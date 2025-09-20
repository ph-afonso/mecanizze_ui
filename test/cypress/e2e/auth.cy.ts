// cypress/e2e/auth.cy.ts
/// <reference types="cypress" />

describe('Fluxo de Autenticação', () => {
  it('deve permitir que o usuário faça login e logout com sucesso', () => {
    // Passo 1: Visitar a página de login
    cy.visit('/login');

    // Garante que a aplicação carregou antes de interagir
    cy.get('form').should('be.visible');

    // Passo 2: Preencher o formulário
    cy.get('input[type="email"]').type('admin@quasar.com');
    cy.get('input[type="password"]').type('password');

    // Passo 3: Clicar no botão de entrar (submetendo o formulário)
    cy.get('form').submit();

    // Passo 4: Verificar se o login teve sucesso
    // (Verificamos se o botão de logout agora existe na página)
    cy.get('button[aria-label="Sair do sistema"]').should('be.visible');

    // --- Agora, o teste de Logout ---

    // Passo 5: Clicar no botão de logout
    cy.get('button[aria-label="Sair do sistema"]').click();

    // Passo 6: Clicar no botão "Sair" do diálogo de confirmação
    cy.get('.q-dialog').contains('button', 'Sair').click();

    // Passo 7: Verificar se fomos redirecionados de volta para a tela de login
    cy.url().should('include', '/login');
    cy.get('form').should('be.visible'); // Confirma que o formulário de login está na tela
  });
});