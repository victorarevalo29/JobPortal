import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

import { connectDatabase } from './src/database/connect.js'
import { Company } from './src/models/Company.js'
import { Job } from './src/models/Job.js'
import { User } from './src/models/User.js'
import { Review } from './src/models/Review.js'
import { Resource } from './src/models/Resource.js'
import { ForumPost } from './src/models/ForumPost.js'
import { Application } from './src/models/Application.js'

const hashPassword = (plain) => bcrypt.hash(plain, 10)

const randomPastDate = (maxDays = 30) => {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * maxDays)
  const hoursAgo = Math.floor(Math.random() * 24)
  return new Date(now.getTime() - ((daysAgo * 24) + hoursAgo) * 60 * 60 * 1000)
}

const sample = (array) => array[Math.floor(Math.random() * array.length)]
const shuffle = (array) => [...array].sort(() => Math.random() - 0.5)

const companiesSeed = [
  {
    name: 'Ráfaga Mobility Lab',
    description: 'Estudio de movilidad ligera que diseña flotas eléctricas, sensores y rituales de datos para ciudades latinoamericanas.',
    location: 'Ciudad de México, México',
    industry: 'Movilidad',
    logoUrl: 'https://images.jobportal.dev/logos/rafaga.png'
  },
  {
    name: 'Selva Cloud Cartography',
    description: 'Cooperativa de ingeniería que convierte mapas comunitarios en tableros cloud listos para escalar y compartir.',
    location: 'Quito, Ecuador',
    industry: 'Cloud / GIS',
    logoUrl: 'https://images.jobportal.dev/logos/selva.png'
  },
  {
    name: 'Matiz Learning Lab',
    description: 'Laboratorio educativo que produce microcursos, experiencias inmersivas y mentorías para talento creativo.',
    location: 'Bogotá, Colombia',
    industry: 'Educación',
    logoUrl: 'https://images.jobportal.dev/logos/matiz.png'
  },
  {
    name: 'Pulsar Analytics Coop',
    description: 'Equipo de ciencia de datos que acompaña a municipalidades y ONG a convertir métricas en políticas públicas.',
    location: 'Quito, Ecuador',
    industry: 'Data / Impacto',
    logoUrl: 'https://images.jobportal.dev/logos/pulsar.png'
  },
  {
    name: 'Nebula Kitchen OS',
    description: 'Plataforma que coordina inventario, sensores IoT y rituales de comunidad para cocinas colaborativas.',
    location: 'Santiago, Chile',
    industry: 'Foodtech',
    logoUrl: 'https://images.jobportal.dev/logos/nebula.png'
  },
  {
    name: 'Costa Dev Commons',
    description: 'Escuadrón nearshore que construye soluciones GovTech y fintech para aliados públicos.',
    location: 'Ciudad de Panamá, Panamá',
    industry: 'Servicios tecnológicos',
    logoUrl: 'https://images.jobportal.dev/logos/costadev.png'
  },
  {
    name: 'Bruma XR Forge',
    description: 'Estudio creativo que fabrica experiencias XR educativas para museos, escuelas y ferias itinerantes.',
    location: 'Buenos Aires, Argentina',
    industry: 'XR / Creatividad',
    logoUrl: 'https://images.jobportal.dev/logos/bruma.png'
  },
  {
    name: 'Prisma Health Build',
    description: 'Startup de salud comunitaria que arma herramientas low-code junto a clínicas y brigadas médicas.',
    location: 'Guadalajara, México',
    industry: 'Healthtech',
    logoUrl: 'https://images.jobportal.dev/logos/prisma.png'
  },
  {
    name: 'Andén Robotics Collective',
    description: 'Colectivo maker que acerca kits abiertos de robótica a escuelas técnicas y centros comunitarios.',
    location: 'Rosario, Argentina',
    industry: 'Robótica educativa',
    logoUrl: 'https://images.jobportal.dev/logos/anden.png'
  },
  {
    name: 'Faro Civic Systems',
    description: 'Consultora de datos cívicos que crea plataformas de transparencia y alertas urbanas.',
    location: 'Montevideo, Uruguay',
    industry: 'GovTech',
    logoUrl: 'https://images.jobportal.dev/logos/faro.png'
  }
]

