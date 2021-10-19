/* eslint-disable */
import createCustomizedBridge from "../utils/CustomizedBridge";

describe("Connects to the wallet and swaps chains", () => {
  it("Visits the page", async () => {
    cy.visit("localhost:3000/#");
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
    cy.get(
      ".bn-onboard-custom.bn-onboard-modal-content-close.svelte-rntogh"
    ).click();
  });

  it("Clicks swap to Kovan-Optimism and changes chain", () => {
    cy.get("#cySwapChain").click();
    // Note: we capitalize with CSS.
    cy.get("#cyNetworkName").contains("arbitrum rinkeby");
  });
});
