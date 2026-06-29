# ☕ Café Dois Dedin

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

**Seleção de tamanho com `v-model` e estilo reativo no `PedidoComponent.vue`:**
```html
<select v-model="tamanhoSelecionado">
  <option value="">Selecione o tamanho</option>
  <option v-for="tamanho in listaTamanhos" :key="tamanho.id" :value="tamanho">
    {{ tamanho.descricao }}
  </option>
</select>
```

**Toggle de acompanhamentos e bebidas (multi-seleção via checkbox):**
```html
<input
  type="checkbox"
  :value="acomp"
  v-model="listaAcompanhamentosSelecionados"
/>
```

---

## 🚨 Solução Técnica dos Alertas Semânticos

O sistema de alertas é implementado no componente `AlertaComponent.vue` e utilizado em várias telas via composição de props e eventos.

### Paleta semântica

| Tipo      | Cor      | Uso                                                          |
|-----------|----------|---------------------------------------------------------------|
| `erro`    | Vermelho | Campos obrigatórios vazios, falha na API                     |
| `alerta`  | Laranja  | Avisos (pedido sem opcionais, confirmação de exclusão)        |
| `info`    | Azul     | Informações contextuais (café selecionado, status do pedido) |
| `sucesso` | Verde    | Pedido criado, status atualizado, exclusão confirmada         |

### Como funciona

O componente `AlertaComponent.vue` recebe `tipo`, `mensagem` e `duracao` via props. Ele exibe ou oculta automaticamente usando `v-if` + `<transition>`, possui ícones SVG próprios para cada tipo, barra de progresso indicando o tempo até o fechamento automático, e dispara um `$emit('fechar')` ao fim do timer ou ao clicar no botão de fechar.

```vue
<!-- Uso nos componentes -->
<AlertaComponent
  v-if="alerta.mensagem"
  :tipo="alerta.tipo"
  :mensagem="alerta.mensagem"
  :duracao="alerta.duracao"
  @fechar="limparAlerta"
/>
```

```js
// Método centralizado de exibição
exibirAlerta(tipo, mensagem, duracao = 4000) {
  this.alerta = { tipo, mensagem, duracao }
},
limparAlerta() {
  this.alerta = { tipo: 'info', mensagem: '', duracao: 4000 }
}
```

O auto-dismiss é gerenciado com `setTimeout` dentro do próprio `AlertaComponent.vue`, usando `watch` na prop `mensagem` para re-triggar o timer sempre que uma nova mensagem chega. Isso evita que alertas anteriores bloqueiem novos.

```js
// AlertaComponent.vue
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

### Exemplos reais de uso por tipo

- **Info (azul):** ao selecionar um café no cardápio, a tela de configuração exibe *"Você selecionou [café]. Agora escolha o tamanho e os opcionais do seu pedido."* Também aparece quando o status de um pedido muda para "Em preparo", "Pronto para retirada" ou "Entregue".
- **Alerta (laranja):** ao confirmar um pedido sem nenhum acompanhamento ou bebida selecionada, ou antes de excluir um pedido (modal de confirmação).
- **Erro (vermelho):** campos obrigatórios vazios (nome, tamanho) ou falha de comunicação com a API.
- **Sucesso (verde):** pedido criado, status atualizado, exclusão confirmada.

### Validação de formulário

O método `validar()` em `PedidoComponent.vue` bloqueia o envio se nome ou tamanho estiverem ausentes, exibindo mensagens de erro inline em cada campo e um alerta global vermelho:

```js
validar() {
  let valido = true
  this.erros = { nome: '', tamanho: '' }

  if (!this.nomeCliente.trim()) { this.erros.nome = 'Informe o seu nome.'; valido = false }
  if (!this.tamanhoSelecionado) { this.erros.tamanho = 'Selecione o tamanho.'; valido = false }

  if (!valido) this.exibirAlerta('erro', 'Preencha os campos obrigatórios antes de confirmar.')
  return valido
}
```

---

## 🧭 Diretrizes UX implementadas

- **Redirecionamento automático:** após confirmação do pedido, um alerta verde é exibido e a navegação para `/pedidos` ocorre automaticamente após 2,6 segundos via `setTimeout + this.$router.push`.
- **Listagem atualizada em tempo real:** `ListaPedidoComponent` carrega os dados na hook `mounted()`, garantindo que o pedido recém-criado já apareça na listagem.
- **Remoção reativa:** ao excluir um pedido, o array `listaPedidosRealizados` é filtrado diretamente (`this.listaPedidosRealizados = this.listaPedidosRealizados.filter(...)`) sem necessidade de reload — Vue re-renderiza a lista instantaneamente.
- **Modal de confirmação:** exclusões são protegidas por um modal que exige confirmação explícita do usuário, acionado por um alerta de aviso (laranja).

---

## 🔗 Links do Projeto

| Recurso | URL |
|---------|-----|
| 🌐 **Deploy (Vercel)** | https://cafe-dois-dedin.vercel.app/ |
| 🌐 **Deploy (Netlify)** | https://jade-ganache-2897a5.netlify.app/ |
| 🌐 **Deploy (GitHub Pages)** | https://guiandrade17.github.io/cafe-dois-dedin/ |
| 🗄️ **API (JSON Server / Render)** | https://cafe-dois-dedin-api.onrender.com |
| 📁 **Repositório Front-end** | https://github.com/guiandrade17/cafe-dois-dedin |
| 🗃️ **Repositório banco-json** | https://github.com/guiandrade17/cafe-dois-dedin |

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
│   └── db.json                       # Mock da API (JSON Server)
├── public/
│   └── img/                          # Banner, logo e imagens locais
├── src/
│   ├── components/
│   │   ├── AlertaComponent.vue       # Alertas semânticos reativos
│   │   ├── BannerComponent.vue       # Banner da Home
│   │   ├── NavBarComponent.vue       # Barra de navegação com logo
│   │   ├── PedidoComponent.vue       # Formulário de configuração do pedido
│   │   └── ListaPedidoComponent.vue  # Listagem e gerenciamento de pedidos
│   ├── router/
│   │   └── index.js                  # Vue Router 4
│   ├── views/
│   │   ├── HomeView.vue              # Tela inicial
│   │   ├── MenuView.vue              # Cardápio
│   │   ├── ConfiguracaoPedidoView.vue# Tela de configuração do pedido
│   │   └── PedidoView.vue            # Listagem de pedidos
│   ├── App.vue                       # Layout raiz + estilos globais
│   └── main.js                       # Entry point ($apiUrl global)
├── .env.development                  # URL da API local
├── .env.production                   # URL da API pública
├── vue.config.js                     # publicPath para GitHub Pages
└── package.json
```

---

## 🛠️ Tecnologias Utilizadas

- [Vue 3](https://vuejs.org/) — Options API
- [Vue Router 4](https://router.vuejs.org/)
- [JSON Server](https://github.com/typicode/json-server) — Mock REST API
- HTML5 + CSS3 — sem frameworks externos de UI
- Vercel / Netlify / GitHub Pages — hospedagem do front-end
- Render — hospedagem do banco-json

---

Desenvolvido por **Guilherme** — CEUB · Desenvolvimento Web · 2025