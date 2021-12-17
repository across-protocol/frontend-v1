// Detailed will be docs how to add a new chain to the list of available options in Across.

import { ethers } from "ethers";
import memoize from "lodash-es/memoize";
import ethereumLogo from "assets/ethereum-logo.png";
import usdcLogo from "assets/usdc-logo.png";
import optimismLogo from "assets/optimism-alt-logo.svg";
import wethLogo from "assets/weth-logo.svg";
import arbitrumLogo from "assets/arbitrum-logo.svg";
import umaLogo from "assets/UMA-round.svg";
import bobaLogo from "assets/Across-Boba-Color30x30.svg";
import { getAddress } from "../address";
import { defaultConstructExplorerLink } from "./functions";

// Add the ChainId of the chain.
export enum ChainId {
  MAINNET = 1,
  OPTIMISM = 10,
  ARBITRUM = 42161,
  BOBA = 288,
}

type GetProvider = () => ethers.providers.JsonRpcProvider;

// Create a provider, index to the ChainId enum.
// This is to query data for the user that hasn't connected yet.
export const PROVIDERS: Record<ChainId, GetProvider> = {
  [ChainId.MAINNET]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://mainnet.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
      )
  ),
  [ChainId.OPTIMISM]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://optimism-mainnet.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
      )
  ),
  [ChainId.ARBITRUM]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
      )
  ),
  // Doesn't have an rpc on infura.
  [ChainId.BOBA]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(`https://mainnet.boba.network`)
  ),
};

type Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  bridgePool: string;
};

// enforce weth to be first so we can use it as a guarantee in other parts of the app
export type Tokens = [
  {
    address: string;
    symbol: "WETH";
    name: "Wrapped Ether";
    decimals: 18;
    logoURI: typeof wethLogo;
    bridgePool: string;
  },
  ...Token[]
];

// Add a list of Tokens deployed on the layer 2 chain to this object.
// Indexed to the ChainId enum in this file.
export const TOKENS_DEPLOYED_ON_L2CHAINS: Record<ChainId, Tokens> = {
  [ChainId.MAINNET]: [
    {
      address: getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"),
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
      bridgePool: getAddress("0x7355Efc63Ae731f584380a9838292c7046c1e433"),
    },
    {
      address: getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"),
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      logoURI: usdcLogo,
      bridgePool: getAddress("0x256C8919CE1AB0e33974CF6AA9c71561Ef3017b6"),
    },
    {
      address: ethers.constants.AddressZero,
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      logoURI: ethereumLogo,
      bridgePool: getAddress("0x7355Efc63Ae731f584380a9838292c7046c1e433"),
    },
    {
      address: "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
      name: "UMA Token",
      symbol: "UMA",
      decimals: 18,
      logoURI: umaLogo,
      bridgePool: "0xdfe0ec39291e3b60ACa122908f86809c9eE64E90",
    },
  ],
  [ChainId.OPTIMISM]: [
    {
      address: getAddress("0x4200000000000000000000000000000000000006"),
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
      bridgePool: getAddress("0x7355Efc63Ae731f584380a9838292c7046c1e433"),
    },
    {
      address: getAddress("0x7f5c764cbc14f9669b88837ca1490cca17c31607"),
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      logoURI: usdcLogo,
      bridgePool: getAddress("0x190978cC580f5A48D55A4A20D0A952FA1dA3C057"),
    },
    {
      address: getAddress("0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea"),
      name: "UMA Token",
      symbol: "UMA",
      decimals: 18,
      logoURI: umaLogo,
      bridgePool: getAddress("0xdfe0ec39291e3b60ACa122908f86809c9eE64E90"),
    },
    {
      address: ethers.constants.AddressZero,
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      logoURI: ethereumLogo,
      bridgePool: getAddress("0x7355Efc63Ae731f584380a9838292c7046c1e433"),
    },
  ],
  [ChainId.ARBITRUM]: [
    {
      address: getAddress("0x82af49447d8a07e3bd95bd0d56f35241523fbab1"),
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
      bridgePool: getAddress("0x7355Efc63Ae731f584380a9838292c7046c1e433"),
    },
    {
      address: getAddress("0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"),
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      logoURI: usdcLogo,
      bridgePool: getAddress("0x256C8919CE1AB0e33974CF6AA9c71561Ef3017b6"),
    },
    {
      address: getAddress("0xd693ec944a85eeca4247ec1c3b130dca9b0c3b22"),
      name: "UMA Token",
      symbol: "UMA",
      decimals: 18,
      logoURI: umaLogo,
      bridgePool: getAddress("0xdfe0ec39291e3b60ACa122908f86809c9eE64E90"),
    },
    {
      address: ethers.constants.AddressZero,
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      logoURI: ethereumLogo,
      bridgePool: getAddress("0x7355Efc63Ae731f584380a9838292c7046c1e433"),
    },
  ],
  [ChainId.BOBA]: [
    {
      address: getAddress("0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"),
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
      bridgePool: getAddress("0x7355Efc63Ae731f584380a9838292c7046c1e433"),
    },
    {
      address: getAddress("0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc"),
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      logoURI: usdcLogo,
      bridgePool: getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"),
    },
    {
      address: ethers.constants.AddressZero,
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      logoURI: ethereumLogo,
      bridgePool: "",
    },
  ],
};

