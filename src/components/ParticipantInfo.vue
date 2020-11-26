<template>
  <section id="participants">
    <div>
      <div class="player">
        <h2 :class="{ x: xActive }">&times;</h2>
        <strong>{{ series.x_player_name }}</strong>
      </div>
      <div class="scores">{{ series.x.wins }} / {{ series.x.losses }} / {{ series.x.ties }}</div>
    </div>
    <div class="turn" :class="{ x: xActive, o: !xActive }">
      <span v-if="xActive">⬅</span>
      Turn
      <span v-if="!xActive">⮕</span>
    </div>
    <div>
      <div class="player">
        <h2 :class="{ o: !xActive }">o</h2>
        <strong>{{ series.o_player_name }}</strong>
      </div>
      <div class="scores">{{ series.o.wins }} / {{ series.o.losses }} / {{ series.o.ties }}</div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    series: {
      required: true,
      type: Object,
    },
  },

  computed: {
    xActive() {
      return this.series.active === "x";
    },
  },
};
</script>

<style lang="scss">
#participants {
  padding: 0.1rem;
  display: flex;
  align-items: center;
  color: #666;
  margin-bottom: 1rem;
  & > div {
    flex: 1;
    text-align: center;
  }
  .turn {
    font-size: min(5vw, 2rem);
  }
}
</style>
