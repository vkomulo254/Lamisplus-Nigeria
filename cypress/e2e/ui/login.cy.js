describe('Login Page - Basic Authentication', () => {
  it('should login successfully with valid credentials', () => {
    cy.visit('/login')

    // Enter email
    cy.get('input[type="email"]').type('admin@demo-hospital.com')

    // Enter password
    cy.get('input[type="password"]').type('Admin@123456')

    // Click sign in button
    cy.get('button[type="submit"]').click()

    // Assert successful login
    cy.url().should('not.include', '/login')
  })
})
