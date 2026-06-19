<template>
  <div id="menu-container">
    <h1>Cardápio</h1>

    <div v-if="listaMenuCafes.length === 0" id="loading">
      <p>☕ Carregando cardápio…</p>
    </div>

    <div id="cards-grid">
      <div
        class="card-content"
        v-for="cafe in listaMenuCafes"
        :key="cafe.id"
      >
        <div class="card-img-wrap">
          <img :src="cafe.foto" :alt="cafe.nome" @error="onImgError($event)" />
          <span v-if="cafe.eh_novidade" class="badge-novidade">Novidade ✨</span>
        </div>
        <div class="card-coluna">
          <p class="nome-content">{{ cafe.nome }}</p>
          <p class="preco-content">R$ {{ cafe.valor.toFixed(2) }}</p>
          <p class="descricao-content">{{ cafe.descricao }}</p>
          <button @click="selecionarCafe(cafe)">Selecionar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "MenuView",
  data() {
    return {
      listaMenuCafes: [],
    };
  },
  methods: {
    async consultarMenu() {
      try {
        const response = await fetch(`${this.$apiUrl}/menu`);
        const dados = await response.json();
        this.listaMenuCafes = [
          ...(dados.especiais || []),
          ...(dados.cafes    || []),
        ];
      } catch {
        console.error("Erro ao carregar o cardápio.");
      }
    },
    selecionarCafe(cafeSelecionado) {
      const param = JSON.stringify(cafeSelecionado);
      const cafeJson = encodeURIComponent(param);
      this.$router.push({ path: "/config", query: { cafe: cafeJson } });
    },
    onImgError(event) {
      event.target.src = "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=400&h=250&auto=compress&cs=tinysrgb";
    },
  },
  mounted() {
    this.consultarMenu();
  },
};
</script>

<style scoped>
#menu-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

h1 {
  text-align: center;
  margin: 24px 0 32px;
  font-family: Georgia, serif;
  color: #1C0A00;
  font-size: 2rem;
}

#loading {
  text-align: center;
  padding: 2rem;
  color: #888;
}

#cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.card-content {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(28,10,0,0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-content:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(28,10,0,0.2);
}

.card-img-wrap {
  position: relative;
}

.card-img-wrap img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.badge-novidade {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #C47A2B;
  color: #1C0A00;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}

.card-coluna {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.nome-content {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1C0A00;
  margin-bottom: 6px;
  white-space: normal;
}

.preco-content {
  font-size: 1.4rem;
  font-weight: bold;
  color: #C47A2B;
  margin-bottom: 10px;
}

.descricao-content {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  flex: 1;
  margin-bottom: 16px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.card-coluna button {
  padding: 12px;
  background-color: #1C0A00;
  color: #C47A2B;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
}

.card-coluna button:hover {
  background-color: #C47A2B;
  color: #1C0A00;
}
</style>