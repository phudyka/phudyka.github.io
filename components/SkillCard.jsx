import { memo } from 'react';
import { motion } from 'framer-motion';

const SkillCard = ({ category, delay }) => {
  const Icon = category.icon;
  return (
    <motion.div
      key={delay}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      <div
        className={`absolute -inset-0.5 bg-gradient-to-br from-${category.color}-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition`}
      />
      <div className="relative glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-2.5 bg-${category.color}-500/10 rounded-xl border border-${category.color}-500/20`}>
            <Icon className={`w-5 h-5 text-${category.color}-400`} />
          </div>
          <h3 className="text-lg font-semibold">{category.title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.items.map((s, j) => (
            <span key={j} className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-gray-300">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(SkillCard);
