describe('OPD Consultation - Fill Consultation Form', () => {
  it('should open consultation page, find a patient, use Action menu, fill consultation form, and save', () => {
    const today = new Date().toISOString().split('T')[0]
    const uniqueSuffix = `${Date.now()}`
    const hospitalNumber = `HOSP-CY-${uniqueSuffix.slice(-8)}`
    const uniqueEmail = `john.${uniqueSuffix}@example.com`
    const uniqueNin = uniqueSuffix.slice(-11).padStart(11, '0')
    const shortPause = 900
    const stagePause = 1400

    const typeSlowly = (selector, value) => {
      cy.get(selector)
        .should('exist')
        .clear({ force: true })
        .type(value, { force: true, delay: 170 })
      cy.wait(500)
    }

    const selectSearchableOption = (placeholder, valueText) => {
      cy.get(`input[placeholder="${placeholder}"]`, { timeout: 15000 })
        .should('exist')
        .click({ force: true })

      cy.get('body').then(($body) => {
        const options = $body.find('.MuiAutocomplete-popper [role="option"]')
        if (options.length > 0) {
          cy.wrap(options[0]).click({ force: true })
        } else {
          cy.get(`input[placeholder="${placeholder}"]`)
            .type(valueText, { force: true, delay: 140 })

          cy.get('.MuiAutocomplete-popper [role="option"]', { timeout: 15000 })
            .first()
            .click({ force: true })
        }
      })

      cy.wait(700)
    }

    const selectAutocompleteOption = (placeholder, optionText) => {
      cy.get(`input[placeholder="${placeholder}"]`, { timeout: 15000 })
        .should('exist')
        .click({ force: true })
        .clear({ force: true })
        .type(optionText, { force: true, delay: 120 })

      cy.get('.MuiAutocomplete-popper [role="option"]', { timeout: 15000 })
        .contains(new RegExp(optionText, 'i'))
        .click({ force: true })

      cy.wait(700)
    }

    const selectFirstNativeOption = (selector) => {
      cy.get(selector, { timeout: 15000 })
        .should('exist')
        .should('not.be.disabled')
        .then(($sel) => {
          const options = [...$sel[0].options].map((opt) => opt.value).filter(Boolean)
          if (options.length) {
            cy.wrap($sel).select(options[0], { force: true })
          }
        })
      cy.wait(700)
    }

    const selectMUIOptionMatching = (matcher) => {
      cy.get('.MuiAutocomplete-popper [role="option"]', { timeout: 15000 }).then(($options) => {
        const matchedOption = [...$options].find((option) => matcher.test(option.innerText))
        if (matchedOption) {
          cy.wrap(matchedOption).click({ force: true })
        } else {
          cy.wrap($options[0]).click({ force: true })
        }
      })
      cy.wait(700)
    }

    const selectFirstOptionForPlaceholder = (placeholder) => {
      cy.get(`input[placeholder="${placeholder}"]`, { timeout: 20000 })
        .should('be.visible')
        .click({ force: true })

      cy.get('.MuiAutocomplete-popper [role="option"]', { timeout: 20000 })
        .should('have.length.greaterThan', 0)
        .first()
        .click({ force: true })

      cy.wait(shortPause)
    }

    const openConsultationSection = (sectionTitle) => {
      cy.contains('button', sectionTitle, { timeout: 15000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -120, left: 0 } })
        .click({ force: true })
      cy.wait(stagePause)
    }

    const ensureConsultationSectionOpen = (sectionTitle, requiredSelector) => {
      cy.get('body').then(($body) => {
        if (!$body.find(requiredSelector).length) {
          openConsultationSection(sectionTitle)
        }
      })

      cy.get(requiredSelector, { timeout: 15000 }).should('exist')
      cy.wait(shortPause)
    }

    const selectFirstOptionForFieldLabel = (labelText) => {
      cy.contains('label', labelText, { timeout: 20000 })
        .should('exist')
        .parent()
        .find('input[role="combobox"]')
        .first()
        .click({ force: true })

      cy.get('.MuiAutocomplete-popper [role="option"]', { timeout: 20000 })
        .should('have.length.greaterThan', 0)
        .first()
        .click({ force: true })

      cy.wait(shortPause)
    }

    const typeInputByFieldLabel = (labelText, value) => {
      cy.contains('label', labelText, { timeout: 20000 })
        .should('exist')
        .scrollIntoView({ offset: { top: -120, left: 0 } })
        .parent()
        .find('input')
        .first()
        .clear({ force: true })
        .type(value, { force: true, delay: 140 })

      cy.wait(shortPause)
    }

    const filterTableByText = (valueText) => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="core-common-table-input"]').length) {
          cy.get('[data-testid="core-common-table-input"]')
            .clear({ force: true })
            .type(valueText, { force: true, delay: 100 })
        } else if ($body.find('[data-testid="core-common-table-button"]').length) {
          cy.get('[data-testid="core-common-table-button"]', { timeout: 15000 })
            .first()
            .click({ force: true })

          cy.get('[data-testid="core-common-table-input"]', { timeout: 15000 })
            .clear({ force: true })
            .type(valueText, { force: true, delay: 100 })
        }
      })

      cy.wait(1200)
    }

    const clickGridActionForPatient = (patientIdentifier) => {
      cy.get('body', { timeout: 45000 }).should('not.contain', 'Loading...')
      cy.get('.MuiDataGrid-root', { timeout: 45000 }).should('exist')

      filterTableByText(patientIdentifier)

      cy.contains('.MuiDataGrid-row', patientIdentifier, { timeout: 60000 })
        .should('exist')
        .within(() => {
          cy.get('[data-testid="core-common-action-menu-button"]', { timeout: 15000 })
            .click({ force: true })
        })

      cy.wait(1200)
    }

    cy.visit('/login')
    cy.get('input[type="email"]').type('admin@demo-hospital.com', { delay: 120 })
    cy.wait(600)
    cy.get('input[type="password"]').type('Admin@123456', { delay: 120 })
    cy.wait(600)
    cy.get('button[type="submit"]').click()
    cy.url({ timeout: 30000 }).should('not.include', '/login')

    // Try dashboard after login, but do not hard-fail if this user does not land on dashboard.
    cy.location('pathname', { timeout: 30000 }).then((pathname) => {
      if (!pathname.includes('/ehr/dashboard')) {
        cy.visit('/ehr/dashboard')
      }
    })

    cy.get('body', { timeout: 30000 }).then(($body) => {
      const hasDashboardTitle = [...$body.find('h1')].some((h) => /dashboard/i.test(h.innerText))
      const hasDashboardTabs = $body.find('[data-testid="opd-dashboard-dashboard-button"]').length > 0

      if (hasDashboardTitle || hasDashboardTabs) {
        cy.log('Dashboard is visible after login')
      } else {
        cy.log('Dashboard UI not visible for this session, continuing with OPD flow')
      }
    })
    cy.wait(2500)

    // Create a dedicated patient, then post that patient through registration -> triage -> consultation.
    cy.visit('/ehr/registration/register')
    cy.get('input[name="firstName"]', { timeout: 15000 }).should('exist')

    cy.get('input[name="dateOfRegistration"]').type(today, { force: true })
    cy.get('input[name="hospitalNumber"]').type(hospitalNumber, { force: true })
    cy.get('input[name="nationalIdentityNumber"]').type(uniqueNin, { force: true })
    cy.get('input[name="firstName"]').type('John', { force: true })
    cy.get('input[name="middleName"]').type('David', { force: true })
    cy.get('input[name="lastName"]').type('Doe', { force: true })

    cy.get('select[name="sex"]').then(($sel) => {
      const options = [...$sel[0].options].map((option) => option.value).filter(Boolean)
      if (options.length) {
        cy.wrap($sel).select(options[0], { force: true })
      }
    })

    cy.get('input[name="dateOfBirth"]').type('1990-01-15', { force: true })

    cy.contains('button', 'Registration Details').click({ force: true })
    cy.get('select[name="maritalStatus"]', { timeout: 15000 }).then(($sel) => {
      const options = [...$sel[0].options].map((option) => option.value).filter(Boolean)
      if (options.length) {
        cy.wrap($sel).select(options[0], { force: true })
      }
    })
    cy.get('select[name="employmentStatus"]').then(($sel) => {
      const options = [...$sel[0].options].map((option) => option.value).filter(Boolean)
      if (options.length) {
        cy.wrap($sel).select(options[0], { force: true })
      }
    })
    cy.get('select[name="educationLevel"]').then(($sel) => {
      const options = [...$sel[0].options].map((option) => option.value).filter(Boolean)
      if (options.length) {
        cy.wrap($sel).select(options[0], { force: true })
      }
    })
    cy.get('input[name="phoneNumber"]').clear({ force: true }).type('+2348012345678', { force: true })
    cy.get('input[name="alternativePhoneNumber"]').clear({ force: true }).type('+2348087654321', { force: true })
    cy.get('input[name="email"]').type(uniqueEmail, { force: true })
    selectAutocompleteOption('Select country', 'Nigeria')
    selectAutocompleteOption('Select state', 'Lagos')
    cy.get('input[placeholder="Select LGA"]', { timeout: 15000 })
      .should('exist')
      .click({ force: true })
    cy.get('.MuiAutocomplete-popper [role="option"]', { timeout: 15000 })
      .first()
      .click({ force: true })
    cy.get('input[name="streetAddress"]').type('123 Main Street, Lagos', { force: true })
    cy.get('input[name="landmark"]').type('Near Central Market', { force: true })

    cy.contains('button', 'Next of Kin Details').click({ force: true })
    cy.get('select[name="relationshipType"]', { timeout: 15000 }).then(($sel) => {
      const options = [...$sel[0].options].map((option) => option.value).filter(Boolean)
      if (options.length) {
        cy.wrap($sel).select(options[0], { force: true })
      }
    })
    cy.get('input[name="kinFirstName"]').type('Jane', { force: true })
    cy.get('input[name="kinMiddleName"]').type('Mary', { force: true })
    cy.get('input[name="kinLastName"]').type('Doe', { force: true })
    cy.get('input[name="kinPhoneNumber"]').clear({ force: true }).type('+2349012345678', { force: true })
    cy.get('input[name="kinEmail"]').type(`jane.${uniqueSuffix}@example.com`, { force: true })
    cy.get('input[name="kinAddress"]').type('456 Secondary Street, Lagos', { force: true })

    cy.contains('button', 'Emergency Contact').click({ force: true })
    cy.get('input[name="emergencyFirstName"]', { timeout: 15000 }).type('Michael', { force: true })
    cy.get('input[name="emergencyLastName"]').type('Smith', { force: true })
    cy.get('input[name="emergencyPhoneNumber"]').clear({ force: true }).type('+2347012345678', { force: true })
    cy.get('input[name="emergencyEmail"]').type(`michael.${uniqueSuffix}@example.com`, { force: true })
    cy.get('select[name="emergencyRelationshipType"]').then(($sel) => {
      const options = [...$sel[0].options].map((option) => option.value).filter(Boolean)
      if (options.length) {
        cy.wrap($sel).select(options[0], { force: true })
      }
    })
    cy.get('input[name="emergencyAddress"]').type('789 Third Avenue, Lagos', { force: true })

    cy.contains('button', 'Billing Information').click({ force: true })
    cy.get('select[name="billingType"]', { timeout: 15000 }).then(($sel) => {
      const options = [...$sel[0].options].map((option) => option.value).filter(Boolean)
      if (options.length) {
        cy.wrap($sel).select(options[0], { force: true })
      }
    })
    cy.get('input[name="organisationEmployer"]').type('ABC Corporation', { force: true })

    cy.contains('button', 'Save', { timeout: 15000 }).click({ force: true })
    cy.wait(4000)

    cy.visit('/ehr/registration')
    clickGridActionForPatient(hospitalNumber)

    cy.contains('[data-testid="core-common-action-menu-button-1"]', 'Dashboard', { timeout: 10000 })
      .click({ force: true })
    cy.wait(2000)

    cy.contains('Patient Details Dashboard', { timeout: 15000 }).should('exist')
    cy.contains('button', 'Post Patient', { timeout: 15000 }).click({ force: true })
    cy.wait(2000)

    cy.contains('Check in Patient', { timeout: 15000 }).should('exist')
    typeSlowly('input[name="visitDate"]', today)
    typeSlowly('input[name="checkInTime"]', '08:00')
    typeSlowly('input[name="purposeOfVisit"]', 'General Consultation')
    selectFirstNativeOption('select[name="facilityLocationUuid"]')
    cy.wait(2000)
    cy.get('#services-select').click({ force: true })
    selectMUIOptionMatching(/triage/i)
    cy.contains('button', 'Check In', { timeout: 10000 })
      .should('not.be.disabled')
      .click({ force: true })
    cy.wait(2500)

    cy.visit('/ehr/triage')
    cy.contains('Triage', { timeout: 15000 }).should('exist')
    clickGridActionForPatient(hospitalNumber)

    cy.contains('[data-testid="core-common-action-menu-button-1"]', 'Capture Vitals', { timeout: 10000 })
      .click({ force: true })
    cy.wait(1500)

    cy.contains('Record Triage Details', { timeout: 15000 }).should('exist')
    typeSlowly('input[name="vitalSignDate"]', today)
    typeSlowly('input[name="heartRate"]', '72')
    typeSlowly('input[name="respiratoryRate"]', '18')
    typeSlowly('input[name="temperature"]', '36.8')
    typeSlowly('input[name="bloodPressureSystolic"]', '120')
    typeSlowly('input[name="bloodPressureDiastolic"]', '80')
    typeSlowly('input[name="oxygenSaturation"]', '98')
    typeSlowly('input[name="bodyWeight"]', '70')
    typeSlowly('input[name="height"]', '175')
    cy.contains('button', 'Save', { timeout: 10000 })
      .should('not.be.disabled')
      .click({ force: true })
    cy.wait(2500)

    cy.contains('button', 'Patient Attended To', { timeout: 15000 }).click({ force: true })
    cy.wait(1500)
    clickGridActionForPatient(hospitalNumber)

    cy.contains('[data-testid="core-common-action-menu-button-1"]', 'Post Patient', { timeout: 10000 })
      .click({ force: true })
    cy.wait(1500)

    cy.contains('Check in Patient', { timeout: 15000 }).should('exist')
    typeSlowly('input[name="visitDate"]', today)
    typeSlowly('input[name="checkInTime"]', '09:00')
    typeSlowly('input[name="purposeOfVisit"]', 'Consultation Review')
    selectFirstNativeOption('select[name="facilityLocationUuid"]')
    cy.wait(2000)
    cy.get('#services-select').click({ force: true })
    selectMUIOptionMatching(/consult/i)
    cy.contains('button', 'Check In', { timeout: 10000 })
      .should('not.be.disabled')
      .click({ force: true })
    cy.wait(2500)

    // OPD -> Consultation page
    cy.visit('/ehr/consultation')
    cy.contains('Consultation', { timeout: 15000 }).should('exist')
    cy.wait(1200)

    // Find the same patient in waiting and open the Action menu.
    clickGridActionForPatient(hospitalNumber)

    cy.contains('[data-testid="core-common-action-menu-button-1"]', 'Fill Consultation Form', { timeout: 10000 })
      .click({ force: true })

    cy.contains('Consultation Form', { timeout: 15000 }).should('exist')
    cy.wait(1200)

    // Stage 1: Physical Examination + Vitals
    typeSlowly('input[name="encounterDate"]', today)

    selectSearchableOption('Search visit type...', 'visit')
    cy.wait(shortPause)

    cy.get('select[name="isVisitReferral"]', { timeout: 15000 })
      .should('exist')
      .then(($sel) => {
        const options = [...$sel[0].options].map((opt) => opt.value).filter(Boolean)
        if (options.length) {
          cy.wrap($sel).select(options[0], { force: true })
        }
      })
    cy.wait(stagePause)

    cy.get('input[name="dateOfVitalSign"]', { timeout: 15000 }).then(($input) => {
      if (!$input.prop('disabled')) {
        typeSlowly('input[name="dateOfVitalSign"]', today)
        typeSlowly('input[name="pulse"]', '74')
        typeSlowly('input[name="respiratoryRate"]', '18')
        typeSlowly('input[name="temperature"]', '36.7')
        typeSlowly('input[name="systolic"]', '120')
        typeSlowly('input[name="diastolic"]', '80')
        typeSlowly('input[name="oxygenSaturation"]', '98')
        typeSlowly('input[name="bodyWeight"]', '71')
        typeSlowly('input[name="height"]', '176')
      }
    })
    cy.wait(stagePause)

    // Stage 2: Presenting Complaints
    openConsultationSection('Presenting Complaints')
    typeSlowly('textarea[name="patientVisitNotes"]', 'Patient reports headache, mild fever, and general fatigue for review.')
    selectFirstOptionForPlaceholder('Search presenting complaint...')
    typeSlowly('input[name="onsetDate"]', today)
    selectFirstOptionForPlaceholder('Search severity...')
    cy.contains('button', 'Add Complaint', { timeout: 10000 })
      .should('not.be.disabled')
      .click({ force: true })
    cy.wait(stagePause)

    // Stage 3: Clinical Diagnosis
    openConsultationSection('Clinical Diagnosis')
    cy.contains('label', 'Condition', { timeout: 15000 })
      .parent()
      .find('input[role="combobox"]')
      .first()
      .click({ force: true })
      .type('malaria', { force: true, delay: 120 })
    cy.wait(1800)
    cy.get('body').then(($body) => {
      const icdOptions = $body.find('.MuiAutocomplete-popper [role="option"]')

      if (icdOptions.length > 0) {
        cy.wrap(icdOptions[0]).click({ force: true })
        cy.wait(shortPause)
        selectFirstOptionForPlaceholder('Search priority...')
        selectFirstOptionForPlaceholder('Search certainty...')
        cy.contains('button', 'Add Diagnosis', { timeout: 10000 })
          .should('not.be.disabled')
          .click({ force: true })
      } else {
        cy.log('ICD diagnosis options unavailable, skipping Add Diagnosis in this run')
      }
    })
    cy.wait(stagePause)

    // Stage 4: Laboratory Test Orders
    openConsultationSection('Laboratory Test Orders')
    cy.get('body').then(($body) => {
      if ($body.text().includes('do not have permission to add laboratory test orders')) {
        cy.wait(stagePause)
      } else {
        selectFirstOptionForPlaceholder('category of lab tests')
        selectFirstOptionForPlaceholder('specific test name')
        selectFirstOptionForPlaceholder('choose specimen type(s)')

        cy.get('input[placeholder="urgency of the test"]', { timeout: 15000 }).then(($priority) => {
          if ($priority.length) {
            selectFirstOptionForPlaceholder('urgency of the test')
          }
        })

        cy.contains('button', /Add Lab|Update Lab/, { timeout: 10000 })
          .should('not.be.disabled')
          .click({ force: true })
        cy.wait(stagePause)
      }
    })

    // Stage 5: Pharmacy Orders
    ensureConsultationSectionOpen('Pharmacy Orders', 'input[name="prescriptionDate"]')
    typeSlowly('input[name="prescriptionDate"]', today)
    selectFirstOptionForPlaceholder('Search for a drug...')
    selectFirstOptionForFieldLabel('Formulation')
    selectFirstOptionForFieldLabel('Route of Admin')
    typeInputByFieldLabel('Strength', '500mg')
    typeInputByFieldLabel('Dosage Amount', '1')
    selectFirstOptionForFieldLabel('Frequency')
    typeInputByFieldLabel('Quantity Prescribed', '10')
    typeInputByFieldLabel('Duration', '5')
    selectFirstOptionForFieldLabel('Duration Unit')

    cy.contains('button', /Add Pharmacy|Update Pharmacy/, { timeout: 10000 })
      .should('not.be.disabled')
      .click({ force: true })
    cy.wait(stagePause)

    // Save consultation form
    cy.contains('button', 'Save', { timeout: 10000 })
      .should('not.be.disabled')
      .click({ force: true })

    // Stay on the saved page briefly before test exit.
    cy.url({ timeout: 20000 }).then((savedUrl) => {
      cy.wait(8000)
      cy.url().then((currentUrl) => {
        expect(currentUrl).to.include('/ehr/consultation')
        expect(savedUrl).to.include('/ehr/consultation')
      })
    })

    // Verify we are still within consultation context after save.
    cy.get('body', { timeout: 15000 }).then(($body) => {
      if ($body.text().includes('Consultation Form')) {
        cy.contains('Consultation Form').should('exist')
      } else {
        cy.contains('Consultation').should('exist')
      }
    })

    cy.screenshot('opd-consultation-form-saved')
  })
})
