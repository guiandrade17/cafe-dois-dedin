# ☕ Café Dois Dedim

Sistema de gerenciamento de pedidos para cafeteria artesanal, desenvolvido com **Vue 3** como projeto final da disciplina de Desenvolvimento Web — CEUB.

---

## 📌 Visão Geral

O **Café Dois Dedim** é uma transformação completa do sistema T-Burguer, migrado do segmento de hamburgueria para uma **cafeteria artesanal**. A identidade visual, os dados, os campos de formulário e as regras de negócio foram totalmente adaptados ao novo contexto.

### Principais mudanças estruturais

| T-Burguer (original)         | Café Dois Dedim (adaptado)         |
|------------------------------|------------------------------------|
| Identidade visual vermelha/escura | Paleta caramelo, espresso e creme |
| Seleção de Hambúrguer        | Seleção de Café (cardápio + especiais) |
| Campo "Ponto da Carne"       | Campo "Tamanho" (Pequeno / Médio / Grande / Família) |
| Complementos (batata/fritas) | Acompanhamentos (pão de queijo, croissant, bolo) |
| Bebidas de lata              | Bebidas artesanais (suco, limonada, chá) |
| `menu.burgues` + `menu.limitado` | `menu.cafes` + `menu.especiais` |
| `tipos_pontos` no db         | `tipos_tamanho` no db              |

### Trechos de código representativos

**Estrutura do pedido no `db.json`:**
```json
{
  "tipos_tamanho": [
    { "id": 1, "descricao": "Pequeno (200ml)" },
    { "id": 2, "descricao": "Médio (300ml)" },
    { "id": 3, "descricao": "Grande (400ml)" },
    { "id": 4, "descricao": "Família (500ml)" }
  ]
}
```

**Seleção de tamanho com `v-model` e estilo reativo no `PedidoView.vue`:**
```html
<label
  v-for="tam in tiposTamanho"
  :key="tam.id"
  :class="['tamanho-option', { 'tamanho-option--ativo': pedido.tamanho && pedido.tamanho.id === tam.id }]"
>
  <input type="radio" :value="tam" v-model="pedido.tamanho" style="display:none" />
  {{ tam.descricao }}
</label>
```

**Toggle de acompanhamentos (multi-seleção):**
```js
toggleAcompanhamento(item) {
  const idx = this.pedido.acompanhamentos.findIndex(a => a.id === item.id)
  if (idx >= 0) this.pedido.acompanhamentos.splice(idx, 1)
  else          this.pedido.acompanhamentos.push(item)
}
```

---

## 🚨 Solução Técnica dos Alertas Semânticos

O sistema de alertas é implementado no componente `Alerta.vue` e utilizado em todas as views via composição simples de props e eventos.

### Paleta semântica

| Tipo      | Cor      | Uso                                      |
|-----------|----------|------------------------------------------|
| `erro`    | Vermelho | Campos obrigatórios vazios, falha na API |
| `alerta`  | Laranja  | Avisos gerais, ações irreversíveis       |
| `info`    | Azul     | Informações contextuais                  |
| `sucesso` | Verde    | Pedido criado, status atualizado, exclusão confirmada |

### Como funciona

O componente `Alerta.vue` recebe `tipo`, `mensagem` e `duracao` via props. Ele exibe ou oculta automaticamente usando `v-if` + `<transition>` e dispara um `$emit('fechar')` ao fim do timer ou ao clicar no botão de fechar.

```vue
<!-- Uso nas views -->
<Alerta
  v-if="alerta.mensagem"
  :tipo="alerta.tipo"
  :mensagem="alerta.mensagem"
  :duracao="alerta.duracao"
  @fechar="limparAlerta"
/>
```

```js
// Método centralizado de exibição nas views
exibirAlerta(tipo, mensagem, duracao = 4000) {
  this.alerta = { tipo, mensagem, duracao }
},
limparAlerta() {
  this.alerta = { tipo: 'info', mensagem: '', duracao: 4000 }
}
```

O auto-dismiss é gerenciado com `setTimeout` dentro do próprio `Alerta.vue`, usando `watch` na prop `mensagem` para re-triggar o timer sempre que uma nova mensagem chega. Isso evita que alertas anteriores bloqueiem novos.

