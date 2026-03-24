import ProdutosPage from '../../support/pages/ProdutosPage'
import AdminPage from '../../support/pages/AdminPage'

describe('Cadastro de Produto no Frontend', () => {
  let usuario

  beforeEach(() => {
    // Pré-condição: criar usuário admin e fazer login
    cy.gerarUsuario(true).then((novoUsuario) => {
      usuario = novoUsuario
      cy.cadastrarUsuarioApi(usuario)
      cy.loginFrontend(usuario.email, usuario.password)
      cy.url().should('include', '/admin/home')
    })
  })

  it('deve cadastrar um novo produto com sucesso e exibir na lista', () => {
    // Ação: navegar até cadastro e preencher formulário
    ProdutosPage.clicarCadastrarProduto()
    cy.url().should('include', '/admin/cadastrarprodutos')

    const nomeProduto = `Produto Teste ${Date.now()}`
    const preco = 299
    const descricao = 'Descrição do produto de teste automatizado'
    const quantidade = 5

    ProdutosPage.preencherFormularioProduto(
      nomeProduto,
      preco,
      descricao,
      quantidade,
      'cypress/fixtures/assets/10982569.png'
    )
    cy.get('[data-testid="cadastarProdutos"]').click()

    // Validação: verificar que redirecionou para a lista de produtos
    cy.url().should('include', '/admin/listarprodutos')

    // Validação: verificar que o produto cadastrado aparece na tabela
    cy.contains('td', nomeProduto).should('be.visible')
    cy.contains('td', nomeProduto)
      .parent('tr')
      .within(() => {
        cy.contains('td', nomeProduto).should('exist')
        cy.contains('td', preco.toString()).should('exist')
        cy.contains('td', descricao).should('exist')
        cy.contains('td', quantidade.toString()).should('exist')
      })
  })

  it('deve exibir lista de produtos na página inicial', () => {
    // Validação: verificar que a tabela/lista de produtos está visível
    ProdutosPage.validarPaginaInicial()
    cy.get('[data-testid="logout"]').should('be.visible')
    cy.contains('Bem Vindo').should('be.visible')
  })

  it('deve impedir cadastro de produto com nome já existente', () => {
    const nomeProduto = `Produto Duplicado ${Date.now()}`

    // Pré-condição: cadastrar produto via API
    cy.loginApi(usuario.email, usuario.password).then((res) => {
      const token = res.body.authorization

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/produtos`,
        headers: { Authorization: token },
        body: {
          nome: nomeProduto,
          preco: 100,
          descricao: 'Produto para teste de duplicidade',
          quantidade: 1
        }
      })
    })

    // Ação: tentar cadastrar produto com o mesmo nome
    ProdutosPage.clicarCadastrarProduto()
    ProdutosPage.preencherFormularioProduto(nomeProduto, 200, 'Tentativa de duplicação', 3)
    cy.get('[data-testid="cadastarProdutos"]').click()

    // Validação: verificar mensagem de erro
    ProdutosPage.validarMensagem('Já existe produto com esse nome')
  })

  it('deve excluir um produto com sucesso', () => {
    const nomeProduto = `Produto Excluir ${Date.now()}`

    // Pré-condição: cadastrar produto via API
    cy.loginApi(usuario.email, usuario.password).then((res) => {
      const token = res.body.authorization

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/produtos`,
        headers: { Authorization: token },
        body: {
          nome: nomeProduto,
          preco: 50,
          descricao: 'Produto para teste de exclusão',
          quantidade: 1
        }
      })
    })

    // Ação: navegar para lista de produtos e excluir
    cy.visit('/admin/listarprodutos')
    cy.contains('td', nomeProduto).should('be.visible')
    AdminPage.excluirRegistroPorNome(nomeProduto)

    // Validação: verificar que o produto não aparece mais na lista
    cy.contains('td', nomeProduto).should('not.exist')
  })
})
