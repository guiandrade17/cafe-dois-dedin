<template>
  <div id="main-banner">
    <img src="/img/cafe.jpg" alt="Banner Café Dois Dedim" id="banner-img" />
    <div id="banner-overlay">
      <h1>Café Dois Dedin ☕✌️</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "BannerComponent",
};
</script>

<style scoped>
#main-banner {
  position: relative;
  height: 350px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

#banner-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  z-index: 0;
}

#banner-overlay {
  position: relative;
  z-index: 1;
}

#banner-overlay h1 {
  font-size: 40px;
  color: #F5E6C8;
  background: rgba(28, 10, 0, 0.75);
  padding: 25px;
  border-radius: 100px 0px 0px 100px;
  letter-spacing: 0.04em;
}
</style>