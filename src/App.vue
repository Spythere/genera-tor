<template>
  <div id="app_wrapper">
    <router-view />
  </div>
</template>

<style lang="scss">
@import './styles/global.scss';

#app {
  background-color: $bgCol;
  color: white;

  min-height: 100vh;
}

#app_wrapper {
  padding: 0.5em;
}

@media screen and (max-width: 500px) {
  #app {
    font-size: calc(1vw + 0.5rem);
  }
}
</style>

