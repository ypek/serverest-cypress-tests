const { faker } = require('@faker-js/faker')

// Gera dados dinâmicos para usuário
Cypress.Commands.add('gerarUsuario', (admin = true) => {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
    administrador: admin ? 'true' : 'false'
  }
})

// Cadastra usuário via API e retorna os dados
Cypress.Commands.add('cadastrarUsuarioApi', (usuario) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/usuarios`,
    body: usuario
  })
})

// Realiza login via API e retorna o token
Cypress.Commands.add('loginApi', (email, password) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    body: { email, password }
  })
})

// Realiza login no frontend
Cypress.Commands.add('loginFrontend', (email, senha) => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(senha)
  cy.get('[data-testid="entrar"]').click()
})
