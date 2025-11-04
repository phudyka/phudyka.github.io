import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-center"
      >
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <img
            src="/profile-picture.png"
            alt="Paul Hudyka"
            className="w-48 h-48 rounded-full mx-auto object-cover"
          />
        </motion.div>
        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.9 }}
          className="title text-5xl md:text-7xl mt-8"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-blue-300 animate-gradient-xy" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.2)' }}>
            Paul Hudyka
          </span>
        </motion.h1>
      </motion.div>
    </section>
  );
}

