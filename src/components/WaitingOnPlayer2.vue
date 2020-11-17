<template>
  <section id="waiting-on-player-2">
    <h2>Waiting on Player 2</h2>
    <p>Waiting on Player 2 to join the game.</p>
    <p>Share this link with Player 2:</p>
    <input :value="url" ref="url" />
    <button v-if="!copyError" @click.prevent="copyToClipboard()">Copy</button>
    <div v-else>This device doesn't support copying to clipboard. :(</div>
    <div class="copied" v-if="copied">Copied to Clipboard</div>
  </section>
</template>

<script>
export default {
  props: {
    gameId: {
      required: true,
      type: String,
    },
  },

  computed: {
    url() {
      return `https://playtictactoe.page/${this.gameId}`;
    },
  },

  data() {
    return {
      copyError: false,
      copied: false,
    };
  },

  methods: {
    copyToClipboard() {
      try {
        const input = this.$refs.url;
        input.select();
        input.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.getSelection().removeAllRanges();
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 3000);
      } catch (e) {
        this.copyError = true;
      }
    },
  },
};
</script>

<style lang="scss">
#waiting-on-player-2 {
  text-align: center;
  h2 {
    margin-bottom: 3rem;
  }

  input {
    margin-top: 2rem;
    width: 100%;
    text-align: center;
    max-width: 300px;
  }

  .copied {
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
