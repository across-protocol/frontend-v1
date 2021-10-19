import {
  Initialization,
  WalletModule,
  WalletInitOptions,
} from "bnc-onboard/dist/src/interfaces";
import { ethers } from "ethers";
import ethereumLogo from "assets/ethereum-logo.png";
import usdcLogo from "assets/usdc-logo.png";
import optimismLogo from "assets/optimism.svg";
import wethLogo from "assets/weth-logo.svg";
import arbitrumLogo from "assets/arbitrum-logo.svg";
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
};

export const COLORS = {
  grayLightest: "0deg 0% 89%",
  gray: "230deg 6% 19%",
  grayLight: "240deg 2% 39%",
  primary: "166deg 92% 70%",
  primaryDark: "180deg 15% 25%",
  secondary: "266deg 77% 62%",
  white: "0deg 100% 100%",
  black: "0deg 0% 0%",
  error: "11deg 92% 70%",
  errorLight: "11deg 93% 94%",
};

export const infuraId =
  process.env.REACT_APP_PUBLIC_INFURA_ID || "d5e29c9b9a9d4116a7348113f57770a8";

const getNetworkName = (chainId: number) => {
  switch (chainId) {
    case 1: {
      return "mainnet";
    }
    case 42: {
      return "kovan";
    }
    case 3: {
      return "ropsten";
    }
    case 4: {
      return "rinkeby";
    }
    case 10: {
      return "optimism-mainnet";
    }
  }
};
const customExtensionWalletLogo = `	<svg 		height="40" 		viewBox="0 0 40 40" 		width="40" 		xmlns="http://www.w3.org/2000/svg"	>		<path 			d="m2744.99995 1155h9.99997" 			fill="#617bff" 		/>	</svg>`;
// create custom wallet
const customInjectedWallet: WalletModule | WalletInitOptions = {
  name: "Test Wallet",
  type: "injected",
  svg: customExtensionWalletLogo,
  wallet: async (helpers: any) => {
    const { createLegacyProviderInterface } = helpers;
    const provider = (window as any).ethereum;

    console.log("provider", provider);
    return {
      provider,
      interface: createLegacyProviderInterface(provider),
    };
  },
  desktop: true,
};

export function onboardBaseConfig(_chainId?: number): Initialization {
  const chainId = _chainId ?? 1;
  const infuraRpc = `https://${getNetworkName(
    chainId
  )}.infura.io/v3/${infuraId}`;

  const wallets: (WalletModule | WalletInitOptions)[] = [
    { walletName: "metamask", preferred: true },
    {
      walletName: "walletConnect",
      rpc: { [chainId || 1]: infuraRpc },
    },
  ];

  // This is only for testing. Cypress injects this testing variable at the start of tests with cy.visit()
  // If this var exists, inject our test wallet into the first element of the array.
  const cypressTesting = localStorage.getItem("cypress-testing");

  return {
    dappId: process.env.REACT_APP_PUBLIC_ONBOARD_API_KEY || "",
    hideBranding: true,
    networkId: 10, // Default to main net. If on a different network will change with the subscription.
    walletSelect: {
      wallets: !cypressTesting ? wallets : [customInjectedWallet, ...wallets],
      // wallets: [customInjectedWallet, ...wallets],
    },
    walletCheck: [
      { checkName: "connect" },
      { checkName: "accounts" },
      { checkName: "network" },
      { checkName: "balance", minimumBalance: "0" },
    ],
    // To prevent providers from requesting block numbers every 4 seconds (see https://github.com/WalletConnect/walletconnect-monorepo/issues/357)
    blockPollingInterval: 1000 * 60 * 60,
  };
}

type Coin = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};
type Coins = [
  Coin & { symbol: "WETH"; name: "Wrapped Ethereum"; decimals: 18 },
  ...Coin[]
];
// Adapted from Coingecko token list here: https://tokens.coingecko.com/uniswap/all.json
export const COIN_LIST: Record<number, Coins> = {
  1: [
    {
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
    },
    {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      logoURI: usdcLogo,
    },
    {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
      logoURI: ethereumLogo,
      address: ethers.constants.AddressZero,
    },
  ],
  42: [
    {
      address: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
    },
    {
      address: "0x08ae34860fbfe73e223596e65663683973c72dd3",
      name: "DAI Stablecoin",
      symbol: "DAI",
      decimals: 18,
      logoURI: usdcLogo,
    },
    {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
      logoURI: ethereumLogo,
      address: ethers.constants.AddressZero,
    },
  ],
  4: [
    {
      address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
    },
    {
      address: ethers.constants.AddressZero,
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      logoURI: ethereumLogo,
    },
  ],
  10: [
    {
      address: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
    },
    {
      address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      logoURI: usdcLogo,
    },
    {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
      logoURI: ethereumLogo,
      address: ethers.constants.AddressZero,
    },
  ],
  69: [
    {
      address: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
    },
    {
      address: "0x2a41F55E25EfEE3E53834140c0bD81dBF3464831",
      name: "DAI (L2 Dai)",
      symbol: "DAI",
      decimals: 18,
      logoURI: usdcLogo,
    },
    {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
      logoURI: ethereumLogo,
      address: ethers.constants.AddressZero,
    },
  ],
  42161: [
    {
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
    },
    {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      logoURI: ethereumLogo,
      address: ethers.constants.AddressZero,
    },
  ],
  421611: [
    {
      address: "0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681",
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
    },
    {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
      logoURI: ethereumLogo,
      address: ethers.constants.AddressZero,
    },
  ],
};