const userProfiles = [
  {
    name: 'Marcela Duarte',
    email: 'marcela.duarte@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Investigadora de producto enfocada en salud y movilidad con gusto por prototipos rápidos.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/marcela-duarte.pdf',
    skills: ['Product discovery', 'Research ops', 'Figma'],
    photoUrl: 'https://images.jobportal.dev/users/marcela.jpg',
    stats: { applicationsSent: 0, profileViews: 54 },
    alerts: [
      { type: 'weekly-digest', enabled: true },
      { type: 'product-remote', enabled: true }
    ]
  },
  {
    name: 'Iván Solano',
    email: 'ivan.solano@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Data storyteller que arma dashboards accionables para municipalidades.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/ivan-solano.pdf',
    skills: ['SQL', 'Metabase', 'Storytelling'],
    photoUrl: 'https://images.jobportal.dev/users/ivan.jpg',
    stats: { applicationsSent: 0, profileViews: 63 },
    alerts: [
      { type: 'weekly-digest', enabled: true },
      { type: 'data-impact', enabled: true }
    ]
  },
  {
    name: 'Luisa Fernanda León',
    email: 'luisa.leon@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Design ops lead que diseña rituales, checklists y documentación amigable.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/luisa-leon.pdf',
    skills: ['Design ops', 'Notion', 'Workshop facilitation'],
    photoUrl: 'https://images.jobportal.dev/users/luisa.jpg',
    stats: { applicationsSent: 0, profileViews: 41 },
    alerts: [
      { type: 'weekly-digest', enabled: true }
    ]
  },
  {
    name: 'Camila Prieto',
    email: 'camila.prieto@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Copywriter y facilitadora que arma playbooks y rituales de comunicación.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/camila-prieto.pdf',
    skills: ['Storytelling', 'Content design', 'Workshops'],
    photoUrl: 'https://images.jobportal.dev/users/camila.jpg',
    stats: { applicationsSent: 0, profileViews: 38 },
    alerts: [
      { type: 'weekly-digest', enabled: true },
      { type: 'remote-content', enabled: true }
    ]
  },
  {
    name: 'Andrés Palma',
    email: 'andres.palma@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Frontend engineer que disfruta optimizar design systems y accesibilidad.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/andres-palma.pdf',
    skills: ['React', 'Typescript', 'Accessibility'],
    photoUrl: 'https://images.jobportal.dev/users/andres.jpg',
    stats: { applicationsSent: 0, profileViews: 59 },
    alerts: [
      { type: 'weekly-digest', enabled: true },
      { type: 'frontend-remote', enabled: true }
    ]
  },
  {
    name: 'Teresa Villalobos',
    email: 'teresa.villalobos@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Operations lead que arma runbooks para equipos distribuidos.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/teresa-villalobos.pdf',
    skills: ['Operations', 'Analytics', 'Budgeting'],
    photoUrl: 'https://images.jobportal.dev/users/teresa.jpg',
    stats: { applicationsSent: 0, profileViews: 44 },
    alerts: [
      { type: 'weekly-digest', enabled: true }
    ]
  },
  {
    name: 'Diego Alcázar',
    email: 'diego.alcazar@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Científico de datos que especializa modelos cívicos y de movilidad.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/diego-alcazar.pdf',
    skills: ['Python', 'dbt', 'Civic data'],
    photoUrl: 'https://images.jobportal.dev/users/diego.jpg',
    stats: { applicationsSent: 0, profileViews: 67 },
    alerts: [
      { type: 'weekly-digest', enabled: true },
      { type: 'data-impact', enabled: true }
    ]
  },
  {
    name: 'Natalia Vera',
    email: 'natalia.vera@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Service designer enfocada en salud comunitaria y procesos participativos.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/natalia-vera.pdf',
    skills: ['Service design', 'Journey mapping', 'Co-creation'],
    photoUrl: 'https://images.jobportal.dev/users/natalia.jpg',
    stats: { applicationsSent: 0, profileViews: 45 },
    alerts: [
      { type: 'weekly-digest', enabled: true }
    ]
  },
  {
    name: 'Rodrigo Méndez',
    email: 'rodrigo.mendez@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'QA engineer que documenta suites end-to-end y automatiza regresiones.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/rodrigo-mendez.pdf',
    skills: ['Playwright', 'Cypress', 'Regression testing'],
    photoUrl: 'https://images.jobportal.dev/users/rodrigo.jpg',
    stats: { applicationsSent: 0, profileViews: 37 },
    alerts: [
      { type: 'weekly-digest', enabled: true },
      { type: 'qa-remote', enabled: true }
    ]
  },
  {
    name: 'Ana Sofía Calle',
    email: 'ana.calle@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Storyteller y community builder que diseña experiencias híbridas.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/ana-calle.pdf',
    skills: ['Community', 'Storytelling', 'Notion'],
    photoUrl: 'https://images.jobportal.dev/users/ana.jpg',
    stats: { applicationsSent: 0, profileViews: 32 },
    alerts: [
      { type: 'weekly-digest', enabled: true }
    ]
  },
  {
    name: 'Bruno Serrano',
    email: 'bruno.serrano@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Product manager que conecta squads de impacto y datos urbanos.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/bruno-serrano.pdf',
    skills: ['Product strategy', 'OKRs', 'User research'],
    photoUrl: 'https://images.jobportal.dev/users/bruno.jpg',
    stats: { applicationsSent: 0, profileViews: 52 },
    alerts: [
      { type: 'weekly-digest', enabled: true },
      { type: 'product-latam', enabled: true }
    ]
  },
  {
    name: 'Elisa Godínez',
    email: 'elisa.godinez@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'XR prototyper que combina investigación educativa y motion design.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/elisa-godinez.pdf',
    skills: ['Unity', 'Blender', 'UX Research'],
    photoUrl: 'https://images.jobportal.dev/users/elisa.jpg',
    stats: { applicationsSent: 0, profileViews: 33 },
    alerts: [
      { type: 'weekly-digest', enabled: true }
    ]
  },
  {
    name: 'Javier Quiroga',
    email: 'javier.quiroga@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'DevOps engineer que asegura despliegues reproducibles y monitoreo clear.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/javier-quiroga.pdf',
    skills: ['Kubernetes', 'Terraform', 'Monitoring'],
    photoUrl: 'https://images.jobportal.dev/users/javier.jpg',
    stats: { applicationsSent: 0, profileViews: 49 },
    alerts: [
      { type: 'weekly-digest', enabled: true }
    ]
  },
  {
    name: 'Paulina Neira',
    email: 'paulina.neira@seedmail.dev',
    password: 'SeedUser123!',
    role: 'user',
    bio: 'Investigadora cualitativa para programas de desarrollo social.',
    resumeUrl: 'https://cdn.jobportal.dev/resumes/paulina-neira.pdf',
    skills: ['Research', 'Interviews', 'Synthesis'],
    photoUrl: 'https://images.jobportal.dev/users/paulina.jpg',
    stats: { applicationsSent: 0, profileViews: 35 },
    alerts: [
      { type: 'weekly-digest', enabled: true }
    ]
  },
  {
    name: 'Laura Izarra',
    email: 'laura.izarra@rafaga.dev',
    password: 'SeedUser123!',
    role: 'employer',
    bio: 'Talent lead en Ráfaga que coordina programas de becarios.',
    skills: ['Hiring', 'People ops', 'Culture'],
    photoUrl: 'https://images.jobportal.dev/users/laura.jpg',
    stats: { applicationsSent: 0, profileViews: 91 },
    alerts: [
      { type: 'talent-updates', enabled: true }
    ]
  },
  {
    name: 'Mauricio Lobo',
    email: 'mauricio.lobo@selva.dev',
    password: 'SeedUser123!',
    role: 'employer',
    bio: 'Head of People en Selva con foco en equipos híbridos.',
    skills: ['Hiring', 'Employer branding'],
    photoUrl: 'https://images.jobportal.dev/users/mauricio.jpg',
    stats: { applicationsSent: 0, profileViews: 88 },
    alerts: [
      { type: 'talent-updates', enabled: true }
    ]
  },
  {
    name: 'Gabriela Obando',
    email: 'gabriela.obando@matiz.dev',
    password: 'SeedUser123!',
    role: 'employer',
    bio: 'Community manager en Matiz que activa programas de mentores.',
    skills: ['Community', 'People ops'],
    photoUrl: 'https://images.jobportal.dev/users/gabriela.jpg',
    stats: { applicationsSent: 0, profileViews: 76 },
    alerts: [
      { type: 'talent-updates', enabled: true }
    ]
  },
  {
    name: 'Sebastián Pardo',
    email: 'sebastian.pardo@pulsar.dev',
    password: 'SeedUser123!',
    role: 'employer',
    bio: 'Co-founder en Pulsar que lidera squads de inteligencia.',
    skills: ['Data leadership', 'Hiring'],
    photoUrl: 'https://images.jobportal.dev/users/sebastian.jpg',
    stats: { applicationsSent: 0, profileViews: 84 },
    alerts: [
      { type: 'talent-updates', enabled: true }
    ]
  },
  {
    name: 'Alicia Henríquez',
    email: 'alicia.henriquez@nebula.dev',
    password: 'SeedUser123!',
    role: 'employer',
    bio: 'People partner en Nebula Kitchen enfocado en cultura.',
    skills: ['Hiring', 'People analytics'],
    photoUrl: 'https://images.jobportal.dev/users/alicia.jpg',
    stats: { applicationsSent: 0, profileViews: 79 },
    alerts: [
      { type: 'talent-updates', enabled: true }
    ]
  },
  {
    name: 'Hugo Salim',
    email: 'hugo.salim@faro.dev',
    password: 'SeedUser123!',
    role: 'employer',
    bio: 'Director en Faro Civic Systems y mentor de equipos GovTech.',
    skills: ['GovTech', 'Partnerships'],
    photoUrl: 'https://images.jobportal.dev/users/hugo.jpg',
    stats: { applicationsSent: 0, profileViews: 83 },
    alerts: [
      { type: 'talent-updates', enabled: true }
    ]
  }
]

