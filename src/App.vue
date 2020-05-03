<template>
  <div id="app">
    <main>
      <tic-tac-toe-board></tic-tac-toe-board>
    </main>
    <footer>
      &copy; {{ new Date().getFullYear() }}
      <a
        href="https://morebetterfaster.io"
        target="_blank"
        title="For Programming With Best Practices and Bullet-proof Processes"
        @click="trackMBF()"
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
  },

  methods: {
    trackMBF() {
      this.$gtag.event("outbound", {
        event_category: "click",
        event_label: "url",
        value: "https://morebetterfaster.io"
      });
    }
  }
};
</script>
<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
main {
  padding-bottom: 4rem;
}
footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 3rem;
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
