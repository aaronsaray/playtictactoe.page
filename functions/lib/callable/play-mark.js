const functions = require("firebase-functions");
const admin = require("firebase-admin");

const ensureAuthenticated = require("./ensure-authenticated");

/**
 * This is basically a slimmed down version of the 1 player functionality
 */
function isTie(marks) {
  return marks.every((item) => item);
}

/**
 * This is basically a slimmed down version of the 1 player functionality
 */
function isWinner(marks) {
  const winning = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let winningSet = [];
  let winner = null;

  const winningResult = winning.some((check) => {
    const items = [marks[check[0]], marks[check[1]], marks[check[2]]];
    if (items.every((item) => item === "x")) {
      winningSet = check;
      winner = "x";
      return true;
    }
    if (items.every((item) => item === "o")) {
      winningSet = check;
      winner = "o";
      return true;
    }
    return false;
  });

  if (winningResult) {
    return {
      winningSet,
      winner,
    };
  }
  return false;
}

module.exports = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);

  const { seriesId, index, mark } = data;

  const seriesRef = admin.firestore().collection("series").doc(seriesId);
  const seriesSnapshot = await seriesRef.get();

  if (!seriesSnapshot.exists) {
    throw new functions.https.HttpsError("failed-precondition", "Series does not exist");
  }
  const seriesData = seriesSnapshot.data();

  const uidToCheck = `${mark}_uid`;

  if (seriesData[uidToCheck] !== context.auth.uid) {
    throw new functions.https.HttpsError("failed-precondition", "You can not make this mark.");
  }

  const gameRef = admin.firestore().collection("games").doc(seriesData.current_game_id);
  const gameSnapshot = await gameRef.get();
  const gameData = gameSnapshot.data();

  if (gameData.marks[index]) {
    throw new functions.https.HttpsError("failed-precondition", "This spot is already taken.");
  }

  const { marks } = gameData;
  marks[index] = mark;

  const winningResult = isWinner(marks);

  const seriesUpdate = {
    updated: admin.firestore.FieldValue.serverTimestamp(),
  };
  const gameUpdate = {
    marks,
    updated: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (winningResult === false) {
    if (isTie(marks)) {
      gameUpdate.tie = true;

      const { o, x } = seriesData;
      o.ties += 1;
      x.ties += 1;
      seriesUpdate.o = o;
      seriesUpdate.x = x;
    } else {
      seriesUpdate.active = seriesData.active !== "x" ? "x" : "o";
    }
  } else {
    const { winner, winningSet } = winningResult;

    gameUpdate.winner = winner;
    gameUpdate.winningSet = winningSet;

    const winnerKey = winner;
    const loserKey = winner === "x" ? "o" : "x";

    const w = seriesData[winnerKey];
    w.wins += 1;
    seriesUpdate[winnerKey] = w;

    const l = seriesData[loserKey];
    l.losses += 1;
    seriesUpdate[loserKey] = l;
  }

  await gameRef.update(gameUpdate);
  await seriesRef.update(seriesUpdate);

  return true;
});
