<template>
  <div>
    <h1>Configuração do Pedido</h1>

    <alerta-component
      v-if="alerta.mensagem"
      :tipo="alerta.tipo"
      :mensagem="alerta.mensagem"
      :duracao="alerta.duracao"
      @fechar="limparAlerta"
    />

    <pedido-component :cafe="this.cafeSelecionado" />
  </div>
</template>

<script>
import PedidoComponent from "@/components/PedidoComponent.vue";
import AlertaComponent from "@/components/AlertaComponent.vue";

export default {
  name: "ConfiguracaoPedidoView",
  components: {
    PedidoComponent,
    AlertaComponent,
  },
  data() {
    return {
      cafeSelecionado: null,
      alerta: { tipo: "info", mensagem: "", duracao: 4000 },
    };
  },
  mounted() {
    const query = this.$route.query;
    if (query.cafe) {
      const decodeCafe = JSON.parse(decodeURIComponent(query.cafe));
      this.cafeSelecionado = decodeCafe;

      // Alerta informativo: confirma a seleção e orienta o próximo passo
      this.exibirAlerta(
        "info",
        `Você selecionou ${decodeCafe.nome}. Agora escolha o tamanho e os opcionais do seu pedido.`
      );
    } else {
      // Aviso: chegou na tela de configuração sem nenhum café escolhido
      this.exibirAlerta(
        "alerta",
        "Nenhum café foi selecionado ainda. Volte ao cardápio para escolher um."
      );
    }
  },
  methods: {
    exibirAlerta(tipo, mensagem, duracao = 4000) {
      this.alerta = { tipo, mensagem, duracao };
    },
    limparAlerta() {
      this.alerta = { tipo: "info", mensagem: "", duracao: 4000 };
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin: 24px 0;
  font-family: Georgia, serif;
  color: #1C0A00;
}
</style>