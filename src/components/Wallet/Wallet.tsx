import { onboard } from "utils";
import { FC, useState } from "react";
import { useConnection, useETHBalance } from "state/hooks";
import {
  DEFAULT_FROM_CHAIN_ID,
  CHAINS,
  shortenAddress,
  formatEther,
} from "utils";

import {
  Wrapper,
  Account,
  Info,
  ConnectButton,
  UnsupportedNetwork,
  WalletModal,
} from "./Wallet.styles";

const { init } = onboard;

const Wallet: FC = () => {
  const { account, isConnected, chainId } = useConnection();
  const [isOpen, setIsOpen] = useState(false);

  const { data: balance } = useETHBalance(
    { account: account ?? "", chainId: chainId ?? DEFAULT_FROM_CHAIN_ID },
    { skip: !isConnected }
  );

  if (account && !isConnected && !chainId) {
    return (
      <UnsupportedNetwork>
        Unsupported Network. Please swap networks.
      </UnsupportedNetwork>
    );
  }

  if (!isConnected) {
    return <ConnectButton onClick={init}>Connect Wallet</ConnectButton>;
  }

  return (
    <div>
      <Wrapper onClick={() => setIsOpen(!isOpen)}>
        <Info>
          <div>
            {formatEther(balance ?? "0")}{" "}
            {CHAINS[chainId ?? 1].nativeCurrency.symbol}
          </div>
          <div>{CHAINS[chainId ?? 1].name}</div>
        </Info>
        <Account>{shortenAddress(account ?? "")}</Account>
      </Wrapper>
      {isOpen && <WalletModal />}
    </div>
  );
};
export default Wallet;
