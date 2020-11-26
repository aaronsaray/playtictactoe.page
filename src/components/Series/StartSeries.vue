<template>
  <section id="start-series">
    <h2>Start Game</h2>
    <choose-type v-if="!type" @type-chosen="typeChosen"></choose-type>
    <div v-else>
      <p v-if="type === SERIES_TYPE_2_PLAYER">
        <span v-if="isPlayerO">
          Joining a game as player O <br /><small>{{ joinSeriesId }}</small>
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
      };

      if (this.type === SERIES_TYPE_2_PLAYER) {
        if (this.isPlayerO) {
          // player o tries to join the joinSeriesId
          const joinSeries = this.$functions().httpsCallable("joinSeries");

          joinSeries({
            seriesId: this.joinSeriesId,
          })
            .then(() => {
              const seriesId = this.joinSeriesId;

              this.$clientDb.setItem("seriesId", seriesId);

              seriesDetails.seriesId = seriesId;
              this.$emit("start-series", seriesDetails); // how do we know we're player 0?
            })
            .catch((error) => this.$error(error));
        } else {
          // player x starts the game
          const createOrJoinSeries = this.$functions().httpsCallable("createOrJoinSeries");

          createOrJoinSeries({
            seriesId: this.$clientDb.getItem("seriesId"),
          })
            .then((response) => {
              const seriesId = response.data;

              this.$clientDb.setItem("seriesId", seriesId);

              this.$router.push({
                name: "GameViewWithSeriesId",
                params: {
                  series_id: seriesId,
                },
              });

              seriesDetails.seriesId = seriesId;
              this.$emit("start-series", seriesDetails);
            })
            .catch((error) => this.$error(error));
        }
      } else {
        // 1 player, just start

        // little garbage cleanup just in case
        this.$clientDb.removeItem("seriesId");

        this.$emit("start-series", seriesDetails);
      }
    },
  },

  computed: {
    isPlayerO() {
      return !!this.joinSeriesId;
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
