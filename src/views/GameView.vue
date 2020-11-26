<template>
  <div>
    <a href="#" v-if="seriesType" id="start-over" @click.prevent="startOver()">Start Over</a>
    <participant-info :series="series"></participant-info>
    <game-board
      :game="this.currentGame"
      :active="series.active"
      :player-type="playerType"
      @player-chose="playerChose"
      :winner="winner"
      :winning-set="winningSet"
    ></game-board>
    <start-series
      v-if="!seriesId"
      :join-series-id="joinSeriesId"
      @start-series="startSeries"
    ></start-series>
    <waiting-on-player-2 v-if="isWaitingOnPlayer2" :series-id="seriesId"></waiting-on-player-2>
    <game-done
      v-if="winner || tie"
      :winner="winner"
      :tie="tie"
      :winner-name="winnerName"
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
  },

  data() {
    return {
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

      currentGame: Array(9).fill(null),

      winningSet: [],
      winner: null,
      tie: false,
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

    playerChose(index) {
      this.$set(this.currentGame, index, this.series.active);

      if (!this.checkWinner() && !this.checkTie()) {
        this.series.active = this.series.active === "x" ? "o" : "x";
        if (this.computerPlays) {
          this.computerPlaysEasy();
        }
      }
    },

    computerPlaysEasy() {
      setTimeout(() => {
        let o;
        do {
          o = Math.floor(Math.random() * 9);
        } while (this.currentGame[o]);
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
          this.currentGame[check[0]],
          this.currentGame[check[1]],
          this.currentGame[check[2]],
        ];
        if (items.every((item) => item === "x")) {
          this.winningSet = check;
          this.winner = "x";
        } else if (items.every((item) => item === "o")) {
          this.winningSet = check;
          this.winner = "o";
        }

        if (this.winner) {
          this.series[this.winner].wins += 1;
          this.series[this.winner !== "x" ? "x" : "o"].losses += 1;
          return true;
        }

        return false;
      });
    },

    // only for 1 player games
    checkTie() {
      const isTie = this.currentGame.every((item) => item);
      if (isTie) {
        this.tie = true;
        this.series.x.ties += 1;
        this.series.o.ties += 1;
        return true;
      }
      return false;
    },

    // this is currently only set up for player 1
    playAgainRequested() {
      const active = this.winner || "x";

      this.winner = null;
      this.tie = false;
      this.series.active = active;

      this.currentGame = Array(9).fill(null);

      if (this.computerPlays) {
        this.computerPlaysEasy();
      }
    },

    // kind of a nuclear option
    startOver() {
      // eslint-disable-next-line
      if (window.confirm("Are you sure you want to leave this game and reset your score?")) {
        window.location.href = "/";
      }
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
      return this.winner ? this.series[`${this.winner}_player_name`] : "";
    },

    computerPlays() {
      return this.series.active !== this.playerType;
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
</style>
