<template>
  <div>
    <participant-info :players="players" :active-player="'x'"></participant-info>
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

      players: {
        x: {
          name: "Player 1",
          wins: 0,
          losses: 0,
          ties: 0,
          userId: null,
        },
        o: {
          name: "Player 2",
          wins: 0,
          losses: 0,
          ties: 0,
          userId: null,
        },
      },
    };
  },

  methods: {
    startSeries(seriesData) {
      this.seriesId = seriesData.id;
      this.seriesType = seriesData.type;
      this.playerType = seriesData.playerType;
      this.players[seriesData.playerType].name = seriesData.playerName;

      if (this.seriesType === SERIES_TYPE_2_PLAYER) {
        this.$router
          .push({
            name: "GameViewWithSeriesId",
            params: {
              series_id: this.seriesId,
            },
          })
          .catch((e) => e);
      } else {
        this.players.o.name = "Computer";
      }
    },
  },

  computed: {
    isWaitingOnPlayer2() {
      return this.seriesType === SERIES_TYPE_2_PLAYER;
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
</style>
