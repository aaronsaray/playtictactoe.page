<template>
  <section id="game-done">
    <h2 v-if="winner" :class="winner">
      {{ winnerName }}
      Wins!
    </h2>
    <h2 v-if="tie">It's a Tie.</h2>
    <a v-if="canChoosePlayAgain" href="#" @click.prevent="playAgain()">Play Again?</a>
    <p v-else>Waiting on other player to start new game.</p>
  </section>
</template>

<script>
export default {
  props: {
    winner: {
      required: true,
    },
    winnerName: {
      required: true,
      type: String,
    },

    tie: {
      required: true,
      type: Boolean,
    },

    canChoosePlayAgain: {
      required: true,
      type: Boolean,
    },
  },

  methods: {
    playAgain() {
      this.$emit("play-again");
    },
  },
};
</script>

<style lang="scss">
#game-done {
  text-align: center;
  h2 {
    font-size: 3rem;
    font-weight: 400;
    margin-bottom: 3rem;
  }
  a {
    color: $success;
  }
}
</style>
