import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { DEFAULT_FROM_CHAIN_ID } from "utils";
import { update } from "./connection";

type Transaction = ethers.Transaction & { meta?: any };
type Account = {
  transactions: Record<string, Transaction>;
  balances: Record<string, ethers.BigNumber>;
};
type ChainState = Record<string, Account>;
type State = {
  currentChainId: number;
  currentAccount: string;
  chains: Record<number, ChainState>;
};

const initialState: State = {
  currentChainId: DEFAULT_FROM_CHAIN_ID,
  currentAccount: "",
  chains: {
    1: {},
    42: {},
    4: {},
    10: {},
    69: {},
    42161: {},
    421611: {},
    1337: {},
  },
};

type ChangeBalancesPayload = {
  chainId: number;
  address: string;
  balances: Record<string, ethers.BigNumber>;
};

type ChangeTransactionsPayload = {
  chainId: number;
  address: string;
  transaction: Transaction;
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    balances: (state, action: PayloadAction<ChangeBalancesPayload>) => {
      const { address, balances, chainId } = action.payload;

      state.chains[chainId][address] = {
        ...state.chains[chainId][address],
        balances,
      };
      return state;
    },
    transactions: (state, action: PayloadAction<ChangeTransactionsPayload>) => {
      const { address, transaction, chainId } = action.payload;
      if (!transaction.hash) {
        return state;
      }

      state.chains[chainId][address] = {
        ...state.chains[chainId][address],
        transactions: {
          ...state.chains[chainId][address].transactions,
          [transaction.hash]: transaction,
        },
      };

      return state;
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(
        (action) =>
          action.type === update.type && Boolean(action.payload.account),
        (state, action: PayloadAction<{ account: string }>) => {
          const { account } = action.payload;
          state.currentAccount = account;
          return state;
        }
      )
      .addMatcher(
        (action) =>
          action.type === update.type && Boolean(action.payload.chainId),
        (state, action: PayloadAction<{ chainId: number }>) => {
          const { chainId } = action.payload;
          state.currentChainId = chainId;
          return state;
        }
      ),
});

const { actions, reducer } = globalSlice;
// Extract and export each action creator by name
export const { balances, transactions } = actions;
// Export the reducer, either as a default or named export
export default reducer;
