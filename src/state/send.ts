import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { update } from "./connection";
import { toggle as toggleConfirmationScreen } from "./deposits";

import {
  ChainId,
  CHAINS_SELECTION,
  DEFAULT_FROM_CHAIN_ID,
  DEFAULT_TO_CHAIN_ID,
  getAddress,
  getBridgeableTokens,
  UnreachableChainError,
} from "utils";

type State = {
  token: string;
  amount: ethers.BigNumber;
  toChain: ChainId;
  fromChain: ChainId;
  toAddress?: string;
  error?: Error;
};

const initialState: State = {
  token: ethers.constants.AddressZero,
  amount: ethers.constants.Zero,
  toChain: DEFAULT_TO_CHAIN_ID,
  fromChain: DEFAULT_FROM_CHAIN_ID,
};

const sendSlice = createSlice({
  name: "send",
  initialState,
  reducers: {
    token: (state, action: PayloadAction<Pick<State, "token">>) => {
      state.token = action.payload.token;
      return state;
    },
    amount: (state, action: PayloadAction<Pick<State, "amount">>) => {
      state.amount = action.payload.amount;
      return state;
    },
    toChain: (state, action: PayloadAction<Pick<State, "toChain">>) => {
      const { reachableChains } = CHAINS_SELECTION[state.fromChain];
      if (!reachableChains.includes(action.payload.toChain)) {
        throw new UnreachableChainError(
          action.payload.toChain,
          state.fromChain
        );
      }
      state.toChain = action.payload.toChain;
      const bridgeableTokens = getBridgeableTokens(
        state.fromChain,
        state.toChain
      );
      // If the token currently selected is not bridgeable for this chain, set it to the first bridgeable token
      if (!bridgeableTokens.some((t) => t.address === state.token)) {
        state.token = bridgeableTokens[0].address;
      }
      return state;
    },
    fromChain: (state, action: PayloadAction<Pick<State, "fromChain">>) => {
      state.fromChain = action.payload.fromChain;
      const { reachableChains } = CHAINS_SELECTION[state.fromChain];
      if (!reachableChains.includes(state.toChain)) {
        state.toChain = reachableChains[0];
      }
      const bridgeableTokens = getBridgeableTokens(
        state.fromChain,
        state.toChain
      );
      // If the token currently selected is not bridgeable for this chain, set it to the first bridgeable token
      if (!bridgeableTokens.some((t) => t.address === state.token)) {
        state.token = bridgeableTokens[0].address;
      }
      return state;
    },
    toAddress: (
      state,
      action: PayloadAction<Required<Pick<State, "toAddress">>>
    ) => {
      state.toAddress = action.payload.toAddress;
      return state;
    },
    error: (state, action: PayloadAction<Pick<State, "error">>) => {
      state.error = action.payload.error;
      return state;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(update, (state, action) => {
        // since this is hooked in from a connection update, we need to treat the address the same way. Onboard is all lowercase.
        state.toAddress = action.payload.account
          ? getAddress(action.payload.account)
          : state.toAddress;
        return state;
      })
      .addCase(toggleConfirmationScreen, (state, action) => {
        // If the confirmation screen is closed, reset some values in the state.
        if (action.payload.showConfirmationScreen === false) {
          state = {
            ...state,
            amount: ethers.constants.Zero,
            error: undefined,
          };
        }
        return state;
      }),
});

export const { actions, reducer } = sendSlice;
// Extract and export each action creator by name
export const { token, amount, fromChain, toChain, toAddress, error } = actions;
// Export the reducer, either as a default or named export
export default reducer;
