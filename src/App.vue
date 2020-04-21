<template>
  <div id="app">
    <tic-tac-toe-board></tic-tac-toe-board>
    <footer>
      &copy; {{ new Date().getFullYear() }}
      <a
        href="https://morebetterfaster.io"
        target="_blank"
        title="For Programming With Best Practices and Bullet-proof Processes"
      >
        More Better Faster
      </a>
    </footer>
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
footer {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background: #191919;
  color: #cccccc;
  padding: 1rem;
  font-size: 0.9rem;
  text-align: center;
  a {
    color: #cccccc;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
