<template>
  <div>
    <section id="board">
      <template v-for="(row, x) in board">
        <div v-for="(col, y) in row" :key="`a-${x}-${y}`">
          <span class="x" v-if="x % 3">&times;</span>
          <span class="o" v-if="!(x % 3)">&#9702;</span>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]
    };
  }
};
</script>

<style lang="scss">
#board {
  width: 80vw;
  height: 80vw;
  margin: auto;
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);

  div {
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

    &.x {
      color: #00bc8c;
    }
    &.o {
      color: #3498db;
    }
  }
}
</style>
