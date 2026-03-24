describe('Carrinho de Compras no Frontend', () => {
  let token
  const produtos = []

  beforeEach(() => {
    // Pré-condição: criar usuário admin, cadastrar produtos, depois logar como usuário normal
    cy.gerarUsuario(true).then((admin) => {
      cy.cadastrarUsuarioApi(admin)
      cy.loginApi(admin.email, admin.password).then((res) => {
        token = res.body.authorization

        // Cadastrar 2 produtos para os testes
        const produto1 = `Produto Alpha ${Date.now()}`
        const produto2 = `Produto Beta ${Date.now()}`

        cy.apiRequest(
          'POST',
          '/produtos',
          {
            nome: produto1,
            preco: 100,
            descricao: 'Produto para teste de carrinho',
            quantidade: 50
          },
          token
        )

        cy.apiRequest(
          'POST',
          '/produtos',
          {
            nome: produto2,
            preco: 200,
            descricao: 'Segundo produto para teste de carrinho',
            quantidade: 30
          },
          token
        )

        produtos[0] = produto1
        produtos[1] = produto2
      })
    })

    // Criar usuário normal (não admin) e fazer login
    cy.gerarUsuario(false).then((usuario) => {
      cy.cadastrarUsuarioApi(usuario)
      cy.loginFrontend(usuario.email, usuario.password)
      cy.url().should('include', '/home')
    })
  })

  it('deve pesquisar produto, adicionar à lista e ir ao carrinho', () => {
    // Ação: pesquisar pelo produto
    cy.get('[data-testid="pesquisar"]').type(produtos[0])
    cy.get('[data-testid="botaoPesquisar"]').click()

    // Ação: adicionar à lista de compras
    cy.get('[data-testid="adicionarNaLista"]').first().click()

    // Ação: adicionar ao carrinho
    cy.get('[data-testid="adicionar\\ carrinho"]').click()

    // Validação: deve redirecionar para /carrinho
    cy.url().should('include', '/carrinho')
  })

  it('deve aumentar e diminuir quantidade de item na lista', () => {
    // Ação: pesquisar e adicionar produto à lista
    cy.get('[data-testid="pesquisar"]').type(produtos[0])
    cy.get('[data-testid="botaoPesquisar"]').click()
    cy.get('[data-testid="adicionarNaLista"]').first().click()

    // Ação: aumentar quantidade
    cy.get('[data-testid="product-increase-quantity"]').first().click()
    cy.get('[data-testid="product-increase-quantity"]').first().click()

    // Validação: quantidade deve ser 3
    cy.get('[data-testid="shopping-cart-product-quantity"]')
      .first()
      .should('contain', 'Total: 3')

    // Ação: diminuir quantidade
    cy.get('[data-testid="product-decrease-quantity"]').first().click()

    // Validação: quantidade deve ser 2
    cy.get('[data-testid="shopping-cart-product-quantity"]')
      .first()
      .should('contain', 'Total: 2')
  })

  it('deve limpar a lista de compras e exibir mensagem de carrinho vazio', () => {
    // Ação: pesquisar e adicionar produto à lista
    cy.get('[data-testid="pesquisar"]').type(produtos[0])
    cy.get('[data-testid="botaoPesquisar"]').click()
    cy.get('[data-testid="adicionarNaLista"]').first().click()

    // Validação: verificar que o produto está na lista
    cy.contains(produtos[0]).should('be.visible')

    // Ação: limpar lista
    cy.get('[data-testid="limparLista"]').click()

    // Validação: a mensagem de carrinho vazio deve aparecer
    cy.contains('Seu carrinho está vazio').should('be.visible')
  })

  it('deve adicionar múltiplos itens, alterar quantidades e limpar a lista', () => {
    // Ação: pesquisar e adicionar o primeiro produto
    cy.get('[data-testid="pesquisar"]').type(produtos[0])
    cy.get('[data-testid="botaoPesquisar"]').click()
    cy.get('[data-testid="adicionarNaLista"]').first().click()

    // Ação: voltar à página inicial para buscar o segundo produto
    cy.get('[data-testid="paginaInicial"]').click()
    cy.url().should('include', '/home')

    // Ação: pesquisar e adicionar o segundo produto
    cy.get('[data-testid="pesquisar"]').type(produtos[1])
    cy.get('[data-testid="botaoPesquisar"]').click()
    cy.get('[data-testid="adicionarNaLista"]').first().click()

    // Validação: ambos os produtos devem estar na lista
    cy.contains(produtos[0]).should('be.visible')
    cy.contains(produtos[1]).should('be.visible')

    // Ação: aumentar quantidade do primeiro produto
    cy.contains(produtos[0])
      .parents('div')
      .find('[data-testid="product-increase-quantity"]')
      .first()
      .click()

    // Ação: limpar toda a lista
    cy.get('[data-testid="limparLista"]').click()

    // Validação: deve exibir mensagem de carrinho vazio
    cy.contains('Seu carrinho está vazio').should('be.visible')
  })

  it('deve retornar à página inicial a partir da lista de compras', () => {
    // Ação: pesquisar e adicionar produto à lista
    cy.get('[data-testid="pesquisar"]').type(produtos[0])
    cy.get('[data-testid="botaoPesquisar"]').click()
    cy.get('[data-testid="adicionarNaLista"]').first().click()

    // Ação: clicar no botão de página inicial
    cy.get('[data-testid="paginaInicial"]').click()

    // Validação: deve redirecionar para /home
    cy.url().should('include', '/home')
  })
})
