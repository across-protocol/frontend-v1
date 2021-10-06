/* eslint-disable */

describe("Connects to the wallet and swaps chains", () => {
  it("Visits the page", () => {
    cy.visit("localhost:3000");
    cy.contains("Connect Wallet");
  });
});
