import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
// import { Eip1193Bridge } from "@ethersproject/experimental";
import { Eip1193Bridge } from "./eip1193-bridge";
import { ethers } from "ethers";

const PRIVATE_KEY_TEST_NEVER_USE =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// address of the above key
export const TEST_ADDRESS_NEVER_USE = new Wallet(PRIVATE_KEY_TEST_NEVER_USE)
  .address;

const SIXTY_NINE_IN_HEX = "0x45";
const ONE_IN_HEX = "0xa";

class CustomizedBridgeMultiChain extends Eip1193Bridge {
  constructor(
    signerOne,
    providerOne,
    signerTwo,
    providerTwo,
    signerThree,
    providerThree
  ) {
    super(signerOne, providerOne);

    ethers.utils.defineReadOnly(this, "signerOne", signerOne);
    ethers.utils.defineReadOnly(this, "providerOne", providerOne || null);

    ethers.utils.defineReadOnly(this, "signerTwo", signerTwo);
    ethers.utils.defineReadOnly(this, "providerTwo", providerTwo || null);

    ethers.utils.defineReadOnly(this, "signerThree", signerThree);
    ethers.utils.defineReadOnly(this, "providerThree", providerThree || null);
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

      console.log("this", this);
      if (chainId === SIXTY_NINE_IN_HEX) {
        console.log("in the 69 chainId cond?");
        this.signer = this.signerThree;
        this.provider = this.providerThree;

        return null;
      }

      if (chainId === ONE_IN_HEX) {
        this.signer = this.signerOne;
        this.provider = this.providerOne;

        return null;
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
  const ethProvider = new ethers.getDefaultProvider("http://127.0.0.1:8545");

  const ethSigner = new Wallet(PRIVATE_KEY_TEST_NEVER_USE, ethProvider);

  const optProvider = new ethers.getDefaultProvider("http://127.0.0.1:9545");
  const optSigner = new Wallet(PRIVATE_KEY_TEST_NEVER_USE, optProvider);

  const optKovanProvider = new ethers.getDefaultProvider(
    "http://127.0.0.1:9546"
  );

  const optKovanSigner = new Wallet(
    PRIVATE_KEY_TEST_NEVER_USE,
    optKovanProvider
  );

  return new CustomizedBridgeMultiChain(
    ethSigner,
    ethProvider,
    optSigner,
    optProvider,
    optKovanSigner,
    optKovanProvider
  );
}