const jobBlueprints = [
  {
    company: 'Ráfaga Mobility Lab',
    title: 'React Native Engineer - Microtransporte',
    location: 'Ciudad de México, México',
    salaryRange: { min: 3200, max: 4200, currency: 'USD' },
    contractType: 'full-time',
    description: 'Integra sensores BLE y optimiza pantallas riders para nuevas rutas piloto.',
    requiredExperience: '3+ años con React Native y Bluetooth stack.',
    status: 'active'
  },
  {
    company: 'Ráfaga Mobility Lab',
    title: 'Embedded QA Analyst',
    location: 'CDMX / Puebla (Híbrido)',
    salaryRange: { min: 2800, max: 3300, currency: 'USD' },
    contractType: 'full-time',
    description: 'Levanta planes de prueba para firmware y coordina test de campo con hardware.',
    requiredExperience: '2+ años en QA de hardware y protocolos CAN.',
    status: 'active'
  },
  {
    company: 'Ráfaga Mobility Lab',
    title: 'Mobility Partnerships Fellow',
    location: 'Remoto con viajes',
    salaryRange: { min: 1800, max: 2100, currency: 'USD' },
    contractType: 'contract',
    description: 'Investiga ciudades piloto y traduce aprendizajes de campo en briefs accionables.',
    requiredExperience: 'Research, growth y manejo de datos urbanos.',
    status: 'paused'
  },
  {
    company: 'Selva Cloud Cartography',
    title: 'Site Reliability Intern',
    location: 'Lima, Perú (Remoto)',
    salaryRange: { min: 1200, max: 1400, currency: 'USD' },
    contractType: 'internship',
    description: 'Aprende a mapear alertas y a escribir runbooks que otros squads puedan ejecutar.',
    requiredExperience: 'Linux, scripting y ganas de aprender observabilidad.',
    status: 'active'
  },
  {
    company: 'Selva Cloud Cartography',
    title: 'DevOps Engineer - Cartografía Cloud',
    location: 'Remoto LATAM',
    salaryRange: { min: 3600, max: 4400, currency: 'USD' },
    contractType: 'full-time',
    description: 'Automatiza pipelines IaC y arma dashboards para monitorear cooperativas conectadas.',
    requiredExperience: '4+ años con Terraform, Kubernetes y observabilidad.',
    status: 'active'
  },
  {
    company: 'Selva Cloud Cartography',
    title: 'Customer Success Partner',
    location: 'Quito / Lima (Remoto)',
    salaryRange: { min: 2500, max: 3000, currency: 'USD' },
    contractType: 'full-time',
    description: 'Convierte tickets técnicos en guías claras y entrenamientos para equipos públicos.',
    requiredExperience: 'Experiencia en soporte B2B técnico.',
    status: 'active'
  },
  {
    company: 'Matiz Learning Lab',
    title: 'Curriculum Writer para microcursos creativos',
    location: 'Bogotá, Colombia',
    salaryRange: { min: 2000, max: 2400, currency: 'USD' },
    contractType: 'full-time',
    description: 'Diseña scripts y actividades que combinen video corto, worksheets y retos colaborativos.',
    requiredExperience: 'Experiencia escribiendo guías educativas o talleres.',
    status: 'active'
  },
  {
    company: 'Matiz Learning Lab',
    title: 'Learning Operations Lead',
    location: 'Bogotá / Remoto',
    salaryRange: { min: 2600, max: 3100, currency: 'USD' },
    contractType: 'full-time',
    description: 'Coordina agenda de mentores, define métricas por cohorte y arma reportes para sponsors.',
    requiredExperience: '3+ años liderando operaciones académicas.',
    status: 'active'
  },
  {
    company: 'Matiz Learning Lab',
    title: 'Motion Designer para cápsulas educativas',
    location: 'Remoto LATAM',
    salaryRange: { min: 2100, max: 2600, currency: 'USD' },
    contractType: 'contract',
    description: 'Animación 2D con look and feel friendly para nutrir la librería de Matiz en TikTok.',
    requiredExperience: 'After Effects y sentido pedagógico.',
    status: 'draft'
  },
  {
    company: 'Pulsar Analytics Coop',
    title: 'Data Analyst - Ciudades Inteligentes',
    location: 'Quito, Ecuador (Híbrido)',
    salaryRange: { min: 2400, max: 2800, currency: 'USD' },
    contractType: 'full-time',
    description: 'Levanta paneles de gasto público y acompaña a equipos municipales en decisiones basadas en datos.',
    requiredExperience: 'Excel avanzado, SQL y visualización.',
    status: 'active'
  },
  {
    company: 'Pulsar Analytics Coop',
    title: 'Analytics Engineer',
    location: 'Remoto LATAM',
    salaryRange: { min: 3200, max: 3800, currency: 'USD' },
    contractType: 'full-time',
    description: 'Construye modelos en dbt y asegura linaje de datos para proyectos sociales.',
    requiredExperience: '3+ años en ingeniería de datos moderna.',
    status: 'active'
  },
  {
    company: 'Pulsar Analytics Coop',
    title: 'Research Fellow - Impacto',
    location: 'Quito / Remoto',
    salaryRange: { min: 1700, max: 2000, currency: 'USD' },
    contractType: 'temporary',
    description: 'Documenta estudios de caso y convierte insights en reportes listos para aliados.',
    requiredExperience: 'Background en investigación y redacción.',
    status: 'paused'
  },
  {
    company: 'Nebula Kitchen OS',
    title: 'Backend Node Developer',
    location: 'Santiago, Chile (Híbrido)',
    salaryRange: { min: 3100, max: 3700, currency: 'USD' },
    contractType: 'full-time',
    description: 'Integra sensores IoT y optimiza APIs que coordinan inventario en cocinas compartidas.',
    requiredExperience: 'Node.js, MQTT y bases de datos en tiempo real.',
    status: 'active'
  },
  {
    company: 'Nebula Kitchen OS',
    title: 'Community Success Manager',
    location: 'Santiago / Remoto',
    salaryRange: { min: 2200, max: 2600, currency: 'USD' },
    contractType: 'full-time',
    description: 'Acompaña a chefs residentes, arma rituales y documenta mejoras de procesos culinarios.',
    requiredExperience: 'Customer success o foodservice.',
    status: 'active'
  },
  {
    company: 'Costa Dev Commons',
    title: 'Delivery Lead - proyectos GovTech',
    location: 'Ciudad de Panamá, Panamá',
    salaryRange: { min: 3300, max: 4000, currency: 'USD' },
    contractType: 'full-time',
    description: 'Asegura cadencia de squads distribuidos y facilita retrospectivas accionables.',
    requiredExperience: '5+ años gestionando proyectos ágiles.',
    status: 'active'
  },
  {
    company: 'Costa Dev Commons',
    title: 'QA Analyst - clientes fintech',
    location: 'Remoto LATAM',
    salaryRange: { min: 2300, max: 2600, currency: 'USD' },
    contractType: 'full-time',
    description: 'Escribe suites de prueba end-to-end y documenta checklists de regresión.',
    requiredExperience: '2+ años en QA automatizado.',
    status: 'active'
  },
  {
    company: 'Costa Dev Commons',
    title: 'Talent Partner',
    location: 'Remoto',
    salaryRange: { min: 1900, max: 2200, currency: 'USD' },
    contractType: 'part-time',
    description: 'Sourcing creativo, entrevistas culturales y acompañamiento de candidatos.',
    requiredExperience: 'Experiencia previa en recruiting tech.',
    status: 'active'
  },
  {
    company: 'Bruma XR Forge',
    title: 'Unity Developer - Museos',
    location: 'Buenos Aires, Argentina',
    salaryRange: { min: 3000, max: 3600, currency: 'USD' },
    contractType: 'full-time',
    description: 'Prototipa experiencias XR educativas y optimiza performance para visores standalone.',
    requiredExperience: 'Unity, C# y optimización gráfica.',
    status: 'active'
  },
  {
    company: 'Bruma XR Forge',
    title: 'XR Technical Artist',
    location: 'Remoto LATAM',
    salaryRange: { min: 2600, max: 3200, currency: 'USD' },
    contractType: 'contract',
    description: 'Crea shaders responsivos y guía a artistas junior en pipelines XR.',
    requiredExperience: 'Render pipelines y arte técnico.',
    status: 'active'
  },
  {
    company: 'Prisma Health Build',
    title: 'Product Manager - Clínicas comunitarias',
    location: 'Guadalajara, México (Híbrido)',
    salaryRange: { min: 3400, max: 4100, currency: 'USD' },
    contractType: 'full-time',
    description: 'Prioriza roadmap junto a médicas y diseña tableros para equipos de campo.',
    requiredExperience: '4+ años liderando producto en salud o impacto.',
    status: 'active'
  },
  {
    company: 'Prisma Health Build',
    title: 'Full Stack Engineer - Low code',
    location: 'Remoto México',
    salaryRange: { min: 3200, max: 3800, currency: 'USD' },
    contractType: 'full-time',
    description: 'Construye módulos en React + Node y adapta integraciones con proveedores públicos.',
    requiredExperience: '3+ años con stacks JS modernos.',
    status: 'active'
  },
  {
    company: 'Andén Robotics Collective',
    title: 'Mechatronics Intern',
    location: 'Rosario, Argentina',
    salaryRange: { min: 900, max: 1100, currency: 'USD' },
    contractType: 'internship',
    description: 'Acompaña talleres en colegios y ayuda a documentar kits DIY de robótica.',
    requiredExperience: 'Estudiante de ingeniería con nociones de electrónica.',
    status: 'active'
  },
  {
    company: 'Andén Robotics Collective',
    title: 'Firmware Engineer - Kits educativos',
    location: 'Rosario / Remoto',
    salaryRange: { min: 2800, max: 3300, currency: 'USD' },
    contractType: 'full-time',
    description: 'Crea firmware abierto y pruebas automatizadas para módulos didácticos.',
    requiredExperience: 'Experiencia con microcontroladores y C/C++.',
    status: 'active'
  },
  {
    company: 'Faro Civic Systems',
    title: 'Policy Intelligence Lead',
    location: 'Montevideo, Uruguay',
    salaryRange: { min: 3100, max: 3600, currency: 'USD' },
    contractType: 'full-time',
    description: 'Coordina analistas para transformar datasets públicos en alertas ejecutables.',
    requiredExperience: 'Políticas públicas + analítica de datos.',
    status: 'active'
  },
  {
    company: 'Faro Civic Systems',
    title: 'Senior Frontend GovTech',
    location: 'Montevideo / Remoto',
    salaryRange: { min: 3000, max: 3700, currency: 'USD' },
    contractType: 'full-time',
    description: 'Construye UI accesibles para portales de datos y herramientas de cabildo.',
    requiredExperience: 'React, accesibilidad AA y pruebas.',
    status: 'active'
  }
]

