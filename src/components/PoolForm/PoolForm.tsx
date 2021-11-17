import { FC, useState, useEffect, useCallback } from "react";
import { ethers, BigNumber } from "ethers";
import Tabs from "../Tabs";
import AddLiquidityForm from "./AddLiquidityForm";
import RemoveLiquidityForm from "./RemoveLiquidityForm";
import { QuerySubState } from "@reduxjs/toolkit/dist/query/core/apiState";
import {
  Wrapper,
  Info,
  InfoText,
  ROIWrapper,
  ROIItem,
  Logo,
  TabContentWrapper,
  PositionWrapper,
  PositionBlock,
  PositionBlockItem,
  PositionBlockItemBold,
} from "./PoolForm.styles";
import {
  formatUnits,
  formatEtherRaw,
  max,
  numberFormatter,
  estimateGasForAddEthLiquidityThrottled,
  ADD_LIQUIDITY_ETH_GAS_ESTIMATE,
  toWeiSafe,
} from "utils";
import { useConnection } from "state/hooks";

interface Props {
  symbol: string;
  icon: string;
  decimals: number;
  apy: string;
  totalPoolSize: ethers.BigNumber;
  totalPosition: ethers.BigNumber;
  position: ethers.BigNumber;
  feesEarned: ethers.BigNumber;
  bridgeAddress: string;
  lpTokens: ethers.BigNumber;
  tokenAddress: string;
  ethBalance: QuerySubState<any> | null | undefined;
  erc20Balances: QuerySubState<any> | null | undefined;
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setDepositUrl: React.Dispatch<React.SetStateAction<string>>;
  balance: string;
  wrongNetwork?: boolean;
  // refetch balance
  refetchBalance: () => void;
  defaultTab: string;
  setDefaultTab: React.Dispatch<React.SetStateAction<string>>;
  utilization: string;
}

