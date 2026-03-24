class CadastroPage {
  get inputNome() {
    return '[data-testid="nome"]'
  }

  get inputEmail() {
    return '[data-testid="email"]'
  }

  get inputSenha() {
    return '[data-testid="password"]'
  }

  get checkboxAdmin() {
    return '[data-testid="checkbox"]'
  }

  get btnCadastrar() {
    return '[data-testid="cadastrar"]'
  }

  get alertMessage() {
    return '.alert'
  }

  visitar() {
    cy.visit('/cadastrarusuarios')
  }

  preencherNome(nome) {
    cy.get(this.inputNome).clear()
    cy.get(this.inputNome).type(nome)
  }

  preencherEmail(email) {
    cy.get(this.inputEmail).clear()
    cy.get(this.inputEmail).type(email)
  }

  preencherSenha(senha) {
    cy.get(this.inputSenha).clear()
    cy.get(this.inputSenha).type(senha)
  }

  marcarAdmin() {
    cy.get(this.checkboxAdmin).check()
  }

  clicarCadastrar() {
    cy.get(this.btnCadastrar).click()
  }

  cadastrarUsuario(nome, email, senha, admin = true) {
    this.visitar()
    this.preencherNome(nome)
    this.preencherEmail(email)
    this.preencherSenha(senha)
    if (admin) {
      this.marcarAdmin()
    }
    this.clicarCadastrar()
  }

  validarMensagem(mensagem) {
    cy.get(this.alertMessage).should('contain.text', mensagem)
  }
}

export default new CadastroPage()
