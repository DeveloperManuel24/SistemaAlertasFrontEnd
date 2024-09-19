// cypress/e2e/funcionales/crearSensor.cy.js

describe('Pruebas Funcionales - Crear Sensor', () => {
  
  // Autenticación antes de cada prueba
  beforeEach(() => {
    // Visitar la página de login y autenticar al usuario
    cy.visit('http://localhost:5173/auth/login');  // Asegúrate de que la URL sea la correcta

    // Ingresar el correo y contraseña válidos
    cy.get('input#email').type('claudiagos85@gmail.com');  // Reemplaza con el email de tu sistema
    cy.get('input[type="password"]').type('Chelita20020@');  // Reemplaza con la contraseña válida

    // Hacer clic en el botón de "Iniciar Sesión"
    cy.get('input[type="submit"]').click();

    // Verificar que se redirige correctamente al dashboard
    cy.url().should('eq', 'http://localhost:5173/');  // Cambia la URL según la ruta protegida de tu sistema

    // Guardar el token de sesión en localStorage (si es necesario)
    cy.window().then((window) => {
      const token = window.localStorage.getItem('AUTH_TOKEN');
      expect(token).to.exist;  // Verificar que el token exista
    });
  });

  // Prueba para crear un nuevo sensor
  it('Debe permitir crear un nuevo sensor', () => {
    // Navegar a la página de creación de sensores
    cy.visit('http://localhost:5173/sensores/create');  // Asegúrate de que la URL sea correcta

    // Verificar que estamos en la página de creación de sensor
    cy.url().should('include', '/sensores/create');

    // Rellenar el formulario de creación de sensor
    cy.get('input[name="nombreSensor"]').type('Sensor de Prueba Cypress');  // Nombre del sensor
    cy.get('input[name="location"]').type('Guatemala');  // Localización del sensor
    cy.get('select[name="status"]').select('Activo');  // Seleccionar estado

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Verificar que se redirige a la página de listado de sensores
    cy.url().should('include', '/sensores');

    // Verificar que el nuevo sensor aparezca en la tabla
    cy.contains('Sensor de Prueba Cypress').should('be.visible');
    cy.contains('Guatemala').should('be.visible');
    cy.contains('Activo').should('be.visible');
  });

 
});
