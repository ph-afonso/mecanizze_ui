/// <reference types="cypress" />

describe('Fluxo de Login', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('form').should('be.visible');
  });

  it('Cenário 1: Deverá ter sucesso ao fazer login e gravará o token no local storage.', () => {
    cy.intercept('POST', '**/token').as('loginRequest');
    cy.get('input[type="email"]').type('admin@mecanizze.com');
    cy.get('input[type="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.be.a('string');
      expect(token).not.to.be.empty;
    });
  });

  it('Cenário 2: Deverá falhar ao realizar login e não gravará o token no local storage.', () => {
    cy.intercept('POST', '**/token').as('loginRequest');
    cy.get('input[type="email"]').type('usuario@errado.com');
    cy.get('input[type="password"]').type('senhaerrada');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.be.null;
    });
  });
});

