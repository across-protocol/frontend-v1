import React, { useState, useEffect } from "react";
import { XOctagon } from "react-feather";
import { useConnection, useSend } from "state/hooks";
import { CHAINS, shortenAddress, isValidAddress, ChainId } from "utils";
import { SectionTitle } from "../Section";
import Dialog from "../Dialog";
import { SecondaryButton } from "../Buttons";
import {
  LastSection,
  Wrapper,
  Logo,
  ChangeWrapper,
  ChangeButton,
  InputWrapper,
  Input,
  ClearButton,
  CancelButton,
  ButtonGroup,
  InputError,
  Menu,
  Item,
  ToggleIcon,
  ToggleButton,
  InputGroup,
  RoundBox,
  ToggleChainName,
  Address,
} from "./AddressSelection.styles";
import { useSelect } from "downshift";
import { CHAINS_SELECTION } from "utils/constants";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { actions } from "state/send";

const AddressSelection: React.FC = () => {
  const { isConnected } = useConnection();
  const { toChain, toAddress, setToAddress } = useSend();
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const sendState = useAppSelector((state) => state.send);
  const [currentlySelectedChain, setCurrentlySelectedChain] = useState(
    CHAINS_SELECTION[3]
  );

  // When redux state changes, make sure local inputs change.
  useEffect(() => {
    if (sendState.fromChain === ChainId.MAINNET) {
      setCurrentlySelectedChain(CHAINS_SELECTION[0]);
    } else {
      setCurrentlySelectedChain(CHAINS_SELECTION[3]);
    }
  }, [sendState.fromChain]);
  const {
    isOpen,
    selectedItem,
    getLabelProps,
    getToggleButtonProps,
    getItemProps,
    getMenuProps,
  } = useSelect({
    items: CHAINS_SELECTION,
    defaultSelectedItem: CHAINS_SELECTION[3],
    selectedItem: currentlySelectedChain,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setCurrentlySelectedChain(selectedItem);
        const nextState = { ...sendState, toChain: selectedItem.chainId };
        dispatch(actions.fromChain(nextState));
        const nsToChain = { ...sendState, fromChain: ChainId.MAINNET };
        if (selectedItem.chainId === ChainId.MAINNET)
          nsToChain.fromChain = ChainId.OPTIMISM;
        dispatch(actions.toChain(nsToChain));
      }
    },
  });

  useEffect(() => {
    if (toAddress) {
      setAddress(toAddress);
    }
  }, [toAddress]);

  const toggle = () => {
    // modal is closing, reset address to the current toAddress
    if (!isConnected) return;
    if (open) setAddress(toAddress || address);
    setOpen((oldOpen) => !oldOpen);
  };
  const clearInput = () => {
    setAddress("");
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(evt.target.value);
  };
  const isValid = !address || isValidAddress(address);
  const handleSubmit = () => {
    if (isValid && address) {
      setToAddress({ toAddress: address });
      toggle();
    }
  };

  return (
    <LastSection>
      <Wrapper>
        <SectionTitle>To</SectionTitle>
        <InputGroup>
          <RoundBox as="label" {...getLabelProps()}>
            <ToggleButton type="button" {...getToggleButtonProps()}>
              <Logo src={selectedItem?.logoURI} alt={selectedItem?.name} />
              <div>
                <ToggleChainName>
                  {selectedItem?.name === "Ether"
                    ? "Mainnet"
                    : selectedItem?.name}
                </ToggleChainName>

                {toAddress && <Address>{shortenAddress(toAddress)}</Address>}
              </div>
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
        <ChangeWrapper onClick={toggle}>
          <ChangeButton className={!isConnected ? "disabled" : ""}>
            Change account
          </ChangeButton>
        </ChangeWrapper>
      </Wrapper>
      <Dialog isOpen={open} onClose={toggle}>
        <h3>Send To</h3>
        <div>Address on {CHAINS[toChain].name}</div>
        <InputWrapper>
          <Input onChange={handleChange} value={address} />
          <ClearButton onClick={clearInput}>
            <XOctagon
              fill="var(--color-gray-300)"
              stroke="var(--color-white)"
            />
          </ClearButton>
          {!isValid && <InputError>Not a valid address</InputError>}
        </InputWrapper>

        <ButtonGroup>
          <CancelButton onClick={toggle}>Cancel</CancelButton>
          <SecondaryButton
            onClick={handleSubmit}
            disabled={!isValid || !address}
          >
            Save Changes
          </SecondaryButton>
        </ButtonGroup>
      </Dialog>
    </LastSection>
  );
};

export default AddressSelection;