export const PROVIDERS: Record<number, ethers.providers.BaseProvider> = {
  1: new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
  ),
  4: new ethers.providers.JsonRpcProvider(
    `https://rinkeby.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
  ),
  10: new ethers.providers.JsonRpcProvider(
    `https://optimism-mainnet.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
  ),
  69: new ethers.providers.JsonRpcProvider(
    `https://optimism-kovan.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
  ),
  42161: new ethers.providers.JsonRpcProvider(
    `https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
  ),
  421611: new ethers.providers.JsonRpcProvider(
    `https://arbitrum-rinkeby.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
  ),
};

export const ADDRESSES: Record<number, { BRIDGE: string }> = {
  10: {
    BRIDGE: "",
  },
  69: {
    BRIDGE: "0x2271a5E74eA8A29764ab10523575b41AA52455f0",
  },
  421611: {
    BRIDGE: "0x6999526e507Cc3b03b180BbE05E1Ff938259A874",
  },
};

type NativeCurrency = {
  name: string;
  symbol: string;
  decimals: 18;
};
type Chain = {
  chainId: number;
  name: string;
  logoURI: string;
  rpcUrl?: string;
  explorerUrl: string;
  constructExplorerLink: (txHash: string) => string;
  nativeCurrency: NativeCurrency;
};

export const CHAINS: Record<number, Chain> = {
  1: {
    name: "Ethereum Mainnet",
    chainId: 1,
    logoURI: ethereumLogo,
    explorerUrl: "https://etherscan.io/",
    constructExplorerLink: (txHash: string) =>
      `https://etherscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  42: {
    name: "Ethereum Testnet Kovan",
    chainId: 42,
    logoURI: ethereumLogo,
    explorerUrl: "https://kovan.etherscan.io",
    constructExplorerLink: (txHash: string) =>
      `https://kovan.etherscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Kovan Ethereum",
      symbol: "KOV",
      decimals: 18,
    },
  },
  4: {
    name: "Rinkeby Testnet",
    chainId: 4,
    logoURI: ethereumLogo,
    explorerUrl: "https://rinkeby.etherscan.io",
    constructExplorerLink: (txHash: string) =>
      `https://rinkeby.etherscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  10: {
    name: "Optimistic Ethereum",
    chainId: 10,
    logoURI: optimismLogo,
    rpcUrl: "https://mainnet.optimism.io",
    explorerUrl: "https://optimistic.etherscan.io/",
    constructExplorerLink: (txHash: string) =>
      `https://optimistic.etherscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "OETH",
      decimals: 18,
    },
  },
  69: {
    name: "Optimistic Ethereum Testnet Kovan",
    chainId: 69,
    logoURI: optimismLogo,
    rpcUrl: "https://kovan.optimism.io",
    explorerUrl: "https://kovan-optimistic.etherscan.io",
    constructExplorerLink: (txHash: string) =>
      `https://kovan-optimistic.etherscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "KOR",
      decimals: 18,
    },
  },
  42161: {
    name: "Arbitrum One",
    chainId: 42161,
    logoURI: arbitrumLogo,
    rpcUrl: "https://arb1.arbitrum.io/rpc ",
    explorerUrl: "https://arbiscan.io",
    constructExplorerLink: (txHash: string) =>
      `https://arbiscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "AETH",
      decimals: 18,
    },
  },
  421611: {
    name: "Arbitrum Testnet Rinkeby",
    chainId: 421611,
    logoURI: arbitrumLogo,
    explorerUrl: "https://rinkeby-explorer.arbitrum.io",
    constructExplorerLink: (txHash: string) =>
      `https://rinkeby-explorer.arbitrum.io/tx/${txHash}`,
    rpcUrl: "https://rinkeby.arbitrum.io/rpc",
    nativeCurrency: {
      name: "Ether",
      symbol: "ARETH",
      decimals: 18,
    },
  },
};

export const DEFAULT_FROM_CHAIN_ID = 421611;
export const DEFAULT_TO_CHAIN_ID = 4;
