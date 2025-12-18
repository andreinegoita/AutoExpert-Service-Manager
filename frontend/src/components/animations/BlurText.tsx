import { motion } from "framer-motion";

export const BlurText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const words = text.split(" ");

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      className="flex gap-2 justify-center flex-wrap"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { filter: "blur(10px)", opacity: 0, y: 20 },
            visible: { 
              filter: "blur(0px)", 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.8, delay: delay + i * 0.1 } 
            },
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};