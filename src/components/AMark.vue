<template>
  <div
    @mouseover="playerConsideringThis()"
    @mouseleave="playerStoppedConsideringThis()"
    @click="playerChoseThis()"
  >
    <span
      v-if="hasMark == 'x' || (mark == 'x' && considering)"
      class="x"
      :class="{ considering: considering }"
    >
      &times;
    </span>
    <span
      v-if="hasMark == 'o' || (mark == 'o' && considering)"
      class="o"
      :class="{ considering: considering }"
    >
      o
    </span>
  </div>
</template>

<script>
export default {
  props: {
    enabled: {
      required: true,
      type: Boolean,
    },
    hasMark: {
      required: true,
    },
    mark: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      considering: false,
    };
  },

  methods: {
    playerConsideringThis() {
      if (this.enabled && !this.hasMark) {
        this.considering = true;
      }
    },

    playerStoppedConsideringThis() {
      this.considering = false;
    },

    playerChoseThis() {
      if (this.enabled && !this.hasMark) {
        this.$emit("player-chose");
        this.playerStoppedConsideringThis();
      }
    },
  },
};
</script>
