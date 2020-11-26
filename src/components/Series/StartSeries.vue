<template>
  <section id="start-series">
    <h2>Start Game</h2>
    <choose-type v-if="!type" @type-chosen="typeChosen"></choose-type>
    <div v-else>
      <p v-if="type !== SERIES_TYPE_2_PLAYER">
        Starting a Single Player Game against the Computer.
      </p>
      <p v-else>2 Player Game</p>
      <loading-spinner></loading-spinner>
    </div>
  </section>
</template>

<script>
import { SERIES_TYPE_2_PLAYER } from "@/SeriesTypes";
import ChooseType from "./ChooseType.vue";
// import PlayerName from "./PlayerName.vue";

export default {
  components: {
    "choose-type": ChooseType,
    // "player-name": PlayerName,
  },

  props: {
    joinSeriesId: {
      required: false,
    },
  },

  async created() {
    this.$auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        // if (user.displayName) {
        //   this.defaultPlayerName = user.displayName;
        // }
      }
    });

    if (this.joinSeriesId) {
      this.type = SERIES_TYPE_2_PLAYER;

      await this.$auth().signInAnonymously();

      const joinSeries = this.$functions().httpsCallable("joinSeries");

      try {
        const playerTypeDataObject = await joinSeries({
          seriesId: this.joinSeriesId,
        });

        this.playerType = playerTypeDataObject.data;
      } catch (e) {
        const errorText = e.message;
        if (errorText === "series-id-not-exist") {
          this.$error("This game does not exist.");
          this.reset();
        } else if (errorText === "not-member-of-series") {
          this.$error("Unable to join this game at this time.");
          this.reset();
        } else {
          this.$error(e);
        }
      }
    }
  },

  data() {
    return {
      SERIES_TYPE_2_PLAYER,
      type: null,
      defaultPlayerName: this.joinSeriesId ? "Player 2" : "Player 1",
      playerName: "",
      user: null,
      playerType: null,
    };
  },

  methods: {
    reset() {
      this.type = null;
      this.$router.push({
        name: "GameView",
      });
    },

    typeChosen(type) {
      if (type !== SERIES_TYPE_2_PLAYER) {
        return new Promise(() => {
          this.type = type;
        });
      }
      return this.$auth()
        .signInAnonymously()
        .then(() => {
          this.type = type;
        })
        .catch((error) => this.$error(error));
    },

    // setPlayerName(name) {
    //   const user = this.$auth().currentUser;

    //   const start = () => {
    //     this.playerName = name;
    //     this.startSeries();
    //   };

    //   if (user && user.displayName !== name) {
    //     user
    //       .updateProfile({
    //         displayName: name,
    //       })
    //       .then(start)
    //       .catch((error) => this.$error(error));
    //   } else {
    //     start();
    //   }
    // },

    // async startSeries() {
    //   const seriesDetails = {
    //     type: this.type,
    //     playerName: this.playerName,
    //     userId: this.playerUserId,
    //   };

    //   if (this.type === SERIES_TYPE_2_PLAYER) {
    //     if (this.isPlayerO) {
    //       // player o tries to join the joinSeriesId
    //       const joinSeries = this.$functions().httpsCallable("joinSeries");

    //       joinSeries({
    //         seriesId: this.joinSeriesId,
    //       })
    //         .then(() => {
    //           const seriesId = this.joinSeriesId;

    //           this.$clientDb.setItem("seriesId", seriesId);

    //           seriesDetails.seriesId = seriesId;
    //           this.$emit("start-series", seriesDetails); // how do we know we're player 0?
    //         })
    //         .catch((error) => this.$error(error));
    //     } else {
    //       // player x starts the game
    //       const createOrJoinSeries = this.$functions().httpsCallable("createOrJoinSeries");

    //       createOrJoinSeries({
    //         seriesId: this.$clientDb.getItem("seriesId"),
    //       })
    //         .then((response) => {
    //           const seriesId = response.data;

    //           this.$clientDb.setItem("seriesId", seriesId);

    //           this.$router.push({
    //             name: "GameViewWithSeriesId",
    //             params: {
    //               series_id: seriesId,
    //             },
    //           });

    //           seriesDetails.seriesId = seriesId;
    //           this.$emit("start-series", seriesDetails);
    //         })
    //         .catch((error) => this.$error(error));
    //     }
    //   } else {
    //     // 1 player, just start

    //     // little garbage cleanup just in case
    //     this.$clientDb.removeItem("seriesId");

    //     this.$emit("start-series", seriesDetails);
    //   }
    // },
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
