import { ethers } from "ethers";
import { CHAINS } from "utils";

export async function switchToChain(
  provider: ethers.providers.JsonRpcProvider,
  chainId: number
) {
  try {
    console.log("ChainId", chainId, "hexValue", ethers.utils.hexValue(chainId));
    await provider.send("wallet_switchEthereumChain", [
      {
        chainId: ethers.utils.hexValue(chainId),
      },
    ]);
  } catch (switchError: any) {
    console.log("switchError", switchError);
    if (switchError.code === 4902) {
      try {
        await provider.send("wallet_addEthereumChain", [
          {
            chainId: ethers.utils.hexValue(chainId),
            chainName: CHAINS[chainId].name,
            rpcUrls: [CHAINS[chainId].rpcUrl],
            blockExplorerUrls: [CHAINS[chainId].explorerUrl],
            nativeCurrency: CHAINS[chainId].nativeCurrency,
          },
        ]);
      } catch (addError) {
        console.error(`Failed to add ${CHAINS[chainId].name}`);
        throw switchError;
      }
    } else {
      console.error(`Failed to switch to ${CHAINS[chainId].name}`);
      throw switchError;
    }
  }
}

export function networkFromChainId(chainId: number) {
  switch (chainId) {
    case 1:
      return "mainnet";
    case 42:
      return "kovan";
    case 4:
      return "rinkeby";
    case 10:
      return "optimism";
    case 69:
      return "kovan optimism";
    case 42161:
      return "arbitrum one";
    case 421611:
      return "arbitrum rinkeby";
    default:
      return "unknown";
  }
}
