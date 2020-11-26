<template>
  <section id="start-series">
    <h2>Start Game</h2>
    <choose-type v-if="!type" v-model="type"></choose-type>
    <div v-else>
      <p v-if="type === SERIES_TYPE_2_PLAYER">
        <span v-if="joinSeriesId">
          Joining a game as player O <br /><small>{{ joinGameId }}</small>
        </span>
        <span v-else> Starting a 2 Player Game </span>
      </p>
      <p v-else>Starting a Single Player Game against the Computer</p>
    </div>
    <player-name
      v-if="type && !playerName"
      :default-name="joinSeriesId ? 'Player 2' : 'Player 1'"
      @name-chosen="setPlayerName"
    ></player-name>
    <div v-if="type && playerName">
      <p>Starting game as {{ playerName }}...</p>
    </div>
  </section>
</template>

<script>
import { SERIES_TYPE_2_PLAYER } from "@/SeriesTypes";
import ChooseType from "./ChooseType.vue";
import PlayerName from "./PlayerName.vue";

export default {
  components: {
    "choose-type": ChooseType,
    "player-name": PlayerName,
  },

  props: {
    joinSeriesId: {
      required: false,
    },
  },

  created() {
    if (this.joinSeriesId) {
      this.type = SERIES_TYPE_2_PLAYER;
    }
  },

  data() {
    return {
      SERIES_TYPE_2_PLAYER,
      type: null,
      playerName: "",
    };
  },

  methods: {
    setPlayerName(name) {
      this.playerName = name;

      this.startSeries();
    },

    startSeries() {
      const seriesDetails = {
        type: this.type,
        playerName: this.playerName,
      };

      if (this.type === SERIES_TYPE_2_PLAYER) {
        const authId = "auth123";
        const seriesId = "game234";

        seriesDetails.userId = authId;
        seriesDetails.seriesId = seriesId;
      }

      this.$emit("start-series", seriesDetails);
    },
  },
};
</script>

<style lang="scss">
#start-series {
  text-align: center;
  h2 {
    margin-bottom: 3rem;
  }
  small {
    color: #888888;
  }
}
</style>
