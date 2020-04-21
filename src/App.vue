<template>
  <div id="app">
    <tic-tac-toe-board></tic-tac-toe-board>
  </div>
</template>

<script>
import TicTacToeBoard from "@/views/TicTacToeBoard";

export default {
  components: {
    "tic-tac-toe-board": TicTacToeBoard
  }
};
</script>
<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
