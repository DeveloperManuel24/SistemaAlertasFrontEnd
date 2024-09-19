describe('Pruebas de Login', () => {
    // Prueba para iniciar sesión con credenciales válidas
    it('Debería iniciar sesión correctamente con credenciales válidas', () => {
      // 1. Visitar la página de login
      cy.visit('http://localhost:5173/auth/login');  // Cambia la URL si es necesario
  
      // 2. Escribir el email y la contraseña correctos
      cy.get('input#email').type('claudiagos85@gmail.com');  // Usa un email válido de tu sistema
      cy.get('input[type="password"]').type('Chelita20020@');  // Usa una contraseña válida
  
      // 3. Hacer clic en el botón de "Iniciar Sesión"
      cy.get('input[type="submit"]').click();
  
      // 4. Verificar que la redirección fue correcta y que se muestra el mensaje de bienvenida
      cy.url().should('eq', 'http://localhost:5173/');  // Cambia la URL según la ruta protegida de tu sistema
      cy.contains('Hola, claudiagos85@gmail.com').should('be.visible');  // Verifica el mensaje de bienvenida
    });

  });
  