const { defineConfig } = require("cypress");
import dotenv from 'dotenv';
dotenv.config();

module.exports = defineConfig({
 
  e2e: {
    env:{
      EMAIL: process.env.EMAIL,
      PASSWORD: process.env.PASSWORD
  },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl:'https://qa.lamisplus.org'
  },
});
