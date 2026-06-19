<template>
  <div>
    <nav id="nav">
      <router-link to="/" id="logo-url">
        <img src="/img/logo_cafe.jpeg" id="logo" />
      </router-link>
      <router-link to="/">Home</router-link> |
      <router-link to="/menu">Cardápio</router-link> |
      <router-link to="/pedidos">Pedidos</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavBarComponent",
};
</script>

<style scoped>
#logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  mix-blend-mode: screen;
  transition: 0.4s;
}

#logo:hover {
  width: 70px;
  height: 70px;
  rotate: 360deg;
}

#nav #logo-url {
  margin: auto;
  margin-left: 0;
  display: flex;
  align-items: center;
  text-decoration: none;
  background: transparent;
}

#nav {
  background-color: #1C0A00;
  border-bottom: #C47A2B 4px solid;
  padding: 15px 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

#nav a {
  color: #C47A2B;
  text-decoration: none;
  margin-left: 20px;
  font-size: 18px;
}

#nav a:hover {
  color: #F5E6C8;
  font-size: 22px;
  transition: 0.2s;
}
</style>