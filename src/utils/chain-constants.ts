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
import { getAddress } from "./address";

// Add the ChainId of the chain.
enum ChainId {
  MAINNET = 1,
  RINKEBY = 4,
  KOVAN = 42,
  OPTIMISM = 10,
  KOVAN_OPTIMISM = 69,
  ARBITRUM = 42161,
  ARBITRUM_RINKEBY = 421611,
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
  [ChainId.RINKEBY]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://rinkeby.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
      )
  ),
  [ChainId.KOVAN]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://kovan.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
      )
  ),
  [ChainId.OPTIMISM]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://optimism-mainnet.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
      )
  ),
  [ChainId.KOVAN_OPTIMISM]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://optimism-kovan.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
      )
  ),
  [ChainId.ARBITRUM]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
      )
  ),
  [ChainId.ARBITRUM_RINKEBY]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://arbitrum-rinkeby.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
      )
  ),
  // Doesn't have an rpc on infura.
  [ChainId.BOBA]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(`https://mainnet.boba.network`)
  ),
};

// enforce weth to be first so we can use it as a guarantee in other parts of the app
type TokenList = [
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
export const TOKENS_LIST: Record<ChainId, TokenList> = {
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
  [ChainId.RINKEBY]: [
    {
      address: getAddress("0xc778417E063141139Fce010982780140Aa0cD5Ab"),
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
      bridgePool: getAddress("0xf42bB7EC88d065dF48D60cb672B88F8330f9f764"),
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
  [ChainId.KOVAN]: [
    {
      address: getAddress("0xd0a1e359811322d97991e03f863a0c30c2cf029c"),
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
      bridgePool: "i",
    },
    {
      address: getAddress("0x08ae34860fbfe73e223596e65663683973c72dd3"),
      name: "DAI Stablecoin",
      symbol: "DAI",
      decimals: 18,
      logoURI: usdcLogo,
      bridgePool: "f",
    },
    {
      address: ethers.constants.AddressZero,
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      logoURI: ethereumLogo,
      bridgePool: "d",
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
  [ChainId.KOVAN_OPTIMISM]: [
    {
      address: getAddress("0x4200000000000000000000000000000000000006"),
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
      bridgePool: "m",
    },
    {
      address: getAddress("0x2a41F55E25EfEE3E53834140c0bD81dBF3464831"),
      name: "DAI (L2 Dai)",
      symbol: "DAI",
      decimals: 18,
      logoURI: usdcLogo,
      bridgePool: "",
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
  [ChainId.ARBITRUM_RINKEBY]: [
    {
      address: getAddress("0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681"),
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      logoURI: wethLogo,
      bridgePool: "",
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
  // Stubbed
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
