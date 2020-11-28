<template>
  <div>
    <loading-spinner v-if="loading" class="remote-loading"></loading-spinner>
    <a href="#" v-if="seriesType" id="start-over" @click.prevent="startOver()">Start Over</a>
    <participant-info :series="series"></participant-info>
    <game-board
      :game="currentGame.marks"
      :active="series.active"
      :player-type="playerType"
      @player-chose="playerChose"
      :winner="currentGame.winner"
      :winning-set="currentGame.winningSet"
      :loading="loading"
    ></game-board>
    <start-series
      v-if="!seriesId"
      :join-series-id="joinSeriesId"
      @start-series="startSeries"
    ></start-series>
    <waiting-on-player-2 v-if="isWaitingOnPlayer2" :series-id="seriesId"></waiting-on-player-2>
    <game-done
      v-if="currentGame.winner || currentGame.tie"
      :winner="currentGame.winner"
      :tie="currentGame.tie"
      :winner-name="winnerName"
      :can-choose-play-again="playerType === 'x'"
      @play-again="playAgainRequested"
    ></game-done>
  </div>
</template>

<script>
import { SERIES_TYPE_2_PLAYER } from "@/SeriesTypes";
import GameBoard from "../components/GameBoard.vue";
import ParticipantInfo from "../components/ParticipantInfo.vue";
import StartSeries from "../components/Series/StartSeries.vue";
import WaitingOnPlayer2 from "../components/WaitingOnPlayer2.vue";
import GameDone from "../components/GameDone.vue";

export default {
  components: {
    "game-board": GameBoard,
    "start-series": StartSeries,
    "participant-info": ParticipantInfo,
    WaitingOnPlayer2,
    GameDone,
  },

  created() {
    this.joinSeriesId = this.$route.params.series_id;
    this.resetGame();
  },

  data() {
    return {
      loading: false,

      seriesId: null,

      joinSeriesId: null,

      seriesType: null,

      playerType: null,

      series: {
        active: "x",
        x_player_name: "Player 1",
        x_uid: null,
        x: {
          wins: 0,
          losses: 0,
          ties: 0,
        },
        o_player_name: "Player 2",
        o_uid: null,
        o: {
          wins: 0,
          losses: 0,
          ties: 0,
        },
      },

      currentGame: {},
    };
  },

  methods: {
    startSeries(seriesData) {
      this.seriesId = seriesData.id;
      this.seriesType = seriesData.type;
      this.playerType = seriesData.playerType;

      if (this.isTwoPlayerGame) {
        this.$router
          .push({
            name: "GameViewWithSeriesId",
            params: {
              series_id: this.seriesId,
            },
          })
          .catch((e) => e);

        this.$bind("series", this.$firestore().collection("series").doc(this.seriesId));
      } else {
        this.series.x_player_name = seriesData.playerName;
        this.series.o_player_name = "Computer";
      }
    },

    async playerChose(index) {
      // respresent it locally (for both 1 player and 2 player)
      this.$set(this.currentGame.marks, index, this.series.active);

      if (this.isTwoPlayerGame) {
        // send it to the remote end point as well
        const playMark = this.$functions().httpsCallable("playMark");
        try {
          this.loading = true;

          await playMark({
            seriesId: this.seriesId,
            index,
            mark: this.series.active,
          });

          this.loading = false;
        } catch (error) {
          this.$error(error);
          this.reset(); // this should never error out
          return false;
        }
      } else if (!this.checkWinner() && !this.checkTie()) {
        this.series.active = this.series.active === "x" ? "o" : "x";
        if (this.computerPlays) {
          this.computerPlaysEasy();
        }
      }
      return true;
    },

    computerPlaysEasy() {
      setTimeout(() => {
        let o;
        do {
          o = Math.floor(Math.random() * 9);
        } while (this.currentGame.marks[o]);
        this.playerChose(o);
      }, 1000);
    },

    // this is only for 1 player games
    checkWinner() {
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

      return winning.some((check) => {
        const items = [
          this.currentGame.marks[check[0]],
          this.currentGame.marks[check[1]],
          this.currentGame.marks[check[2]],
        ];
        if (items.every((item) => item === "x")) {
          this.currentGame.winningSet = check;
          this.currentGame.winner = "x";
        } else if (items.every((item) => item === "o")) {
          this.currentGame.winningSet = check;
          this.currentGame.winner = "o";
        }

        if (this.currentGame.winner) {
          this.series[this.currentGame.winner].wins += 1;
          this.series[this.currentGame.winner !== "x" ? "x" : "o"].losses += 1;
          return true;
        }

        return false;
      });
    },

    // only for 1 player games
    checkTie() {
      const isTie = this.currentGame.marks.every((item) => item);
      if (isTie) {
        this.currentGame.tie = true;
        this.series.x.ties += 1;
        this.series.o.ties += 1;
        return true;
      }
      return false;
    },

    async playAgainRequested() {
      if (this.isTwoPlayerGame) {
        this.loading = true;

        try {
          const startNewGame = this.$functions().httpsCallable("startNewGame");

          await startNewGame({
            seriesId: this.seriesId,
          });

          this.loading = false;
        } catch (e) {
          this.$error(e);
          this.resetGame();
        }
      } else {
        const active = this.currentGame.winner || "x";

        this.resetGame();
        this.series.active = active;

        if (this.computerPlays) {
          this.computerPlaysEasy();
        }
      }
    },

    resetGame() {
      this.currentGame = {
        marks: Array(9).fill(null),
        winner: null,
        winningSet: [],
        tie: false,
      };
    },

    // kind of a nuclear option
    startOver() {
      // eslint-disable-next-line
      if (window.confirm("Are you sure you want to leave this game and reset your score?")) {
        this.reset();
      }
    },

    reset() {
      window.location.href = "/";
    },
  },

  computed: {
    isWaitingOnPlayer2() {
      return this.seriesType === SERIES_TYPE_2_PLAYER && this.series.o_uid === null;
    },

    isTwoPlayerGame() {
      return this.seriesType === SERIES_TYPE_2_PLAYER;
    },

    winnerName() {
      return this.currentGame.winner ? this.series[`${this.currentGame.winner}_player_name`] : "";
    },

    computerPlays() {
      return !this.isTwoPlayerGame && this.series.active !== this.playerType;
    },
  },

  watch: {
    series: {
      handler(newSeries, oldSeries) {
        if (newSeries.current_game_id && newSeries.current_game_id !== oldSeries.current_game_id) {
          this.$bind(
            "currentGame",
            this.$firestore().collection("games").doc(newSeries.current_game_id),
            {
              reset: false,
            }
          );
        }
      },

      deep: true,
    },
  },
};
</script>

<style lang="scss">
#start-series,
#waiting-on-player-2,
#game-done {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding-top: 5rem;
}

#start-over {
  color: #aaaaaa;
  font-size: 0.8rem;
  position: absolute;
  top: 0.1rem;
  right: 0.3rem;
  z-index: 10;
}

.remote-loading {
  position: absolute;
  top: 1rem;
  left: 1rem;
  height: 1rem;
  width: 1rem;
  z-index: 10;
}
</style>
