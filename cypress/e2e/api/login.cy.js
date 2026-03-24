describe('API - Login', () => {
  const apiUrl = Cypress.env('apiUrl')

  it('deve realizar login com sucesso e retornar token de autenticação', () => {
    // Pré-condição: criar usuário
    cy.gerarUsuario().then((usuario) => {
      cy.cadastrarUsuarioApi(usuario).then(() => {
        // Ação: enviar requisição de login
        cy.request({
          method: 'POST',
          url: `${apiUrl}/login`,
          body: {
            email: usuario.email,
            password: usuario.password
          }
        }).then((response) => {
          // Validação: verificar token na resposta
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal('Login realizado com sucesso')
          expect(response.body).to.have.property('authorization')
          expect(response.body.authorization).to.include('Bearer')
        })
      })
    })
  })

  it('deve retornar erro ao tentar login com senha incorreta', () => {
    cy.gerarUsuario().then((usuario) => {
      cy.cadastrarUsuarioApi(usuario).then(() => {
        // Ação: tentar login com senha errada
        cy.request({
          method: 'POST',
          url: `${apiUrl}/login`,
          body: {
            email: usuario.email,
            password: 'senhaIncorreta123'
          },
          failOnStatusCode: false
        }).then((response) => {
          // Validação: verificar erro de autenticação
          expect(response.status).to.equal(401)
          expect(response.body.message).to.equal('Email e/ou senha inválidos')
        })
      })
    })
  })

  it('deve retornar erro ao tentar login com e-mail não cadastrado', () => {
    // Ação: tentar login com e-mail inexistente
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: 'email_nao_existe@teste.com',
        password: 'qualquerSenha'
      },
      failOnStatusCode: false
    }).then((response) => {
      // Validação: verificar erro de autenticação
      expect(response.status).to.equal(401)
      expect(response.body.message).to.equal('Email e/ou senha inválidos')
    })
  })
})
