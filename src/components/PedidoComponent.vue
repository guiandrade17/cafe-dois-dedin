<template>
  <div id="pedido-wrap">
    <!-- Alerta semântico -->
    <alerta-component
      v-if="alerta.mensagem"
      :tipo="alerta.tipo"
      :mensagem="alerta.mensagem"
      :duracao="alerta.duracao"
      @fechar="limparAlerta"
    />

    <form id="pedido-form" @submit="criarPedido($event)">

      <!-- Card do café selecionado -->
      <div id="cafe-selecionado">
        <img
          v-if="cafe && cafe.foto"
          :src="cafe.foto"
          :alt="cafe.nome"
          id="foto-content"
          @error="$event.target.style.display='none'"
        />
        <div id="cafe-selecionado-info">
          <p id="nome-cafe">{{ cafe && cafe.nome ? cafe.nome : "-" }}</p>
          <p id="preco-cafe" v-if="cafe && cafe.valor">R$ {{ cafe.valor.toFixed(2) }}</p>
          <p id="desc-cafe" v-if="cafe && cafe.descricao">{{ cafe.descricao }}</p>
        </div>
      </div>

      <!-- Nome do cliente -->
      <div class="campo">
        <label for="nome-cliente">Nome do cliente <span class="obrigatorio">*</span></label>
        <input
          type="text"
          v-model="nomeCliente"
          id="nome-cliente"
          placeholder="Digite seu nome"
          :class="{ 'input-erro': erros.nome }"
        />
        <span v-if="erros.nome" class="campo-erro">{{ erros.nome }}</span>
      </div>

      <!-- Tamanho -->
      <div class="campo">
        <label>Tamanho <span class="obrigatorio">*</span></label>
        <select
          v-model="tamanhoSelecionado"
          :class="{ 'input-erro': erros.tamanho }"
        >
          <option value="">Selecione o tamanho</option>
          <option
            v-for="tamanho in listaTamanhos"
            :key="tamanho.id"
            :value="tamanho"
          >
            {{ tamanho.descricao }}
          </option>
        </select>
        <span v-if="erros.tamanho" class="campo-erro">{{ erros.tamanho }}</span>
      </div>

      <!-- Acompanhamentos -->
      <div class="campo">
        <label class="label-secao">🍞 Acompanhamentos <small>(opcional)</small></label>
        <div class="opcoes-grid">
          <div
            class="opcao-item"
            v-for="acomp in listaAcompanhamentos"
            :key="acomp.id"
          >
            <input
              type="checkbox"
              :id="'acomp-' + acomp.id"
              :value="acomp"
              v-model="listaAcompanhamentosSelecionados"
            />
            <label :for="'acomp-' + acomp.id" class="label-opcao">
              {{ acomp.nome }}
              <span class="opcao-preco">R$ {{ acomp.valor.toFixed(2) }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Bebidas -->
      <div class="campo">
        <label class="label-secao">🥤 Bebidas <small>(opcional)</small></label>
        <div class="opcoes-grid">
          <div
            class="opcao-item"
            v-for="bebida in listaBebidas"
            :key="bebida.id"
          >
            <input
              type="checkbox"
              :id="'beb-' + bebida.id"
              :value="bebida"
              v-model="listaBebidasSelecionadas"
            />
            <label :for="'beb-' + bebida.id" class="label-opcao">
              {{ bebida.nome }}
              <span class="opcao-preco">R$ {{ bebida.valor.toFixed(2) }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Resumo total -->
      <div id="resumo" v-if="cafe">
        <p class="resumo-linha">
          <span>☕ {{ cafe.nome }}</span>
          <span>R$ {{ cafe.valor.toFixed(2) }}</span>
        </p>
        <p
          class="resumo-linha"
          v-for="a in listaAcompanhamentosSelecionados"
          :key="'ra-' + a.id"
        >
          <span>🍞 {{ a.nome }}</span>
          <span>R$ {{ a.valor.toFixed(2) }}</span>
        </p>
        <p
          class="resumo-linha"
          v-for="b in listaBebidasSelecionadas"
          :key="'rb-' + b.id"
        >
          <span>🥤 {{ b.nome }}</span>
          <span>R$ {{ b.valor.toFixed(2) }}</span>
        </p>
        <div class="resumo-total">
          <span>Total</span>
          <span>R$ {{ totalPedido.toFixed(2) }}</span>
        </div>
      </div>

      <button type="submit" id="btn-confirmar" :disabled="enviando">
        {{ enviando ? "Enviando…" : "✔ Confirmar Pedido" }}
      </button>

    </form>
  </div>
</template>

<script>
import AlertaComponent from "@/components/AlertaComponent.vue";


export default {
  name: "PedidoComponent",
  components: { AlertaComponent },
  props: { cafe: null },
  data() {
    return {
      listaTamanhos: [],
      listaBebidas: [],
      listaAcompanhamentos: [],
      nomeCliente: "",
      tamanhoSelecionado: "",
      listaAcompanhamentosSelecionados: [],
      listaBebidasSelecionadas: [],
      erros: { nome: "", tamanho: "" },
      alerta: { tipo: "info", mensagem: "", duracao: 4000 },
      enviando: false,
      avisoOpcionaisExibido: false,
    };
  },
  computed: {
    totalPedido() {
      let total = this.cafe ? this.cafe.valor : 0;
      this.listaAcompanhamentosSelecionados.forEach((a) => (total += a.valor));
      this.listaBebidasSelecionadas.forEach((b) => (total += b.valor));
      return total;
    },
  },
  methods: {
    async getTamanhos() {
      const res = await fetch(`${this.$apiUrl}/tipos_tamanho`);
      this.listaTamanhos = await res.json();
    },
    async getOpcionais() {
      const res = await fetch(`${this.$apiUrl}/opcionais`);
      const dados = await res.json();
      this.listaAcompanhamentos = dados.acompanhamentos;
      this.listaBebidas = dados.bebidas;
    },
    validar() {
      let valido = true;
      this.erros = { nome: "", tamanho: "" };
      if (!this.nomeCliente.trim()) {
        this.erros.nome = "Informe o seu nome.";
        valido = false;
      }
      if (!this.tamanhoSelecionado) {
        this.erros.tamanho = "Selecione o tamanho.";
        valido = false;
      }
      if (!valido) {
        this.exibirAlerta("erro", "Preencha os campos obrigatórios antes de confirmar.");
      }
      return valido;
    },
    async criarPedido(e) {
      e.preventDefault();
      if (!this.validar()) return;

      // Aviso (laranja): pedido sem nenhum opcional selecionado.
      // Não bloqueia o fluxo, apenas avisa antes de enviar.
      const semOpcionais =
        this.listaAcompanhamentosSelecionados.length === 0 &&
        this.listaBebidasSelecionadas.length === 0;

      if (semOpcionais && !this.avisoOpcionaisExibido) {
        this.avisoOpcionaisExibido = true;
        this.exibirAlerta(
          "alerta",
          "Seu pedido está sem acompanhamentos ou bebidas. Clique novamente em Confirmar para enviar assim mesmo."
        );
        return;
      }

      this.enviando = true;
      const dadosPedido = {
        nome: this.nomeCliente,
        tamanho: this.tamanhoSelecionado,
        bebidas: Array.from(this.listaBebidasSelecionadas),
        acompanhamentos: Array.from(this.listaAcompanhamentosSelecionados),
        cafe: this.cafe,
        statusId: 6,
      };
      try {
        const req = await fetch(`${this.$apiUrl}/pedidos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosPedido),
        });
        if (!req.ok) throw new Error();
        this.exibirAlerta("sucesso", "Pedido realizado com sucesso! Redirecionando…", 2500);
        setTimeout(() => { this.$router.push({ path: "/pedidos" }); }, 2600);
      } catch {
        this.exibirAlerta("erro", "Erro ao enviar o pedido. Tente novamente.");
      } finally {
        this.enviando = false;
      }
    },
    exibirAlerta(tipo, mensagem, duracao = 4000) {
      this.alerta = { tipo, mensagem, duracao };
    },
    limparAlerta() {
      this.alerta = { tipo: "info", mensagem: "", duracao: 4000 };
    },
  },
  mounted() {
    this.getTamanhos();
    this.getOpcionais();
  },
};
</script>

<style scoped>
#pedido-wrap {
  max-width: 620px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

#pedido-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Card do café selecionado */
#cafe-selecionado {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(28,10,0,0.15);
  display: flex;
  flex-direction: column;
}

#foto-content {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

#cafe-selecionado-info {
  padding: 16px 20px;
}

#nome-cafe {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1C0A00;
  margin-bottom: 4px;
  font-family: Georgia, serif;
}

#preco-cafe {
  font-size: 1.3rem;
  font-weight: bold;
  color: #C47A2B;
  margin-bottom: 8px;
}

#desc-cafe {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
}

/* Campos */
.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fff;
  padding: 18px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(28,10,0,0.08);
}

label {
  font-weight: bold;
  color: #1C0A00;
  font-size: 0.95rem;
  border-left: 4px solid #C47A2B;
  padding-left: 10px;
}

.label-secao {
  font-size: 1rem;
  border-left: 4px solid #C47A2B;
  padding-left: 10px;
}

.label-secao small {
  font-weight: 400;
  color: #888;
  font-size: 0.82rem;
}

.obrigatorio { color: #D64045; }

input[type="text"],
select {
  padding: 12px 14px;
  border: 1.5px solid #d0c4b0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
  height: auto;
}

input[type="text"]:focus,
select:focus { border-color: #C47A2B; }

.input-erro { border-color: #D64045 !important; }

.campo-erro {
  color: #D64045;
  font-size: 0.82rem;
  font-weight: 600;
}

/* Opções de checkbox */
.opcoes-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.opcao-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.opcao-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #C47A2B;
  cursor: pointer;
  flex-shrink: 0;
}

.label-opcao {
  border: none;
  padding: 0;
  font-weight: 500;
  color: #333;
  font-size: 0.92rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.opcao-preco {
  color: #C47A2B;
  font-weight: 700;
  font-size: 0.88rem;
}

/* Resumo */
#resumo {
  background: #1C0A00;
  color: #F5E6C8;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resumo-linha {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  border-bottom: 1px dashed rgba(245,230,200,0.2);
  padding-bottom: 6px;
}

.resumo-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.15rem;
  font-weight: bold;
  color: #C47A2B;
  padding-top: 6px;
  margin-top: 4px;
}

/* Botão confirmar */
#btn-confirmar {
  background-color: #C47A2B;
  color: #1C0A00;
  font-weight: bold;
  border: none;
  font-size: 1.1rem;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  width: 100%;
  transition: 0.3s;
}

#btn-confirmar:hover {
  background-color: #1C0A00;
  color: #C47A2B;
}

#btn-confirmar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>