const resourceSeed = [
  {
    title: 'Playbook para retros async con squads pequeños',
    category: 'Productividad',
    content: 'Guía paso a paso para correr retrospectivas en 30 minutos usando Miro y FigJam.'
  },
  {
    title: 'Guía rápida para CVs modulares en Figma',
    category: 'Branding',
    content: 'Plantilla editable con layouts intercambiables y ejemplos reales de métricas.'
  },
  {
    title: 'Checklist para paneles técnicos remotos',
    category: 'Carrera',
    content: 'Documento con pasos para preparar entrevistas técnicas y paneles colaborativos.'
  },
  {
    title: 'Kit de mensajes para networking frío',
    category: 'Carrera',
    content: 'Snippets listos para enviar a hiring managers y mentores en LinkedIn.'
  },
  {
    title: 'Canvas de roadmap personal trimestral',
    category: 'Productividad',
    content: 'Formato para definir experimentos, métricas y celebraciones por cada trimestre.'
  },
  {
    title: 'Playbook de handoff entre diseño y dev',
    category: 'Producto',
    content: 'Checklist con entregables mínimos, rituales y tableros compartidos.'
  },
  {
    title: 'Mini curso para métricas de impacto',
    category: 'Data',
    content: 'Secuencia de 5 lecciones para elegir KPIs accionables en proyectos sociales.'
  },
  {
    title: 'Guión de mock interview para PMs',
    category: 'Carrera',
    content: 'Preguntas abiertas, rúbrica y formato de feedback para prácticas express.'
  },
  {
    title: 'Taller express de storytelling visual',
    category: 'Branding',
    content: 'Slides base y ejercicios para que squads cuenten aprendizajes en 5 minutos.'
  },
  {
    title: 'Manual de supervivencia para trabajo remoto estudihack',
    category: 'Remoto',
    content: 'Tips de ergonomía, calendario y límites para estudiantes que trabajan desde casa.'
  }
]

