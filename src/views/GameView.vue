<template>
  <div>
    <participant-info :players="players" :active-player="'x'"></participant-info>
    <game-board></game-board>
    <start-series
      v-if="!seriesType"
      :join-series-id="seriesId"
      @start-series="startSeries"
    ></start-series>
    <waiting-on-player-2 v-if="waitingOnPlayer2" :series-id="seriesId"></waiting-on-player-2>
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
    this.seriesId = this.$route.params.series_id;
  },

  data() {
    return {
      seriesId: null,

      seriesType: null,

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

  computed: {
    waitingOnPlayer2() {
      return this.seriesType === SERIES_TYPE_2_PLAYER && this.players.o.userId === null;
    },
  },

  methods: {
    startSeries(seriesDetails) {
      this.seriesType = seriesDetails.type;

      if (this.seriesType !== SERIES_TYPE_2_PLAYER) {
        // 1 player easy or hard
        this.players.x.name = seriesDetails.playerName;
        this.players.o.name = "Computer";
      } else if (this.seriesId) {
        // 2 player, joining
        this.players.o.name = seriesDetails.playerName;
        this.players.o.userId = seriesDetails.userId;
      } else {
        // 2 player, creating
        this.players.x.name = seriesDetails.playerName;
        this.players.x.userId = seriesDetails.userId;
        this.seriesId = seriesDetails.seriesId;
      }
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
