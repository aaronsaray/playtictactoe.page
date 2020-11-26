<template>
  <section id="start-series">
    <h2>Start Game</h2>

    <loading-spinner v-if="loading"></loading-spinner>

    <div v-else>
      <choose-type v-if="!type" @type-chosen="typeChosen"></choose-type>
      <div v-else>
        <p v-if="isTwoPlayerGame">
          <span v-if="joinSeriesId">Joining</span>
          2 Player Game
        </p>
        <p v-else>Starting a Single Player Game against the Computer.</p>
        <player-name
          v-if="!playerName"
          :default-name="defaultPlayerName"
          @name-chosen="nameChosen"
        ></player-name>
      </div>
    </div>
  </section>
</template>

<script>
import { SERIES_TYPE_2_PLAYER } from "@/SeriesTypes";
import PlayerName from "./PlayerName.vue";
import ChooseType from "./ChooseType.vue";

export default {
  components: {
    PlayerName,
    "choose-type": ChooseType,
  },

  props: {
    joinSeriesId: {
      required: false,
    },
  },

  data() {
    return {
      loading: false,
      type: null,
      defaultPlayerName: this.joinSeriesId ? "Player 2" : "Player 1",
      playerName: "",
      user: null,
    };
  },

  created() {
    this.$auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        if (user.displayName) {
          this.defaultPlayerName = user.displayName;
        }
      }
    });

    if (this.joinSeriesId) {
      this.typeChosen(SERIES_TYPE_2_PLAYER);
    }
  },

  methods: {
    async typeChosen(type) {
      this.type = type;

      if (this.isTwoPlayerGame) {
        this.loading = true;

        try {
          await this.$auth().signInAnonymously();
        } catch (error) {
          this.$error(error);
        } finally {
          this.loading = false;
        }
      }
    },

    async nameChosen(name) {
      this.playerName = name;

      if (this.isTwoPlayerGame) {
        this.loading = true;

        try {
          const user = this.$auth().currentUser;
          if (user.displayName !== name) {
            await user.updateProfile({
              displayName: name,
            });
          }

          let seriesDataObject = null;

          if (this.joinSeriesId) {
            const joinSeries = this.$functions().httpsCallable("joinSeries");

            try {
              seriesDataObject = await joinSeries({
                seriesId: this.joinSeriesId,
                playerName: this.playerName,
              });
            } catch (e) {
              const errorKey = e.message;

              if (errorKey === "series-id-not-exist") {
                this.$error("This game does not exist. We'll create a new one.");
              } else if (errorKey === "not-member-of-series") {
                this.$error("You can not join this game. We'll create a new one.");
              } else {
                throw e;
              }
            }
          }

          if (!seriesDataObject) {
            const createSeries = this.$functions().httpsCallable("createSeries");
            seriesDataObject = await createSeries({
              playerName: this.playerName,
            });
          }

          this.startSeries(seriesDataObject.data);
        } catch (error) {
          this.$error(error);
        } finally {
          this.loading = false;
        }
      } else {
        this.startSeries({
          id: "local",
          playerType: "x",
          playerName: this.playerName,
        });
      }
    },

    startSeries({ id, playerType, playerName }) {
      const seriesData = {
        id,
        type: this.type,
        playerName,
        playerType,
      };

      this.$emit("start-series", seriesData);
    },
  },

  computed: {
    isTwoPlayerGame() {
      return this.type === SERIES_TYPE_2_PLAYER;
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
