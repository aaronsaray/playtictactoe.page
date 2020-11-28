const functions = require("firebase-functions");
const admin = require("firebase-admin");
const ensureAuthenticated = require("./ensure-authenticated");

/**
 * Here are errors that we can reference on the front side
 */
const ERROR_SERIES_ID_REQUIRED = "series-id-required";
const ERROR_SERIES_ID_NOT_EXIST = "series-id-not-exist";
const ERROR_NOT_MEMBER_OF_SERIES = "not-member-of-series";

/**
 * Tries to join a series with the sent in player name as the authenticated user.
 * If it can, it updates the series with the player name, and then returns the player name,
 * the series id, and the player type. (basically the only new information is the player type x, or o) (series data)
 */
module.exports = functions.https.onCall(async (data, context) => {
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

  let playerType;
  const seriesUpdate = {};

  if (potentialSeriesData.x_uid === context.auth.uid) {
    playerType = "x";
  } else if (potentialSeriesData.o_uid === context.auth.uid) {
    playerType = "o";
  } else if (!potentialSeriesData.o_uid) {
    playerType = "o";
    seriesUpdate.o_uid = context.auth.uid;
  } else {
    throw new functions.https.HttpsError("failed-precondition", ERROR_NOT_MEMBER_OF_SERIES);
  }

  const playerNameKey = `${playerType}_player_name`;
  if (playerName !== potentialSeriesData[playerNameKey]) {
    seriesUpdate[playerNameKey] = playerName;
  }

  if (Object.keys(seriesUpdate).length) {
    await potentialSeriesRef.update({
      ...seriesUpdate,
      updated: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return {
    id: seriesId,
    playerType,
    playerName,
  };
});
