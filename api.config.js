const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  reporter: 'mochawesome',

  reporterOptions: {
    reportDir: 'cypress/reports/api',
    overwrite: false,
    html: true,
    json: true,
  },

  e2e: {
    specPattern: 'cypress/e2e/api/**/*.cy.js',
    //supportFile: 'cypress/support/api.js',

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