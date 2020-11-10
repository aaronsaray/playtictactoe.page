<template>
  <section>
    <div>
      <button @click="start()">Start New Game</button>
    </div>
    <div>or</div>
    <div>
      <form>
        <input placeholder="Enter ID" />
        <br />
        <button>and Join Game</button>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  margin-top: 2rem;
  & > div {
    margin-bottom: 1.5rem;
  }
}
input {
  text-align: center;
  margin-bottom: 0.5rem;
}

section,
button,
input {
  font-size: 1.5rem;
}
</style>
