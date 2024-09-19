describe('Pruebas de Login', () => {
    // Prueba para iniciar sesión con credenciales válidas
  
    // Prueba para intentar iniciar sesión con credenciales incorrectas
    it('Debería mostrar error con credenciales inválidas', () => {
      // 1. Visitar la página de login
      cy.visit('http://localhost:5173/auth/login');
  
      // 2. Escribir un email y una contraseña incorrecta
      cy.get('input#email').type('claudiago111s85@gmail.com');  // Email incorrecto
      cy.get('input[type="password"]').type('Chelita200201111@');  // Contraseña incorrecta
  
      // 3. Hacer clic en el botón de "Iniciar Sesión"
      cy.get('input[type="submit"]').click();
  
      // 4. Verificar que se muestra el error
      cy.contains('Error').should('be.visible');  // Verificar que aparece el mensaje de error
    });
  });
  