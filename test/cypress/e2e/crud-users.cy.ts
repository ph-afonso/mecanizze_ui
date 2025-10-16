describe('Página de Perfil do Usuário', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('form').should('be.visible');

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

  it('Cenário 1: Deverá realizar o cadastro de um novo usuário.', () => {
    cy.get('button[aria-label="Menu"]').click();
    cy.get('div').contains('Gerenciar Usuários').click();
    cy.get('span').contains('Cadastrar Usuário').click();

    cy.get('input[aria-label="Nome Completo *"]').type('Usuário Teste');

  });

});