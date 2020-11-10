<template>
  <section id="participants">
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
        <form v-if="changingPlayerName.x" @submit.prevent="finishChangingPlayerName('x')">
          <input
            type="text"
            maxlength="10"
            ref="player-name-input-x"
            v-model="player.x"
            @blur="finishChangingPlayerName('x')"
          />
        </form>
      </div>
      <div class="scores">{{ scores.wins.x }} / {{ scores.losses.x }} / {{ scores.ties }}</div>
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
        <form v-if="changingPlayerName.o" @submit.prevent="finishChangingPlayerName('o')">
          <input
            type="text"
            maxlength="10"
            ref="player-name-input-o"
            v-model="player.o"
            @blur="finishChangingPlayerName('o')"
          />
        </form>
      </div>
      <div class="scores">{{ scores.wins.o }} / {{ scores.losses.o }} / {{ scores.ties }}</div>
    </div>
  </section>
</template>

<script>
const DEFAULT_PLAYER_NAME = "Player";

export default {
  data() {
    return {
      xActive: false,
      scores: {
        wins: {
          x: 0,
          o: 0,
        },
        losses: {
          x: 0,
          o: 0,
        },
        ties: 0,
      },

      changingPlayerName: {
        x: false,
        o: false,
      },
      player: {
        x: DEFAULT_PLAYER_NAME,
        o: DEFAULT_PLAYER_NAME,
      },
      oPlayerOldName: "",
    };
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
