import {
  useState,
} from 'react';
import { PlaceholderAndVanishInput } from '@/common/components/atoms';
import { MultiStepLoader } from '@/common/components/molecules';
import {
  promptLoadingStates,
  promptPlaceholders,
} from '@/common/constants';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import lang from '@/common/lang';
import { generate } from '../actions';
import { IntefaceAIDTO } from './types';

const { generateIdea: generateIdeaCopy } = lang

export const Prompt = ({
  handleTokenCreation,
  isIdeaProcessing,
} : {
  handleTokenCreation: (value: IntefaceAIDTO) => void;
  isIdeaProcessing: boolean;
}) => {
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (value: string) => {
    setInput(value)
  }
  const handleSubmit = async () => {
    if (input?.length) {
      try {
        setIsGenerating(true)
        const res = await generate(input);
        handleTokenCreation({
          ideaName: res.ideaName,
          ideaDescription: res.ideaDescription || '',
          ideaLandingPage: res.ideaLandingPage || '',
          ideaLogo: res.ideaLogo || '',
          ideaTicker: res.ideaTicker || '',
        })
      } catch (error) {
        toast.error(generateIdeaCopy.generateError)
        console.error(error)
      } finally {
        setIsGenerating(false)
      }
    }
  }
  return (
    <motion.div
      className='mt-8 w-full max-w-[640px]'
      initial={{
        opacity: 0,
        scale: 0.8,
        translateY: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        translateY: 0,
      }}
      transition={{
        delay: 1,
      }}
    >
      <MultiStepLoader
        loadingStates={promptLoadingStates}
        loading={isGenerating || isIdeaProcessing}
        duration={3000}
      />
      <PlaceholderAndVanishInput
        placeholders={promptPlaceholders}
        onChange={handleInputChange}
        input={input}
        onSubmit={handleSubmit}
      />
    </motion.div>
  )
}
