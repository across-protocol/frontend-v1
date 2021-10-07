/* eslint-disable */

describe("Connects to the wallet and swaps chains", () => {
  it("Visits the page", () => {
    // cy.visit("localhost:3000");
    cy.visit("https://across-bdi6pji1b-uma.vercel.app/");
    cy.contains("Connect Wallet");
  });

  it("Connects to Optimism", () => {
    cy.get(".css-7kgf03").click();
    cy.get(
      ".bn-onboard-custom.bn-onboard-prepare-button.bn-onboard-prepare-button-center"
    )
      .first()
      .click();
    cy.get(".bn-onboard-custom.bn-onboard-icon-button").eq(1).click();
  });
});
