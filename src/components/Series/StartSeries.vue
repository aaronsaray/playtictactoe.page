<template>
  <section id="start-series">
    <h2>Start Game</h2>
    <choose-type v-if="!type" @type-chosen="typeChosen"></choose-type>
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
      :default-name="defaultPlayerName"
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

    this.$auth().onAuthStateChanged((user) => {
      if (user) {
        this.playerUserId = user.uid;
        if (user.displayName) {
          this.defaultPlayerName = user.displayName;
        }
      }
    });
  },

  data() {
    return {
      SERIES_TYPE_2_PLAYER,
      type: null,
      defaultPlayerName: this.joinSeriesId ? "Player 2" : "Player 1",
      playerName: "",
      playerUserId: null,
    };
  },

  methods: {
    typeChosen(type) {
      if (type !== SERIES_TYPE_2_PLAYER) {
        this.type = type;
      } else {
        this.$auth()
          .signInAnonymously()
          .then(() => {
            this.type = type;
          })
          .catch((error) => this.$error(error));
      }
    },

    setPlayerName(name) {
      const user = this.$auth().currentUser;

      const start = () => {
        this.playerName = name;
        this.startSeries();
      };

      if (user.displayName !== name) {
        user
          .updateProfile({
            displayName: name,
          })
          .then(start)
          .catch((error) => this.$error(error));
      } else {
        start();
      }
    },

    async startSeries() {
      const seriesDetails = {
        type: this.type,
        playerName: this.playerName,
        userId: this.playerUserId,
        seriesId: "game234",
      };

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
