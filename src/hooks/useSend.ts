import { ERC20Ethers__factory } from "@uma/contracts-frontend";
import { ethers } from "ethers";
import React, { useCallback } from "react";
import { useGlobal } from "state/hooks";
import { COIN_LIST, getDepositBox, PROVIDERS, getRelayFees } from "utils";

type SendArgs = {
  signer?: ethers.Signer;
  l1Recipient: string;
  l2Token: string;
  amount: ethers.BigNumber;
};

export function useSend() {
  const { addTransaction } = useGlobal();
  const [error, setError] = React.useState<Error>();
  const send = useCallback(
    async ({ signer, l1Recipient, l2Token: _l2Token, amount }: SendArgs) => {
      if (!signer) {
        console.warn("Missing signer in useSend");
        return;
      }
      try {
        const chainId = await signer.getChainId();
        const account = await signer.getAddress();
        const depositBox = getDepositBox(chainId, signer);
        const isETH = _l2Token === ethers.constants.AddressZero;

        const l2Token = isETH
          ? (COIN_LIST[chainId].find((c) => c.symbol === "WETH")
              ?.address as string)
          : _l2Token;

        const ethToSend: ethers.BigNumber = isETH
          ? amount
          : ethers.BigNumber.from(0);

        if (!isETH) {
          const token = ERC20Ethers__factory.connect(l2Token, signer);
          const allowance = await token.allowance(account, depositBox.address);
          if (allowance.lt(amount)) {
            const approveTx = await token.approve(
              depositBox.address,
              ethers.constants.MaxUint256
            );
            addTransaction({
              chainId,
              address: account,
              transaction: { ...approveTx, meta: { label: "approve" } },
            });
          }
        }
        console.log(
          `Sending ${amount} ${l2Token} to ${l1Recipient}, isETH ${isETH}`
        );
        const lastBlock = await PROVIDERS[chainId].getBlock("latest");
        const { slowRelayFee, instantRelayFee } = await getRelayFees();
        const depositTx = await depositBox.deposit(
          l1Recipient,
          l2Token,
          amount,
          slowRelayFee,
          instantRelayFee,
          lastBlock.timestamp,
          {
            value: ethToSend,
          }
        );
        addTransaction({
          address: account,
          chainId,
          transaction: { ...depositTx, meta: { label: "deposit" } },
        });
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    },
    [addTransaction]
  );

  return { send, error };
}
