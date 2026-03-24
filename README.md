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
│   │   │   ├── login.cy.js        # Cenários de login
│   │   │   ├── cadastro.cy.js     # Cenários de cadastro de usuário
│   │   │   └── produtos.cy.js     # Cenários de cadastro de produto
│   │   └── api/                   # Testes da API
│   │       ├── usuarios.cy.js     # CRUD de usuários
│   │       ├── login.cy.js        # Autenticação
│   │       └── produtos.cy.js     # CRUD de produtos
│   ├── fixtures/
│   │   └── dados.json             # Dados estáticos para testes
│   ├── reports/                   # Relatórios gerados (gitignored)
│   └── support/
│       ├── commands.js            # Comandos customizados do Cypress
│       ├── e2e.js                 # Configuração de suporte
│       └── pages/                 # Page Objects
│           ├── LoginPage.js
│           ├── CadastroPage.js
│           └── ProdutosPage.js
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

### Frontend (E2E)

| Arquivo | Cenário | Descrição |
|---------|---------|-----------|
| login.cy.js | Login com sucesso | Valida login com credenciais válidas e redirecionamento |
| login.cy.js | Login com credenciais inválidas | Valida mensagem de erro ao usar dados incorretos |
| login.cy.js | Navegação para cadastro | Valida redirecionamento ao clicar no link de cadastro |
| cadastro.cy.js | Cadastro com sucesso | Valida cadastro de novo usuário administrador |
| cadastro.cy.js | E-mail duplicado | Valida mensagem de erro ao usar e-mail já cadastrado |
| cadastro.cy.js | Campos obrigatórios | Valida validação de campos obrigatórios |
| produtos.cy.js | Cadastrar produto | Valida cadastro de novo produto com sucesso |
| produtos.cy.js | Lista de produtos | Valida exibição da página inicial com lista de produtos |
| produtos.cy.js | Produto duplicado | Valida mensagem de erro ao cadastrar produto com nome existente |

### API

| Arquivo | Cenário | Descrição |
|---------|---------|-----------|
| usuarios.cy.js | Cadastrar usuário | Valida criação de usuário e retorno do ID |
| usuarios.cy.js | E-mail duplicado | Valida erro 400 ao tentar cadastrar e-mail existente |
| usuarios.cy.js | Listar usuários | Valida estrutura da resposta com lista de usuários |
| login.cy.js | Login com sucesso | Valida retorno do token Bearer |
| login.cy.js | Senha incorreta | Valida erro 401 com senha errada |
| login.cy.js | E-mail inexistente | Valida erro 401 com e-mail não cadastrado |
| produtos.cy.js | Cadastrar produto | Valida criação de produto autenticado |
| produtos.cy.js | Buscar por ID | Valida retorno correto dos dados do produto |
| produtos.cy.js | Excluir produto | Valida exclusão e confirmação de remoção |

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
