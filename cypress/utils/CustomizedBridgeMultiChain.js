import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
// import { Eip1193Bridge } from "@ethersproject/experimental";
import { Eip1193Bridge } from "./eip1193-bridge";
import { ethers } from "ethers";
import convertNumbersToNamed from "./convertNumbersToNamed";
import capitalizeString from "./capitalizeString";
import { providers } from "@ethersproject/experimental/node_modules/ethers";
const PRIVATE_KEY_TEST_NEVER_USE =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// address of the above key
export const TEST_ADDRESS_NEVER_USE = new Wallet(PRIVATE_KEY_TEST_NEVER_USE)
  .address;

// ChainID: 1
const MAINNET_CHAINID = "0x1";

// ChainID: 69
const OPTIMISM_KOVAN_CHAINID = "0x45";
// ChainID: 10
const OPTIMISM_MAINNET_CHAINID = "0xa";
// ChainID: 421611
const ARB_RINKEBY_CHAINID = "0x66eeb";

class CustomizedBridgeMultiChain extends Eip1193Bridge {
  constructor(defaultSigner, defaultProvider, signers, providers) {
    super(defaultSigner, defaultProvider);

    signers.forEach((signer, index) => {
      ethers.utils.defineReadOnly(
        this,
        `signer${capitalizeString(convertNumberstoNamed(index + 1))}`,
        signer
      );
    });

    providers.forEach((provider, index) => {
      ethers.utils.defineReadOnly(
        this,
        `provider${capitalizeString(convertNumberstoNamed(index + 1))}`,
        provider || null
      );
    });

    this.numProviders = providers.length;
  }

  send = async (...args) => {
    console.debug("send called", ...args);
    console.log("args -------", args);
    const isCallbackForm =
      typeof args[0] === "object" && typeof args[1] === "function";
    let callback;
    let method;
    let params;
    if (isCallbackForm) {
      callback = args[1];
      method = args[0].method;
      params = args[0].params;
    } else {
      method = args[0];
      params = args[1];
    }

    if (method === "wallet_switchEthereumChain") {
      console.debug(
        "send called with method wallet_switchEthereumChain",
        ...args
      );
      console.log("args -------", args);

      const chainId = args[1][0].chainId;

      for (let i = 0; i < this.numProviders; i++) {
        const p =
          this[`provider${capitalizeString(convertNumbersToNamed(i + 1))}`];
        const s =
          this[`signer${capitalizeString(convertNumbersToNamed(i + 1))}`];
        if (p.chainId === chainId) {
          this.provider = p;
          this.signer = s;

          return null;
        }
      }

      // default to signer one if hex is wrong
      this.provider = this.providerOne;
      this.signer = this.signerOne;

      return null;
    }

    // Implemented by UMA
    if (method === "eth_call") {
      const req = ethers.providers.JsonRpcProvider.hexlifyTransaction(
        params[0],
        args[1][0]
      );

      return await this.provider.call(req, params[1]);
    }

    if (method === "eth_chainId") {
      const result = await this.provider.getNetwork();

      return result.chainId;
    }

    if (method === "eth_sendTransaction") {
      if (!this.signer) {
        return throwUnsupported("eth_sendTransaction requires an account");
      }

      const req = ethers.providers.JsonRpcProvider.hexlifyTransaction(
        params[0],
        args[1][0]
      );
      const tx = await this.signer.sendTransaction(req);
      return tx.hash;
    }

    // Uniswap's original code
    if (method === "eth_requestAccounts" || method === "eth_accounts") {
      if (isCallbackForm) {
        callback({ result: [TEST_ADDRESS_NEVER_USE] });
      } else {
        return Promise.resolve([TEST_ADDRESS_NEVER_USE]);
      }
    }

    try {
      const result = await super.send(method, params);
      console.debug("result received", method, params, result);
      if (isCallbackForm) {
        callback(null, { result });
      } else {
        return result;
      }
    } catch (error) {
      if (isCallbackForm) {
        callback(error, null);
      } else {
        throw error;
      }
    }
  };
}

export default function createCustomizedBridgeMultiChain() {
  const signers = [];
  const providers = [];
  const ethProvider = new ethers.getDefaultProvider("http://127.0.0.1:8545");
  const ethSigner = new Wallet(PRIVATE_KEY_TEST_NEVER_USE, ethProvider);
  ethProvider.chainId = MAINNET_CHAINID;
  ethSigner.chainId = MAINNET_CHAINID;

  signers.push(ethSigner);
  providers.push(ethProvider);

  const optProvider = new ethers.getDefaultProvider("http://127.0.0.1:9545");
  const optSigner = new Wallet(PRIVATE_KEY_TEST_NEVER_USE, optProvider);

  optProvider.chainId = OPTIMISM_MAINNET_CHAINID;
  optSigner.chainId = OPTIMISM_MAINNET_CHAINID;

  signers.push(optSigner);
  providers.push(optProvider);

  const optKovanProvider = new ethers.getDefaultProvider(
    "http://127.0.0.1:9546"
  );

  const optKovanSigner = new Wallet(
    PRIVATE_KEY_TEST_NEVER_USE,
    optKovanProvider
  );

  optKovanProvider.chainId = OPTIMISM_KOVAN_CHAINID;
  optKovanSigner.chainId = OPTIMISM_KOVAN_CHAINID;

  signers.push(optKovanSigner);
  providers.push(optKovanProvider);

  const arbitrumRinkebyProvider = new ethers.getDefaultProvider(
    "http://127.0.0.1:9548"
  );
  const arbitrumRinkebySigner = new Wallet(
    PRIVATE_KEY_TEST_NEVER_USE,
    arbitrumRinkebyProvider
  );

  arbitrumRinkebyProvider.chainId = ARB_RINKEBY_CHAINID;
  arbitrumRinkebySigner.chainId = ARB_RINKEBY_CHAINID;

  signers.push(arbitrumRinkebySigner);
  providers.push(arbitrumRinkebyProvider);

  console.log("signers", signers, "providers", providers);
  return new CustomizedBridgeMultiChain(
    ethSigner,
    ethProvider,
    signers,
    providers
  );
}
