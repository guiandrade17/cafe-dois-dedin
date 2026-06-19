<template>
  <div>
    <h1 id="pedidos-titulo">Pedidos</h1>
    <lista-pedido-component />
  </div>
</template>

<script>
import ListaPedidoComponent from "@/components/ListaPedidoComponent.vue";

export default {
  name: "PedidosView",
  components: {
    ListaPedidoComponent,
  },
};
</script>

<style scoped>
#pedidos-titulo {
  text-align: center;
  margin: 24px 0 32px;
  font-family: Georgia, serif;
  color: #1C0A00;
  font-size: 2rem;
}
</style>