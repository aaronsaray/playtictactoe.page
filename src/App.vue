<template>
  <main id="app">
    <router-view />
  </main>
</template>

<style lang="scss">
h2 {
  padding: 1rem;
  margin: 0;
  font-size: 2.2rem;
  font-weight: 300;
}
input {
  background-color: #111111;
  padding: 0.3rem;
  color: #ffffff;
  border: none;
  border-bottom: 2px solid #444444;
  &:focus {
    outline: none;
  }
}
button {
  background-color: $x;
  color: set-button-text-color($x);
  font-size: 1.1rem;
  padding: 0.2rem 0.8rem;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: $o;
  }
}
</style>
