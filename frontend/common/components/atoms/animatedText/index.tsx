import React from 'react';

export const AnimatedText = ({ text = "Attention Grabbing Text!" }) => {
  return (
    <span 
      className="
        font-bold 
        bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
        bg-clip-text 
        text-transparent 
        animate-animatedText
    "
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {text}
    </span>
  );
};