const PoolForm: FC<Props> = ({
  symbol,
  icon,
  decimals,
  totalPoolSize,
  totalPosition,
  apy,
  position,
  feesEarned,
  bridgeAddress,
  lpTokens,
  tokenAddress,
  setShowSuccess,
  setDepositUrl,
  balance,
  wrongNetwork,
  refetchBalance,
  defaultTab,
  setDefaultTab,
  utilization,
}) => {
  const [inputAmount, setInputAmount] = useState("");
  const [removeAmount, setRemoveAmount] = useState(0);
  const [error] = useState<Error>();
  const [formError, setFormError] = useState("");
  const [addLiquidityGas, setAddLiquidityGas] = useState<ethers.BigNumber>(
    ADD_LIQUIDITY_ETH_GAS_ESTIMATE
  );
  const { isConnected, provider, signer } = useConnection();

  const refetchAddLiquidityGas = useCallback(async () => {
    if (!provider || !signer || !isConnected || symbol !== "ETH") return "0";
    try {
      const gasEstimate =
        (await estimateGasForAddEthLiquidityThrottled(
          signer,
          bridgeAddress,
          balance
        )) || ADD_LIQUIDITY_ETH_GAS_ESTIMATE;
      setAddLiquidityGas(gasEstimate);
      return gasEstimate;
    } catch (err) {
      console.error("Warning: Unable to estimate gas", err);
      return ADD_LIQUIDITY_ETH_GAS_ESTIMATE;
    }
  }, [signer, provider, isConnected, bridgeAddress, balance, symbol]);

  // Validate input on change
  useEffect(() => {
    const value = inputAmount;
    try {
      if (Number(value) < 0) return setFormError("Cannot be less than 0.");
      if (value && balance) {
        const valueToWei = toWeiSafe(value, decimals);
        if (valueToWei.gt(balance)) {
          return setFormError("Liquidity amount greater than balance.");
        }
      }

      if (value && symbol === "ETH") {
        const valueToWei = toWeiSafe(value, decimals);
        if (valueToWei.add(addLiquidityGas).gt(balance)) {
          return setFormError("Transaction may fail due to insufficient gas.");
        }
      }
    } catch (e) {
      return setFormError("Invalid number.");
    }
    // clear form if no errors were presented. All errors should return early.
    setFormError("");
  }, [inputAmount, balance, decimals, symbol, addLiquidityGas]);

  const addLiquidityOnChangeHandler = useCallback(
    (value: string) => {
      // this is debounced and throttled in the utility call, so we can call on every input change
      refetchAddLiquidityGas();
      setInputAmount(value);
    },
    [setInputAmount, refetchAddLiquidityGas]
  );

  const handleMaxClick = useCallback(() => {
    let value = ethers.utils.formatUnits(balance, decimals);
    if (symbol !== "ETH") return setInputAmount(value);
    refetchAddLiquidityGas()
      .then((approxGas) => {
        value = formatEtherRaw(
          max("0", BigNumber.from(balance).sub(approxGas))
        );
        setInputAmount(value);
      })
      .catch((err) => console.error("Error Maxing Adding Eth Liquidity", err));
  }, [balance, decimals, symbol, refetchAddLiquidityGas]);

  // if pool changes, set input value to "".
  useEffect(() => {
    setInputAmount("");
    setFormError("");
    setRemoveAmount(0);
  }, [bridgeAddress]);

  return (
    <Wrapper>
      <Info>
        <Logo src={icon} />
        <InfoText>{symbol} Pool</InfoText>
        <PositionWrapper>
          <PositionBlock>
            <PositionBlockItem>My deposit</PositionBlockItem>
            <PositionBlockItem>
              {formatUnits(position, decimals)} {symbol}
            </PositionBlockItem>
          </PositionBlock>
          <PositionBlock>
            <PositionBlockItem>Fees earned</PositionBlockItem>
            <PositionBlockItem>
              {Number(formatUnits(feesEarned, decimals)) > 0
                ? formatUnits(feesEarned, decimals)
                : "0.0000"}{" "}
              {symbol}
            </PositionBlockItem>
          </PositionBlock>
          <PositionBlock>
            <PositionBlockItemBold>Total</PositionBlockItemBold>
            <PositionBlockItemBold>
              {formatUnits(totalPosition, decimals)} {symbol}
            </PositionBlockItemBold>
          </PositionBlock>
        </PositionWrapper>
        <ROIWrapper>
          <ROIItem>Total Pool Size:</ROIItem>
          <ROIItem>
            {formatUnits(totalPoolSize, decimals)} {symbol}
          </ROIItem>
        </ROIWrapper>
        <ROIWrapper>
          <ROIItem>Pool Utilization:</ROIItem>
          <ROIItem>{formatUnits(utilization, 16)}%</ROIItem>
        </ROIWrapper>
        <ROIWrapper>
          <ROIItem>Estimated APY:</ROIItem>
          <ROIItem>{numberFormatter(Number(apy)).replaceAll(",", "")}%</ROIItem>
        </ROIWrapper>
      </Info>
      <Tabs
        defaultTab={defaultTab}
        changeDefaultTab={(tab: string) => {
          setDefaultTab(tab);
        }}
      >
        <TabContentWrapper data-label="Add">
          <AddLiquidityForm
            wrongNetwork={wrongNetwork}
            error={error}
            formError={formError}
            amount={inputAmount}
            onChange={addLiquidityOnChangeHandler}
            bridgeAddress={bridgeAddress}
            decimals={decimals}
            symbol={symbol}
            tokenAddress={tokenAddress}
            setShowSuccess={setShowSuccess}
            setDepositUrl={setDepositUrl}
            balance={balance}
            setAmount={setInputAmount}
            refetchBalance={refetchBalance}
            onMaxClick={handleMaxClick}
          />
        </TabContentWrapper>
        <TabContentWrapper data-label="Remove">
          <RemoveLiquidityForm
            wrongNetwork={wrongNetwork}
            removeAmount={removeAmount}
            setRemoveAmount={setRemoveAmount}
            bridgeAddress={bridgeAddress}
            lpTokens={lpTokens}
            decimals={decimals}
            symbol={symbol}
            setShowSuccess={setShowSuccess}
            setDepositUrl={setDepositUrl}
            balance={balance}
            position={position}
            feesEarned={feesEarned}
            totalPosition={totalPosition}
            refetchBalance={refetchBalance}
          />
        </TabContentWrapper>
      </Tabs>
    </Wrapper>
  );
};

export default PoolForm;
