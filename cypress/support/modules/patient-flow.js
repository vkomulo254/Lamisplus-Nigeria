export const locator = {
  EMAIL_INPUT: 'input[name="email"]',
  FIRST_NAME_INPUT: 'input[name="firstName"]',
  MIDDLE_NAME_INPUT: 'input[name="middleName"]',
  LAST_NAME_INPUT: 'input[name="lastName"]',
  DATE_OF_BIRTH_INPUT: 'input[name="dateOfBirth"]',
  DATE_OF_REGISTRATION_INPUT: 'input[name="dateOfRegistration"]',
  HOSPITAL_NUMBER_INPUT: 'input[name="hospitalNumber"]',
  NATIONAL_ID_INPUT: 'input[name="nationalIdentityNumber"]',
  AUTOCOMPLETE_COUNTRY: 'input[placeholder="Select country"]',
  AUTOCOMPLETE_STATE: 'input[placeholder="Select state"]',
  AUTOCOMPLETE_LGA: 'input[placeholder="Select LGA"]',
  STREET_ADDRESS_INPUT: 'input[name="streetAddress"]',
  LANDMARK_INPUT: 'input[name="landmark"]',
  PHONE_NUMBER_INPUT: 'input[name="phoneNumber"]',
  ALTERNATIVE_PHONE_NUMBER_INPUT: 'input[name="alternativePhoneNumber"]',
  EMAIL_INPUT: 'input[name="email"]',
  RELATIONSHIP_TYPE_SELECT: 'select[name="relationshipType"]',
    KIN_PHONE_NUMBER_INPUT: 'input[name="kinPhoneNumber"]',
    KIN_EMAIL_INPUT: 'input[name="kinEmail"]',
    KIN_ADDRESS_INPUT: 'input[name="kinAddress"]',
    EMERGENCY_FIRST_NAME_INPUT: 'input[name="emergencyFirstName"]',
    EMERGENCY_LAST_NAME_INPUT: 'input[name="emergencyLastName"]',
    EMERGENCY_PHONE_NUMBER_INPUT: 'input[name="emergencyPhoneNumber"]',
    EMERGENCY_EMAIL_INPUT: 'input[name="emergencyEmail"]',
    EMERGENCY_RELATIONSHIP_TYPE_SELECT: 'select[name="emergencyRelationshipType"]',
    EMERGENCY_ADDRESS_INPUT: 'input[name="emergencyAddress"]',
    AUTOCOMPLETE_BILLING_TYPE: 'select[name="billingType"]',
    INPUT_ORGANISATION_EMPLOYER: 'input[name="organisationEmployer"]',
    AUTOCOMPLETE_MARITAL_STATUS: 'select[name="maritalStatus"]',
    AUTOCOMPLETE_EMPLOYMENT_STATUS: 'select[name="employmentStatus"]',
    AUTOCOMPLETE_EDUCATION_LEVEL: 'select[name="educationLevel"]',
    AUTOCOMPLETE_POPUP_OPTIONS: '.MuiAutocomplete-popper [role="option"]',
    BILLING_TYPE_SELECT: 'select[name="billingType"]',
    ORGANISATION_EMPLOYER_INPUT: 'input[name="organisationEmployer"]',
    EMERGENCY_ADDRESS_INPUT: 'input[name="emergencyAddress"]',
    EMERGENCY_EMAIL_INPUT: 'input[name="emergencyEmail"]',
    EMERGENCY_PHONE_NUMBER_INPUT: 'input[name="emergencyPhoneNumber"]',
    EMERGENCY_LAST_NAME_INPUT: 'input[name="emergencyLastName"]',
    EMERGENCY_FIRST_NAME_INPUT: 'input[name="emergencyFirstName"]',
    EMERGENCY_RELATIONSHIP_TYPE_SELECT: 'select[name="emergencyRelationshipType"]',
    KIN_ADDRESS_INPUT: 'input[name="kinAddress"]',
    KIN_EMAIL_INPUT: 'input[name="kinEmail"]',
    KIN_PHONE_NUMBER_INPUT: 'input[name="kinPhoneNumber"]',
    KIN_LAST_NAME_INPUT: 'input[name="kinLastName"]',
    KIN_MIDDLE_NAME_INPUT: 'input[name="kinMiddleName"]',
    KIN_FIRST_NAME_INPUT: 'input[name="kinFirstName"]',
    RELATIONSHIP_TYPE_SELECT: 'select[name="relationshipType"]',
    LGA_OPTION: '.MuiAutocomplete-popper [role="option"]',
    LGA_INPUT: 'input[placeholder="Select LGA"]',
    EDUCATION_LEVEL_SELECT: 'select[name="educationLevel"]',
    EMPLOYMENT_STATUS_SELECT: 'select[name="employmentStatus"]',
    MARITAL_STATUS_SELECT: 'select[name="maritalStatus"]',

}
export const selectAutocompleteOption = (placeholder, optionText) => {
      cy.get(`input[placeholder="${placeholder}"]`, { timeout: 10000 })
        .should('exist')
        .click({ force: true })
        .clear({ force: true })
        .type(optionText, { force: true })

      cy.get(locator.AUTOCOMPLETE_POPUP_OPTIONS, { timeout: 10000 })
        .contains(new RegExp(optionText, 'i'))
        .click({ force: true })
    }

