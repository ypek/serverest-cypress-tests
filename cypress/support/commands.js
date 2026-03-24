const { faker } = require('@faker-js/faker')

const API_URL = Cypress.env('apiUrl')

// Gera dados dinâmicos para usuário
Cypress.Commands.add('gerarUsuario', (admin = true) => {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
    administrador: admin ? 'true' : 'false'
  }
})

// Requisição genérica para a API com retry automático
Cypress.Commands.add(
  'apiRequest',
  (method, endpoint, body = null, token = null, failOnStatusCode = true) => {
    const options = {
      method,
      url: `${API_URL}${endpoint}`,
      failOnStatusCode,
      retryOnStatusCodeFailure: true
    }
    if (body) options.body = body
    if (token) options.headers = { Authorization: token }
    return cy.request(options)
  }
)

// Cadastra usuário via API e retorna os dados
Cypress.Commands.add('cadastrarUsuarioApi', (usuario) => {
  return cy.apiRequest('POST', '/usuarios', usuario)
})

// Realiza login via API e retorna o token
Cypress.Commands.add('loginApi', (email, password) => {
  return cy.apiRequest('POST', '/login', { email, password })
})

// Realiza login no frontend
Cypress.Commands.add('loginFrontend', (email, senha) => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(senha)
  cy.get('[data-testid="entrar"]').click()
})
