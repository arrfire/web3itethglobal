'use client'
import {
  useCallback,
  useEffect,
  useState,
} from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/common/components/atoms';
import {
  Token,
  TradeType,
  Percent,
  CurrencyAmount,
} from '@uniswap/sdk-core';
import {
  Pool,
  Route,
  SwapQuoter,
  Trade,
  SwapRouter,
} from '@uniswap/v3-sdk';
import Lottie from "react-lottie";
import { IdeaTokenType } from "@/common/types";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  Address, parseUnits, formatUnits,
  decodeAbiParameters,
  ContractFunctionExecutionError,
} from "viem";
import {
  useAccount,
  useBalance,
  useChainId,
  useWalletClient,
} from 'wagmi';
import toast from "react-hot-toast";
import { publicClient } from "@/config";
import { CircularSpinner } from "@/common/components/atoms";
import {
  getSwapSymbol,
  POOL_FEE,
  QUOTER_CONTRACT_ADDRESS,
  SWAP_ROUTER_ADDRESS,
  WETH9_ADDRESS,
} from "@/common/constants";
import { usePrivy } from "@privy-io/react-auth";
import { useWindowDimensions } from "@/common/hooks/useWindowDimensions";
import { secondaryFont } from "@/common/utils/localFont";
import Link from "next/link";
import {
  abbreviateNumber, revalidateTagData,
} from "@/utils/helpers";

import lang from "@/common/lang";
import { UniswapIcon } from "@/common/components/icons";
import { Slot0Data } from "./types";
import * as animData from '@/common/lottie/swap-animation.json'
import poolAbi from '@/utils/abis/poolAbi.json'
import tokenApprovalAbi from '@/utils/abis/tokenApprovalAbi.json'

const { ideaPage: ideaPageCopy } = lang

