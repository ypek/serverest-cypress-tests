class AdminPage {
  get btnCadastrarUsuarios() {
    return '[data-testid="cadastrarUsuarios"]'
  }

  get btnListarUsuarios() {
    return '[data-testid="listarUsuarios"]'
  }

  get btnCadastrarProdutos() {
    return '[data-testid="cadastrarProdutos"]'
  }

  get btnListarProdutos() {
    return '[data-testid="listarProdutos"]'
  }

  get btnLogout() {
    return '[data-testid="logout"]'
  }

  get inputNome() {
    return '[data-testid="nome"]'
  }

  get inputEmail() {
    return '[data-testid="email"]'
  }

  get inputPassword() {
    return '[data-testid="password"]'
  }

  get checkboxAdmin() {
    return '[data-testid="checkbox"]'
  }

  get btnCadastrarUsuario() {
    return '[data-testid="cadastrarUsuario"]'
  }

  get btnExcluir() {
    return 'button.btn-danger'
  }

  navegarCadastroUsuarios() {
    cy.get(this.btnCadastrarUsuarios).click()
  }

  navegarListaUsuarios() {
    cy.get(this.btnListarUsuarios).click()
  }

  preencherFormularioUsuario(nome, email, password) {
    cy.get(this.inputNome).type(nome)
    cy.get(this.inputEmail).type(email)
    cy.get(this.inputPassword).type(password)
  }

  marcarAdmin() {
    cy.get(this.checkboxAdmin).check()
  }

  submeterCadastroUsuario() {
    cy.get(this.btnCadastrarUsuario).click()
  }

  excluirRegistroPorNome(nome) {
    cy.contains('td', nome).parent('tr').find(this.btnExcluir).click()
  }

  realizarLogout() {
    cy.get(this.btnLogout).click()
  }
}

export default new AdminPage()
