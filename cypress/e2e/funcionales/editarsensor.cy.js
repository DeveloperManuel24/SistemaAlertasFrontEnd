// cypress/integration/funcionales/editarSensor.spec.js

describe('Pruebas Funcionales - Edición de Sensor', () => {
  
  beforeEach(() => {
    // Iniciar sesión antes de cada prueba
    cy.visit('http://localhost:5173/auth/login');
    cy.get('input#email').type('claudiagos85@gmail.com');  // Usa tu email válido
    cy.get('input[type="password"]').type('Chelita20020@');  // Usa tu contraseña válida
    cy.get('input[type="submit"]').click();

    // Esperar un poco después de cada acción para hacerlo más lento
    cy.wait(1000);  // Esperar 1 segundo para ver los cambios

    // Verificar que el login fue exitoso
    cy.url().should('eq', 'http://localhost:5173/');
    cy.wait(1000);
  });

  it('Debe permitir editar un sensor existente', () => {
    // 1. Navegar al listado de sensores
    cy.visit('http://localhost:5173/sensores');
    cy.wait(1000);

    // 2. Buscar el sensor que queremos editar
    cy.contains('td', 'Sensor de Prueba Cypress').parent('tr').within(() => {
      // 3. Hacer clic en el botón "Editar"
      cy.get('button').contains('Editar').click();
    });
    cy.wait(1000);

    // 4. Verificar que estamos en la página de edición
    cy.url().should('include', '/sensores/edit');
    cy.wait(1000);
    
    // 5. Cambiar el nombre del sensor
    cy.get('input[name="nombreSensor"]').clear().type('Sensor de Prueba Editado');
    cy.wait(1000);

    // 6. Cambiar la ubicación del sensor
    cy.get('input[name="location"]').clear().type('Ciudad de Guatemala');
    cy.wait(1000);

    // 7. Cambiar el estado del sensor
    cy.get('select[name="status"]').select('Inactivo');
    cy.wait(1000);

    // 8. Enviar el formulario de edición
    cy.get('button[type="submit"]').click();
    cy.wait(1000);

    // 9. Verificar que hemos sido redirigidos al listado de sensores
    cy.url().should('include', '/sensores');
    cy.wait(1000);

    // 10. Verificar que los cambios están reflejados en el listado de sensores
    cy.contains('td', 'Sensor de Prueba Editado').should('be.visible');
    cy.contains('td', 'Ciudad de Guatemala').should('be.visible');
    cy.contains('td', 'Inactivo').should('be.visible');
    cy.wait(1000);
  });

});
