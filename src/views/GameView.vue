<template>
  <div>
    <a href="#" v-if="seriesType" id="start-over" @click.prevent="startOver()">Start Over</a>
    <participant-info :series="series"></participant-info>
    <game-board></game-board>
    <start-series
      v-if="!seriesId"
      :join-series-id="joinSeriesId"
      @start-series="startSeries"
    ></start-series>
    <waiting-on-player-2 v-if="isWaitingOnPlayer2" :series-id="seriesId"></waiting-on-player-2>
  </div>
</template>

<script>
import { SERIES_TYPE_2_PLAYER } from "@/SeriesTypes";
import GameBoard from "../components/GameBoard.vue";
import ParticipantInfo from "../components/ParticipantInfo.vue";
import StartSeries from "../components/Series/StartSeries.vue";
import WaitingOnPlayer2 from "../components/WaitingOnPlayer2.vue";

export default {
  components: {
    "game-board": GameBoard,
    "start-series": StartSeries,
    "participant-info": ParticipantInfo,
    WaitingOnPlayer2,
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
    };
  },

  methods: {
    startSeries(seriesData) {
      this.seriesId = seriesData.id;
      this.seriesType = seriesData.type;
      this.playerType = seriesData.playerType;

      if (this.seriesType === SERIES_TYPE_2_PLAYER) {
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
        this.series.o_player_name = "Computer";
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
  },
};
</script>

<style lang="scss">
#start-series,
#waiting-on-player-2 {
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
