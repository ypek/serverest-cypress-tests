import LoginPage from '../../support/pages/LoginPage'

describe('Login no Frontend', () => {
  beforeEach(() => {
    LoginPage.visitar()
  })

  it('deve realizar login com sucesso e visualizar a página home', () => {
    // Pré-condição: criar usuário via API
    cy.gerarUsuario().then((usuario) => {
      cy.cadastrarUsuarioApi(usuario).then(() => {
        // Ação: realizar login no frontend
        LoginPage.preencherEmail(usuario.email)
        LoginPage.preencherSenha(usuario.password)
        LoginPage.clicarEntrar()

        // Validação: verificar redirecionamento para página home
        cy.url().should('include', '/admin/home')

        // Validação: verificar elementos da home
        cy.get('[data-testid="home"]').should('be.visible')
        cy.contains('Bem Vindo').should('be.visible')
        cy.get('[data-testid="logout"]').should('be.visible')
        cy.contains(usuario.nome).should('be.visible')
      })
    })
  })

  it('deve exibir mensagem de erro ao tentar login com credenciais inválidas', () => {
    cy.fixture('dados').then((dados) => {
      // Ação: tentar login com credenciais inválidas
      LoginPage.preencherEmail(dados.loginInvalido.email)
      LoginPage.preencherSenha(dados.loginInvalido.senha)
      LoginPage.clicarEntrar()

      // Validação: verificar mensagem de erro
      LoginPage.validarMensagemDeErro('Email e/ou senha inválidos')
      cy.url().should('include', '/login')
    })
  })

  it('deve navegar para a página de cadastro ao clicar no link', () => {
    // Ação: clicar no link de cadastro
    LoginPage.clicarCadastrar()

    // Validação: verificar redirecionamento para página de cadastro
    cy.url().should('include', '/cadastrarusuarios')
    cy.get('[data-testid="nome"]').should('be.visible')
  })
})
