describe('API - Carrinhos', () => {
  const apiUrl = Cypress.env('apiUrl')
  let token
  let produtoId

  beforeEach(() => {
    // Pré-condição: criar usuário admin, obter token e cadastrar produto
    cy.gerarUsuario(true).then((usuario) => {
      cy.cadastrarUsuarioApi(usuario).then(() => {
        cy.loginApi(usuario.email, usuario.password).then((res) => {
          token = res.body.authorization

          cy.request({
            method: 'POST',
            url: `${apiUrl}/produtos`,
            headers: { Authorization: token },
            body: {
              nome: `Produto Carrinho ${Date.now()}`,
              preco: 100,
              descricao: 'Produto para teste de carrinho',
              quantidade: 10
            }
          }).then((resProduto) => {
            produtoId = resProduto.body._id
          })
        })
      })
    })
  })

  afterEach(() => {
    // Limpar carrinho após cada teste
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/carrinhos/cancelar-compra`,
      headers: { Authorization: token },
      failOnStatusCode: false
    })
  })

  it('deve criar um carrinho com sucesso', () => {
    // Ação: criar carrinho com produto
    cy.request({
      method: 'POST',
      url: `${apiUrl}/carrinhos`,
      headers: { Authorization: token },
      body: {
        produtos: [{ idProduto: produtoId, quantidade: 2 }]
      }
    }).then((response) => {
      // Validação: verificar criação do carrinho
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id')
      expect(response.body._id).to.be.a('string').and.not.be.empty
    })
  })

  it('deve impedir criação de mais de um carrinho por usuário', () => {
    // Pré-condição: criar primeiro carrinho
    cy.request({
      method: 'POST',
      url: `${apiUrl}/carrinhos`,
      headers: { Authorization: token },
      body: {
        produtos: [{ idProduto: produtoId, quantidade: 1 }]
      }
    })

    // Ação: tentar criar segundo carrinho
    cy.request({
      method: 'POST',
      url: `${apiUrl}/carrinhos`,
      headers: { Authorization: token },
      body: {
        produtos: [{ idProduto: produtoId, quantidade: 1 }]
      },
      failOnStatusCode: false
    }).then((response) => {
      // Validação: verificar erro de carrinho duplicado
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Não é permitido ter mais de 1 carrinho')
    })
  })

  it('deve concluir compra e excluir carrinho com sucesso', () => {
    // Pré-condição: criar carrinho
    cy.request({
      method: 'POST',
      url: `${apiUrl}/carrinhos`,
      headers: { Authorization: token },
      body: {
        produtos: [{ idProduto: produtoId, quantidade: 2 }]
      }
    })

    // Ação: concluir compra (deleta carrinho e desconta estoque)
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/carrinhos/concluir-compra`,
      headers: { Authorization: token }
    }).then((response) => {
      // Validação: verificar conclusão da compra
      expect(response.status).to.equal(200)
      expect(response.body.message).to.equal('Registro excluído com sucesso')
    })

    // Validação adicional: verificar que o estoque do produto diminuiu
    cy.request({
      method: 'GET',
      url: `${apiUrl}/produtos/${produtoId}`
    }).then((response) => {
      expect(response.body.quantidade).to.equal(8)
    })
  })
})
