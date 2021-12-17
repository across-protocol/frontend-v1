import { Initialization } from "bnc-onboard/dist/src/interfaces";
import { ChainId } from "./chains/constants";

/* Colors and Media Queries section */

export const BREAKPOINTS = {
  tabletMin: 550,
  laptopMin: 1100,
  desktopMin: 1500,
};

export const QUERIES = {
  tabletAndUp: `(min-width: ${BREAKPOINTS.tabletMin / 16}rem)`,
  laptopAndUp: `(min-width: ${BREAKPOINTS.laptopMin / 16}rem)`,
  desktopAndUp: `(min-width: ${BREAKPOINTS.desktopMin / 16}rem)`,
  tabletAndDown: `(max-width: ${(BREAKPOINTS.laptopMin - 1) / 16}rem)`,
  mobileAndDown: `(max-width: ${(BREAKPOINTS.tabletMin - 1) / 16}rem)`,
};

export const COLORS = {
  gray: {
    100: "0deg 0% 89%",
    300: "240deg 4% 27%",
    500: "230deg 6% 19%",
  },
  primary: {
    500: "166deg 92% 70%",
    700: "180deg 15% 25%",
  },
  secondary: {
    500: "266deg 77% 62%",
  },
  error: {
    500: "11deg 92% 70%",
    300: "11deg 93% 94%",
  },
  white: "0deg 100% 100%",
  black: "0deg 0% 0%",
  umaRed: "0deg 100% 65%",
};

/* Onboard config */
export const DEFAULT_FROM_CHAIN_ID = ChainId.ARBITRUM;

export function onboardBaseConfig(): Initialization {
  // const infuraRpc = PROVIDERS[DEFAULT_FROM_CHAIN_ID]().connection.url;
  return {
    dappId: process.env.REACT_APP_PUBLIC_ONBOARD_API_KEY || "",
    networkId: DEFAULT_FROM_CHAIN_ID,
    hideBranding: true,
    walletSelect: {
      wallets: [{ walletName: "metamask", preferred: true }],
    },
    walletCheck: [{ checkName: "connect" }, { checkName: "accounts" }],
    // To prevent providers from requesting block numbers every 4 seconds (see https://github.com/WalletConnect/walletconnect-monorepo/issues/357)
    blockPollingInterval: 1000 * 60 * 60,
  };
}

// this client requires multicall2 be accessible on the chain. This is the address for mainnet.
export const multicallTwoAddress = "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696";
