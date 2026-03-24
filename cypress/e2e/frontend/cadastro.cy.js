import CadastroPage from '../../support/pages/CadastroPage'

describe('Cadastro de Usuário no Frontend', () => {
  it('deve cadastrar um novo usuário administrador com sucesso', () => {
    // Pré-condição: gerar dados de usuário
    cy.gerarUsuario(true).then((usuario) => {
      // Ação: preencher formulário e cadastrar
      CadastroPage.cadastrarUsuario(usuario.nome, usuario.email, usuario.password, true)

      // Validação: verificar redirecionamento para home após cadastro
      cy.url().should('include', '/admin/home')
      cy.get('[data-testid="home"]').should('be.visible')
    })
  })

  it('deve impedir cadastro com e-mail já utilizado', () => {
    // Pré-condição: criar usuário via API
    cy.gerarUsuario().then((usuario) => {
      cy.cadastrarUsuarioApi(usuario).then(() => {
        // Ação: tentar cadastrar com o mesmo e-mail
        CadastroPage.cadastrarUsuario(usuario.nome, usuario.email, usuario.password, true)

        // Validação: verificar mensagem de e-mail duplicado
        CadastroPage.validarMensagem('Este email já está sendo usado')
      })
    })
  })

  it('deve exibir erro ao tentar cadastrar sem preencher campos obrigatórios', () => {
    CadastroPage.visitar()

    // Ação: clicar em cadastrar sem preencher nenhum campo
    CadastroPage.clicarCadastrar()

    // Validação: verificar mensagens de campos obrigatórios
    cy.get(CadastroPage.inputNome).invoke('prop', 'validationMessage').should('not.be.empty')
  })
})
