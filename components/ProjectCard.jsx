import { memo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const ProjectCard = ({ project, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="group relative"
    >
      <div
        className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 blur-2xl transition`}
      />
      <div className="relative glass rounded-3xl p-8">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-300">
            {project.title}
          </h3>
          <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition" />
        </div>
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className={project.accent}>{project.company}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-500">{project.period}</span>
        </div>
        <p className="text-gray-400 font-light leading-relaxed mb-6">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t, j) => (
            <span key={j} className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-xl text-gray-300">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProjectCard);
