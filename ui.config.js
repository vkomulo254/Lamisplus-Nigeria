const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  reporter: 'mochawesome',

  reporterOptions: {
    reportDir: 'cypress/reports/ui',
    overwrite: false,
    html: true,
    json: true,
  },

  e2e: {
    specPattern: 'cypress/e2e/ui/**/*.cy.js',
    //supportFile: 'cypress/support/ui.js',

    baseUrl: 'https://qa.lamisplus.org',

    env: {
      EMAIL: process.env.EMAIL,
      PASSWORD: process.env.PASSWORD
    },

    setupNodeEvents(on, config) {
      return config;
    },
  },
});