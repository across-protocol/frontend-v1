import { ethers } from "ethers";
import { CHAINS_METADATA, ChainId } from "./chains/constants";

export async function switchChain(
  provider: ethers.providers.JsonRpcProvider,
  chainId: ChainId
) {
  try {
    await provider.send("wallet_switchEthereumChain", [
      {
        chainId: ethers.utils.hexValue(chainId),
      },
    ]);
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await provider.send("wallet_addEthereumChain", [
          {
            chainId: ethers.utils.hexValue(chainId),
            chainName: CHAINS_METADATA[chainId].name,
            rpcUrls: [CHAINS_METADATA[chainId].rpcUrl],
            blockExplorerUrls: [CHAINS_METADATA[chainId].explorerUrl],
            nativeCurrency: CHAINS_METADATA[chainId].nativeCurrency,
          },
        ]);
      } catch (addError) {
        console.error(`Failed to add ${CHAINS_METADATA[chainId].name}`);
      }
    } else {
      console.error(`Failed to switch to ${CHAINS_METADATA[chainId].name}`);
    }
  }
}

export function isSupportedChainId(chainId: number): chainId is ChainId {
  return chainId in ChainId;
}
