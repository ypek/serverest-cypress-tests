describe('API - Usuários', () => {
  const apiUrl = Cypress.env('apiUrl')

  it('deve cadastrar um novo usuário com sucesso', () => {
    // Pré-condição: gerar dados dinâmicos
    cy.gerarUsuario().then((usuario) => {
      // Ação: enviar requisição POST para cadastrar usuário
      cy.request({
        method: 'POST',
        url: `${apiUrl}/usuarios`,
        body: usuario
      }).then((response) => {
        // Validação: verificar resposta da API
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        expect(response.body).to.have.property('_id')
        expect(response.body._id).to.be.a('string').and.not.be.empty
      })
    })
  })

  it('deve impedir cadastro de usuário com e-mail já existente', () => {
    cy.gerarUsuario().then((usuario) => {
      // Pré-condição: cadastrar usuário
      cy.cadastrarUsuarioApi(usuario).then(() => {
        // Ação: tentar cadastrar novamente com o mesmo e-mail
        cy.request({
          method: 'POST',
          url: `${apiUrl}/usuarios`,
          body: usuario,
          failOnStatusCode: false
        }).then((response) => {
          // Validação: verificar erro de e-mail duplicado
          expect(response.status).to.equal(400)
          expect(response.body.message).to.equal('Este email já está sendo usado')
        })
      })
    })
  })

  it('deve listar usuários cadastrados', () => {
    // Ação: enviar requisição GET para listar usuários
    cy.request({
      method: 'GET',
      url: `${apiUrl}/usuarios`
    }).then((response) => {
      // Validação: verificar estrutura da resposta
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('quantidade')
      expect(response.body.quantidade).to.be.a('number').and.to.be.greaterThan(0)
      expect(response.body).to.have.property('usuarios')
      expect(response.body.usuarios).to.be.an('array').and.not.be.empty

      // Validar estrutura do primeiro usuário
      const primeiroUsuario = response.body.usuarios[0]
      expect(primeiroUsuario).to.have.all.keys('nome', 'email', 'password', 'administrador', '_id')
    })
  })

  it('deve editar um usuário com sucesso', () => {
    cy.gerarUsuario().then((usuario) => {
      // Pré-condição: criar usuário
      cy.cadastrarUsuarioApi(usuario).then((resCadastro) => {
        const userId = resCadastro.body._id

        // Ação: editar nome do usuário
        const dadosAtualizados = {
          ...usuario,
          nome: 'Nome Atualizado Teste'
        }

        cy.request({
          method: 'PUT',
          url: `${apiUrl}/usuarios/${userId}`,
          body: dadosAtualizados
        }).then((response) => {
          // Validação: verificar atualização
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal('Registro alterado com sucesso')
        })

        // Validação adicional: buscar usuário e confirmar alteração
        cy.request({
          method: 'GET',
          url: `${apiUrl}/usuarios/${userId}`
        }).then((response) => {
          expect(response.body.nome).to.equal('Nome Atualizado Teste')
        })
      })
    })
  })

  it('deve excluir um usuário com sucesso', () => {
    cy.gerarUsuario().then((usuario) => {
      // Pré-condição: criar usuário
      cy.cadastrarUsuarioApi(usuario).then((resCadastro) => {
        const userId = resCadastro.body._id

        // Ação: excluir usuário
        cy.request({
          method: 'DELETE',
          url: `${apiUrl}/usuarios/${userId}`
        }).then((response) => {
          // Validação: verificar exclusão
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal('Registro excluído com sucesso')
        })

        // Validação adicional: confirmar que não existe mais
        cy.request({
          method: 'GET',
          url: `${apiUrl}/usuarios/${userId}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(400)
          expect(response.body.message).to.equal('Usuário não encontrado')
        })
      })
    })
  })
})
