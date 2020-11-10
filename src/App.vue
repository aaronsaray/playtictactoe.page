<template>
  <div id="app">
    <main>
      <router-view />
    </main>
  </div>
</template>

<style lang="scss">
$primary: #375a7f;
$x: #bb86fc;
$o: #3498db;
$success: #00bc8c;

@function set-button-text-color($color) {
  @if (lightness($color) > 40) {
    @return black;
  } @else {
    @return white;
  }
}

* {
  scrollbar-color: #333333 #202020;
}
*::-webkit-scrollbar-track {
  background: #202020;
}
*::-webkit-scrollbar-thumb {
  background-color: #333333;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
main {
  text-align: center;
}
h2 {
  margin: 0;
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
}
button {
  background: $primary;
  color: set-button-text-color($primary);
  padding: 0.3rem 0.7rem;
  cursor: pointer;
}
input {
  background: #121212;
  color: #fff;
  border: none;
  border-bottom: 1px solid #444;
  padding: 0.2rem 0.5rem;
}
</style>
