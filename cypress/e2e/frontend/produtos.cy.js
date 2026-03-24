import ProdutosPage from '../../support/pages/ProdutosPage'

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

  it('deve cadastrar um novo produto com sucesso', () => {
    // Ação: navegar até cadastro e preencher formulário
    ProdutosPage.clicarCadastrarProduto()
    cy.url().should('include', '/admin/cadastrarprodutos')

    const nomeProduto = `Produto Teste ${Date.now()}`
    ProdutosPage.preencherFormularioProduto(
      nomeProduto,
      299,
      'Descrição do produto de teste automatizado',
      5
    )
    cy.get('[data-testid="cadastarProdutos"]').click()

    // Validação: verificar mensagem de sucesso
    ProdutosPage.validarMensagem('Cadastro realizado com sucesso')
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
})
