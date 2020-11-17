<template>
  <section id="start-game">
    <h2>Start Game</h2>
    <choose-type v-if="!type" v-model="type"></choose-type>
    <div v-else>
      <p v-if="type === GAME_TYPE_2_PLAYER">
        <span v-if="joinGameId">
          Joining a game as player O <br /><small>{{ joinGameId }}</small>
        </span>
        <span v-else> Starting a 2 Player Game </span>
      </p>
      <p v-else>Starting a Single Player Game against the Computer</p>
    </div>
    <player-name
      v-if="type && !playerName"
      :default-name="joinGameId ? 'Player 2' : 'Player 1'"
      @name-chosen="setPlayerName"
    ></player-name>
    <div v-if="type && playerName">
      <p>Starting game as {{ playerName }}...</p>
    </div>
  </section>
</template>

<script>
import { GAME_TYPE_2_PLAYER } from "@/GameTypes";
import ChooseType from "./ChooseType.vue";
import PlayerName from "./PlayerName.vue";

export default {
  components: {
    "choose-type": ChooseType,
    "player-name": PlayerName,
  },

  props: {
    joinGameId: {
      required: false,
    },
  },

  created() {
    if (this.joinGameId) {
      this.type = GAME_TYPE_2_PLAYER;
    }
  },

  data() {
    return {
      GAME_TYPE_2_PLAYER,
      type: null,
      playerName: "",
    };
  },

  methods: {
    setPlayerName(name) {
      this.playerName = name;

      this.startGame();
    },

    startGame() {
      // here is where we should if one player, just emit the data
      // if 2 player, auth, and then either start or join a game
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
  small {
    color: #888888;
  }
}
</style>
