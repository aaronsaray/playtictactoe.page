const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Here are errors that we can reference on the front side
 */
const ERROR_SERIES_ID_REQUIRED = "series-id-required";
const ERROR_SERIES_ID_NOT_EXIST = "series-id-not-exist";
const ERROR_NOT_MEMBER_OF_SERIES = "not-member-of-series";

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

/**
 * This takes in a series id - and then it will try to retrieve that series id
 * If it finds it, it will return what user the current auth user is
 */
exports.joinSeries = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);

  const { seriesId, playerName } = data;

  if (!seriesId) {
    throw new functions.https.HttpsError("failed-precondition", ERROR_SERIES_ID_REQUIRED);
  }

  const potentialSeriesRef = admin.firestore().collection("series").doc(seriesId);
  const potentialSeries = await potentialSeriesRef.get();

  if (!potentialSeries.exists) {
    throw new functions.https.HttpsError("failed-precondition", ERROR_SERIES_ID_NOT_EXIST);
  }

  const potentialSeriesData = potentialSeries.data();

  if (potentialSeriesData.x_uid === context.auth.uid) {
    if (playerName !== potentialSeriesData.x_player_name) {
      await potentialSeriesRef.update({
        x_player_name: playerName,
        updated: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return {
      id: seriesId,
      playerType: "x",
      playerName,
    };
  }

  if (potentialSeriesData.o_uid === context.auth.uid) {
    if (playerName !== potentialSeriesData.o_player_name) {
      await potentialSeriesRef.update({
        o_player_name: playerName,
        updated: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return {
      id: seriesId,
      playerType: "o",
      playerName,
    };
  }

  if (!potentialSeriesData.o_uid) {
    await potentialSeriesRef.update({
      o_uid: context.auth.uid,
      o_player_name: playerName,
      updated: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      id: seriesId,
      playerType: "o",
      playerName,
    };
  }

  throw new functions.https.HttpsError("failed-precondition", ERROR_NOT_MEMBER_OF_SERIES);
});

/**
 * Create a series.
 *
 * Ensures authenticated, then creates a new series where we are the player X.
 * Will return id of the series id, and playerType of x.
 */
exports.createSeries = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);

  const { playerName } = data;

  const playerType = "x";

  const result = await admin
    .firestore()
    .collection("series")
    .add({
      x_uid: context.auth.uid,
      x_player_name: playerName,
      o_uid: null,
      o_player_name: "Player 2",
      x: {
        wins: 0,
        losses: 0,
        ties: 0,
      },
      o: {
        wins: 0,
        losses: 0,
        ties: 0,
      },
      active: playerType,
      created: admin.firestore.FieldValue.serverTimestamp(),
      updated: admin.firestore.FieldValue.serverTimestamp(),
    });

  return {
    id: result.id,
    playerType,
    playerName,
  };
});