const forumTopics = [
  {
    category: 'Portafolio',
    title: '¿Cómo mostrar experimentos fallidos en mi case study fintech?',
    content: 'Estoy rearmando mi case study y quiero incluir hipótesis que no salieron como esperaba. ¿Ideas para que luzca honesto sin perder foco?'
  },
  {
    category: 'Mentoría',
    title: 'Busco feedback para ritual de accountability en squads',
    content: 'Estoy piloteando un ritual semanal de accountability y quiero validar la dinámica antes de compartirla con mi cohorte.'
  },
  {
    category: 'Producto',
    title: 'Plantillas para discovery remoto con pacientes',
    content: 'En Prisma estamos entrevistando a médicas comunitarias y necesito plantillas sensibles al contexto.'
  },
  {
    category: 'Remoto',
    title: 'Tips para sobrevivir a los husos horarios',
    content: 'Mi squad ahora tiene miembros en Lisboa y Lima. ¿Cómo llevan las standups sin matar a nadie con horarios?'
  },
  {
    category: 'Branding',
    title: 'Revisión de CV modular estilo Matiz',
    content: '¿Alguien puede mirar mi CV inspirado en Matiz y decirme si el tono se siente muy académico?'
  },
  {
    category: 'Portafolio',
    title: '¿Vale la pena incluir prototipos en video?',
    content: 'Tengo prototipos grabados en Loom. No sé si agregarlos al portafolio o si distraen.'
  },
  {
    category: 'Carrera',
    title: 'Negociar contrato híbrido cuando estás en otra ciudad',
    content: 'Me ofrecieron rol híbrido en CDMX pero vivo en Mérida. ¿Alguien negoció vuelos u hospedaje?'
  },
  {
    category: 'Producto',
    title: 'Validar feature flag para clientes govtech',
    content: 'Necesito definir criterios para habilitar un feature flag en clientes públicos sin romper compliance.'
  },
  {
    category: 'Remoto',
    title: 'Setups ergonómicos low budget',
    content: 'Busco ideas de escritorios plegables para departamentos pequeños. Se aceptan hacks estudiantes.'
  },
  {
    category: 'Mentoría',
    title: 'Cómo estructurar feedback a duplas junior',
    content: 'Empecé a acompañar a dos devs junior y quiero un esquema simple para dar feedback semanal.'
  },
  {
    category: 'Data',
    title: 'Elección de métricas para tableros de impacto',
    content: '¿Qué KPIs usan cuando trabajan con municipios? Busco referencias para proyectos de agua.'
  },
  {
    category: 'Portafolio',
    title: '¿Cuánta info legal puedo compartir?',
    content: 'Trabajé con una cooperativa y no sé hasta dónde puedo mostrar pantallas sin romper NDA.'
  },
  {
    category: 'Carrera',
    title: 'Estrategia para referidos cuando estás cambiando de industria',
    content: 'Vengo de educación y quiero pasar a mobility. ¿Cómo piden referidos sin parecer spam?'
  },
  {
    category: 'Remoto',
    title: 'Herramientas para documentar acuerdos en squads async',
    content: '¿Qué usan para documentar acuerdos de equipo sin llenar de Notion a todo el mundo?'
  },
  {
    category: 'Branding',
    title: 'Moodboards colaborativos para procesos de identidad',
    content: 'Estoy guiando a una cooperativa y quiero un formato remoto para co-crear moodboards.'
  }
]

