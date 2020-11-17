<template>
  <div>
    <game-board></game-board>
    <start-game v-if="!gameStyle" @style-chosen="styleChosen"></start-game>
  </div>
</template>

<script>
import GameBoard from "../components/GameBoard.vue";
import StartGame from "../components/StartGame/StartGame.vue";

export default {
  components: {
    "game-board": GameBoard,
    "start-game": StartGame,
  },

  data() {
    return {
      gameStyle: null,
    };
  },

  methods: {
    styleChosen(style) {
      this.gameStyle = style;
    },
  },
};
</script>

<style lang="scss">
#start-game {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding-top: 5rem;
}
</style>
