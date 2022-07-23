<template>
  <div id="app_wrapper">
    <router-view />

    <footer>
      &copy; <a href="https://td2.info.pl/profile/?u=20777">Spythere</a> {{ new Date().getUTCFullYear() }} | v.{{
        appVersion
      }}
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import packageInfo from '../package.json';

export default defineComponent({
  data() {
    return {
      appVersion: packageInfo.version,
    };
  },
});
</script>

<style lang="scss">
@import './styles/global.scss';

#app {
  color: white;

  min-height: 100vh;
}

footer {
  text-align: center;
  padding: 0.5em 0;
}

@media screen and (max-width: 500px) {
  #app {
    font-size: calc(1vw + 0.5rem);
  }
}
</style>

