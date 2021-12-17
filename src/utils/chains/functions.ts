import { ChainId, CHAINS_METADATA } from "./constants";

export const defaultConstructExplorerLink =
  (explorerUrl: string) => (txHash: string) =>
    `${explorerUrl}/tx/${txHash}`;

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
