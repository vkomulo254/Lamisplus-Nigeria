export const locator = {
  EMAIL_INPUT :'input[type="email"]',
  PASSWORD_INPUT : 'input[type="password"]',
  SUBMIT_BUTTON : 'button[type="submit"]'
}
export const login = () => {
    cy.visit('/login')
    cy.get(locator.EMAIL_INPUT).type('admin@demo-hospital.com')
    cy.get(locator.PASSWORD_INPUT).type('Admin@123456')
    cy.get(locator.SUBMIT_BUTTON).click()
    cy.url().should('not.include', '/login')

};
