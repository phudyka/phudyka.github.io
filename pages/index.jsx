import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from '../components/Hero';
import Section from '../components/Section';

const Projects = dynamic(() => import('../components/Projects'));
const Skills = dynamic(() => import('../components/Skills'));
const Experiences = dynamic(() => import('../components/Experiences'));
const Languages = dynamic(() => import('../components/Languages'));
const Contact = dynamic(() => import('../components/Contact'));

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 0.5, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.3, 0.4], ['100px', '0px']);

  return (
    <main className="relative">
      <motion.div
        style={{ opacity: heroOpacity }}
        className="fixed inset-0 -z-10"
      >
        <img src="/background.png" alt="Background" className="w-full h-full object-cover" />
      </motion.div>

      <motion.div style={{ opacity: heroOpacity }}>
        <Hero />
      </motion.div>

      <div className="h-[100vh]" />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10"
      >
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-black via-gray-900 to-black" />
        <Section id="projects">
          <Projects />
        </Section>
        <Section id="skills">
          <Skills />
        </Section>
        <Section id="experiences">
          <Experiences />
        </Section>
        <Section id="languages">
          <Languages />
        </Section>
        <Section id="contact">
          <Contact />
        </Section>
        <footer className="py-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Paul Hudyka — Built with Next.js, Tailwind & Framer Motion
        </footer>
      </motion.div>
    </main>
  );
}

