<template>
  <section id="participants">
    <div>
      <div class="player">
        <h2 :class="{ x: xActive }">&times;</h2>
        <strong>{{ players.x.name }}</strong>
      </div>
      <div class="scores">{{ players.x.wins }} / {{ players.x.losses }} / {{ players.x.ties }}</div>
    </div>
    <div class="turn" :class="{ x: xActive, o: !xActive }">
      <span v-if="xActive">⬅</span>
      Turn
      <span v-if="!xActive">⮕</span>
    </div>
    <div>
      <div class="player">
        <h2 :class="{ o: !xActive }">o</h2>
        <strong>{{ players.o.name }}</strong>
      </div>
      <div class="scores">{{ players.o.wins }} / {{ players.o.losses }} / {{ players.o.ties }}</div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    players: {
      required: true,
      type: Object,
    },
    xActive: {
      type: Boolean,
      required: true,
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
