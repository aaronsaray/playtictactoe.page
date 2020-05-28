<template>
  <div>
    <div v-if="winner || tie" class="results">
      <section>
        <h3 v-if="winner">{{ winner.toUpperCase() }} Wins!</h3>
        <h3 v-if="tie">It's a Tie.</h3>
        <a href="#" @click.prevent="playAgain()">Play Again?</a>
      </section>
    </div>
    <header class="participants">
      <div>
        <div class="player">
          <h2 :class="{ x: xActive }">&times;</h2>
          <span
            @click="!changingPlayerName.x && changePlayerName('x')"
            class="player-name"
            :class="{ changing: changingPlayerName.x }"
          >
            <strong>{{ player.x }}</strong>
          </span>
          <form
            v-if="changingPlayerName.x"
            @submit.prevent="finishChangingPlayerName('x')"
          >
            <input
              type="text"
              maxlength="10"
              ref="player-name-input-x"
              v-model="player.x"
              @blur="finishChangingPlayerName('x')"
            />
          </form>
        </div>
        <div class="scores">
          {{ scores.wins.x }} / {{ scores.losses.x }} / {{ scores.ties }}
        </div>
      </div>
      <div class="turn" :class="{ x: xActive, o: !xActive }">
        <span v-if="xActive">⬅</span>
        Turn
        <span v-if="!xActive">⮕</span>
      </div>
      <div>
        <div class="player">
          <h2 :class="{ o: !xActive }">o</h2>
          <span
            @click="!changingPlayerName.o && changePlayerName('o')"
            class="player-name"
            :class="{ changing: changingPlayerName.o }"
          >
            <strong>{{ player.o }}</strong>
          </span>
          <form
            v-if="changingPlayerName.o"
            @submit.prevent="finishChangingPlayerName('o')"
          >
            <input
              type="text"
              maxlength="10"
              ref="player-name-input-o"
              v-model="player.o"
              @blur="finishChangingPlayerName('o')"
            />
          </form>
        </div>
        <div class="scores">
          {{ scores.wins.o }} / {{ scores.losses.o }} / {{ scores.ties }}
        </div>
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
      board: null,
      scores: {
        wins: {
          x: 0,
          o: 0
        },
        losses: {
          x: 0,
          o: 0
        },
        ties: 0
      },

      changingPlayerName: {
        x: false,
        o: false
      },
      player: {
        x: "Player",
        o: "Player"
      }
    };
  },

  created() {
    this.initializeBoard();
  },

  methods: {
    initializeBoard() {
      this.nerdStat("Initialize Board");
      this.board = Array(9).fill(null);
    },

    iChoseThis(index) {
      if (!this.board[index]) {
        const mark = this.xActive ? "x" : "o";

        this.nerdStat("Choosing spot " + index + " with " + mark);

        this.board[index] = mark;

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

      let result = winning.some(check => {
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
          this.nerdStat("Winning set: " + JSON.stringify(this.winningSet));
          this.scores.wins[this.winner]++;
          this.scores.losses[this.winner !== "x" ? "x" : "o"]++;

          this.$gtag.event("win", {
            event_category: "game",
            event_label: "winner",
            value: this.winner
          });

          return true;
        }

        return false;
      });

      if (result) {
        this.nerdStat(`Winner ${this.winner}`);
      } else {
        this.nerdStat("No winner found");
      }

      return result;
    },

    checkTie() {
      let isTie = this.board.every(item => item);

      if (isTie) {
        this.tie = true;
        this.scores.ties++;

        this.$gtag.event("tie", {
          event_category: "game"
        });

        this.nerdStat("Was a tie");
        return true;
      } else {
        this.nerdStat("No tie found");
        return false;
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
    },

    changePlayerName(which) {
      this.nerdStat(`Start changing player name ${which}`);
      this.changingPlayerName[which] = true;

      this.$nextTick(() => {
        this.$refs[`player-name-input-${which}`].focus();
      });
    },

    finishChangingPlayerName(which) {
      // this makes sure blur and submit don't both fire
      if (this.changingPlayerName[which]) {
        if (!this.player[which]) {
          this.nerdStat(`Player name ${which} was blank, resetting.`);
          this.player[which] = "Player";
        }
        this.nerdStat(
          `Finish changing player name ${which} to ${this.player[which]}`
        );
        this.changingPlayerName[which] = false;
      }
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
  position: fixed;
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
  align-items: center;
  color: #666;
  margin-bottom: 1rem;

  & > div {
    flex: 1;
    text-align: center;
  }

  .turn {
    font-size: 2rem;
  }
}
.player {
  position: relative;
  h2 {
    margin: 0 1rem 0 0;
    display: inline-block;
    font-size: 4rem;
    vertical-align: sub;
  }
  strong {
    font-size: 2.8rem;
  }
  .player-name {
    cursor: pointer;
    &.changing {
      visibility: hidden;
      cursor: default;
    }
  }

  input {
    width: 100%;
    position: absolute;
    top: 1rem;
    left: 0;
    font-weight: bold;
    text-align: center;
  }
}
.scores {
  text-align: center;
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
  max-width: 80vh;
  @media (min-width: 1000px) {
    max-width: 800px;
  }
  height: 80vw;
  max-height: 80vh;
  @media (min-width: 1000px) {
    max-height: 800px;
  }
  margin: auto;
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);

  .a-mark-container {
    overflow: hidden;
    border: 1vw solid $primary;
    @media (min-width: 1000px) {
      border-width: 10px;
    }

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
    @media (min-width: 1000px) {
      font-size: 200px;
    }
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

input {
  background: #121212;
  color: #ffffff;
  border: none;
  border-bottom: 1px solid #444444;
  padding: 0.2rem 0.5rem;
  font-size: 2.6rem;
  &:focus {
    outline: none;
    background: #000000;
  }
}
</style>
