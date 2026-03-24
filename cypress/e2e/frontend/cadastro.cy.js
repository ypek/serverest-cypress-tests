import CadastroPage from '../../support/pages/CadastroPage'
import AdminPage from '../../support/pages/AdminPage'

describe('Cadastro de Usuário no Frontend', () => {
  describe('Cadastro pela tela de login (rota pública)', () => {
    it('deve cadastrar um novo usuário com sucesso pela tela de login', () => {
      cy.gerarUsuario(true).then((usuario) => {
        // Ação: preencher formulário de cadastro público
        CadastroPage.cadastrarUsuario(usuario.nome, usuario.email, usuario.password, true)

        // Validação: verificar redirecionamento para home após cadastro
        cy.url().should('include', '/admin/home')
        cy.get('[data-testid="home"]').should('be.visible')
        cy.contains('Bem Vindo').should('be.visible')
      })
    })

    it('deve exibir erro ao tentar cadastrar sem preencher campos obrigatórios', () => {
      CadastroPage.visitar()

      // Ação: clicar em cadastrar sem preencher nenhum campo
      CadastroPage.clicarCadastrar()

      // Validação: verificar mensagens de campos obrigatórios
      cy.contains('Nome é obrigatório').should('be.visible')
      cy.contains('Email é obrigatório').should('be.visible')
      cy.contains('Password é obrigatório').should('be.visible')
    })

    it('deve impedir cadastro com e-mail já utilizado', () => {
      cy.gerarUsuario().then((usuario) => {
        cy.cadastrarUsuarioApi(usuario).then(() => {
          // Ação: tentar cadastrar com o mesmo e-mail
          CadastroPage.cadastrarUsuario(usuario.nome, usuario.email, usuario.password, true)

          // Validação: verificar mensagem de e-mail duplicado
          CadastroPage.validarMensagem('Este email já está sendo usado')
        })
      })
    })
  })

  describe('Cadastro pelo painel administrativo', () => {
    beforeEach(() => {
      // Pré-condição: criar usuário admin e fazer login
      cy.gerarUsuario(true).then((usuario) => {
        cy.cadastrarUsuarioApi(usuario)
        cy.loginFrontend(usuario.email, usuario.password)
        cy.url().should('include', '/admin/home')
      })
    })

    it('deve cadastrar um novo usuário administrador pelo painel admin', () => {
      // Ação: navegar até cadastro de usuários
      AdminPage.navegarCadastroUsuarios()
      cy.url().should('include', '/admin/cadastrarusuarios')

      cy.gerarUsuario(true).then((novoUsuario) => {
        AdminPage.preencherFormularioUsuario(
          novoUsuario.nome,
          novoUsuario.email,
          novoUsuario.password
        )
        AdminPage.marcarAdmin()
        AdminPage.submeterCadastroUsuario()

        // Validação: verificar que o usuário aparece na lista
        cy.url().should('include', '/admin/listarusuarios')
        cy.contains('td', novoUsuario.nome).should('be.visible')
      })
    })

    it('deve cadastrar um novo usuário não administrador pelo painel admin', () => {
      // Ação: navegar até cadastro de usuários sem marcar admin
      AdminPage.navegarCadastroUsuarios()
      cy.url().should('include', '/admin/cadastrarusuarios')

      cy.gerarUsuario(false).then((novoUsuario) => {
        AdminPage.preencherFormularioUsuario(
          novoUsuario.nome,
          novoUsuario.email,
          novoUsuario.password
        )
        AdminPage.submeterCadastroUsuario()

        // Validação: verificar que o usuário aparece na lista
        cy.url().should('include', '/admin/listarusuarios')
        cy.contains('td', novoUsuario.nome).should('be.visible')
      })
    })

    it('deve excluir um usuário com sucesso pelo painel admin', () => {
      // Pré-condição: criar usuário para excluir via API
      cy.gerarUsuario(false).then((novoUsuario) => {
        cy.cadastrarUsuarioApi(novoUsuario)

        // Ação: navegar para lista de usuários
        AdminPage.navegarListaUsuarios()
        cy.url().should('include', '/admin/listarusuarios')

        // Encontrar o usuário e clicar em excluir
        cy.contains('td', novoUsuario.nome).should('be.visible')
        AdminPage.excluirRegistroPorNome(novoUsuario.nome)

        // Validação: verificar que o usuário não aparece mais na lista
        cy.contains('td', novoUsuario.nome).should('not.exist')
      })
    })
  })
})
