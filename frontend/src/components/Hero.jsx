import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-5 pb-5 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.005, transition: { duration: 0.4 } }}
        className="w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-xl cursor-pointer
                   border border-primary-200/40"
      >
        <motion.img
          src="/my_banner.png"
          alt="IndoPalm Sapi Banner"
          className="w-full h-auto block"
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
        />
      </motion.div>
    </div>
  );
};

export default Hero;