const commentSnippets = [
  'Yo mostraría la hipótesis fallida y el cambio que hiciste después, eso siempre suma honestidad.',
  'Probé algo parecido y terminé haciendo un canvas compartido. Te paso la plantilla si querés.',
  'Yo pediría vuelo mensual más viáticos. Argumentá con los costos de cambio de ciudad.',
  'Documentamos acuerdos en Loom + resumen de Notion y nos funcionó.',
  'Sumá un apartado de aprendizajes cuantificados, eso da mucha confianza.',
  'Lo resolví con timers estrictos y un template de FigJam, puedo compartirlo.'
]

const reviewSnippets = [
  'La mentoría semanal fue clave para tomar decisiones con datos reales.',
  'Hay espacio para mejorar comunicación, pero el squad escucha feedback.',
  'Aprendí más en dos meses que en un semestre completo, procesos muy humanos.',
  'El onboarding fue express y con recursos visuales súper claros.',
  'Recomiendo la cultura: siempre miden impacto y celebran avances pequeños.',
  'Mucho ownership y acompañamiento entre pares, aunque los deadlines son retadores.',
  'La stack es moderna y dan tiempo para aprender antes de exigir velocidad.',
  'Pagaron puntual y cuidaron cada demo, volvería a colaborar con gusto.'
]

