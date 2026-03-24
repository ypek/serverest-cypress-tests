class LoginPage {
  get inputEmail() {
    return '[data-testid="email"]'
  }

  get inputSenha() {
    return '[data-testid="senha"]'
  }

  get btnEntrar() {
    return '[data-testid="entrar"]'
  }

  get linkCadastrar() {
    return '[data-testid="cadastrar"]'
  }

  get alertMessage() {
    return '.alert'
  }

  visitar() {
    cy.visit('/login')
  }

  preencherEmail(email) {
    cy.get(this.inputEmail).clear()
    cy.get(this.inputEmail).type(email)
  }

  preencherSenha(senha) {
    cy.get(this.inputSenha).clear()
    cy.get(this.inputSenha).type(senha)
  }

  clicarEntrar() {
    cy.get(this.btnEntrar).click()
  }

  clicarCadastrar() {
    cy.get(this.linkCadastrar).click()
  }

  realizarLogin(email, senha) {
    this.visitar()
    this.preencherEmail(email)
    this.preencherSenha(senha)
    this.clicarEntrar()
  }

  validarMensagemDeErro(mensagem) {
    cy.get(this.alertMessage).should('contain.text', mensagem)
  }
}

export default new LoginPage()
