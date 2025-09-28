// cypress/e2e/logout.cy.ts
/// <reference types="cypress" />

describe('Fluxo de Logout', () => {
  // O hook 'beforeEach' executa ANTES de cada teste ('it') neste bloco.
  // Usamos ele para preparar o cenário, garantindo que o usuário esteja logado.
  beforeEach(() => {
    // Passo 1: Visitar a página de login
    cy.visit('/login');
    cy.get('form').should('be.visible');

    // Passo 2: Preencher o formulário com dados válidos e submeter
    cy.get('input[type="email"]').type('admin@quasar.com');
    cy.get('input[type="password"]').type('password');
    cy.get('form').submit();

    // Passo 3: Verificar se a notificação de sucesso do Quasar aparece com a mensagem correta
    cy.get('.q-notification')
      .should('be.visible')
      .and('contain', 'Login realizado com sucesso');
    
    // Passo 4: Verificar se o token foi salvo no local storage
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.be.a('string');
      expect(token).not.to.be.empty;
    });
  });

  it('Cenário 1: Deve realizar o logout com sucesso e limpar o token do local storage', () => {
    // Passo 1: Clicar no botão de logout
    cy.get('button[aria-label="Sair do sistema"]').click();

    // Passo 2: Clicar no botão "Sair" do diálogo de confirmação
    cy.get('.q-dialog').contains('button', 'Sair').click();

    // Passo 3: Verifica se foi redirecionado para a página de login
    cy.url().should('include', '/login');
    cy.get('form').should('be.visible');

    // Passo 4: Verifica se o token foi removido do local storage
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.be.null;
    });
  });
});