const admin = require("firebase-admin");

/**
 * Used to create a new game data
 */
module.exports = async () => {
  const gameResult = await admin
    .firestore()
    .collection("games")
    .add({
      marks: Array(9).fill(null),
      winner: null,
      winningSet: [],
      tie: false,
      created: admin.firestore.FieldValue.serverTimestamp(),
      updated: admin.firestore.FieldValue.serverTimestamp(),
    });

  return gameResult.id;
};
