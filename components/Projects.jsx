import { PROJECT_LIST } from '../lib/constants';
import ProjectCard from './ProjectCard';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Projects(){
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section ref={ref} className="py-28">
      <div className="section-wrap">
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}} className="mb-16 text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-sm text-blue-400 tracking-widest">Projets</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <h2 className="title text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">Showcase</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {PROJECT_LIST.map((p, i) => (
            <ProjectCard key={i} project={p} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}

