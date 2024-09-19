// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.js

Cypress.Commands.add('login', (email, password) => {
    // Aumentar el tiempo de espera para que la página de login cargue completamente
    cy.visit('http://localhost:5173/auth/login', { timeout: 10000 });
  
    // Asegurarse de que el campo de email esté visible antes de interactuar
    cy.get('input[name="email"]', { timeout: 10000 }).should('be.visible').type(email);
  
    // Asegurarse de que el campo de contraseña esté visible antes de interactuar
    cy.get('input[name="password"]', { timeout: 10000 }).should('be.visible').type(password);
  
    // Asegurarse de que el botón de enviar esté visible y clicarlo
    cy.get('button[type="submit"]', { timeout: 10000 }).should('be.visible').click();
  });
  