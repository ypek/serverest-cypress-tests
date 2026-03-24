# ServeRest - Testes Automatizados com Cypress

Projeto de testes automatizados utilizando **Cypress** e **JavaScript** para a aplicação [ServeRest](https://serverest.dev/), cobrindo cenários de **frontend (E2E)** e **API**.

![CI](https://github.com/ypek/serverest-cypress-tests/actions/workflows/cypress.yml/badge.svg)

## Aplicação Testada

- **Frontend:** https://front.serverest.dev/
- **API (Swagger):** https://serverest.dev/

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [npm](https://www.npmjs.com/) (incluso com o Node.js)

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/ypek/serverest-cypress-tests.git

# Acessar o diretório do projeto
cd serverest-cypress-tests

# Instalar as dependências
npm install
```

## Executando os Testes

### Modo interativo (Cypress UI)

```bash
npm run cy:open
```

### Modo headless (linha de comando)

```bash
# Executar todos os testes
npm run cy:run

# Executar apenas testes de frontend
npm run cy:run:frontend

# Executar apenas testes de API
npm run cy:run:api
```

### Relatórios HTML (Mochawesome)

```bash
# Executar testes e gerar relatório HTML
npm run test:report

# Apenas gerar relatório a partir dos JSONs existentes
npm run report
```

O relatório será gerado em `cypress/reports/mochawesome-report/report.html`.

### Linting e Formatação

```bash
# Verificar padrões de código
npm run lint

# Corrigir automaticamente
npm run lint:fix

# Formatar código com Prettier
npm run format

# Verificar formatação
npm run format:check
```

## Estrutura do Projeto

```
serverest-cypress-tests/
├── .github/
│   └── workflows/
│       └── cypress.yml             # Pipeline CI/CD (GitHub Actions)
├── cypress/
│   ├── e2e/
│   │   ├── frontend/              # Testes E2E do frontend
│   │   │   ├── login.cy.js        # Login, logout e navegação
│   │   │   ├── cadastro.cy.js     # Cadastro público e pelo painel admin
│   │   │   └── produtos.cy.js     # CRUD de produtos no frontend
│   │   └── api/                   # Testes da API
│   │       ├── usuarios.cy.js     # CRUD de usuários
│   │       ├── login.cy.js        # Autenticação
│   │       ├── produtos.cy.js     # CRUD de produtos
│   │       └── carrinhos.cy.js    # Gestão de carrinhos
│   ├── fixtures/
│   │   ├── dados.json             # Dados estáticos para testes
│   │   └── assets/                # Imagens para upload
│   ├── reports/                   # Relatórios gerados (gitignored)
│   └── support/
│       ├── commands.js            # Comandos customizados do Cypress
│       ├── e2e.js                 # Configuração de suporte
│       └── pages/                 # Page Objects
│           ├── LoginPage.js       # Tela de login pública
│           ├── CadastroPage.js    # Tela de cadastro pública
│           ├── AdminPage.js       # Painel administrativo
│           └── ProdutosPage.js    # Gestão de produtos
├── .editorconfig                  # Padronização de editor
├── .eslintrc.json                 # Configuração ESLint
├── .prettierrc                    # Configuração Prettier
├── cypress.config.js              # Configuração do Cypress
├── package.json
├── .gitignore
└── README.md
```

## CI/CD

O projeto possui pipeline configurado com **GitHub Actions** que executa automaticamente em push/PR na branch `main`:

1. **Lint** — Valida padrões de código com ESLint
2. **Testes de API** — Executa os testes de API em paralelo
3. **Testes Frontend** — Executa os testes E2E em paralelo

Os relatórios e screenshots (em caso de falha) são salvos como artefatos no GitHub Actions.

## Cenários de Teste

### Frontend (E2E) — 14 testes

| Arquivo | Cenário | Descrição |
|---------|---------|-----------|
| login.cy.js | Login com sucesso | Valida login, redirecionamento e elementos da home (Bem Vindo, logout, nome) |
| login.cy.js | Login com credenciais inválidas | Valida mensagem de erro ao usar dados incorretos |
| login.cy.js | Navegação para cadastro | Valida redirecionamento ao clicar no link de cadastro |
| login.cy.js | Logout | Valida logout e retorno à tela de login |
| cadastro.cy.js | Cadastro pela tela de login — sucesso | Valida cadastro público de novo usuário |
| cadastro.cy.js | Cadastro pela tela de login — campos obrigatórios | Valida mensagens de erro para campos obrigatórios |
| cadastro.cy.js | Cadastro pela tela de login — e-mail duplicado | Valida mensagem de erro ao usar e-mail já existente |
| cadastro.cy.js | Painel admin — cadastrar admin | Valida cadastro de usuário administrador pelo painel |
| cadastro.cy.js | Painel admin — cadastrar não-admin | Valida cadastro de usuário não-administrador pelo painel |
| cadastro.cy.js | Painel admin — excluir usuário | Valida exclusão de usuário cadastrado pelo painel |
| produtos.cy.js | Cadastrar produto | Valida cadastro de produto com upload de imagem |
| produtos.cy.js | Lista de produtos | Valida exibição da lista de produtos na home |
| produtos.cy.js | Produto duplicado | Valida mensagem de erro ao cadastrar produto com nome existente |
| produtos.cy.js | Excluir produto | Valida exclusão de produto e confirmação de remoção |

### API — 14 testes

| Arquivo | Cenário | Descrição |
|---------|---------|-----------|
| usuarios.cy.js | Cadastrar usuário | Valida criação de usuário e retorno do ID |
| usuarios.cy.js | E-mail duplicado | Valida erro 400 ao tentar cadastrar e-mail existente |
| usuarios.cy.js | Listar usuários | Valida estrutura da resposta com lista de usuários |
| usuarios.cy.js | Editar usuário (PUT) | Valida edição de dados de usuário existente |
| usuarios.cy.js | Excluir usuário (DELETE) | Valida exclusão de usuário e confirmação de remoção |
| login.cy.js | Login com sucesso | Valida retorno do token Bearer |
| login.cy.js | Senha incorreta | Valida erro 401 com senha errada |
| login.cy.js | E-mail inexistente | Valida erro 401 com e-mail não cadastrado |
| produtos.cy.js | Cadastrar produto | Valida criação de produto autenticado |
| produtos.cy.js | Buscar por ID | Valida retorno correto dos dados do produto |
| produtos.cy.js | Excluir produto | Valida exclusão e confirmação de remoção |
| carrinhos.cy.js | Criar carrinho | Valida criação de carrinho com produto e retorno do ID |
| carrinhos.cy.js | Impedir carrinho duplicado | Valida regra de um carrinho por usuário |
| carrinhos.cy.js | Concluir compra | Valida conclusão de compra e decremento do estoque |

## Padrões e Boas Práticas Utilizados

- **Page Object Pattern:** Encapsulamento de seletores e ações do frontend em classes reutilizáveis
- **Custom Commands:** Comandos reutilizáveis para operações comuns (login, cadastro via API)
- **Dados dinâmicos:** Utilização do Faker.js para gerar dados únicos a cada execução
- **Fixtures:** Dados estáticos centralizados em arquivos JSON
- **Testes independentes:** Cada teste cria seus próprios dados, sem dependência entre eles
- **Validações específicas:** Assertivas claras verificando status code, mensagens e estrutura de dados
- **Linting (ESLint):** Padrões de código consistentes com regras específicas para Cypress
- **Formatação (Prettier):** Código formatado automaticamente
- **CI/CD (GitHub Actions):** Pipeline automatizado com lint + testes + relatórios
- **Reports HTML (Mochawesome):** Relatórios visuais de execução dos testes

## Tecnologias

| Ferramenta | Finalidade |
|------------|-----------|
| [Cypress](https://www.cypress.io/) v13+ | Framework de testes |
| [Faker.js](https://fakerjs.dev/) | Geração de dados dinâmicos |
| [Mochawesome](https://github.com/adamgruber/mochawesome) | Relatórios HTML |
| [ESLint](https://eslint.org/) | Linting de código |
| [Prettier](https://prettier.io/) | Formatação de código |
| [GitHub Actions](https://github.com/features/actions) | CI/CD |
| JavaScript (ES6+) | Linguagem |
