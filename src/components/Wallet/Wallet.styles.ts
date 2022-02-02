import styled from "@emotion/styled";
import { QUERIES } from "utils";
import { RoundBox } from "../Box";
import { SecondaryButton } from "../Buttons";

export const Wrapper = styled(RoundBox)`
  background-color: inherit;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0;
  &:hover {
    cursor: pointer;
  }
`;

export const ConnectButton = styled(SecondaryButton)`
  padding: 12px 16px;
  border: 1px solid transparent;
`;

export const Account = styled.div`
  background-color: var(--color-gray);
  color: var(--color-white);
  display: grid;
  place-items: center;
  padding: 0 10px;
  border-radius: 0 var(--radius) var(--radius) 0;
  border: 1px solid var(--color-gray);
  @media ${QUERIES.tabletAndUp} {
    padding: 0 30px;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-transform: capitalize;
  border-radius: var(--radius) 0 0 var(--radius);
  border: 1px solid var(--color-gray);
  padding: 5px 10px;
  white-space: nowrap;
  & > div {
    line-height: 1;
  }
  & > div:last-of-type {
    color: var(--color-gray-300);
    font-size: ${14 / 16}rem;
  }
  @media ${QUERIES.tabletAndUp} {
    padding: 10px 20px 5px;
  }
`;

export const UnsupportedNetwork = styled.div`
  background-color: rgba(45, 46, 51, 0.25);
  padding: 1rem 0.5rem;
`;

export const WalletModal = styled.div`
  position: absolute;
  background: #fff;
  border-radius: 16px;
  min-height: 100px;
  width: 300px;
  /* margin: 0 auto; */
  margin-top: 4px;
  margin-left: 4px;
  padding: 1rem;
`;

export const WalletModalHeader = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  text-indent: 2px;
`;

export const WalletModalAccount = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  text-indent: 2px;
`;

export const WalletModalChain = styled.div`
  text-indent: 2px;
  font-size: 0.75rem;
  font-weight: 400;
  border-bottom: 1px solid var(--color-gray-transparent);
  padding-bottom: 0.5rem;
`;

export const WalletModalDisconnect = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  text-indent: 2px;
  margin-top: 4px;
  color: var(--color-purple);
  &:hover {
    cursor: pointer;
  }
`;
