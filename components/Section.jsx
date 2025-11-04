import { motion } from 'framer-motion';

export default function Section({ children, ...props }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      viewport={{ once: true }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
