<template>
  <div id="app" :class="{ 'nerd-stats': showNerdStats }">
    <main>
      <tic-tac-toe-board></tic-tac-toe-board>
    </main>
    <footer>
      <section>
        <a
          href="#"
          @click.prevent="showNerdStats = !showNerdStats"
          id="nerd-stats-toggle"
        >
          <span v-if="showNerdStats">⭣</span>
          <span v-else>⭡</span>
          Nerd Stats
        </a>
        &copy; {{ new Date().getFullYear() }}
        <a
          href="https://morebetterfaster.io"
          target="_blank"
          title="For Programming With Best Practices and Bullet-proof Processes"
          @click="trackMBF()"
        >
          More Better Faster
        </a>
      </section>
      <section id="nerd-stats">
        <p v-for="(stat, index) in nerdStats" :key="`nerd-stat-${index}`">
          {{ stat }}
        </p>
      </section>
    </footer>
  </div>
</template>

<script>
import { EventBus } from "./event-bus.js";
import TicTacToeBoard from "@/views/TicTacToeBoard";

export default {
  components: {
    "tic-tac-toe-board": TicTacToeBoard
  },

  created() {
    EventBus.$on("nerd-stat", stat => {
      this.nerdStats.push(stat);
    });
  },

  data: function() {
    return {
      showNerdStats: false,
      nerdStats: []
    };
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
* {
  scrollbar-width: thin;
  scrollbar-color: #333333 #202020;
}

/* Works on Chrome/Edge/Safari */
*::-webkit-scrollbar {
  width: 12px;
}
*::-webkit-scrollbar-track {
  background: #202020;
}
*::-webkit-scrollbar-thumb {
  background-color: #333333;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
main {
  padding-bottom: 4rem;
  transition: padding-bottom 0.2s linear;
}
footer {
  height: 3rem;
  transition: height 0.2s linear;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  background: #191919;
  color: #cccccc;
  padding: 1rem;
  font-size: 0.9rem;
  & > section:first-child {
    margin-bottom: 1rem;
    text-align: center;
    a {
      color: #cccccc;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.nerd-stats {
  main {
    padding-bottom: 11rem;
  }
  footer {
    height: 10rem;
  }
}
#nerd-stats-toggle {
  position: absolute;
  right: 0.8rem;
  color: #992211;
  font-size: 0.8rem;
}
#nerd-stats {
  background: #000000;
  height: 6rem;
  overflow-y: scroll;
  font-family: "Courier New", Courier, monospace;
  color: #00ff00;
  font-size: 0.8;
  line-height: 1.4;
  padding: 0.3rem;
  p {
    margin: 0;
  }
}
</style>