// List of Chain Metadata
export type ChainMetadata = {
  name: string;
  chainId: ChainId;
  logoURI: string;
  rpcUrl?: string;
  explorerUrl: string;
  constructExplorerLink: (txHash: string) => string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const CHAINS_METADATA: Record<ChainId, ChainMetadata> = {
  [ChainId.MAINNET]: {
    name: "Ethereum Mainnet",
    chainId: ChainId.MAINNET,
    logoURI: ethereumLogo,
    explorerUrl: "https://etherscan.io",
    constructExplorerLink: defaultConstructExplorerLink("https://etherscan.io"),
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  [ChainId.OPTIMISM]: {
    name: "Optimism",
    chainId: ChainId.OPTIMISM,
    logoURI: optimismLogo,
    rpcUrl: "https://mainnet.optimism.io",
    explorerUrl: "https://optimistic.etherscan.io",
    constructExplorerLink: (txHash: string) =>
      `https://optimistic.etherscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "OETH",
      decimals: 18,
    },
  },
  [ChainId.ARBITRUM]: {
    name: "Arbitrum One",
    chainId: ChainId.ARBITRUM,
    logoURI: arbitrumLogo,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    constructExplorerLink: (txHash: string) =>
      `https://arbiscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "AETH",
      decimals: 18,
    },
  },
  [ChainId.BOBA]: {
    name: "Boba",
    chainId: ChainId.BOBA,
    logoURI: bobaLogo,
    rpcUrl: "https://mainnet.boba.network",
    explorerUrl: "https://blockexplorer.boba.network",
    constructExplorerLink: (txHash: string) =>
      `https://blockexplorer.boba.network/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
};

export const CONTRACT_ADDRESSES_BY_CHAIN: Record<ChainId, { BRIDGE?: string }> =
  {
    [ChainId.MAINNET]: {
      // Stubbed value. Does not work. TODO: Change this out when contract deployed.
      BRIDGE: "0x2271a5E74eA8A29764ab10523575b41AA52455f0",
    },
    [ChainId.OPTIMISM]: {
      BRIDGE: "0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96",
    },
    [ChainId.BOBA]: {
      BRIDGE: "0xCD43CEa89DF8fE39031C03c24BC24480e942470B",
    },
    [ChainId.ARBITRUM]: {
      BRIDGE: "0xD8c6dD978a3768F7DDfE3A9aAD2c3Fd75Fa9B6Fd",
    },
  };

export function getChainName(chainId: ChainId): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return CHAINS_METADATA[ChainId.MAINNET].name;
    case ChainId.OPTIMISM:
      return CHAINS_METADATA[ChainId.OPTIMISM].name;
    case ChainId.ARBITRUM:
      return CHAINS_METADATA[ChainId.ARBITRUM].name;
    default:
      return "unknown";
  }
}

export const DEFAULT_FROM_CHAIN_ID = ChainId.ARBITRUM;
export const DEFAULT_TO_CHAIN_ID = ChainId.MAINNET;

interface EthChainMetadata {
  name: "Ethereum";
  chainId: 1;
  logoURI: string;
  rpcUrl: string;
  explorerUrl: string;
  constructExplorerLink: (txHash: string) => string;
  nativeCurrency: {
    name: "Ether";
    symbol: "ETH";
    decimals: 18;
  };
}

type ChainsSelection = [...ChainMetadata[], EthChainMetadata];
// Chains in order for dropdown in Send tab.
export const CHAINS_SELECTION_DROPDOWN: ChainsSelection = [
  {
    name: "Optimism",
    chainId: ChainId.OPTIMISM,
    logoURI: optimismLogo,
    rpcUrl: "https://mainnet.optimism.io",
    explorerUrl: "https://optimistic.etherscan.io",
    constructExplorerLink: defaultConstructExplorerLink(
      "https://optimistic.etherscan.io"
    ),
    nativeCurrency: {
      name: "Ether",
      symbol: "OETH",
      decimals: 18,
    },
  },
  {
    name: "Arbitrum",
    chainId: ChainId.ARBITRUM,
    logoURI: arbitrumLogo,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    constructExplorerLink: (txHash: string) =>
      `https://arbiscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "AETH",
      decimals: 18,
    },
  },
  {
    name: "Boba",
    chainId: ChainId.BOBA,
    logoURI: bobaLogo,
    rpcUrl: "https://mainnet.boba.network",
    explorerUrl: "https://blockexplorer.boba.network",
    constructExplorerLink: (txHash: string) =>
      `https://blockexplorer.boba.network/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    name: "Ethereum",
    chainId: ChainId.MAINNET,
    logoURI: ethereumLogo,
    // Doesn't have an RPC on Infura. Need to know how to handle this
    rpcUrl: "https://mainnet.infura.io/v3/",
    explorerUrl: "https://etherscan.io",
    constructExplorerLink: (txHash: string) =>
      `https://etherscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
];
