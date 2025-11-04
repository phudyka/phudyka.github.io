import { LANGUAGES } from '../lib/constants';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Globe } from 'lucide-react';

export default function Languages() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28">
      <div className="section-wrap">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-sm text-blue-400 tracking-widest">Langues</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <h2 className="title text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">Communication</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="glass rounded-2xl p-8 max-w-2xl mx-auto"
        >
          <ul className="space-y-4">
            {LANGUAGES.map((lang, i) => (
              <li key={i} className="flex justify-between items-center">
                <span className="text-lg text-white flex items-center gap-3">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  {lang.name}
                </span>
                <span className="text-gray-400">{lang.level}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
