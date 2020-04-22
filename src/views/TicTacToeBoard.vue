<template>
  <div>
    <div v-if="winner" class="results">
      <section>
        <h3>{{ winner.toUpperCase() }} Wins!</h3>
        <a href="#" @click.prevent="playAgain()">Play Again?</a>
      </section>
    </div>
    <header class="participants">
      <div :class="{ active: xActive, x: xActive }">
        <h2>X's Turn</h2>
      </div>
      <div :class="{ active: !xActive, o: !xActive }">
        <h2>O's Turn</h2>
      </div>
    </header>
    <section id="board">
      <a-mark
        v-for="(mark, index) in board"
        :key="`a-mark-${index}`"
        :mark="xActive ? 'x' : 'o'"
        :has-mark="mark"
        v-on:chose="iChoseThis(index)"
        class="a-mark-container"
        :enabled="!winner && !tie"
        :class="{
          winner: winner && winner == mark && winningSet.includes(index)
        }"
      ></a-mark>
    </section>
  </div>
</template>

<script>
import AMark from "@/components/AMark";

export default {
  components: {
    "a-mark": AMark
  },

  data: function() {
    return {
      consideringX: null,
      consideringY: null,
      xActive: true,
      tie: false,
      winner: false,
      winningSet: [],
      board: null
    };
  },

  created() {
    this.initializeBoard();
  },

  methods: {
    initializeBoard() {
      this.board = Array(9).fill(null);
    },

    iChoseThis(index) {
      if (!this.board[index]) {
        this.board[index] = this.xActive ? "x" : "o";

        this.checkWinner() || this.checkTie() || this.activateOtherPlayer();
      }
    },

    checkWinner() {
      const winning = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];

      return winning.some(check => {
        let items = [
          this.board[check[0]],
          this.board[check[1]],
          this.board[check[2]]
        ];

        if (items.every(item => item === "x")) {
          this.winningSet = check;
          this.winner = "x";
        } else if (items.every(item => item === "o")) {
          this.winningSet = check;
          this.winner = "o";
        }

        if (this.winner) {
          this.$gtag.event("win", {
            event_category: "game",
            event_label: "winner",
            value: this.winner
          });

          return true;
        }

        return false;
      });
    },

    checkTie() {
      if (this.board.every(item => item)) {
        this.tie = true;
        this.$gtag.event("tie", {
          event_category: "game"
        });
        return true;
      }
    },

    activateOtherPlayer() {
      this.xActive = !this.xActive;
    },

    playAgain() {
      this.$gtag.event("reset", {
        event_category: "game"
      });

      this.initializeBoard();
      this.tie = false;
      this.winner = false;
      this.xActive = true;
    }
  }
};
</script>

<style lang="scss">
.x {
  color: $x;
}
.o {
  color: $o;
}

.results {
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  text-align: center;
  a {
    display: inline-block;
    color: $success;
    margin-bottom: 30vh;
  }
}

.participants {
  display: flex;
  justify-content: space-around;
  color: #444;

  h2 {
    margin-top: 0;
    font-size: 1.5rem;
    font-weight: 300;
  }
}

.results-banner {
  position: absolute;
  font-size: 5rem;
  color: #f39c12;
  text-align: center;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

#board {
  width: 80vw;
  height: 80vw;
  max-height: 80%;
  margin: auto;
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);

  .a-mark-container {
    border: 1vh solid $primary;
    &:nth-child(1) {
      border-top-color: transparent;
      border-left-color: transparent;
    }
    &:nth-child(2) {
      border-top-color: transparent;
    }
    &:nth-child(3) {
      border-top-color: transparent;
      border-right-color: transparent;
    }
    &:nth-child(4) {
      border-left-color: transparent;
    }
    &:nth-child(6) {
      border-right-color: transparent;
    }
    &:nth-child(7) {
      border-bottom-color: transparent;
      border-left-color: transparent;
    }
    &:nth-child(8) {
      border-bottom-color: transparent;
    }
    &:nth-child(9) {
      border-bottom-color: transparent;
      border-right-color: transparent;
    }

    font-size: 20vw;
    text-align: center;
    line-height: 1;
    cursor: pointer;

    &.winner * {
      color: #ffffff;
    }

    .considering {
      text-shadow: 0px 6px 9px #000000;
      opacity: 0.8;
    }
  }
}
</style>
