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

  const result = await admin
    .firestore()
    .collection("series")
    .add({
      current_game_id: gameResult.id,
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

function checkTie(marks) {
  return marks.every((item) => item);
}

function checkWinner(marks) {
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

// not currently checking if the last game is over
exports.startNewGame = functions.https.onCall(async (data, context) => {
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

  // should issue a new game with the active person being the last active (winner?) on the last one
  await seriesRef.update({
    current_game_id: gameResult.id,
    updated: admin.firestore.FieldValue.serverTimestamp(),
  });

  return gameResult.id;
});

exports.playMark = functions.https.onCall(async (data, context) => {
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

  // here is where we'd mark it
  const { marks } = gameData;
  marks[index] = mark;

  // then check winner and tie (so messy)
  const winningResult = checkWinner(marks);

  const seriesUpdate = {
    updated: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (winningResult === false) {
    if (checkTie(marks)) {
      await gameRef.update({
        marks,
        tie: true,
        updated: admin.firestore.FieldValue.serverTimestamp(),
      });
      const { o, x } = seriesData;
      o.ties += 1;
      x.ties += 1;
      seriesUpdate.o = o;
      seriesUpdate.x = x;
    } else {
      await gameRef.update({ marks, updated: admin.firestore.FieldValue.serverTimestamp() });
      seriesUpdate.active = seriesData.active !== "x" ? "x" : "o";
    }
  } else {
    const { winner, winningSet } = winningResult;

    await gameRef.update({
      marks,
      winner,
      winningSet,
      updated: admin.firestore.FieldValue.serverTimestamp(),
    });

    const winnerKey = winner;
    const loserKey = winner === "x" ? "o" : "x";

    const w = seriesData[winnerKey];
    w.wins += 1;
    seriesUpdate[winnerKey] = w;

    const l = seriesData[loserKey];
    l.losses += 1;
    seriesUpdate[loserKey] = l;
  }

  await seriesRef.update(seriesUpdate);

  return true;
});
