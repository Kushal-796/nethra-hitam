import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function ScrollReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45 }}>
      {children}
    </motion.div>
  );
}
