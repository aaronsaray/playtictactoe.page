<template>
  <div>
    <header class="participants">
      <div :class="{ active: youActive }">
        <h2>You</h2>
      </div>
      <div :class="{ active: !youActive }">
        <h2>
          Computer
        </h2>
      </div>
    </header>
    <div class="results-banner" v-if="tie">
      <h3>
        It's a Tie
      </h3>
    </div>
    <section id="board">
      <template v-for="(row, x) in board">
        <div
          v-for="(col, y) in row"
          :key="`a-${x}-${y}`"
          class="box"
          :class="{ available: !board[x][y] && youActive }"
          @mouseover="iAmConsidering(x, y)"
          @mouseleave="iStoppedConsideringThis()"
          @click="iChooseThis(x, y)"
        >
          <span
            v-if="
              board[x][y] == 'x' || (consideringX == x && consideringY == y)
            "
            :class="{ considering: !board[x][y] }"
            class="x"
          >
            &times;
          </span>
          <span v-if="board[x][y] == 'o'" class="o">
            o
          </span>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      consideringX: null,
      consideringY: null,
      youActive: true,
      tie: false,
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]
    };
  },

  methods: {
    iAmConsidering(x, y) {
      if (!this.board[x][y] && this.youActive) {
        this.consideringX = x;
        this.consideringY = y;
      }
    },

    iStoppedConsideringThis() {
      this.consideringX = null;
      this.consideringY = null;
    },

    iChooseThis(x, y) {
      if (!this.board[x][y]) {
        this.board[x][y] = "x";
        this.iStoppedConsideringThis();
        this.activateOtherPlayer();
      }
    },

    activateOtherPlayer() {
      this.youActive = false;

      if (this.board.every(row => row.every(item => item))) {
        this.tie = true;
        return;
      }

      // just really bad random here
      let x, y;
      do {
        x = Math.floor(Math.random() * 3);
        y = Math.floor(Math.random() * 3);
      } while (this.board[x][y]);

      this.board[x][y] = "o";

      if (!this.checkWinner()) {
        this.youActive = true;
      }
    },

    checkWinner() {
      return false;
    }
  }
};
</script>

<style lang="scss">
$x: #00bc8c;

.participants {
  display: flex;
  justify-content: space-around;

  h2 {
    margin-top: 0;
    font-size: 1.5rem;
    font-weight: 300;
    color: #444;
  }
  .active h2 {
    color: $x;
  }
}

.results-banner {
  position: absolute;
  font-size: 5rem;
  color: #f39c12;
  text-align: center;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  & > * {
    padding: 2rem 1rem;
    margin: 0;
  }
}

#board {
  width: 80vw;
  height: 80vw;
  max-height: 80%;
  margin: auto;
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);

  .box {
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
    cursor: not-allowed;

    &.available {
      cursor: pointer;
    }

    .considering {
      opacity: 0.4;
    }

    .x {
      color: $x;
    }
    .o {
      color: #3498db;
    }
  }
}
</style>
