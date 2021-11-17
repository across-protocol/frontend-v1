import { useCallback, useMemo, useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ethers, BigNumber } from "ethers";
import type { Block } from "@ethersproject/abstract-provider";
import { bindActionCreators } from "redux";
import {
  getDepositBox,
  isValidAddress,
  TOKENS_LIST,
  TransactionError,
  ChainId,
  Timer,
} from "utils";
import type { RootState, AppDispatch } from "./";
import { update, disconnect, error as errorAction } from "./connection";
import {
  token as tokenAction,
  amount as amountAction,
  fromChain as fromChainAction,
  toChain as toChainAction,
  toAddress as toAddressAction,
  error as sendErrorAction,
} from "./send";
import chainApi, { useAllowance, useBridgeFees } from "./chainApi";
import { add } from "./transactions";
import { deposit as depositAction, toggle } from "./deposits";
import { setTime } from "./timers";
import { store } from ".";

const FEE_ESTIMATION = "0.004";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// set a timer which updates by defalt every 30 seconds
Timer((time) => store.dispatch(setTime(time)));

export function useConnection() {
  const { account, signer, provider, error, chainId, notify } = useAppSelector(
    (state) => state.connection
  );

  const dispatch = useAppDispatch();
  const actions = useMemo(
    () => bindActionCreators({ update, disconnect, errorAction }, dispatch),
    [dispatch]
  );

  const isConnected = !!chainId && !!signer && !!account;
  return {
    account,
    chainId,
    provider,
    signer,
    error,
    isConnected,
    setUpdate: actions.update,
    disconnect: actions.disconnect,
    setError: actions.errorAction,
    notify,
  };
}

export function useSend() {
  const { isConnected, chainId, account, signer, provider } = useConnection();
  const { fromChain, toChain, toAddress, amount, token, error } =
    useAppSelector((state) => state.send);
  const { time } = useAppSelector((state) => state.time);
  const dispatch = useAppDispatch();
  const actions = bindActionCreators(
    {
      tokenAction,
      amountAction,
      fromChainAction,
      toChainAction,
      toAddressAction,
      sendErrorAction,
    },
    dispatch
  );

  const { balance: balanceStr } = useBalance({
    chainId: fromChain,
    account,
    tokenAddress: token,
  });
  const balance = BigNumber.from(balanceStr);
  const depositBox = getDepositBox(fromChain);
  const { data: allowance } = useAllowance(
    {
      chainId: fromChain,
      token,
      owner: account!,
      spender: depositBox.address,
      amount,
    },
    { skip: !account || !isConnected || !depositBox }
  );
  const canApprove = balance.gte(amount) && amount.gte(0);
  const hasToApprove = allowance?.hasToApprove ?? false;

  const hasToSwitchChain = isConnected && fromChain !== chainId;

  const tokenSymbol =
    TOKENS_LIST[fromChain].find((t) => t.address === token)?.symbol ?? "";

  const { data: fees } = useBridgeFees(
    {
      amount,
      tokenSymbol,
      blockNumber: time,
    },
    { skip: tokenSymbol === "" || amount.lte(0) || time === undefined }
  );

  const canSend = useMemo(
    () =>
      fromChain &&
      toChain &&
      amount &&
      token &&
      fees &&
      toAddress &&
      isValidAddress(toAddress) &&
      !hasToApprove &&
      !hasToSwitchChain &&
      !error &&
      !fees.isAmountTooLow &&
      !fees.isLiquidityInsufficient &&
      balance
        .sub(
          token === "0x0000000000000000000000000000000000000000"
            ? BigNumber.from(ethers.utils.parseEther(FEE_ESTIMATION))
            : BigNumber.from("0")
        )
        .gte(amount),
    [
      fromChain,
      toChain,
      amount,
      token,
      fees,
      toAddress,
      hasToApprove,
      hasToSwitchChain,
      error,
      balance,
    ]
  );
  const send = useCallback(async () => {
    if (!signer || !canSend || !fees || !toAddress || !provider) {
      return {};
    }

    let block: Block | undefined = undefined;
    try {
      block = await provider.getBlock("latest");
      const depositBox = getDepositBox(fromChain, signer);
      const isETH = token === ethers.constants.AddressZero;
      const value = isETH ? amount : ethers.constants.Zero;
      const l2Token = isETH ? TOKENS_LIST[fromChain][0].address : token;
      const { instantRelayFee, slowRelayFee } = fees;
      const timestamp = block.timestamp;

      const tx = await depositBox.deposit(
        toAddress,
        l2Token,
        amount,
        slowRelayFee.pct,
        instantRelayFee.pct,
        timestamp,
        { value }
      );
      return { tx, fees };
    } catch (e) {
      throw new TransactionError(
        depositBox.address,
        "deposit",
        toAddress,
        token,
        amount,
        fees.slowRelayFee.pct,
        fees.instantRelayFee.pct,
        block?.timestamp
      );
    }
  }, [
    amount,
    canSend,
    depositBox.address,
    fees,
    fromChain,
    signer,
    toAddress,
    token,
    provider,
  ]);

  return {
    fromChain,
    toChain,
    toAddress,
    amount,
    token,
    error,
    setToken: actions.tokenAction,
    setAmount: actions.amountAction,
    setFromChain: actions.fromChainAction,
    setToChain: actions.toChainAction,
    setToAddress: actions.toAddressAction,
    setError: actions.sendErrorAction,
    canSend,
    canApprove,
    hasToApprove,
    hasToSwitchChain,
    send,
  };
}

export function useTransactions() {
  const { transactions } = useAppSelector((state) => state.transactions);
  const dispatch = useAppDispatch();
  const actions = bindActionCreators({ add }, dispatch);
  return {
    transactions,
    addTransaction: actions.add,
  };
}

export function useDeposits() {
  const { deposit, showConfirmationScreen } = useAppSelector(
    (state) => state.deposits
  );
  const dispatch = useAppDispatch();
  const actions = bindActionCreators({ depositAction, toggle }, dispatch);
  return {
    deposit,
    showConfirmationScreen,
    toggle: actions.toggle,
    addDeposit: actions.depositAction,
  };
}

export {
  useAllowance,
  useBalances,
  useETHBalance,
  useBridgeFees,
} from "./chainApi";

export function useBalance(params: {
  chainId: ChainId;
  account?: string;
  tokenAddress: string;
}) {
  const { chainId, account, tokenAddress } = params;
  // const { data: balances, ...rest } = useBalances({ chainId, account });
  const [updateBalances, result] = chainApi.endpoints.balances.useLazyQuery();
  function refetch() {
    if (account) updateBalances({ chainId, account });
  }
  useEffect(refetch, [chainId, account, tokenAddress, updateBalances]);
  const tokenList = TOKENS_LIST[chainId];
  const selectedIndex = tokenList.findIndex(
    ({ address }) => address === tokenAddress
  );
  const balance = result?.data ? result.data[selectedIndex].toString() : "0";

  return {
    balance,
    refetch,
  };
}
