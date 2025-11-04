
import { Code2, Terminal, Database, Cloud, Wrench } from 'lucide-react';

export const ABOUT_TEXT = "Étudiant à l’École 42 Nice, en formation algorithmique et IA, je recherche une alternance de deux ans à partir de Janvier 2026 en tant qu’ingénieur Machine Learning.";

export const PROJECT_LIST = [
  {
    title: 'KeyMaster',
    period: 'Mai — Nov 2025',
    company: 'GPI France',
    description: "Application web de gestion de licences logicielles (Django / Angular / PostgreSQL). Génération/validation de clés via ECDSA + SHA-256 et API externe.",
    tech: ['Django','Angular','PostgreSQL','ECDSA','SHA-256'],
    gradient: 'from-blue-500/20 via-purple-500/20 to-pink-500/20',
    accent: 'text-blue-400'
  },
  {
    title: 'Remote Monitoring',
    period: 'Mai — Nov 2025',
    company: 'GPI France',
    description: "POC médical connectant des capteurs Cosinuss° C-MED Alpha à un RAG. Conversion JSON → openEHR/FHIR et détection temps réel d'anomalies vitales.",
    tech: ['Python','RAG','openEHR','FHIR','IoT'],
    gradient: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    accent: 'text-emerald-400'
  },
];

export const SKILLS = [
  { title:'Langages', icon: Code2, items:['C','C++','Python','JavaScript','TypeScript','PHP','ASM','HTML','CSS'], color:'blue' },
  { title:'Frameworks / Libs', icon: Terminal, items:['Node.js','React','Angular','Next.js','Django','FastAPI','Tailwind CSS','REST API','Three.js'], color:'purple' },
  { title:'Bases de données', icon: Database, items:['PostgreSQL','SQLite','NoSQL','Firebase','Prisma','psycopg2'], color:'pink' },
  { title:'Cloud & DevSecOps', icon: Cloud, items:['Docker','Kubernetes','Ansible','VirtualBox','Git','GitLab','HuggingFace','SonarQube','RabbitMQ','GCP','nginx'], color:'cyan' },
  { title:'Outils', icon: Wrench, items:['n8n','Ollama','Blender','gunicorn','ECDSA','bcrypt','argon2','Linux','Windows','Bash'], color:'emerald' },
];

export const EXPERIENCES = [
  {
    role: 'Conseiller de vente',
    company: 'ESPACE CULTUREL E. LECLERC',
    period: 'Juin 2023 — Déc. 2024',
    description: 'Vente, conseil client et gestion des rayons dans un environnement culturel.'
  },
  {
    role: 'Vendeur polyvalent',
    company: 'Fêter et Recevoir',
    period: 'Juil. 2022 — Sept. 2022',
    description: 'Accueil, vente, gestion de caisse et mise en rayon.'
  },
  {
    role: 'Manutentionnaire intérimaire',
    company: 'PROMAN',
    period: 'Déc. 2020 — Juin 2022',
    description: 'Missions variées de manutention et préparation de commandes.'
  },
  {
    role: 'Préparateur de commandes',
    company: 'Alliance Healthcare',
    period: 'Juil. 2021 — Jan. 2022',
    description: 'Préparation et expédition de commandes pharmaceutiques.'
  }
];

export const LANGUAGES = [
  { name: 'Français', level: 'Maternel' },
  { name: 'Anglais', level: 'Bilingue' },
  { name: 'Espagnol', level: 'Avancé' },
  { name: 'Russe', level: 'Débutant' },
  { name: 'Chinois', level: 'Débutant' },
];
