import {
  useState,
} from "react";
import { 
  AnimatedText, Button,
} from "@/common/components/atoms";
import { IdeaTokenType } from "@/common/types";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { motion } from "framer-motion";
import { simulateContract } from '@wagmi/core'
import { secondaryFont } from "@/common/utils/localFont";
import {
  ContractFunctions, getCurrency,
} from "@/common/constants";
import {
  Address, parseUnits,
} from "viem";
import toast from "react-hot-toast";
import { useWindowDimensions } from "@/common/hooks/useWindowDimensions";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/common/components/organisms";
import { KeyedMutator } from "swr";
import lang from "@/common/lang";
import { ethers } from "ethers";
import { 
  usePrivy,
} from "@privy-io/react-auth";
import { config } from "@/config";
import {
  Get_Owners_Dto,
  Get_Token_Balance_Type,
  Get_Transfers_Dto,
} from "./types";
import ideaAbi from '@/utils/abis/ideaFactory.json'
import { 
  abbreviateNumber, 
  revalidateTagData,
} from '../../utils/helpers';

const { ideaPage: ideaPageCopy } = lang

const K = BigInt('500000000000000');
const INITIAL_PRICE = BigInt('42700000000');
const PRECISION = BigInt('1000000000000');

export const BuyToken = ({
  idea,
  setTokenInfoLoading,
  tokenAddress,
  mutateTransfers,
  mutateOwners,
  mutateTokenBalance,
} : {
  idea: IdeaTokenType;
  setTokenInfoLoading: (value: boolean) => void;
  tokenAddress: string;
  mutateTransfers: KeyedMutator<Get_Transfers_Dto>;
  mutateOwners: KeyedMutator<Get_Owners_Dto>;
  mutateTokenBalance: KeyedMutator<Get_Token_Balance_Type>;
}) => {
  const {
    writeContractAsync,
  } = useWriteContract()
  const {
    authenticated, login,
  } = usePrivy()

  const {
    address,
  } = useAccount({
    config: config,
  })

  const walletBalanceData = useBalance({
    address: address,
  })

  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [cost, setCost] = useState('0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [costWei, setCostWei] = useState(0)
  const [lowFunds, setLowFunds] = useState(false)
  const maxSupply = parseInt(process.env.NEXT_PUBLIC_MAX_SUPPLY || '0');
  const totalSupply = idea ? parseInt(`${idea.tokenCurrentSupply}`) : 0;
  const remainingTokens = idea ? maxSupply - totalSupply : 0
  const initialSupply = parseInt(process.env.NEXT_PUBLIC_INITIAL_SUPPLY || '0')
  const actualSupply = totalSupply - initialSupply
  const {
    refetch: getCostRPC,
  } = useReadContract({
    abi: ideaAbi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    functionName: ContractFunctions.calculateCost,
    args: [actualSupply, purchaseAmount],
    query: {
      enabled: false,
    },
  })

  const {
    isDesktopView,
  } = useWindowDimensions()

  const simulateBuy = async (amount: number) => {
    try {
      setLowFunds(false)
      await simulateContract(config, {
        abi: ideaAbi,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
        functionName: ContractFunctions.buyToken,
        value: parseUnits(amount.toString(), 0),
        args: [
          tokenAddress,
          purchaseAmount,
        ],
        account: address,
      })
    } catch (error) {
      if (authenticated) {
        setLowFunds(true)
      }
    }
  }
  const getCost = async () => {
    if (!purchaseAmount && purchaseAmount < 0) {
      return;
    }
    if (purchaseAmount > remainingTokens) {
      toast.error(`${ideaPageCopy.limitedTokensError.replace('%amount%', remainingTokens.toString())}`)
      return
    }
    try {
      setTokenInfoLoading(true)
      const { data: costInWei } = await getCostRPC()
      setCostWei(costInWei as number)
      setCost(ethers.formatUnits(costInWei as number, 'ether'));
      setIsModalOpen(true);
      await simulateBuy(costInWei as number)
    } catch (error) {
      console.error(error)
    } finally {
      setTokenInfoLoading(false)
    }
  };
  const handlePurchase = async () => {
    const purchaseAction = async () => {
      try {
        setTokenInfoLoading(true)
        await writeContractAsync({
          abi: ideaAbi,
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
          functionName: ContractFunctions.buyToken,
          value: BigInt(costWei),
          args: [
            tokenAddress,
            purchaseAmount,
          ],
        })
        await mutateTransfers()
        await mutateOwners()
        await mutateTokenBalance()
        await revalidateTagData(`ideaToken-${tokenAddress}`)
        toast.success(`${ideaPageCopy.purchaseSuccess} ${purchaseAmount} ${idea.symbol}`)
        setPurchaseAmount(0)
      } catch (error) {
        toast.error(ideaPageCopy.purchaseError)
      } finally {
        setIsModalOpen(false);
        setTokenInfoLoading(false)
        revalidateTagData('getIdeas')
      }
    }
    if (!authenticated) {
      login()
    } else {
      await purchaseAction()
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      getCost()
    }
  }

  const exp = (x: bigint): bigint => {
    let sum = PRECISION;
    let term = PRECISION;
    
    for (let i = 1; i <= 20; i++) {
      term = (term * x) / (BigInt(i) * PRECISION);
      sum += term;
      if (term < BigInt(1)) {
        break;
      }
    }
    return sum;
  }

  const calculateCost = (currentSupply: bigint, tokensToBuy: bigint): bigint => {
    const exponent1 = (K * (currentSupply + tokensToBuy)) / PRECISION;
    const exponent2 = (K * currentSupply) / PRECISION;
    return ((INITIAL_PRICE * PRECISION * (exp(exponent1) - exp(exponent2))) / K);
  }

  const calculateTokenAmount = (
    currentSupply: string | number | bigint,
    nativeAmount: string | number | bigint,
  ): bigint => {
    const supply = BigInt(currentSupply);
    const amount = BigInt(nativeAmount);
    
    if (amount <= BigInt(0)) {
      throw new Error("Amount must be greater than 0");
    }

    let left = BigInt(1);
    let right = BigInt('10000000000000000000000');
    let tokenAmount = BigInt(0);

    let iterations = 0;
    const MAX_ITERATIONS = 100; 

    while (left <= right && iterations < MAX_ITERATIONS) {
      const mid = (left + right) / BigInt(2);
      const cost = calculateCost(supply, mid);
      if (cost <= amount && amount - cost <= amount / BigInt(100)) {
        tokenAmount = mid;
        break;
      } else if (cost > amount) {
        right = mid - BigInt(1);
      } else {
        left = mid + BigInt(1);
        tokenAmount = mid;
      }
      iterations++;
    }
    return tokenAmount;
  }

  const getTokensForEth = () => {
    if (walletBalanceData?.data?.formatted) {
      const ethAmount = walletBalanceData.data.formatted
      const currentSupply = parseInt(`${idea.tokenCurrentSupply}`)
      try {
        const weiAmount = ethers.parseUnits(ethAmount, 18);
        const tokens = calculateTokenAmount(
          currentSupply,
          weiAmount.toString(),
        );
        setPurchaseAmount(parseInt(tokens.toString()))
      } catch (error) {
        toast.error("Error calculating tokens")
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
      <div className="flex justify-between items-center">
        <div className="text-neutral-200 font-semibold text-lg">{ideaPageCopy.buyTokens}</div>
        <div className="text-xs">
          <AnimatedText text={abbreviateNumber(remainingTokens.toString()).toString()} />
          <span className="text-neutral-400">{ideaPageCopy.remaining}</span> 
        </div>
      </div>
      <div className="text-neutral-500 mb-2 text-sm text-justify w-full">{ideaPageCopy.buyTokensDesc}</div>
      <div className="ring-white/5 ring-[1px] rounded-3xl p-2 flex flex-col gap-1 relative">
        <label htmlFor="input" className="bg-white/5 relative rounded-2xl p-4 border-t-[1px] border-white/20 cursor-text">
          <div className="flex justify-between items-center">
            <div className="text-neutral-400 font-medium">{ideaPageCopy.buy}</div>
            <div className="bg-white rounded-full text-xs px-2 py-1/2 font-semibold">
              <span className={`bg-gradient-to-b from-indigo-500 to-purple-500 text-transparent bg-clip-text ${secondaryFont.className}`}>
                {idea?.symbol || ''}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center gap-1">
            <input
              type="number"
              id="input"
              min={1}
              max={remainingTokens}
              value={`${purchaseAmount ? purchaseAmount : ''}`}
              onKeyDown={handleKeyDown}
              onChange={(e) => setPurchaseAmount(parseInt(e.target.value ? e.target.value : '0'))}
              className="bg-transparent flex-1 outline-none border-0 font-semibold text-xl text-white placeholder:text-neutral-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            {authenticated && walletBalanceData.data?.value ? (
              <div className="flex justify-end gap-1.5 items-center mt-1">
                <span className="text-violets-are-blue text-xs font-semibold">{parseFloat(walletBalanceData.data.formatted).toFixed(2)} {getCurrency()}</span>
                <button 
                  type="button"
                  onClick={() => getTokensForEth()}
                  className={`flex items-center justify-center text-neutral-300 rounded-full outline-none
                      transition-all duration-150 ease-in-out py-0.5 px-1.5 font-medium text-xs ring-1 ring-neutral-300
                      ring-inset hover:bg-white/15`}
                >
                  {ideaPageCopy.maxButton}
                </button>
              </div>
            ) : null}
          </div>
        </label>
        <Modal>
          <ModalTrigger setIsModalOpen={setIsModalOpen} disabled={purchaseAmount <= 0 || purchaseAmount > remainingTokens} onClick={getCost}>
            {ideaPageCopy.purchaseLabel}
          </ModalTrigger>
          <ModalBody isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <ModalContent>
              <h4 className="text-white font-semibold text-xl md:text-2xl ml-6 pt-4">{ideaPageCopy.confirmPurchase}</h4>
              <div className="text-center font-medium md:text-xl text-white mt-16 flex gap-2 flex-col md:flex-row items-center justify-center">
                <span>{ideaPageCopy.youWillReceive}</span>
                <div className="flex items-center gap-1">
                  <AnimatedText text={purchaseAmount.toString()} />
                  {idea?.symbol}
                </div>
                <span>{ideaPageCopy.for}</span>
                <div className="flex items-center gap-1">
                  <AnimatedText text={cost.toString()} />
                  {getCurrency()}
                </div>
              </div>
              {lowFunds && <p className="text-red-500 mt-5 text-center text-xs md:text-sm px-4">{ideaPageCopy.likelyFail}</p>}
            </ModalContent>
            <ModalFooter className="gap-4 pb-6 mt-5">
              <Button
                size="md"
                variant="primary"
                type="button"
                onClick={handlePurchase}
                className="!px-8 transition-all duration-150 hover:from-han-purple/70 hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-semibold"
              >
                {authenticated ? ideaPageCopy.buyNow : ideaPageCopy.connectWallet}
              </Button>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </div>
    </motion.div>
  );
};