const applicationStatuses = ['submitted', 'in-review', 'interview', 'offer', 'rejected']

const applicationMessages = [
  'Les dejo métricas de mi último lanzamiento y disponibilidad inmediata.',
  'Me interesa el rol porque enlaza impacto urbano y datos abiertos.',
  'Compartí caso de estudio con métricas de adopción, feliz de contarlo en entrevista.',
  'Tengo experiencia liderando squads híbridos y puedo arrancar en dos semanas.',
  'Dejo portafolio actualizado con prototipos de pruebas, gracias por leer.',
  'Ya trabajé con clientes públicos y puedo apoyar con compliance desde el día uno.'
]

const buildUserDocs = async () => {
  const docs = []
  for (const profile of userProfiles) {
    const { password, ...rest } = profile
    docs.push({
      ...rest,
      passwordHash: await hashPassword(password)
    })
  }
  return docs
}

const buildJobDocs = (companies) => {
  const mapByName = new Map(companies.map((company) => [company.name, company._id]))
  return jobBlueprints.map((job) => {
    const companyId = mapByName.get(job.company)
    if (!companyId) {
      throw new Error(`No encontré la compañía ${job.company} para el job ${job.title}`)
    }
    return {
      ...job,
      company: companyId,
      publishedAt: job.publishedAt || randomPastDate(45)
    }
  })
}

