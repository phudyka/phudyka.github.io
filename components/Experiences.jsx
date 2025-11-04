import { EXPERIENCES } from '../lib/constants';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ExperienceCard = ({ exp, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="glass p-6 rounded-2xl"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-white">{exp.role}</h3>
          <p className="text-sm text-gray-400">{exp.company}</p>
        </div>
        <span className="text-xs text-blue-400/80 whitespace-nowrap">{exp.period}</span>
      </div>
      <p className="text-sm text-gray-400/90 font-light">{exp.description}</p>
    </motion.div>
  );
};

export default function Experiences() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section ref={ref} className="py-28">
      <div className="section-wrap">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-sm text-blue-400 tracking-widest">Parcours</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <h2 className="title text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">Expériences</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard key={i} exp={exp} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}
