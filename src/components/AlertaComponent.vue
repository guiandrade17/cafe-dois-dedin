<template>
  <teleport to="body">
    <transition name="alerta-slide">
      <div
        v-if="visivel"
        :class="['alerta', `alerta--${tipo}`]"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <!-- Barra de progresso -->
        <div v-if="duracao > 0" class="alerta-progresso">
          <div
            class="alerta-progresso-barra"
            :style="{ animationDuration: `${duracao}ms` }"
          />
        </div>

        <!-- Ícone -->
        <div class="alerta-icone-wrapper">
          <svg class="alerta-icone" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <!-- Erro -->
            <template v-if="tipo === 'erro'">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
              <path d="M15 9L9 15M9 9l6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </template>
            <!-- Aviso -->
            <template v-else-if="tipo === 'alerta'">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="1.2"/>
            </template>
            <!-- Info -->
            <template v-else-if="tipo === 'info'">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
              <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <circle cx="12" cy="8.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="1.2"/>
            </template>
            <!-- Sucesso -->
            <template v-else-if="tipo === 'sucesso'">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
              <path d="M8 12.5l2.5 2.5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </template>
          </svg>
        </div>

        <!-- Conteúdo -->
        <div class="alerta-conteudo">
          <p class="alerta-titulo">{{ titulos[tipo] }}</p>
          <p class="alerta-msg">{{ mensagem }}</p>
        </div>

        <!-- Botão fechar -->
        <button class="alerta-fechar" @click="fechar" aria-label="Fechar notificação">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: "AlertaComponent",
  props: {
    tipo: {
      type: String,
      default: "info",
      validator: (v) => ["erro", "alerta", "info", "sucesso"].includes(v),
    },
    mensagem: { type: String, default: "" },
    duracao:  { type: Number, default: 4000 },
  },
  emits: ["fechar"],
  data() {
    return {
      visivel: false,
      timer: null,
      titulos: {
        erro:    "Algo deu errado",
        alerta:  "Atenção",
        info:    "Informação",
        sucesso: "Tudo certo!",
      },
    };
  },
  watch: {
    mensagem(nova) {
      if (nova) this.mostrar();
    },
  },
  mounted() {
    if (this.mensagem) this.mostrar();
  },
  methods: {
    mostrar() {
      this.visivel = true;
      clearTimeout(this.timer);
      if (this.duracao > 0) {
        this.timer = setTimeout(() => this.fechar(), this.duracao);
      }
    },
    fechar() {
      this.visivel = false;
      clearTimeout(this.timer);
      this.$emit("fechar");
    },
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
};
</script>

<style scoped>
/* ── Posicionamento fixo no canto superior direito ── */
.alerta {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;

  display: flex;
  align-items: flex-start;
  gap: 14px;

  width: 360px;
  max-width: calc(100vw - 32px);
  padding: 18px 18px 18px 20px;
  border-radius: 12px;
  overflow: hidden;

  background: #ffffff;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 10px 24px -4px rgba(0, 0, 0, 0.12);

  border-left: 4px solid transparent;
}

/* ── Cores semânticas ── */
.alerta--erro {
  border-left-color: #DC2626;
  --cor-icone: #DC2626;
  --cor-icone-bg: #FEF2F2;
  --cor-titulo: #991B1B;
  --cor-msg: #7F1D1D;
}
.alerta--alerta {
  border-left-color: #D97706;
  --cor-icone: #D97706;
  --cor-icone-bg: #FFFBEB;
  --cor-titulo: #92400E;
  --cor-msg: #78350F;
}
.alerta--info {
  border-left-color: #2563EB;
  --cor-icone: #2563EB;
  --cor-icone-bg: #EFF6FF;
  --cor-titulo: #1E40AF;
  --cor-msg: #1E3A8A;
}
.alerta--sucesso {
  border-left-color: #16A34A;
  --cor-icone: #16A34A;
  --cor-icone-bg: #F0FDF4;
  --cor-titulo: #15803D;
  --cor-msg: #14532D;
}

/* ── Barra de progresso ── */
.alerta-progresso {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.06);
}
.alerta-progresso-barra {
  height: 100%;
  background: var(--cor-icone);
  opacity: 0.45;
  animation: progresso linear forwards;
}
@keyframes progresso {
  from { width: 100%; }
  to   { width: 0%; }
}

/* ── Ícone ── */
.alerta-icone-wrapper {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--cor-icone-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.alerta-icone {
  width: 18px;
  height: 18px;
  color: var(--cor-icone);
}

/* ── Conteúdo de texto ── */
.alerta-conteudo {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.alerta-titulo {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--cor-titulo);
  letter-spacing: -0.01em;
}
.alerta-msg {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--cor-msg);
  opacity: 0.85;
}

/* ── Botão fechar ── */
.alerta-fechar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  color: var(--cor-icone);
  opacity: 0.5;
  transition: opacity 0.15s ease, background 0.15s ease;
  padding: 0;
  margin-top: 2px;
}
.alerta-fechar svg {
  width: 14px;
  height: 14px;
}
.alerta-fechar:hover {
  opacity: 1;
  background: var(--cor-icone-bg);
}
.alerta-fechar:focus-visible {
  outline: 2px solid var(--cor-icone);
  outline-offset: 2px;
  opacity: 1;
}

/* ── Animação de entrada / saída ── */
.alerta-slide-enter-active {
  animation: slideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
}
.alerta-slide-leave-active {
  animation: slideOut 0.25s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(calc(100% + 24px));
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
    max-height: 200px;
  }
  to {
    opacity: 0;
    transform: translateX(calc(100% + 24px));
    max-height: 0;
  }
}

/* ── Responsividade mobile ── */
@media (max-width: 480px) {
  .alerta {
    top: 12px;
    right: 12px;
    left: 12px;
    width: auto;
    max-width: none;
  }
}

/* ── Respeita preferência de movimento reduzido ── */
@prefers-reduced-motion: reduce {
  .alerta-slide-enter-active,
  .alerta-slide-leave-active,
  .alerta-progresso-barra {
    animation: none;
    transition: opacity 0.2s ease;
  }
}
</style>