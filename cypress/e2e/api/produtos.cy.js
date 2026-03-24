describe('API - Produtos', () => {
  const apiUrl = Cypress.env('apiUrl')
  let token

  beforeEach(() => {
    // Pré-condição: criar usuário admin e obter token
    cy.gerarUsuario(true).then((usuario) => {
      cy.cadastrarUsuarioApi(usuario).then(() => {
        cy.loginApi(usuario.email, usuario.password).then((res) => {
          token = res.body.authorization
        })
      })
    })
  })

  it('deve cadastrar um novo produto com sucesso', () => {
    const produto = {
      nome: `Produto API ${Date.now()}`,
      preco: 150,
      descricao: 'Produto cadastrado via teste de API',
      quantidade: 20
    }

    // Ação: enviar requisição POST para cadastrar produto
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { Authorization: token },
      body: produto
    }).then((response) => {
      // Validação: verificar resposta de sucesso
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id')
      expect(response.body._id).to.be.a('string').and.not.be.empty
    })
  })

  it('deve buscar produto por ID após cadastro', () => {
    const produto = {
      nome: `Produto Busca ${Date.now()}`,
      preco: 75,
      descricao: 'Produto para teste de busca por ID',
      quantidade: 5
    }

    // Pré-condição: cadastrar produto
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { Authorization: token },
      body: produto
    }).then((resCadastro) => {
      const produtoId = resCadastro.body._id

      // Ação: buscar produto pelo ID
      cy.request({
        method: 'GET',
        url: `${apiUrl}/produtos/${produtoId}`
      }).then((response) => {
        // Validação: verificar dados do produto retornado
        expect(response.status).to.equal(200)
        expect(response.body.nome).to.equal(produto.nome)
        expect(response.body.preco).to.equal(produto.preco)
        expect(response.body.descricao).to.equal(produto.descricao)
        expect(response.body.quantidade).to.equal(produto.quantidade)
        expect(response.body._id).to.equal(produtoId)
      })
    })
  })

  it('deve excluir um produto com sucesso', () => {
    const produto = {
      nome: `Produto Excluir ${Date.now()}`,
      preco: 50,
      descricao: 'Produto para teste de exclusão',
      quantidade: 1
    }

    // Pré-condição: cadastrar produto
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { Authorization: token },
      body: produto
    }).then((resCadastro) => {
      const produtoId = resCadastro.body._id

      // Ação: excluir produto
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/produtos/${produtoId}`,
        headers: { Authorization: token }
      }).then((response) => {
        // Validação: verificar exclusão com sucesso
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })

      // Validação adicional: confirmar que o produto não existe mais
      cy.request({
        method: 'GET',
        url: `${apiUrl}/produtos/${produtoId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Produto não encontrado')
      })
    })
  })
})
