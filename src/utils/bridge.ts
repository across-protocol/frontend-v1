import { clients } from "@uma/sdk";
import { ethers } from "ethers";
import { PROVIDERS, ADDRESSES } from "./constants";

export function getDepositBox(
  chainId: number,
  signerOrProvider?: ethers.providers.BaseProvider | ethers.Signer
): clients.bridgeDepositBox.Instance {
  return clients.bridgeDepositBox.connect(
    ADDRESSES[chainId].BRIDGE,
    signerOrProvider ?? PROVIDERS[chainId]
  );
}

export async function getDeposits(chainId: number) {
  const depositBox = getDepositBox(chainId);

  const events = await depositBox.queryFilter({});
  const state: clients.bridgeDepositBox.EventState =
    clients.bridgeDepositBox.getEventState(events);

  return state;
}

export type RelayFees = {
  instantRelayFee: ethers.BigNumber;
  slowRelayFee: ethers.BigNumber;
};

// This is 5bps so it will always have to be divided by 10,000 to get the actual fee
const HARDCODED_INSTANT_RELAY_FEE = ethers.BigNumber.from("5");
const HARDCODED_SLOW_RELAY_FEE = ethers.BigNumber.from("5");
export async function getRelayFees(): Promise<RelayFees> {
  return {
    instantRelayFee: HARDCODED_INSTANT_RELAY_FEE,
    slowRelayFee: HARDCODED_SLOW_RELAY_FEE,
  };
}

export async function getLpFeePct(): Promise<ethers.BigNumber> {
  return ethers.constants.Zero;
}

export function getFees(
  amount: ethers.BigNumber,
  fees: RelayFees & { lpFeePct: ethers.BigNumber }
) {
  const instantRelayFee = amount.mul(fees.instantRelayFee).div(10e4);
  const slowRelayFee = amount.mul(fees.slowRelayFee).div(10e4);
  const lpFee = amount.mul(fees.lpFeePct).div(10e4);
  const totalFee = instantRelayFee.add(slowRelayFee).add(lpFee);
  return {
    totalFee,
    amountAfterFees: amount.sub(totalFee),
  };
}
