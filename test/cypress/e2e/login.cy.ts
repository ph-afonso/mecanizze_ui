// cypress/e2e/login.cy.ts
/// <reference types="cypress" />

describe('Fluxo de Login', () => {
  beforeEach(() => {
    // Passo 1: Visitar a página de login
    cy.visit('/login');
    cy.get('form').should('be.visible');
  });

  it('Cenário 1: Deverá ter sucesso ao fazer login e gravará o token no local storage.', () => {
    // Passo 1: Preencher o formulário com dados válidos
    cy.get('input[type="email"]').type('admin@quasar.com');
    cy.get('input[type="password"]').type('password');

    // Passo 2: Submeter o formulário
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

  it('Cenário 2: Deverá falhar ao realizar login e não gravará o token no local storage.', () => {
    // Passo 1: Preencher o formulário com dados inválidos
    cy.get('input[type="email"]').type('usuario@errado.com');
    cy.get('input[type="password"]').type('senhaerrada');

    // Passo 2: Submeter o formulário
    cy.get('form').submit();

    // Passo 3: Verificar se a notificação de erro do Quasar aparece com a mensagem correta
    cy.get('.q-notification')
      .should('be.visible')
      .and('contain', 'Credenciais inválidas');

    // Passo 4: Verificar se o token não foi salvo no local storage
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.be.null;
    });
  });
});