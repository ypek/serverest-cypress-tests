class ProdutosPage {
  get headerHome() {
    return '[data-testid="home"]'
  }

  get btnCadastrarProduto() {
    return '[data-testid="cadastarProdutos"]'
  }

  get inputNome() {
    return '[data-testid="nome"]'
  }

  get inputPreco() {
    return '[data-testid="preco"]'
  }

  get inputDescricao() {
    return '[data-testid="descricao"]'
  }

  get inputQuantidade() {
    return '[data-testid="quantity"]'
  }

  get btnCadastrar() {
    return '[data-testid="cadastarProdutos"]'
  }

  get alertMessage() {
    return '.alert'
  }

  get listaProdutos() {
    return '[data-testid="produto"]'
  }

  validarPaginaInicial() {
    cy.get(this.headerHome).should('be.visible')
  }

  clicarCadastrarProduto() {
    cy.get(this.btnCadastrarProduto).click()
  }

  preencherFormularioProduto(nome, preco, descricao, quantidade) {
    cy.get(this.inputNome).clear()
    cy.get(this.inputNome).type(nome)
    cy.get(this.inputPreco).clear()
    cy.get(this.inputPreco).type(preco.toString())
    cy.get(this.inputDescricao).clear()
    cy.get(this.inputDescricao).type(descricao)
    cy.get(this.inputQuantidade).clear()
    cy.get(this.inputQuantidade).type(quantidade.toString())
  }

  validarMensagem(mensagem) {
    cy.get(this.alertMessage).should('contain.text', mensagem)
  }
}

export default new ProdutosPage()
