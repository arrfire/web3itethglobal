'use client'

import { motion } from 'framer-motion'
import { BackgroundGradientAnimation } from '../backgroundGradientAnimation';

export const ShaderGradient = () => {

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}>
      <div className="absolute top-0 left-1/2 w-1/2 h-screen -z-10 opacity-60">
        <BackgroundGradientAnimation />
      </div>
    </motion.div>
  );
};
