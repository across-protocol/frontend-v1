import assert from "assert";
import debounce from "lodash-es/debounce";
import throttle from "lodash-es/throttle";
import { clients } from "@uma/sdk";
import { ethers, Signer, BigNumberish, BigNumber } from "ethers";
import { toWeiSafe } from "./weiMath";

export const DEFAULT_GAS_PRICE = toWeiSafe(
  process.env.REACT_APP_DEFAULT_GAS_PRICE || "400",
  9
);
export const GAS_PRICE_BUFFER = toWeiSafe(
  process.env.REACT_APP_GAS_PRICE_BUFFER || "1",
  9
);
// Rounded up from a mainnet transaction sending eth gas limit
export const ADD_LIQUIDITY_ETH_GAS = ethers.BigNumber.from(100000);

export const ADD_LIQUIDITY_ETH_GAS_ESTIMATE = estimateGas(
  ADD_LIQUIDITY_ETH_GAS,
  DEFAULT_GAS_PRICE,
  GAS_PRICE_BUFFER
);

// for a dynamic gas estimation
export function estimateGas(
  gas: BigNumberish,
  gasPriceWei: BigNumberish,
  buffer: BigNumberish = BigNumber.from("0")
) {
  return BigNumber.from(gas).mul(BigNumber.from(gasPriceWei).add(buffer));
}

// this could be replaced eventually with a better gas estimator
export async function getGasPrice(
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  const fees = await provider.getFeeData();
  return fees.maxFeePerGas || fees.gasPrice || (await provider.getGasPrice());
}

// calculate exact amount of gas needed for tx
export async function gasForAddEthLiquidity(
  signer: Signer,
  bridgeAddress: string,
  balance: BigNumberish
) {
  return clients.bridgePool
    .connect(bridgeAddress, signer)
    .estimateGas.addLiquidity(balance, { value: balance });
}

// combine all gas values to get a good gas estimate
export async function estimateGasForAddEthLiquidity(
  signer: Signer,
  bridgeAddress: string,
  balance: BigNumberish
) {
  assert(signer.provider, "requires signer with provider");
  const gasPrice = await getGasPrice(signer.provider);
  const gas = await gasForAddEthLiquidity(signer, bridgeAddress, balance);
  return estimateGas(gas, gasPrice);
}

// debounce and throttle this to prevent hammering call during typing or spamming max button
export const estimateGasForAddEthLiquidityDebounce = debounce(
  throttle(estimateGasForAddEthLiquidity, 1000),
  100,
  { leading: true, trailing: true }
);
