// cypress/integration/funcionales/eliminarSensor.spec.js

describe('Pruebas Funcionales - Eliminación de Sensor', () => {
  
  beforeEach(() => {
    // Iniciar sesión antes de cada prueba
    cy.visit('http://localhost:5173/auth/login');
    cy.get('input#email').type('claudiagos85@gmail.com');  // Usa tu email válido
    cy.wait(1000); // Espera 1 segundo
    cy.get('input[type="password"]').type('Chelita20020@');  // Usa tu contraseña válida
    cy.wait(1000); // Espera 1 segundo
    cy.get('input[type="submit"]').click();

    // Verificar que el login fue exitoso
    cy.url().should('eq', 'http://localhost:5173/');
    cy.wait(1000); // Espera 1 segundo
  });

  it('Debe permitir eliminar un sensor existente', () => {
    // 1. Navegar al listado de sensores
    cy.visit('http://localhost:5173/sensores');
    cy.wait(1000); // Espera 1 segundo
    
    // 2. Buscar el sensor que queremos eliminar
    cy.contains('td', 'Sensor de Prueba Cypress').parent('tr').within(() => {
      cy.wait(1000); // Espera 1 segundo
      // 3. Hacer clic en el botón "Eliminar"
      cy.get('button').contains('Eliminar').click();
    });

    cy.wait(1000); // Espera 1 segundo

    // 4. Confirmar la eliminación en el modal de confirmación de SweetAlert
    cy.get('.swal2-confirm').click();  // Seleccionar el botón de confirmación en SweetAlert
    cy.wait(1000); // Espera 1 segundo

    // 5. Verificar que el sensor ha sido eliminado del listado
    cy.contains('Sensor de Prueba Cypress').should('not.exist');
    cy.wait(1000); // Espera 1 segundo para observar el resultado final
  });

});
