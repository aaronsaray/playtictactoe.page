<template>
  <section id="player-name">
    <form @submit.prevent="handleSubmit()">
      <label for="player-name-input"> Your name </label><br />
      <input v-model="name" required id="player-name-input" maxlength="20" /><br />
      <button type="submit">Set</button>
    </form>
  </section>
</template>

<script>
export default {
  props: {
    defaultName: {
      required: false,
      type: String,
    },
  },

  data() {
    return {
      name: this.defaultName,
    };
  },

  methods: {
    handleSubmit() {
      this.$emit("name-chosen", this.name);
    },
  },
};
</script>

<style lang="scss">
#player-name {
  color: #aaaaaa;
  font-size: 1.8rem;
}
</style>
