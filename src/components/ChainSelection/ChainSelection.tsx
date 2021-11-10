import React, { useState } from "react";
import { onboard } from "utils";
import { useConnection, useSend } from "state/hooks";
import { CHAINS, switchChain } from "utils";
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
} from "./ChainSelection.styles";
import { useSelect } from "downshift";
import { CHAINS_SELECTION } from "utils/constants";

const ChainSelection: React.FC = () => {
  const { init } = onboard;
  const { isConnected, provider } = useConnection();
  const { hasToSwitchChain, fromChain } = useSend();
  const [, setCurrentChainDropdown] = useState(CHAINS_SELECTION[0]);

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

  const {
    isOpen,
    selectedItem,
    getLabelProps,
    getToggleButtonProps,
    getItemProps,
    getMenuProps,
  } = useSelect({
    items: CHAINS_SELECTION,
    defaultSelectedItem: CHAINS_SELECTION[0],
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setCurrentChainDropdown(selectedItem);
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
              <div>{selectedItem?.name}</div>
              <ToggleIcon />
            </ToggleButton>
          </RoundBox>
          <Menu {...getMenuProps()}>
            {isOpen &&
              CHAINS_SELECTION.map((t, index) => {
                return (
                  <Item {...getItemProps({ item: t, index })} key={t.chainId}>
                    <Logo src={t.logoURI} alt={t.name} />
                    <div>{t.name}</div>
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
