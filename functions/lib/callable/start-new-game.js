const functions = require("firebase-functions");
const admin = require("firebase-admin");
const ensureAuthenticated = require("./ensure-authenticated");
const createNewGame = require("../create-new-game");

/**
 * Starts a new game.
 */
module.exports = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);

  const { seriesId } = data;

  const seriesRef = admin.firestore().collection("series").doc(seriesId);
  const seriesSnapshot = await seriesRef.get();

  if (!seriesSnapshot.exists) {
    throw new functions.https.HttpsError("failed-precondition", "Series does not exist");
  }

  const seriesData = seriesSnapshot.data();

  if (seriesData.x_uid !== context.auth.uid) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "You are not able to request a new game."
    );
  }

  const gameResultId = createNewGame();

  // should issue a new game with the active person being the last active (winner?) on the last one
  await seriesRef.update({
    current_game_id: gameResultId,
    updated: admin.firestore.FieldValue.serverTimestamp(),
  });

  return gameResultId;
});
