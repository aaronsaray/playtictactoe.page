<template>
  <div>
    <section id="board">
      <a-mark
        v-for="(mark, index) in game"
        :key="`mark-${index}`"
        class="a-mark-container"
        :class="{
          available: !mark && active === playerType && !loading,
          winner: winner && winner === mark && winningSet.includes(index),
        }"
        :has-mark="mark"
        :mark="active"
        :enabled="active === playerType && !loading"
        @player-chose="playerChose(index)"
      ></a-mark>
    </section>
  </div>
</template>

<script>
import AMark from "@/components/AMark.vue";

export default {
  components: {
    "a-mark": AMark,
  },

  props: {
    loading: {
      required: true,
      type: Boolean,
    },

    playerType: {
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
    game: {
      required: true,
      type: Array,
    },
    winner: {
      required: true,
    },
    winningSet: {
      required: true,
      type: Array,
    },
  },

  methods: {
    isMarkAvailable(index) {
      return !this.game[index];
    },

    playerChose(index) {
      this.$emit("player-chose", index);
    },
  },
};
</script>

<style lang="scss">
#board {
  width: 80vw;
  max-width: 80vh;
  @media (min-width: 1000px) {
    max-width: 750px;
  }
  height: 80vw;
  max-height: 80vh;
  @media (min-width: 1000px) {
    max-height: 750px;
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
    cursor: not-allowed;

    &.winner * {
      color: #ffffff;
    }

    &.available {
      cursor: pointer;
    }

    .considering {
      text-shadow: 0px 6px 9px #000000;
      opacity: 0.8;
    }
  }
}
</style>
