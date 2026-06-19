<template>
  <div>
    <banner-component />
    <div id="home-content">
      <h2>Bem-vindo ao Café Dois Dedin!</h2>
      <p>Futebol é paixão, café é ritual. Prepare o seu dedin extra de café: a resenha já festeja antes do gol.</p>
      <router-link to="/menu" class="btn-cardapio">Ver Cardápio ☕</router-link>
    </div>
  </div>
</template>

<script>
import BannerComponent from "@/components/BannerComponent.vue";

export default {
  name: "HomeView",
  components: { BannerComponent },
};
</script>

<style scoped>
#home-content {
  text-align: center;
  padding: 3rem 1rem;
}

h2 {
  font-family: Georgia, serif;
  font-size: 2rem;
  color: #1C0A00;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
}

.btn-cardapio {
  display: inline-block;
  padding: 14px 32px;
  background: #1C0A00;
  color: #C47A2B;
  text-decoration: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.1rem;
  transition: 0.4s;
}

.btn-cardapio:hover {
  background: #C47A2B;
  color: #1C0A00;
}
</style>