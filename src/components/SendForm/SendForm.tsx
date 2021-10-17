import React from "react";

import {
  Section,
  AccentSection,
  SendWrapper,
  Info,
  SendButton,
} from "./SendForm.styles";
import ChainSelection from "../ChainSelection";
import CoinSelection from "../CoinSelection";
import AddressSelection from "../AddressSelection";
import { useConnection, useGlobal, useSelectedSendArgs } from "state/hooks";
import type { Transfer } from "state/transfers";
import { useSend } from "hooks";
import { networkFromChainId, getFees, COIN_LIST, formatUnits } from "utils";
import { useBridgeFees } from "state/chain";
import { ethers } from "ethers";

const ZERO = ethers.constants.Zero;
type Props = {
  onSend: (transfer: Transfer) => void;
};

const SendForm: React.FC<Props> = ({ onSend }) => {
  const { isConnected, signer } = useConnection();
  const { currentChainId, currentAccount } = useGlobal();
  const { fromChain, toChain, amount, address, asset } = useSelectedSendArgs();
  const { send } = useSend();
  const { data: fees } = useBridgeFees({ depositAmount: amount, token: asset });

  const assetToken = COIN_LIST[fromChain].find((c) => c.address === asset);
  const assetSymbol = assetToken?.symbol ?? "Unkwown";
  const assetDecimals = assetToken?.decimals ?? 18;

  const { totalFee, amountAfterFees } = getFees(amount, {
    instantRelayFee: fees?.instantRelayFee ?? ZERO,
    slowRelayFee: fees?.slowRelayFee ?? ZERO,
    lpFeePct: fees?.lpFee ?? ZERO,
  });

  const isCorrectlyConnected = isConnected && currentChainId === fromChain;
  const disableButton = !isCorrectlyConnected;
  const buttonMsg = isConnected ? "Send" : "Connect Wallet";
  const handleSend = () => {
    send({
      signer,
      l1Recipient: address ?? currentAccount,
      l2Token: asset,
      amount,
    });
  };
  return (
    <>
      <Section>
        <ChainSelection />
      </Section>
      <Section>
        <CoinSelection />
      </Section>
      <Section>
        <AddressSelection />
      </Section>
      <AccentSection>
        <SendWrapper>
          <Info>
            <div>Time to {networkFromChainId(toChain)}</div>
            <div>~1-3 minutes</div>
          </Info>
          <Info>
            <div>Bridge Fee</div>
            <div>
              {formatUnits(totalFee, assetDecimals)} {assetSymbol}
            </div>
          </Info>
          <Info>
            <div>You will get</div>
            <div>
              {formatUnits(amountAfterFees, assetDecimals)} {assetSymbol}
            </div>
          </Info>

          <SendButton disabled={disableButton} onClick={handleSend}>
            {buttonMsg}
          </SendButton>
        </SendWrapper>
      </AccentSection>
    </>
  );
};

export default SendForm;
