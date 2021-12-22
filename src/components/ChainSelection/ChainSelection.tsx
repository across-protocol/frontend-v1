import React from "react";
import { onboard } from "utils";
import { useConnection, useSend } from "state/hooks";
import {
  CHAINS,
  switchChain,
  ChainId,
  UnsupportedChainIdError,
  CHAINS_SELECTION,
} from "utils";

import { Section, SectionTitle } from "../Section";
import {
  Wrapper,
  RoundBox,
  Logo,
  ConnectButton,
  Menu,
  Item,
  ToggleIcon,
  ToggleButton,
  InputGroup,
  ToggleChainName,
} from "./ChainSelection.styles";
import { useSelect } from "downshift";
import { actions } from "state/send";
import { useAppDispatch } from "state/hooks";

const ChainSelection: React.FC = () => {
  const { init } = onboard;
  const { isConnected, provider, chainId, error } = useConnection();
  const { fromChain } = useSend();
  const dispatch = useAppDispatch();

  const wrongNetworkSend =
    provider &&
    chainId &&
    (error instanceof UnsupportedChainIdError || chainId !== fromChain);

  const buttonText = wrongNetworkSend
    ? `Switch to ${CHAINS[fromChain].name}`
    : !isConnected
    ? "Connect Wallet"
    : null;

  const handleClick = () => {
    if (!provider) {
      init();
    } else if (wrongNetworkSend) {
      switchChain(provider, fromChain);
    }
  };

  const {
    isOpen,
    selectedItem,
    getLabelProps,
    getToggleButtonProps,
    getItemProps,
    getMenuProps,
  } = useSelect({
    items: Object.values(CHAINS_SELECTION),
    defaultSelectedItem: CHAINS_SELECTION[fromChain],
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        dispatch(actions.fromChain({ fromChain: selectedItem.chainId }));
      }
    },
  });

  return (
    <Section>
      <Wrapper>
        <SectionTitle>From</SectionTitle>
        <InputGroup>
          <RoundBox as="label" {...getLabelProps()}>
            <ToggleButton type="button" {...getToggleButtonProps()}>
              <Logo src={selectedItem?.logoURI} alt={selectedItem?.name} />
              <ToggleChainName>{selectedItem?.name}</ToggleChainName>
              <ToggleIcon />
            </ToggleButton>
          </RoundBox>
          <Menu isOpen={isOpen} {...getMenuProps()}>
            {isOpen &&
              Object.values(CHAINS_SELECTION).map((t, index) => {
                return (
                  <Item
                    {...getItemProps({ item: t, index })}
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    exit={{ y: -10 }}
                    key={t.chainId}
                  >
                    <Logo src={t.logoURI} alt={t.name} />
                    <div>{t.name}</div>
                    <span className="layer-type">
                      {t.chainId !== ChainId.MAINNET ? "L2" : "L1"}
                    </span>
                  </Item>
                );
              })}
          </Menu>
        </InputGroup>
        {(wrongNetworkSend || !isConnected) && (
          <ConnectButton onClick={handleClick}>{buttonText}</ConnectButton>
        )}
      </Wrapper>
    </Section>
  );
};
export default ChainSelection;
