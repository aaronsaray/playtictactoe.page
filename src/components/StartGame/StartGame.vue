<template>
  <section id="start-game">
    <h2>Start Game</h2>
    <choose-type v-if="!type" v-model="type"></choose-type>
    <div v-else>
      <p v-if="type === '2'">Starting a 2 Player Game</p>
      <p v-else>Starting a Single Player Game against the Computer</p>
    </div>
    <player-name
      v-if="type && !playerName"
      default-name="Player 1"
      @name-chosen="setPlayerName"
    ></player-name>
    <div v-if="type && playerName">
      <p>Starting game as {{ playerName }}...</p>
    </div>
  </section>
</template>

<script>
import ChooseType from "./ChooseType.vue";
import PlayerName from "./PlayerName.vue";

export default {
  components: {
    "choose-type": ChooseType,
    "player-name": PlayerName,
  },

  data() {
    return {
      type: null,
      playerName: "",
    };
  },

  methods: {
    setPlayerName(name) {
      this.playerName = name;

      this.registerNew2PlayerGame();
    },

    registerNew2PlayerGame() {
      // eslint-disable-next-line
      alert("Authenticate, then create new game");
    },
  },
};
</script>

<style lang="scss">
#start-game {
  text-align: center;
  h2 {
    margin-bottom: 3rem;
  }
}
</style>
