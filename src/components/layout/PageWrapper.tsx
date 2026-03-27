import { motion } from "framer-motion";
import { ReactNode } from "react";

export function PageWrapper({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-[calc(100vh-56px)] pt-10 pb-16 px-5 sm:px-8 lg:px-12 max-w-5xl mx-auto w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
