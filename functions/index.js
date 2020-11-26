const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Validates that our functions are called only by auth'd people
 */
function ensureAuthenticated(context) {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }
}

exports.joinSeries = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);

  const { seriesId } = data;

  if (!seriesId) {
    throw new functions.https.HttpsError("failed-precondition", "A series id is required.");
  }

  const potentialSeries = await admin.firestore().collection("series").doc(seriesId).get();

  if (potentialSeries.exists) {
    const potentialSeriesData = potentialSeries.data();
    if (potentialSeriesData.joined_uuid === context.auth.uid || !potentialSeriesData.joined_uuid) {
      return seriesId;
    }
  }

  throw new functions.https.HttpsError(
    "failed-precondition",
    "Series does not exist or joined by other user."
  );
});

exports.createOrJoinSeries = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);

  const { seriesId } = data;

  if (seriesId) {
    const existing = await admin
      .firestore()
      .collection("series")
      .where(admin.firestore.FieldPath.documentId(), "==", seriesId)
      .where("created_uid", "==", context.auth.uid)
      .get();

    if (!existing.empty) {
      let id;

      existing.forEach((doc) => {
        id = doc.id;
      });

      return id;
    }
  }

  const result = await admin
    .firestore()
    .collection("series")
    .add({
      x: {
        uid: context.auth.uid,
        wins: 0,
        losses: 0,
        ties: 0,
      },
      o: {
        uid: null,
        wins: 0,
        losses: 0,
        ties: 0,
      },
      active: "x",
      created_uid: context.auth.uid,
      joined_uuid: null,
      created: admin.firestore.FieldValue.serverTimestamp(),
      updated: admin.firestore.FieldValue.serverTimestamp(),
    });

  return result.id;
});