```js
// Alerta.vue
watch: {
  mensagem(nova) {
    if (nova) this.mostrar()
  }
},
methods: {
  mostrar() {
    this.visivel = true
    clearTimeout(this.timer)
    if (this.duracao > 0) {
      this.timer = setTimeout(() => this.fechar(), this.duracao)
    }
  }
}
```

### Validação de formulário

O método `validar()` em `PedidoView.vue` bloqueia o envio se nome, café ou tamanho estiverem ausentes, exibindo mensagens de erro inline em cada campo e um alerta global vermelho:

```js
validar() {
  let valido = true
  this.erros = { nome: '', cafe: '', tamanho: '' }

  if (!this.pedido.nome)    { this.erros.nome    = 'Informe o nome do cliente.'; valido = false }
  if (!this.pedido.cafe)    { this.erros.cafe    = 'Selecione um café.';         valido = false }
  if (!this.pedido.tamanho) { this.erros.tamanho = 'Selecione o tamanho.';       valido = false }

  if (!valido) this.exibirAlerta('erro', '❌ Preencha os campos obrigatórios antes de confirmar.')
  return valido
}
```

---

## 🧭 Diretrizes UX implementadas

- **Redirecionamento automático:** após confirmação do pedido, um alerta verde é exibido e a navegação para `/pedidos` ocorre automaticamente após 2,6 segundos via `setTimeout + this.$router.push`.
- **Listagem atualizada em tempo real:** `PedidosView` carrega os dados na hook `created()`, garantindo que o pedido recém-criado já apareça na listagem.
- **Remoção reativa:** ao excluir um pedido, o array `pedidos` é filtrado diretamente (`this.pedidos = this.pedidos.filter(...)`) sem necessidade de reload — Vue re-renderiza a lista instantaneamente.
- **Modal de confirmação:** exclusões são protegidas por um modal que exige confirmação explícita do usuário.

---

## 🔗 Links do Projeto

| Recurso | URL |
|---------|-----|
| 🌐 **Deploy (GitHub Pages)** | `https://SEU_USUARIO.github.io/cafe-dois-dedim/` |
| 🗄️ **API (JSON Server / Render)** | `https://sua-api-cafe.onrender.com` |
| 📁 **Repositório Front-end** | `https://github.com/SEU_USUARIO/cafe-dois-dedim` |
| 🗃️ **Repositório banco-json** | `https://github.com/SEU_USUARIO/banco-json-cafe` |

> Substitua `SEU_USUARIO` pelo seu usuário do GitHub após o deploy.

---

## ⚙️ Como Rodar Localmente

```bash
# 1. Instale as dependências
npm install

# 2. Copie o arquivo de ambiente
cp .env.exemplo .env.development

# 3. Inicie o JSON Server (em outro terminal)
npm run bancojson

# 4. Inicie a aplicação Vue
npm run serve
```

Acesse em: `http://localhost:8080`

---

## 🏗️ Estrutura do Projeto

```
cafe-dois-dedim/
├── db/
│   └── db.json              # Mock da API (JSON Server)
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Alerta.vue       # Alertas semânticos reativos
│   │   ├── CardCafe.vue     # Card de item do cardápio
│   │   └── NavBar.vue       # Barra de navegação
│   ├── router/
│   │   └── index.js         # Vue Router 4
│   ├── views/
│   │   ├── HomeView.vue     # Tela inicial
│   │   ├── PedidoView.vue   # Formulário de pedido
│   │   └── PedidosView.vue  # Listagem e gerenciamento
│   ├── App.vue              # Layout raiz + estilos globais
│   └── main.js              # Entry point
├── .env.desenvolvimento      # URL da API local
├── .env.production           # URL da API pública
├── vue.config.js             # publicPath para GitHub Pages
└── package.json
```

---

## 🛠️ Tecnologias Utilizadas

- [Vue 3](https://vuejs.org/) — Composition API / Options API
- [Vue Router 4](https://router.vuejs.org/)
- [JSON Server](https://github.com/typicode/json-server) — Mock REST API
- HTML5 + CSS3 — sem frameworks externos de UI
- GitHub Pages — hospedagem do front-end
- Render — hospedagem do banco-json

---

Desenvolvido por **Guilherme** — CEUB · Desenvolvimento Web · 2025
