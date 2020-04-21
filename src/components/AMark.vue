<template>
  <div
    @mouseover="iAmConsideringThis()"
    @mouseleave="iStoppedConsideringThis()"
    @click="iChoseThis()"
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
  props: ["hasMark", "mark", "enabled"],

  data: function() {
    return {
      considering: false
    };
  },

  methods: {
    iAmConsideringThis() {
      if (this.enabled && !this.hasMark) {
        this.considering = true;
      }
    },

    iStoppedConsideringThis() {
      this.considering = false;
    },

    iChoseThis() {
      if (this.enabled && !this.hasMark) {
        this.$emit("chose");
        this.considering = false;
      }
    }
  }
};
</script>
