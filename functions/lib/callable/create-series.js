const functions = require("firebase-functions");
const admin = require("firebase-admin");

const ensureAuthenticated = require("./ensure-authenticated");
const createNewGame = require("../create-new-game");

/**
 * Ensure authenticated user, then create a new series where we are player X.
 * Will return id of the series, player name, and the player type of x (trying to stay consistent with series data)
 */
module.exports = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);

  const { playerName } = data;

  const playerType = "x";

  const gameResultId = await createNewGame();

  const result = await admin
    .firestore()
    .collection("series")
    .add({
      current_game_id: gameResultId,
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
