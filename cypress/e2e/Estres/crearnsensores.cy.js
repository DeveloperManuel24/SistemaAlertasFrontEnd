// cypress/e2e/Estres/crearNSensores.cy.js

describe('Pruebas de Estrés - Crear N Sensores', () => {
  
    beforeEach(() => {
      // Iniciar sesión antes de cada prueba
      cy.visit('http://localhost:5173/auth/login');
      cy.get('input#email').type('claudiagos85@gmail.com');  // Usa tu email válido
      cy.get('input[type="password"]').type('Chelita20020@');  // Usa tu contraseña válida
      cy.get('input[type="submit"]').click();
  
      // Verificar que el login fue exitoso
      cy.url().should('eq', 'http://localhost:5173/');
    });
  
    it('Debe cargar múltiples sensores de manera eficiente', () => {
      // Navegar a la página de sensores
      cy.visit('http://localhost:5173/sensores');
      
      // Simular la creación de una gran cantidad de sensores
      for (let i = 0; i < 5; i++) {
        cy.get('button').contains('Crear Sensor').click();  // Hacer clic en "Crear Sensor"
  
        // Rellenar el formulario para cada sensor simulado
        cy.get('input[name="nombreSensor"]').type(`Sensor ${i}`);
        cy.get('input[name="location"]').type('Guatemala');
        cy.get('select[name="status"]').select('Activo');
  
        // Enviar el formulario
        cy.get('button[type="submit"]').click();
        // Verificar que el sensor recién creado aparece en la lista
        cy.contains(`Sensor ${i}`).scrollIntoView().should('be.visible');
      }
        // 2. Buscar el sensor que queremos eliminar
    cy.contains('td', 'Sensor 0').parent('tr').within(() => {
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
  