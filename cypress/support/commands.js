// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import createCustomizedBridgeMultiChain from "../utils/CustomizedBridgeMultiChain";
// import createCustomizedBridge from "../utils/CustomizedBridge";

// sets up the injected provider to be a mock ethereum provider with the given mnemonic/index
Cypress.Commands.overwrite("visit", (original, url, options) => {
  return original(
    url.startsWith("/") && url.length > 2 && !url.startsWith("/#")
      ? `/#${url}`
      : url,
    // url,
    {
      ...options,
      onBeforeLoad(win) {
        options && options.onBeforeLoad && options.onBeforeLoad(win);
        win.localStorage.clear();
        win.localStorage.setItem("cypress-testing", true);

        win.ethereum = createCustomizedBridgeMultiChain();
        // win.ethereum = createCustomizedBridge();
      },
    }
  );
});