const buildResourceDocs = () => resourceSeed.map((resource) => ({
  ...resource,
  publishedAt: randomPastDate(60)
}))

const buildForumPosts = (users) => {
  const communityUsers = users.filter((user) => user.role === 'user')
  return forumTopics.map((topic, index) => {
    const author = communityUsers[index % communityUsers.length]
    const availableCommenters = communityUsers.filter((user) => user._id.toString() !== author._id.toString())
    const commenters = shuffle(availableCommenters).slice(0, 2 + (index % 2))
    const comments = commenters.map((commentAuthor) => ({
      author: commentAuthor._id,
      content: sample(commentSnippets),
      createdAt: randomPastDate(25)
    }))

    return {
      ...topic,
      author: author._id,
      publishedAt: randomPastDate(20),
      comments
    }
  })
}

const buildReviews = (users, companies) => {
  const seekers = users.filter((user) => user.role === 'user')
  const combos = new Set()
  const reviews = []

  while (reviews.length < 40) {
    const author = sample(seekers)
    const company = sample(companies)
    const key = `${author._id.toString()}-${company._id.toString()}`
    if (combos.has(key)) continue

    combos.add(key)
    reviews.push({
      author: author._id,
      company: company._id,
      rating: Math.floor(Math.random() * 3) + 3,
      comment: sample(reviewSnippets),
      publishedAt: randomPastDate(50)
    })
  }

  return reviews
}

const buildApplications = (users, jobs) => {
  const candidates = users.filter((user) => user.role === 'user')
  const eligibleJobs = jobs.filter((job) => job.status !== 'draft')
  const combos = new Set()
  const applications = []

  while (applications.length < 30) {
    const candidate = sample(candidates)
    const job = sample(eligibleJobs)
    const key = `${candidate._id.toString()}-${job._id.toString()}`
    if (combos.has(key)) continue

    combos.add(key)
    applications.push({
      candidate: candidate._id,
      job: job._id,
      status: sample(applicationStatuses),
      appliedAt: randomPastDate(35),
      message: sample(applicationMessages)
    })
  }

  return applications
}

const syncApplicationStats = async (applications) => {
  const counts = applications.reduce((acc, application) => {
    const key = application.candidate.toString()
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  await Promise.all(Object.entries(counts).map(([userId, total]) => User.findByIdAndUpdate(userId, {
    $set: { 'stats.applicationsSent': total },
    $max: { 'stats.profileViews': total * 12 }
  })))
}

const updateCompanyRatings = async () => {
  const stats = await Review.aggregate([
    {
      $group: {
        _id: '$company',
        avgRating: { $avg: '$rating' }
      }
    }
  ])

  await Promise.all(stats.map((stat) => Company.findByIdAndUpdate(stat._id, {
    avgRating: Number(stat.avgRating.toFixed(2))
  })))
}

const seed = async () => {
  await connectDatabase()

  console.log('🧹 Limpiando colecciones...')
  await Promise.all([
    Application.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    User.deleteMany({}),
    Review.deleteMany({}),
    Resource.deleteMany({}),
    ForumPost.deleteMany({})
  ])

  console.log('🏢 Insertando compañías...')
  const companies = await Company.insertMany(companiesSeed)

  console.log('👤 Insertando usuarios...')
  const preparedUsers = await buildUserDocs()
  const users = await User.insertMany(preparedUsers)

  console.log('💼 Insertando empleos...')
  const jobs = await Job.insertMany(buildJobDocs(companies))

  console.log('📄 Insertando postulaciones...')
  const applications = await Application.insertMany(buildApplications(users, jobs))
  await syncApplicationStats(applications)

  console.log('⭐ Insertando reviews...')
  await Review.insertMany(buildReviews(users, companies))
  await updateCompanyRatings()

  console.log('📚 Insertando recursos...')
  await Resource.insertMany(buildResourceDocs())

  console.log('💬 Insertando discusiones...')
  await ForumPost.insertMany(buildForumPosts(users))

  console.log('✅ Seed completado con éxito')
}

seed()
  .catch((error) => {
    console.error('❌ Error ejecutando seed', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.connection.close()
    console.log('🔌 Conexión cerrada')
  })
