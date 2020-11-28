const admin = require("firebase-admin");

const createSeries = require("./lib/callable/create-series");
const joinSeries = require("./lib/callable/join-series");
const startNewGame = require("./lib/callable/start-new-game");
const playMark = require("./lib/callable/play-mark");

/**
 * All methods require initialized app
 */
admin.initializeApp();

module.exports = {
  createSeries,
  joinSeries,
  startNewGame,
  playMark,
};