export const LPSwaps = ({
  idea,
  poolAddress,
  tokenBalance,
} : {
  idea: IdeaTokenType;
  poolAddress: string;
  tokenBalance: string;
}) => {
  const [isSellingToken, setIsSellingToken] = useState(true);
  const [activeField, setActiveField] = useState<'buy' | 'sell' | null>(null);
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [enableAnim, setEnableAnim] = useState(false);

  const { address } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();

  const walletBalanceData = useBalance({
    address: address,
  })

  const {
    authenticated, login,
  } = usePrivy()

  const {
    isDesktopView,
  } = useWindowDimensions()

  const animOptions = {
    loop: true,
    autoplay: false,
    animationData: animData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const getBaseToken = useCallback(() => new Token(
    chainId || 42161,
    WETH9_ADDRESS,
    18,
    'ETH',
    'Arbitrum',
  ), [chainId]);

  const getIdeaToken = useCallback(() => new Token(
    chainId || 137,
    idea.tokenAddress,
    18,
    idea.symbol,
    idea.name,
  ), [chainId, idea]);

  const getPool = useCallback(async (tokenA: Token, tokenB: Token) => {
    if (publicClient) {
      try {
        const [slot0Data, liquidity] = await Promise.all([
          publicClient.readContract({
            address: poolAddress as Address,
            abi: poolAbi,
            functionName: 'slot0',
          }) as Promise<Slot0Data>,
          publicClient.readContract({
            address: poolAddress as Address,
            abi: poolAbi,
            functionName: 'liquidity',
          }) as Promise<bigint>,
        ]);

        return new Pool(
          tokenA,
          tokenB,
          POOL_FEE,
          slot0Data[0].toString(),
          liquidity.toString(),
          slot0Data[1],
        );
      } catch (error) {
        console.error('Pool fetch error:', error);
      }
    }
  }, [poolAddress]);
  const getQuote = useCallback(async (route: Route<Token, Token>, amountIn: string, isSellField: boolean) => {
    if (!publicClient) {
      return null;
    }
    try {
      const quoteParams = await SwapQuoter.quoteCallParameters(
        route,
        CurrencyAmount.fromRawAmount(
          isSellField && isSellingToken ? getIdeaToken() : getBaseToken(),
          parseUnits(amountIn, 18).toString(),
        ),
        isSellField ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
        {
          useQuoterV2: true,
        },
      );
      const quoteCallReturnData = await publicClient.call({
        to: QUOTER_CONTRACT_ADDRESS,
        data: quoteParams.calldata as `0x${string}`,
      });

      const [quotedAmountOut] = decodeAbiParameters(
        [{ type: 'uint256' }],
        quoteCallReturnData.data as Address,
      );

      return quotedAmountOut.toString();
    } catch (error) {
      toast.error('Unable to fetch quote')
    }

  }, [isSellingToken, getBaseToken, getIdeaToken]);

  const updateQuote = useCallback(async (amount: string, isSellField: boolean) => {
    if (!amount || parseFloat(amount) === 0) {
      if (isSellField) {
        setBuyAmount('');
      } else {
        setSellAmount('');
      }
      return;
    }

    setIsQuoting(true);
    try {
      const tokenIn = isSellingToken ? getIdeaToken() : getBaseToken();
      const tokenOut =  isSellingToken ? getBaseToken() : getIdeaToken();
      const pool = await getPool(tokenIn, tokenOut);
      if (pool) {
        const route = new Route([pool], tokenIn, tokenOut);
        const quotedAmount = await getQuote(route, amount, isSellField);
        if (quotedAmount) {
          if (isSellField) {
            setBuyAmount(formatUnits(BigInt(quotedAmount), 18));
          } else {
            setSellAmount(formatUnits(BigInt(quotedAmount), 18));
          }
        }
      }
    } catch (error) {
      toast.error('Failed to get price quote')
    } finally {
      setIsQuoting(false);
    }
  }, [isSellingToken, getPool, getQuote, getBaseToken, getIdeaToken]);

  useEffect(() => {
    if (activeField === 'sell') {
      const debounceTimeout = setTimeout(() => {
        updateQuote(sellAmount, true);
      }, 500);

      return () => clearTimeout(debounceTimeout);
    }
  }, [sellAmount, updateQuote, activeField]);

  useEffect(() => {
    if (activeField === 'buy') {
      const debounceTimeout = setTimeout(() => {
        updateQuote(buyAmount, false);
      }, 500);

      return () => clearTimeout(debounceTimeout);
    }
  }, [buyAmount, updateQuote, activeField]);

  const getTokenTransferApproval = async (token: Token, sellAmount: string) => {
    if (!walletClient || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      const tokenContract = {
        address: token.address as Address,
        abi: tokenApprovalAbi,
      };

      const formattedApproval = parseUnits(sellAmount, 18);

      const hash = await walletClient.writeContract({
        ...tokenContract,
        functionName: 'approve',
        args: [SWAP_ROUTER_ADDRESS, formattedApproval],
        account: address,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Error approving token')
    }
  };

  const handleSwap = async () => {
    if (!walletClient || !address) {
      if (!authenticated) {
        login()
      }
      return
    }
    if (!sellAmount) {
      return;
    }

    setIsLoading(true);
    try {
      const tokenA = isSellingToken ? getIdeaToken() : getBaseToken();
      const tokenB = isSellingToken ? getBaseToken() : getIdeaToken();

      const pool = await getPool(tokenA, tokenB);
      if (!pool) {
        toast.error('Pool not found')
        return
      }
      const route = new Route([pool], tokenA, tokenB);

      const tokenApproval = await getTokenTransferApproval(tokenA, sellAmount);
      if (!tokenApproval) {
        toast.error('Token approval failed')
        return
      }

      const amountIn = parseUnits(sellAmount, tokenA.decimals);
      const amountOut = parseUnits(buyAmount, tokenB.decimals);

      const uncheckedTrade = Trade.createUncheckedTrade({
        route,
        inputAmount: CurrencyAmount.fromRawAmount(tokenA, amountIn.toString()),
        outputAmount: CurrencyAmount.fromRawAmount(tokenB, amountOut.toString()),
        tradeType: TradeType.EXACT_INPUT,
      });
      let slippageTolerance;
      const amountInFloat = parseFloat(sellAmount);
      if (amountInFloat <= 0.1) {
        slippageTolerance = new Percent(200, 10_000);
      } else if (amountInFloat <= 1) {
        slippageTolerance = new Percent(150, 10_000);
      } else if (amountInFloat <= 10) {
        slippageTolerance = new Percent(100, 10_000);
      } else {
        slippageTolerance = new Percent(75, 10_000);
      }
      const options = {
        slippageTolerance,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        recipient: address,
      };

      const {
        calldata, value,
      } = SwapRouter.swapCallParameters([uncheckedTrade], options);

      const estimatedGas = await publicClient.estimateGas({
        account: address,
        to: SWAP_ROUTER_ADDRESS,
        data: calldata as Address,
        value: BigInt(value),
      });
      const gasBuffer = (estimatedGas * BigInt(120)) / BigInt(100);

      const hash = await walletClient.sendTransaction({
        data: calldata as Address,
        to: SWAP_ROUTER_ADDRESS,
        value: BigInt(value),
        from: address,
        gas: gasBuffer,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setSellAmount('');
      setBuyAmount('');
      setActiveField(null);
      await revalidateTagData(`ideaToken-${idea.tokenAddress}`)
      toast.success('You have successfully swapped your tokens');
    } catch (error) {
      if (error instanceof ContractFunctionExecutionError) {
        toast.error('Transaction failed. Please check your balance and try again')
      } else {
        console.error(error)
        toast.error('An error occurred while processing the swap')
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellAmountChange = (value: string) => {
    setActiveField('sell');
    setSellAmount(value);
  };

  const handleBuyAmountChange = (value: string) => {
    setActiveField('buy');
    setBuyAmount(value);
  };

  const handleToggleDirection = () => {
    setIsSellingToken(!isSellingToken);
    setActiveField(null);
    setBuyAmount('');
    setSellAmount('');
  };

  const setMaxValue = () => {
    if (isSellingToken) {
      setSellAmount(tokenBalance);
      updateQuote(tokenBalance, true);
    } else {
      setSellAmount(walletBalanceData?.data?.formatted || '');
      if (walletBalanceData?.data?.formatted) {
        updateQuote(walletBalanceData.data.formatted, true);
      }

    }
  }
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{ delay: isDesktopView ? 1.5 : 2.1 }}
      className=""
    >
      <div className="text-neutral-200 font-semibold text-lg">{ideaPageCopy.swapTokens}</div>
      <div className="text-neutral-500 text-sm flex items-center justify-between">
        <span>
          {ideaPageCopy.swapTokensDesc}
        </span>
        <Tooltip delayDuration={200}>
          <TooltipTrigger>
            <Link
              target="_blank"
              href={`https://app.uniswap.org/explore/tokens/polygon/${idea.tokenAddress}`}
              className="flex gap-2 text-white hover:bg-white/15 rounded-full p-1"
            >
              <UniswapIcon />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="isolate bg-white/15 shadow-lg border-0 outline-none rounded-lg">
            <p className="text-xs text-white">{ideaPageCopy.openUniswap}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="ring-white/5 ring-[1px] rounded-3xl p-2 flex flex-col gap-1 relative">
        <label htmlFor="input" className="bg-white/5 relative rounded-2xl p-4 border-t-[1px] border-white/20 cursor-text">
          <div className="flex justify-between items-center">
            <div className="text-neutral-400 font-medium">Sell</div>
            <div className="bg-white rounded-full text-xs px-2 py-1/2 font-semibold">
              <span className={`bg-gradient-to-b from-indigo-500 to-purple-500 text-transparent bg-clip-text ${secondaryFont.className}`}>
                {isSellingToken ? idea.symbol : getSwapSymbol()}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center gap-1">
            {isQuoting && activeField === 'buy' ? (
              <div><CircularSpinner /></div>
            ) : (
              <input
                type="number"
                id="input"
                value={sellAmount}
                onChange={(e) => handleSellAmountChange(e.target.value)}
                className="bg-transparent outline-none border-0 font-semibold text-xl text-white placeholder:text-neutral-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
            )}
            {authenticated && tokenBalance && isSellingToken ? (
              <div className="flex justify-end gap-1.5 items-center mt-1">
                <span className="text-violets-are-blue text-xs font-semibold">{abbreviateNumber(tokenBalance)}</span>
                <button
                  type="button"
                  onClick={() => setMaxValue()}
                  className={`flex items-center justify-center text-neutral-300 rounded-full outline-none
                      transition-all duration-150 ease-in-out py-0.5 px-1.5 font-medium text-xs ring-1 ring-neutral-300
                      ring-inset hover:bg-white/15`}
                >
                  {ideaPageCopy.maxButton}
                </button>
              </div>
            ) : null}
            {authenticated && walletBalanceData?.data && !isSellingToken ? (
              <div className="flex justify-end gap-1.5 items-center mt-1">
                <span className="text-violets-are-blue text-xs font-semibold">{parseFloat(walletBalanceData.data.formatted).toFixed(2)} </span>
                <button
                  type="button"
                  onClick={() => setMaxValue()}
                  className={`flex items-center justify-center text-neutral-300 rounded-full outline-none
                      transition-all duration-150 ease-in-out py-0.5 px-1.5 font-medium text-xs ring-1 ring-neutral-300
                      ring-inset hover:bg-white/15`}
                >
                  {ideaPageCopy.maxButton}
                </button>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleToggleDirection}
            className="duration-200 transition-all text-white shadow-xl bg-violets-are-blue hover:bg-violets-are-blue/70 ring-4 ring-white/5 rounded-3xl p-1.5 absolute left-1/2 -translate-x-1/2"
          >
            <ArrowDown />
          </button>
        </label>
        <label htmlFor="output" className="bg-white/5 rounded-2xl p-4 border-b-[1px] border-white/20 cursor-text">
          <div className="flex justify-between items-center">
            <div className="text-neutral-400 font-medium">Receive</div>
            <div className="bg-white rounded-full text-xs px-2 py-1/2 font-semibold">
              <span className={`bg-gradient-to-b from-indigo-500 to-purple-500 text-transparent bg-clip-text ${secondaryFont.className}`}>
                {isSellingToken ? getSwapSymbol() : idea.symbol}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center gap-1">
            {isQuoting && activeField === 'sell' ? (
              <div><CircularSpinner /></div>
            ) : (
              <input
                id="output"
                type="number"
                value={buyAmount}
                onChange={(e) => handleBuyAmountChange(e.target.value)}
                className="bg-transparent outline-none border-0 font-semibold text-xl text-white placeholder:text-neutral-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
            )}
          </div>
        </label>
        <button
          onClick={handleSwap}
          disabled={isLoading || (!sellAmount && Boolean(address))}
          onMouseEnter={() => setEnableAnim(true)}
          onMouseLeave={() => setEnableAnim(false)}
          className="mt-1 w-full disabled:cursor-not-allowed bg-gradient-to-tr hover:from-han-purple/70 hover:to-tulip/70 from-han-purple to-tulip text-white rounded-2xl py-3 font-medium disabled:opacity-50 flex gap-2 items-center justify-center"
        >
          {!address ? ideaPageCopy.connectWallet : isLoading ? ideaPageCopy.swapping : ideaPageCopy.swap}
          {address ? (
            <Lottie
              options={animOptions}
              isStopped={!enableAnim && !isLoading}
              style={{ margin: '0' }}
              height={24}
              width={24}
            />
          ) : null}
        </button>
      </div>
    </motion.div>
  );
}
