<template>
  <div id="app">
    <nav-bar-component />
    <router-view />
  </div>
</template>

<script>
import NavBarComponent from "@/components/NavBarComponent.vue";

export default {
  name: "App",
  components: { NavBarComponent },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: #FDF6EC;
  color: #1C0A00;
}

#app {
  min-height: 100vh;
}

h1 {
  font-family: Georgia, serif;
  color: #1C0A00;
}
</style>