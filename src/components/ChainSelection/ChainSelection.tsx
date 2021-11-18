import React, { useState, useEffect } from "react";
import { onboard } from "utils";
import { useConnection, useSend } from "state/hooks";
import { CHAINS, switchChain, ChainId } from "utils";
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
import { CHAINS_SELECTION } from "utils/constants";
import { actions } from "state/send";
import { useAppDispatch, useAppSelector } from "state/hooks";

const ChainSelection: React.FC = () => {
  const { init } = onboard;
  const { isConnected, provider } = useConnection();
  const { hasToSwitchChain, fromChain } = useSend();
  const sendState = useAppSelector((state) => state.send);
  const [currentlySelectedChain, setCurrentlySelectedChain] = useState(
    CHAINS_SELECTION[1]
  );
  const dispatch = useAppDispatch();
  const buttonText = hasToSwitchChain
    ? `Switch to ${CHAINS[fromChain].name}`
    : !isConnected
    ? "Connect Wallet"
    : null;

  const handleClick = () => {
    if (!provider) {
      init();
    } else if (hasToSwitchChain) {
      switchChain(provider, fromChain);
    }
  };

  // When redux state changes, make sure local inputs change.
  useEffect(() => {
    if (sendState.toChain === ChainId.MAINNET) {
      setCurrentlySelectedChain(CHAINS_SELECTION[0]);
    } else {
      setCurrentlySelectedChain(CHAINS_SELECTION[3]);
    }
  }, [sendState.toChain]);

  const {
    isOpen,
    selectedItem,
    getLabelProps,
    getToggleButtonProps,
    getItemProps,
    getMenuProps,
  } = useSelect({
    items: CHAINS_SELECTION,
    defaultSelectedItem: CHAINS_SELECTION[1],
    selectedItem: currentlySelectedChain,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setCurrentlySelectedChain(selectedItem);
        const nextState = { ...sendState, fromChain: selectedItem.chainId };
        dispatch(actions.fromChain(nextState));
        const nsToChain = { ...sendState, toChain: ChainId.MAINNET };
        if (selectedItem.chainId === ChainId.MAINNET) {
          nsToChain.toChain = ChainId.OPTIMISM;
          dispatch(actions.toChain(nsToChain));
        }
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
              CHAINS_SELECTION.map((t, index) => {
                return (
                  <Item
                    className={t === currentlySelectedChain ? "disabled" : ""}
                    {...getItemProps({ item: t, index })}
                    key={t.chainId}
                  >
                    <Logo src={t.logoURI} alt={t.name} />
                    <div>{t.name}</div>
                    <span className="layer-type">
                      {t.name !== "Ether" ? "L2" : "L1"}
                    </span>
                  </Item>
                );
              })}
          </Menu>
        </InputGroup>
        {(hasToSwitchChain || !isConnected) && (
          <ConnectButton onClick={handleClick}>{buttonText}</ConnectButton>
        )}
      </Wrapper>
    </Section>
  );
};
export default ChainSelection;