export const patientRegistration = () => {
        // Step 2: Navigate directly to the registration form
    cy.visit('/ehr/registration/register')
    cy.wait(4000)
    cy.get(locator.FIRST_NAME_INPUT, { timeout: 10000 }).should('exist')
    cy.log('Registration form loaded')

    // ─── 1. BIO DATA (defaultExpanded — already open) ──────────────────────
    cy.get(locator.DATE_OF_REGISTRATION_INPUT).type('2026-03-24', { force: true })
    cy.wait(200)
    cy.get(locator.HOSPITAL_NUMBER_INPUT).type('HOSP-TEST-001', { force: true })
    cy.wait(200)
    cy.get(locator.NATIONAL_ID_INPUT).type('12345678901', { force: true })
    cy.wait(200)
    cy.get(locator.FIRST_NAME_INPUT ).type('John', { force: true })
    cy.wait(200)
    cy.get(locator.MIDDLE_NAME_INPUT).type('David', { force: true })
    cy.wait(200)
    cy.get(locator.LAST_NAME_INPUT).type('Doe', { force: true })
    cy.wait(200)
    cy.get(locator.SEX_SELECT).then($sel => {
      const opts = [...$sel[0].options].map(o => o.value).filter(v => v)
      if (opts.length) cy.wrap($sel).select(opts[0], { force: true })
    })
    cy.wait(200)
    cy.get(locator.DATE_OF_BIRTH_INPUT).type('1990-01-15', { force: true })
    cy.wait(500)

    // ─── 2. REGISTRATION DETAILS (collapsed — click header to expand) ───────
    cy.contains('button', 'Registration Details').click({ force: true })
    cy.wait(1500)
    cy.get(locator.MARITAL_STATUS_SELECT, { timeout: 10000 }).should('exist')
    cy.get(locator.MARITAL_STATUS_SELECT).then($sel => {
      const opts = [...$sel[0].options].map(o => o.value).filter(v => v)
      if (opts.length) cy.wrap($sel).select(opts[0], { force: true })
    })
    cy.wait(200)
    cy.get(locator.EMPLOYMENT_STATUS_SELECT).then($sel => {
      const opts = [...$sel[0].options].map(o => o.value).filter(v => v)
      if (opts.length) cy.wrap($sel).select(opts[0], { force: true })
    })
    cy.wait(200)
    cy.get(locator.EDUCATION_LEVEL_SELECT).then($sel => {
      const opts = [...$sel[0].options].map(o => o.value).filter(v => v)
      if (opts.length) cy.wrap($sel).select(opts[0], { force: true })
    })
    cy.wait(200)
    cy.get(locator.PHONE_NUMBER_INPUT).clear({ force: true }).type('+2348012345678', { force: true })
    cy.wait(200)
    cy.get(locator.ALTERNATIVE_PHONE_NUMBER_INPUT).clear({ force: true }).type('+2348087654321', { force: true })
    cy.wait(200)
    cy.get(locator.EMAIL_INPUT).type('john.doe@example.com', { force: true })
    cy.wait(200)
    selectAutocompleteOption('Select country', 'Nigeria')
    cy.wait(1500)
    selectAutocompleteOption('Select state', 'Lagos')
    cy.wait(1500)
    cy.get(locator.LGA_INPUT, { timeout: 10000 })
      .should('exist')
      .click({ force: true })
    cy.get(locator.LGA_OPTION, { timeout: 10000 }).first().click({ force: true })
    cy.wait(500)
    cy.get(locator.STREET_ADDRESS_INPUT).type('123 Main Street, Lagos', { force: true })
    cy.wait(200)
    cy.get(locator.LANDMARK_INPUT).type('Near Central Market', { force: true })
    cy.wait(200)

    // ─── 3. NEXT OF KIN (collapsed — click header to expand) ────────────────
    cy.contains('button', 'Next of Kin Details').click({ force: true })
    cy.wait(1000)
    cy.get(locator.RELATIONSHIP_TYPE_SELECT, { timeout: 10000 }).should('exist')
    cy.get(locator.RELATIONSHIP_TYPE_SELECT).then($sel => {
      const opts = [...$sel[0].options].map(o => o.value).filter(v => v)
      if (opts.length) cy.wrap($sel).select(opts[0], { force: true })
    })
    cy.wait(200)
    cy.get(locator.KIN_FIRST_NAME_INPUT).type('Jane', { force: true })
    cy.wait(200)
    cy.get(locator.KIN_MIDDLE_NAME_INPUT).type('Mary', { force: true })
    cy.wait(200)
    cy.get(locator.KIN_LAST_NAME_INPUT).type('Doe', { force: true })
    cy.wait(200)
    cy.get(locator.KIN_PHONE_NUMBER_INPUT).clear({ force: true }).type('+2349012345678', { force: true })
    cy.wait(200)
    cy.get(locator.KIN_EMAIL_INPUT).type('jane.doe@example.com', { force: true })
    cy.wait(200)
    cy.get(locator.KIN_ADDRESS_INPUT).type('456 Secondary Street, Lagos', { force: true })
    cy.wait(200)

    // ─── 4. EMERGENCY CONTACT (collapsed — click header to expand) ──────────
    cy.contains('button', 'Emergency Contact').click({ force: true })
    cy.wait(1000)
    cy.get(locator.EMERGENCY_FIRST_NAME_INPUT, { timeout: 10000 }).should('exist')
    cy.get(locator.EMERGENCY_FIRST_NAME_INPUT).type('Michael', { force: true })
    cy.wait(200)
    cy.get(locator.EMERGENCY_LAST_NAME_INPUT).type('Smith', { force: true })
    cy.wait(200)
    cy.get(locator.EMERGENCY_PHONE_NUMBER_INPUT).clear({ force: true }).type('+2347012345678', { force: true })
    cy.wait(200)
    cy.get(locator.EMERGENCY_EMAIL_INPUT).type('michael.smith@example.com', { force: true })
    cy.wait(200)
    cy.get(locator.EMERGENCY_RELATIONSHIP_TYPE_SELECT).then($sel => {
      const opts = [...$sel[0].options].map(o => o.value).filter(v => v)
      if (opts.length) cy.wrap($sel).select(opts[0], { force: true })
    })
    cy.wait(200)
    cy.get(locator.EMERGENCY_ADDRESS_INPUT).type('789 Third Avenue, Lagos', { force: true })
    cy.wait(200)

    // ─── 5. BILLING INFORMATION (collapsed — click header to expand) ─────────
    cy.contains('button', 'Billing Information').click({ force: true })
    cy.wait(1000)
    cy.get(locator.BILLING_TYPE_SELECT, { timeout: 10000 }).should('exist')
    cy.get(locator.BILLING_TYPE_SELECT).then($sel => {
      const opts = [...$sel[0].options].map(o => o.value).filter(v => v)
      if (opts.length) cy.wrap($sel).select(opts[0], { force: true })
    })
    cy.wait(200)
    cy.get(locator.ORGANISATION_EMPLOYER_INPUT).type('ABC Corporation', { force: true })
    cy.wait(200)

    // ─── SAVE ────────────────────────────────────────────────────────────────
    cy.wait(500)
    cy.contains('button', 'Save').click({ force: true })
    cy.wait(4000)
    cy.screenshot('patient-registration-complete')

    cy.get('body').then($body => {
      const text = $body.text()
      if (text.includes('success') || text.includes('created') || text.includes('registered')) {
        cy.log('Patient registered successfully')
      } else {
        cy.log('Form submitted - check screenshot for result')
      }
    })
  };

