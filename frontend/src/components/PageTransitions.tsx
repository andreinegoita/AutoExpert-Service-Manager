import { motion, Transition } from 'framer-motion'; // Am adaugat Transition aici
import { ReactNode } from 'react';

const pageVariants = {
  initial: { opacity: 0, x: -20, scale: 0.98 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: 20, scale: 1.02 }
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};