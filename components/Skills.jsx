import { SKILLS } from '../lib/constants';
import SkillCard from './SkillCard';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Skills(){
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28">
      <div className="section-wrap">
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}} className="mb-14 text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-sm text-blue-400 tracking-widest">Compétences</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <h2 className="title text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">Skills Grid</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((cat, i) => (
            <SkillCard key={i} category={cat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

