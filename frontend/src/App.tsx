import React, { useState, useEffect } from 'react'
import {
  ShoppingCart,
  Heart,
  Search,
  Star,
  CheckCircle2,
  ChevronDown,
  User,
  ArrowRight,
  ShieldCheck,
  Phone,
  X,
  Plus,
  Minus,
  Trash2,
  FileText,
  Sparkles,
  CreditCard,
  Crown,
  Laptop,
  GraduationCap,
  PenTool,
  BookOpen,
  Code,
  Award,
  Globe,
  Sun,
  Moon,
  Mail,
  Lock,
  Headphones,
  RotateCcw,
} from 'lucide-react'

import type { Product, Transaction, Subscription, User as UserType } from './types'
import { NexusPayMemoModal } from './components/NexusPayMemoModal'
import { CheckoutModal } from './components/CheckoutModal'
import { AuthModal } from './components/AuthModal'
import { DashboardView } from './components/DashboardView'
import { translations, LANGUAGES, type Language } from './translations'
import ezopyLogo from './assets/ezopy.png'

export type ThemeMode = 'light' | 'night' | 'auto'

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun; desc: string }[] = [
  { mode: 'light', label: 'Light', icon: Sun, desc: 'Daylight clean theme' },
  { mode: 'night', label: 'Night', icon: Moon, desc: 'Deep dark night theme' },
  { mode: 'auto', label: 'Auto', icon: Laptop, desc: 'System settings appearance' },
]

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

interface CartItem {
  product: Product
  quantity: number
}

interface ExtendedProduct extends Product {
  rating?: number
  reviewsCount?: number
  categoryTag?: string
  bgTint?: string
  year?: '1st Year' | '2nd Year' | '3rd Year' | '4th Year'
  semester?: '1st Semester' | '2nd Semester' | '3rd Semester'
  prerequisite?: string
  credits?: string
  courseCode?: string
}

export default function App() {
  // Comprehensive Catalog: AI Tools + East West University (EWU) CSE Bachelor Curriculum
  const defaultCatalog: ExtendedProduct[] = [
    // ==========================================
    // AI SUBSCRIPTION PACKAGES
    // ==========================================
    {
      id: 'pkg-standard',
      title: 'Standard AI Research Pack',
      badge: '50% OFF',
      description: 'Essential research, grammar enhancement and paraphrasing for students and researchers.',
      product_type: 'PACKAGE',
      price_bdt: 299.0,
      features: ['ChatGPT Plus (Shared VIP)', 'Grammarly Premium EDU', 'Quillbot Premium Unlimited', '24/7 Server Access'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 142,
      categoryTag: 'AI Bundles',
      bgTint: 'from-blue-50 to-indigo-50/60',
    },
    {
      id: 'pkg-premium',
      title: 'Premium All-in-One AI Suite',
      badge: 'BEST SELLER',
      description: 'Full powerhouse suite with Turnitin AI & Plagiarism checker, Perplexity Pro & Stealth Writer.',
      product_type: 'PACKAGE',
      price_bdt: 599.0,
      features: ['ChatGPT Plus (GPT-4o)', 'Turnitin Plagiarism & AI Detector', 'Perplexity Pro Search', 'Stealth Writer Humanize'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 238,
      categoryTag: 'AI Bundles',
      bgTint: 'from-purple-50 to-pink-50/60',
    },
    {
      id: 'pkg-advance',
      title: 'Advance Master Enterprise',
      badge: 'ENTERPRISE',
      description: 'Uncapped digital empire package with Coursera Plus certificates, Claude 3.5 & Midjourney access.',
      product_type: 'PACKAGE',
      price_bdt: 850.0,
      features: ['All Premium Tools Included', 'Coursera Plus Verified', 'Udemy Business Access', 'WhatsApp VIP Concierge'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 96,
      categoryTag: 'AI Bundles',
      bgTint: 'from-amber-50 to-orange-50/60',
    },
    {
      id: 'pkg-seo',
      title: 'SEO & Copywriter Combo',
      badge: 'POPULAR',
      description: 'Engineered for digital agencies, marketers and bloggers needing high-volume paraphrasing.',
      product_type: 'PACKAGE',
      price_bdt: 299.0,
      features: ['Grammarly Premium EDU', 'Quillbot Unlimited Paraphrase', 'Keyword Explorer Tool', 'Zero Downtime'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 84,
      categoryTag: 'Writing & SEO',
      bgTint: 'from-emerald-50 to-teal-50/60',
    },

    // ==========================================
    // SINGLE AI TOOLS
    // ==========================================
    {
      id: 'tool-chatgpt',
      title: 'ChatGPT Plus (GPT-4o Turbo)',
      badge: 'INSTANT ACCESS',
      description: 'OpenAI most advanced multimodal model with Canvas Editor, Voice mode & DALL-E 3.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 200.0,
      features: ['GPT-4o Vision & Voice', 'Canvas Code Editor', 'Unlimited Custom GPTs'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 312,
      categoryTag: 'Single Tools',
      bgTint: 'from-emerald-50 to-green-50/60',
    },
    {
      id: 'tool-grammarly',
      title: 'Grammarly Premium',
      badge: 'TOP RATED',
      description: 'Comprehensive writing assistant, tone adjuster, clarity enhancer, and plagiarism auditor.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 200.0,
      features: ['Full Sentence Rewrites', 'Plagiarism Checker', 'Vocabulary Enhancement'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 185,
      categoryTag: 'Writing & SEO',
      bgTint: 'from-teal-50 to-cyan-50/60',
    },
    {
      id: 'tool-quillbot',
      title: 'Quillbot Premium',
      badge: 'UNLIMITED',
      description: 'The world-famous AI paraphraser with 7 distinct writing modes, summarizer & translator.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 200.0,
      features: ['Unlimited Words Paraphrasing', '7 Custom Writing Modes', 'Freeze Words & Summarizer'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 164,
      categoryTag: 'Writing & SEO',
      bgTint: 'from-yellow-50 to-amber-50/60',
    },
    {
      id: 'tool-stealth',
      title: 'Stealth Writer AI Humanizer',
      badge: '100% BYPASS',
      description: 'Undetectable AI humanizer that cleanly bypasses Turnitin, Originality.ai & GPTZero.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 399.0,
      features: ['Bypasses Turnitin Detection', 'Zero Flag Plagiarism', 'Natural Native Phrasing'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 119,
      categoryTag: 'Single Tools',
      bgTint: 'from-rose-50 to-red-50/60',
    },
    {
      id: 'tool-coursera',
      title: 'Coursera Plus Subscription',
      badge: 'CERTIFIED',
      description: 'Unlimited access to 7,000+ top courses & professional certificates from Google, IBM, Yale.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 200.0,
      features: ['Shareable Verified Certificates', 'Hands-on Applied Projects', 'Career Fast Track'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 204,
      categoryTag: 'Education',
      bgTint: 'from-blue-50 to-sky-50/60',
    },

    // =========================================================================
    // COMPUTER SCIENCE & ENGINEERING (B.SC. CSE) YEAR BUNDLES & COURSES
    // =========================================================================

    // --- B.SC. CSE YEAR ALL-IN-ONE PASSES ---
    {
      id: 'cse-yr-1-bundle',
      title: 'B.Sc. CSE 1st Year Complete Academic Pass',
      badge: '35 CREDITS BUNDLE',
      description: 'All 10 foundational courses across Semesters 1, 2 & 3. Full lecture slides, C programming labs, calculus notes & past papers.',
      product_type: 'PACKAGE',
      price_bdt: 499.0,
      features: ['ENG101, MAT101, CSE103 (C Lab)', 'ENG102, MAT102, CSE106, CHE109', 'PHY109, MAT104, CSE110 (OOP Lab)', 'Solved Mid & Final Exam Papers'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 156,
      categoryTag: 'Education',
      year: '1st Year',
      credits: '35 Credits',
      bgTint: 'from-emerald-50 to-teal-50',
    },
    {
      id: 'cse-yr-2-bundle',
      title: 'B.Sc. CSE 2nd Year Core Engineering Pass',
      badge: '35 CREDITS BUNDLE',
      description: 'Complete syllabus preparation for Data Structures, Circuits, Operating Systems and Linear Algebra.',
      product_type: 'PACKAGE',
      price_bdt: 549.0,
      features: ['GEN226, STA102, CSE200, CSE209', 'MAT205, CSE207 (Data Structures Lab)', 'CSE251, PHY209, CSE325 (OS Lab)', 'Weekly Coding Practice & Solutions'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 182,
      categoryTag: 'Education',
      year: '2nd Year',
      credits: '35 Credits',
      bgTint: 'from-blue-50 to-indigo-50',
    },
    {
      id: 'cse-yr-3-bundle',
      title: 'B.Sc. CSE 3rd Year Systems & Networks Pass',
      badge: '35 CREDITS BUNDLE',
      description: 'High-tier computer science core: Algorithms, Database SQL, DLD, Architecture and Computer Networks.',
      product_type: 'PACKAGE',
      price_bdt: 599.0,
      features: ['CSE246 (Algorithms Lab), CSE302 (DBMS)', 'CSE345 (DLD Lab), CSE347 (SAD)', 'CSE360 (Arch), CSE405 (Networks Lab)', 'Project Guidance & Code Repos'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 148,
      categoryTag: 'Education',
      year: '3rd Year',
      credits: '35 Credits',
      bgTint: 'from-purple-50 to-pink-50',
    },
    {
      id: 'cse-yr-4-bundle',
      title: 'B.Sc. CSE 4th Year Capstone & Career Pass',
      badge: '35 CREDITS BUNDLE',
      description: 'Complete Capstone Project (I, II, III) mentorship, Cyber Security, Green Computing & Project Management.',
      product_type: 'PACKAGE',
      price_bdt: 649.0,
      features: ['CSE400 Capstone Project-I, II, III Mentorship', 'CSE487 Cyber Security & Law', 'CSE407 Green Computing & CSE495 IT PM', 'Viva Prep & Thesis Template Files'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 112,
      categoryTag: 'Education',
      year: '4th Year',
      credits: '35 Credits',
      bgTint: 'from-amber-50 to-orange-50',
    },

    // --- 1ST YEAR COURSES ---
    {
      id: 'cse-eng101',
      title: 'ENG101 Basic English',
      courseCode: 'ENG101',
      badge: '1ST YEAR • SEM 1',
      description: 'Foundational English reading, writing comprehension and grammatical mechanics for engineers.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 120.0,
      features: ['Grammar Handouts & Reading Passages', 'Midterm & Final Sample Essays', 'Quiz Practice Sheets'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 88,
      categoryTag: 'Education',
      year: '1st Year',
      semester: '1st Semester',
      credits: '3 Credits',
      prerequisite: 'None',
      bgTint: 'from-slate-50 to-zinc-50',
    },
    {
      id: 'cse-mat101',
      title: 'MAT101 Differential and Integral Calculus',
      courseCode: 'MAT101',
      badge: '1ST YEAR • SEM 1',
      description: 'Limits, continuity, differentiation, integration techniques, applications in physical modeling.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 150.0,
      features: ['Step-by-Step Solved Problem Sets', 'Formula Reference Cheat Sheet', 'Previous 5 Years Exam Solutions'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 135,
      categoryTag: 'Education',
      year: '1st Year',
      semester: '1st Semester',
      credits: '3 Credits',
      prerequisite: 'None',
      bgTint: 'from-blue-50 to-cyan-50',
    },
    {
      id: 'cse-cse103',
      title: 'CSE103 Structured Programming',
      courseCode: 'CSE103',
      badge: 'CORE • SEM 1',
      description: 'Fundamental programming paradigms in C language: loops, arrays, pointers, structures & file I/O with lab.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 180.0,
      features: ['Complete C Lab Task Codes with Comments', 'Pointer & Memory Management Guide', 'Online Judge Problem Sets & Solutions'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 220,
      categoryTag: 'Education',
      year: '1st Year',
      semester: '1st Semester',
      credits: '3 + 1.5 = 4.5 Credits',
      prerequisite: 'None',
      bgTint: 'from-emerald-50 to-teal-50',
    },
    {
      id: 'cse-eng102',
      title: 'ENG102 Composition And Communication Skills',
      courseCode: 'ENG102',
      badge: '1ST YEAR • SEM 2',
      description: 'Professional technical writing, research reports, presentations and interpersonal communication.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 120.0,
      features: ['Formal Report Templates & Rubrics', 'Presentation Slide Frameworks', 'APA Referencing & Citation Notes'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 74,
      categoryTag: 'Education',
      year: '1st Year',
      semester: '2nd Semester',
      credits: '3 Credits',
      prerequisite: 'ENG101',
      bgTint: 'from-slate-50 to-gray-50',
    },
    {
      id: 'cse-mat102',
      title: 'MAT102 Differential Equations & Special Functions',
      courseCode: 'MAT102',
      badge: '1ST YEAR • SEM 2',
      description: 'First & higher order differential equations, Laplace transforms, Fourier series and Bessel functions.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 150.0,
      features: ['Laplace & Fourier Master Table', 'Homogeneous & Non-Homogeneous DE Solutions', 'Midterm Question Bank'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 110,
      categoryTag: 'Education',
      year: '1st Year',
      semester: '2nd Semester',
      credits: '3 Credits',
      prerequisite: 'MAT101',
      bgTint: 'from-blue-50 to-indigo-50',
    },
    {
      id: 'cse-cse106',
      title: 'CSE106 Discrete Mathematics',
      courseCode: 'CSE106',
      badge: 'CORE • SEM 2',
      description: 'Propositional logic, set theory, relations, graph theory, combinatorics and mathematical induction.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 160.0,
      features: ['Logic Proofs & Truth Tables', 'Graph Theory Visual Exercises', 'Rosen Textbook Chapter Solutions'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 140,
      categoryTag: 'Education',
      year: '1st Year',
      semester: '2nd Semester',
      credits: '3 Credits',
      prerequisite: 'CSE103',
      bgTint: 'from-purple-50 to-violet-50',
    },
    {
      id: 'cse-che109',
      title: 'CHE109 Engineering Chemistry',
      courseCode: 'CHE109',
      badge: '1ST YEAR • SEM 2',
      description: 'Chemical kinetics, thermodynamics, electrochemistry, semiconductors and polymers with lab experiments.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 140.0,
      features: ['Chemistry Lab Report Manual & Data', 'Electrochemistry Solved Numericals', 'Exam Summary Cheat Sheets'],
      is_active: true,
      rating: 4.7,
      reviewsCount: 65,
      categoryTag: 'Education',
      year: '1st Year',
      semester: '2nd Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'None',
      bgTint: 'from-rose-50 to-pink-50',
    },
    {
      id: 'cse-phy109',
      title: 'PHY109 Engineering Physics-I',
      courseCode: 'PHY109',
      badge: '1ST YEAR • SEM 3',
      description: 'Mechanics, waves, oscillations, optics and thermal physics accompanied by hands-on laboratory setups.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 150.0,
      features: ['Physics Lab Manual & Calculations', 'Oscillations & Waves Formulas', 'Past Trimester Exam Solutions'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 92,
      categoryTag: 'Education',
      year: '1st Year',
      semester: '3rd Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'MAT102',
      bgTint: 'from-cyan-50 to-sky-50',
    },
    {
      id: 'cse-mat104',
      title: 'MAT104 Coordinate Geometry & Vector Analysis',
      courseCode: 'MAT104',
      badge: '1ST YEAR • SEM 3',
      description: '2D & 3D coordinate geometry, vector algebra, gradient, divergence, curl, line and surface integrals.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 150.0,
      features: ['Vector Calculus Master Notes', 'Green, Gauss & Stokes Theorem Proofs', 'Practice Quiz Solutions'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 88,
      categoryTag: 'Education',
      year: '1st Year',
      semester: '3rd Semester',
      credits: '3 Credits',
      prerequisite: 'MAT101',
      bgTint: 'from-blue-50 to-indigo-50',
    },
    {
      id: 'cse-cse110',
      title: 'CSE110 Object Oriented Programming',
      courseCode: 'CSE110',
      badge: 'CORE • SEM 3',
      description: 'OOP concepts: classes, inheritance, polymorphism, encapsulation, abstraction in Java/C++ with full lab.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 180.0,
      features: ['Java OOP Project Source Code', 'Lab Exam Solutions & GUI Examples', 'Exception Handling & Collections Guide'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 198,
      categoryTag: 'Education',
      year: '1st Year',
      semester: '3rd Semester',
      credits: '3 + 1.5 = 4.5 Credits',
      prerequisite: 'CSE106',
      bgTint: 'from-emerald-50 to-teal-50',
    },

    // --- 2ND YEAR COURSES ---
    {
      id: 'cse-gen226',
      title: 'GEN226 Emergence of Bangladesh',
      courseCode: 'GEN226',
      badge: '2ND YEAR • SEM 1',
      description: 'Historical events leading to 1971 Liberation War, Bengali national identity and constitutional evolution.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 120.0,
      features: ['Chronological Timeline Handouts', 'Key Question Answers for Mid & Final', 'Summary Slides'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 120,
      categoryTag: 'Education',
      year: '2nd Year',
      semester: '1st Semester',
      credits: '3 Credits',
      prerequisite: 'ENG102',
      bgTint: 'from-green-50 to-emerald-50',
    },
    {
      id: 'cse-sta102',
      title: 'STA102 Statistics and Probability',
      courseCode: 'STA102',
      badge: '2ND YEAR • SEM 1',
      description: 'Probability distributions, hypothesis testing, regression analysis, ANOVA and statistical computing.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 150.0,
      features: ['Probability Distribution Formula Sheet', 'Hypothesis Testing Z/T-Test Worksheets', 'Solved Midterm Papers'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 95,
      categoryTag: 'Education',
      year: '2nd Year',
      semester: '1st Semester',
      credits: '3 Credits',
      prerequisite: 'None',
      bgTint: 'from-amber-50 to-yellow-50',
    },
    {
      id: 'cse-cse200',
      title: 'CSE200 Computer-Aided Engineering Drawing',
      courseCode: 'CSE200',
      badge: '2ND YEAR • SEM 1',
      description: 'AutoCAD design drafting: orthographic projections, isometric views, circuit schematics and 2D/3D layouts.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 130.0,
      features: ['AutoCAD .dwg Exercise Project Files', 'Step-by-Step Projection Tutorials', 'Lab Assignment Checklists'],
      is_active: true,
      rating: 4.7,
      reviewsCount: 60,
      categoryTag: 'Education',
      year: '2nd Year',
      semester: '1st Semester',
      credits: '0 + 1 = 1 Credit',
      prerequisite: 'None',
      bgTint: 'from-slate-50 to-zinc-50',
    },
    {
      id: 'cse-cse209',
      title: 'CSE209 Electrical Circuits',
      courseCode: 'CSE209',
      badge: '2ND YEAR • SEM 1',
      description: 'Ohm’s law, KVL/KCL, Thevenin/Norton equivalents, AC steady state analysis, resonance, RLC circuit lab.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 160.0,
      features: ['Circuit Simulation (Proteus/Multisim) Files', 'Thevenin & Norton Solved Examples', 'Lab Manual Calculations'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 110,
      categoryTag: 'Education',
      year: '2nd Year',
      semester: '1st Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'None',
      bgTint: 'from-blue-50 to-indigo-50',
    },
    {
      id: 'cse-mat205',
      title: 'MAT205 Linear Algebra and Complex Variables',
      courseCode: 'MAT205',
      badge: '2ND YEAR • SEM 2',
      description: 'Vector spaces, eigenvalues/eigenvectors, matrix diagonalization, complex integration and Cauchy-Riemann equations.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 160.0,
      features: ['Eigenvalues & Matrix Transformations Guide', 'Complex Residue Theorem Notes', 'Past 4 Trimester Final Papers'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 104,
      categoryTag: 'Education',
      year: '2nd Year',
      semester: '2nd Semester',
      credits: '3 Credits',
      prerequisite: 'MAT102',
      bgTint: 'from-indigo-50 to-purple-50',
    },
    {
      id: 'cse-cse207',
      title: 'CSE207 Data Structures',
      courseCode: 'CSE207',
      badge: 'CORE • SEM 2',
      description: 'Arrays, linked lists, stacks, queues, trees (BST, AVL), heaps, hashing, graph representations with C++/Java lab.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 190.0,
      features: ['All 12 Data Structure Implementations (C++/Java)', 'LeetCode/HackerRank Mapping for Midterm', 'Lab Exam Code Templates'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 245,
      categoryTag: 'Education',
      year: '2nd Year',
      semester: '2nd Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'CSE110',
      bgTint: 'from-emerald-50 to-teal-50',
    },
    {
      id: 'cse-cse251',
      title: 'CSE251 Electronic Circuits',
      courseCode: 'CSE251',
      badge: '2ND YEAR • SEM 2',
      description: 'Diodes, BJTs, MOSFETs, operational amplifiers, rectifiers, switching circuits, frequency response with lab.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 160.0,
      features: ['BJT & Op-Amp Circuit Solutions', 'Proteus Simulation Lab Files', 'Midterm & Final Preparation Guides'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 88,
      categoryTag: 'Education',
      year: '2nd Year',
      semester: '2nd Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'CSE209',
      bgTint: 'from-cyan-50 to-blue-50',
    },
    {
      id: 'cse-phy209',
      title: 'PHY209 Engineering Physics-II',
      courseCode: 'PHY209',
      badge: '2ND YEAR • SEM 3',
      description: 'Electromagnetism, Maxwell’s equations, quantum mechanics, wave-particle duality, atomic structure & lasers.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 150.0,
      features: ['Maxwell Equations Simplified Notes', 'Quantum Physics Problem Solutions', 'Exam Revision Cheat Sheet'],
      is_active: true,
      rating: 4.7,
      reviewsCount: 78,
      categoryTag: 'Education',
      year: '2nd Year',
      semester: '3rd Semester',
      credits: '3 Credits',
      prerequisite: 'MAT205',
      bgTint: 'from-sky-50 to-blue-50',
    },
    {
      id: 'cse-cse325',
      title: 'CSE325 Operating Systems',
      courseCode: 'CSE325',
      badge: 'CORE • SEM 3',
      description: 'Process management, CPU scheduling, synchronization, semaphores, deadlocks, memory virtualization, Linux OS lab.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 180.0,
      features: ['Linux Bash Scripting & Fork/Pipe C Code', 'Deadlock & Banker Algorithm Solved Problems', 'Page Replacement Simulation Programs'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 162,
      categoryTag: 'Education',
      year: '2nd Year',
      semester: '3rd Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'CSE207',
      bgTint: 'from-purple-50 to-indigo-50',
    },

    // --- 3RD YEAR COURSES ---
    {
      id: 'cse-cse246',
      title: 'CSE246 Algorithms',
      courseCode: 'CSE246',
      badge: 'CORE • SEM 1',
      description: 'Divide-and-conquer, Greedy, Dynamic Programming, Graph algorithms (Dijkstra, Bellman-Ford, Kruskal), NP-completeness.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 200.0,
      features: ['Dynamic Programming Pattern Playbook', 'Graph Algorithm Visual Implementations', 'Lab Tasks & Trimester Exam Question Bank'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 260,
      categoryTag: 'Education',
      year: '3rd Year',
      semester: '1st Semester',
      credits: '3 + 1.5 = 4.5 Credits',
      prerequisite: 'CSE207',
      bgTint: 'from-rose-50 to-orange-50',
    },
    {
      id: 'cse-cse302',
      title: 'CSE302 Database Systems',
      courseCode: 'CSE302',
      badge: 'CORE • SEM 1',
      description: 'Relational database model, ER diagrams, Normalization (1NF to BCNF), SQL queries, indexing, transactions with lab.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 190.0,
      features: ['Complex SQL Queries & Subquery Workbook', 'Normalization Step-by-Step Solved Proofs', 'Full Stack CRUD Database Project Source Code'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 215,
      categoryTag: 'Education',
      year: '3rd Year',
      semester: '1st Semester',
      credits: '3 + 1.5 = 4.5 Credits',
      prerequisite: 'CSE106',
      bgTint: 'from-emerald-50 to-green-50',
    },
    {
      id: 'cse-cse345',
      title: 'CSE345 Digital Logic Design',
      courseCode: 'CSE345',
      badge: '3RD YEAR • SEM 2',
      description: 'Boolean algebra, Karnaugh maps, combinational logic, sequential circuits, flip-flops, registers, counters with lab.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 170.0,
      features: ['Logisim Circuit Files & Lab Simulation', 'K-Map Minimization Worksheet', 'Finite State Machine Design Problems'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 115,
      categoryTag: 'Education',
      year: '3rd Year',
      semester: '2nd Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'CSE251',
      bgTint: 'from-amber-50 to-yellow-50',
    },
    {
      id: 'cse-cse347',
      title: 'CSE347 Information System Analysis and Design',
      courseCode: 'CSE347',
      badge: '3RD YEAR • SEM 2',
      description: 'SDLC, Agile/Scrum, Use-case models, UML diagrams, architectural patterns, system testing & documentation with project.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 170.0,
      features: ['Complete UML Diagrams (Class, Sequence, Activity)', 'SRS (Software Requirements Specification) Template', 'Project Defense Prep Guide'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 130,
      categoryTag: 'Education',
      year: '3rd Year',
      semester: '2nd Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'CSE302',
      bgTint: 'from-blue-50 to-teal-50',
    },
    {
      id: 'cse-cse360',
      title: 'CSE360 Computer Architecture',
      courseCode: 'CSE360',
      badge: '3RD YEAR • SEM 3',
      description: 'MIPS assembly, instruction set architecture, processor datapath & control, pipelining, hazards, memory hierarchy & cache.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 180.0,
      features: ['MIPS Assembly Programs & Mars Simulator Guide', 'Pipelining & Hazard Solved Numericals', 'Cache Memory Mapping Calculations'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 142,
      categoryTag: 'Education',
      year: '3rd Year',
      semester: '3rd Semester',
      credits: '3 Credits',
      prerequisite: 'CSE325',
      bgTint: 'from-indigo-50 to-violet-50',
    },
    {
      id: 'cse-cse405',
      title: 'CSE405 Computer Networks',
      courseCode: 'CSE405',
      badge: 'CORE • SEM 3',
      description: 'OSI & TCP/IP models, routing protocols (OSPF, BGP), transport layer (TCP/UDP flow control), socket programming, Cisco Packet Tracer.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 190.0,
      features: ['Cisco Packet Tracer Network Topology Labs', 'Python Socket Client-Server Programs', 'Subnetting & VLSM Speed Sheet'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 195,
      categoryTag: 'Education',
      year: '3rd Year',
      semester: '3rd Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'CSE246',
      bgTint: 'from-teal-50 to-emerald-50',
    },

    // --- 4TH YEAR COURSES & CAPSTONE ---
    {
      id: 'cse-cse400-1',
      title: 'CSE400 Capstone Project-I',
      courseCode: 'CSE400',
      badge: 'CAPSTONE • SEM 1',
      description: 'Problem formulation, literature review, requirement engineering, feasibility study and initial proposal defense.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 200.0,
      features: ['Approved Topic Ideas & Proposal Template', 'Literature Review Guide for IEEE Papers', 'Proposal Defense Slide Deck'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 175,
      categoryTag: 'Education',
      year: '4th Year',
      semester: '1st Semester',
      credits: '0 + 1 = 1 Credit',
      prerequisite: '100+ Credits Completed',
      bgTint: 'from-rose-50 to-pink-50',
    },
    {
      id: 'cse-cse407',
      title: 'CSE407 Green Computing',
      courseCode: 'CSE407',
      badge: '4TH YEAR • SEM 1',
      description: 'Energy-efficient algorithms, sustainable data centers, carbon footprint reduction and green cloud virtualization.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 150.0,
      features: ['Summary Lecture Notes', 'Case Studies in Green Cloud Infrastructure', 'Trimester Exam Revision Questions'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 68,
      categoryTag: 'Education',
      year: '4th Year',
      semester: '1st Semester',
      credits: '3 Credits',
      prerequisite: 'CSE405',
      bgTint: 'from-emerald-50 to-lime-50',
    },
    {
      id: 'cse-cse400-2',
      title: 'CSE400 Capstone Project-II',
      courseCode: 'CSE400',
      badge: 'CAPSTONE • SEM 2',
      description: 'System architectural design, implementation progress, prototype development and mid-term project evaluation.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 220.0,
      features: ['Architecture Design Diagrams Review', 'GitHub CI/CD Deployment Templates', 'Mid-Term Progress Report Template'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 160,
      categoryTag: 'Education',
      year: '4th Year',
      semester: '2nd Semester',
      credits: '0 + 2 = 2 Credits',
      prerequisite: 'CSE400 Capstone-I',
      bgTint: 'from-purple-50 to-indigo-50',
    },
    {
      id: 'cse-cse487',
      title: 'CSE487 Cyber Security, Ethics and Law',
      courseCode: 'CSE487',
      badge: '4TH YEAR • SEM 2',
      description: 'Cryptography (RSA, AES), ethical hacking basics, network vulnerabilities, digital forensics and cyber law in Bangladesh.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 180.0,
      features: ['Wireshark & Nmap Network Security Labs', 'Cryptography Mathematics & Ciphers Handout', 'Bangladesh Digital Security Act Summary'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 155,
      categoryTag: 'Education',
      year: '4th Year',
      semester: '2nd Semester',
      credits: '3 Credits',
      prerequisite: 'CSE405',
      bgTint: 'from-red-50 to-orange-50',
    },
    {
      id: 'cse-cse400-3',
      title: 'CSE400 Capstone Project-III',
      courseCode: 'CSE400',
      badge: 'CAPSTONE • SEM 3',
      description: 'Full software testing, production deployment, thesis book writing, IEEE conference paper drafting & final defense.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 250.0,
      features: ['Final Thesis Book LaTeX / Word Template', 'IEEE Conference Paper Formatting Template', 'Final Defense Q&A Preparation'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 190,
      categoryTag: 'Education',
      year: '4th Year',
      semester: '3rd Semester',
      credits: '0 + 3 = 3 Credits',
      prerequisite: 'CSE400 Capstone-II',
      bgTint: 'from-amber-50 to-yellow-50',
    },
    {
      id: 'cse-cse495',
      title: 'CSE495 IT Project Management & Entrepreneurship',
      courseCode: 'CSE495',
      badge: '4TH YEAR • SEM 3',
      description: 'Software estimation (COCOMO), risk management, Gantt charts, budgeting, startup launch strategy and pitching.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 160.0,
      features: ['COCOMO Calculation Worksheets', 'Startup Pitch Deck PowerPoint Template', 'Mid & Final Exam Solved Notes'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 110,
      categoryTag: 'Education',
      year: '4th Year',
      semester: '3rd Semester',
      credits: '3 Credits',
      prerequisite: 'CSE347',
      bgTint: 'from-blue-50 to-sky-50',
    },
    {
      id: 'cse-cse479',
      title: 'CSE479: Web Programming',
      courseCode: 'CSE479',
      badge: 'CORE • 4TH YEAR',
      description: 'Modern full-stack web engineering: HTML5, CSS3, JavaScript, React, Node.js, Express, REST APIs, state management & PostgreSQL/MongoDB.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 190.0,
      features: ['Full Stack MERN/PERN Project Codebases', 'Lab Assignment Tasks & Solutions', 'REST API Authentication & JWT Guides'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 165,
      categoryTag: 'Education',
      year: '4th Year',
      semester: '2nd Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'CSE302 Database Systems',
      bgTint: 'from-emerald-50 to-teal-50',
    },
    {
      id: 'cse-cse442',
      title: 'CSE442: Microprocessors and Microcontrollers',
      courseCode: 'CSE442',
      badge: 'CORE • 4TH YEAR',
      description: 'Intel 8086 microprocessor architecture, assembly language programming, 8051/AVR microcontrollers, interrupts, ADC/DAC & hardware interfacing lab.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 180.0,
      features: ['8086 Assembly Emulator Code Sets', 'Proteus Microcontroller Interfacing Labs', 'Mid & Final Exam Solved Numericals'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 130,
      categoryTag: 'Education',
      year: '4th Year',
      semester: '1st Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'CSE345 Digital Logic Design',
      bgTint: 'from-indigo-50 to-blue-50',
    },
    {
      id: 'cse-cse412',
      title: 'CSE412: Software Engineering',
      courseCode: 'CSE412',
      badge: 'CORE • 4TH YEAR',
      description: 'Software life-cycle models, agile frameworks, architecture design patterns, testing (unit, integration), CI/CD pipelines & quality metrics.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 170.0,
      features: ['Software Architecture Pattern Guides', 'Unit & Integration Test Suites', 'Software Project Defense Rubrics'],
      is_active: true,
      rating: 4.9,
      reviewsCount: 145,
      categoryTag: 'Education',
      year: '4th Year',
      semester: '1st Semester',
      credits: '3 Credits',
      prerequisite: 'CSE347 SAD',
      bgTint: 'from-purple-50 to-pink-50',
    },
    {
      id: 'cse-cse399',
      title: 'CSE399: Cyber Ethics and Legal Framework',
      courseCode: 'CSE399',
      badge: 'CORE • 3RD YEAR',
      description: 'Ethical dilemmas in computing, intellectual property rights, data privacy laws, professional codes (ACM/IEEE), GDPR & cyber laws in Bangladesh.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 140.0,
      features: ['Case Study Analysis Notes', 'Cyber Law Summary Handouts', 'Mid & Final Exam Question Solutions'],
      is_active: true,
      rating: 4.8,
      reviewsCount: 95,
      categoryTag: 'Education',
      year: '3rd Year',
      semester: '2nd Semester',
      credits: '3 Credits',
      prerequisite: 'ENG102',
      bgTint: 'from-slate-50 to-zinc-50',
    },
    {
      id: 'cse-cse370',
      title: 'CSE370: Mobile Programming',
      courseCode: 'CSE370',
      badge: 'CORE • 3RD YEAR',
      description: 'Native & cross-platform mobile development (Android Kotlin & Flutter), lifecycle management, SQLite/Room, Firebase integration & lab.',
      product_type: 'SINGLE_TOOL',
      price_bdt: 190.0,
      features: ['Android Kotlin Project Source Code', 'Flutter Mobile App Templates', 'Firebase Auth & Cloud Firestore Labs'],
      is_active: true,
      rating: 5.0,
      reviewsCount: 178,
      categoryTag: 'Education',
      year: '3rd Year',
      semester: '3rd Semester',
      credits: '3 + 1 = 4 Credits',
      prerequisite: 'CSE110 OOP',
      bgTint: 'from-cyan-50 to-sky-50',
    },
  ]

  const [products, setProducts] = useState<ExtendedProduct[]>(defaultCatalog)
  const [user, setUser] = useState<UserType | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('ezopy_token'))
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  // E-Commerce UI State
  const [activeCategory, setActiveCategory] = useState<string>('Education') // Default to Education to highlight CSE courses!
  const [selectedYear, setSelectedYear] = useState<string>('All')
  const [educationViewMode, setEducationViewMode] = useState<'accordion' | 'grid'>('accordion')
  const [expandedCoreCourse, setExpandedCoreCourse] = useState<string | null>('CSE400')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [wishlist, setWishlist] = useState<string[]>([])

  // Multi-Language & i18n State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('ezopy_language') as Language) || 'en'
  })
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false)

  // Theme State: 'night', 'light', 'auto' (system settings)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ezopy_theme') as ThemeMode | null
    if (saved === 'light' || saved === 'night' || saved === 'auto') {
      return saved
    }
    return 'auto'
  })
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'night'>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      let isNight = false
      if (themeMode === 'night') {
        isNight = true
      } else if (themeMode === 'light') {
        isNight = false
      } else {
        // 'auto' matches device system settings
        isNight = mediaQuery.matches
      }

      setEffectiveTheme(isNight ? 'night' : 'light')
      if (isNight) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    applyTheme()
    localStorage.setItem('ezopy_theme', themeMode)

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'auto') {
        const isNight = e.matches
        setEffectiveTheme(isNight ? 'night' : 'light')
        if (isNight) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [themeMode])

  const t = translations[language] || translations.en
  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('ezopy_language', lang)
    setIsLangMenuOpen(false)
  }

  // Modal / Views
  const [activeView, setActiveView] = useState<'store' | 'dashboard' | 'memo-generator'>('store')
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<Product | null>(null)
  const [activeMemoData, setActiveMemoData] = useState<any | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingCheckoutProduct, setPendingCheckoutProduct] = useState<Product | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'refund' | 'terms' | null>(null)

  // Auto-dismiss any active notification after 8 seconds (max 10 seconds) without needing a page refresh
  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => {
      setNotification(null)
    }, 8000)
    return () => clearTimeout(timer)
  }, [notification])

  // Standalone memo generator state
  const [generatorTrxId, setGeneratorTrxId] = useState('LID02082191058')
  const [generatorAmount, setGeneratorAmount] = useState('599')
  const [generatorMode, setGeneratorMode] = useState<'FUND_TRANSFER' | 'BILL_PAYMENT'>('BILL_PAYMENT')
  const [generatorStudentId, setGeneratorStudentId] = useState('2022-1-60-019')
  const [generatorBiller, setGeneratorBiller] = useState('EZOPY MART TECH')

  // Load backend products, token user, and check SSLCommerz return query params
  useEffect(() => {
    document.title = 'EZOPY MART TECH'
    fetchProducts()
    if (token) {
      fetchCurrentUser(token)
    }

    const params = new URLSearchParams(window.location.search)
    const status = params.get('status')
    const tran_id = params.get('tran_id')
    const amount = params.get('amount')
    const val_id = params.get('val_id')
    const card_type = params.get('card_type')
    const bank_tran_id = params.get('bank_tran_id')

    if (status === 'success' && tran_id) {
      setNotification(`🎉 SSLCommerz Payment Successful! TrxID: ${tran_id} (৳ ${amount || ''})`)
      setTimeout(() => setNotification(null), 8000)
      setActiveMemoData({
        memo: {
          id: tran_id,
          transaction_id: tran_id,
          memo_type: 'BILL_PAYMENT',
          receiver_name: 'EZOPY MART TECH',
          receiver_bank: 'Dutch-Bangla Bank PLC',
          receiver_account: '107.110.198425',
          sender_card_type: card_type || 'VISA / MASTER / MFS',
          sender_card_number: 'SSL-GATEWAY-CARD',
          nexus_pay_id: val_id ? `VAL-${val_id.slice(-6)}` : 'SSL-VERIFIED',
          biller_name: 'EZOPY MART TECH',
          biller_code: '8810',
          student_id: '2022-1-60-019',
          fee_bdt: 0.0,
          formatted_timestamp: new Date().toLocaleString(),
          raw_reference: tran_id,
        },
        transaction: {
          transaction_id: tran_id,
          amount_bdt: parseFloat(amount || '599'),
          status: 'VERIFIED',
        },
      })

      // Sync transaction & activate subscription in backend with fallback
      const activeToken = token || localStorage.getItem('ezopy_token')
      if (activeToken) {
        fetch(`${BACKEND_URL}/api/v1/checkout/sync-ssl-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({
            tran_id,
            val_id,
            amount: parseFloat(amount || '0'),
            card_type,
            bank_tran_id,
          }),
        })
          .then(() => {
            refreshUserData(activeToken, user?.role === 'ADMIN')
          })
          .catch((e) => console.error('Failed to sync SSL order:', e))
      }

      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (status === 'failed') {
      setNotification(`❌ SSLCommerz payment was rejected or failed.`)
      setTimeout(() => setNotification(null), 8000)
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (status === 'cancelled') {
      setNotification(`⚠️ Payment was cancelled on the SSLCommerz gateway.`)
      setTimeout(() => setNotification(null), 8000)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [token])

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/products`)
      if (res.ok) {
        const apiData = await res.json()
        if (Array.isArray(apiData) && apiData.length > 0) {
          // Merge API data with the CSE courses catalog cleanly so courses are always present!
          const apiIds = new Set(apiData.map((x: any) => x.id))
          const cseOnly = defaultCatalog.filter((c) => !apiIds.has(c.id))
          const mergedApi = apiData.map((item: any, idx: number) => ({
            ...item,
            rating: 4.8 + ((idx * 3) % 3) / 10,
            reviewsCount: 110 + (idx * 27),
            categoryTag:
              item.categoryTag ||
              (item.title.toLowerCase().includes('coursera') || item.title.toLowerCase().includes('cse')
                ? 'Education'
                : item.product_type === 'PACKAGE'
                ? 'AI Bundles'
                : 'Single Tools'),
            bgTint: defaultCatalog[idx % defaultCatalog.length]?.bgTint || 'from-slate-50 to-gray-50',
          }))
          setProducts([...cseOnly, ...mergedApi])
        }
      }
    } catch (err) {
      console.warn('API fetch warning, using rich default catalog with CSE courses:', err)
    }
  }

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const u = await res.json()
        setUser(u)
        refreshUserData(authToken, u.role === 'ADMIN')
      } else {
        handleLogout()
      }
    } catch (err) {
      console.error('Error fetching current user', err)
    }
  }

  const refreshUserData = async (authToken = token, isAdmin = user?.role === 'ADMIN') => {
    if (!authToken) return
    try {
      const subRes = await fetch(`${BACKEND_URL}/api/v1/checkout/my-subscriptions`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (subRes.ok) setSubscriptions(await subRes.json())

      const trxRes = await fetch(`${BACKEND_URL}/api/v1/checkout/my-history`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (trxRes.ok) setTransactions(await trxRes.json())

      if (isAdmin) {
        const allRes = await fetch(`${BACKEND_URL}/api/v1/checkout/all-transactions`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        if (allRes.ok) setAllTransactions(await allRes.json())
      }
    } catch (err) {
      console.error('Error refreshing data', err)
    }
  }

  const handleLoginSuccess = (newToken: string, newUser: UserType) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('ezopy_token', newToken)
    setShowAuthModal(false)
    setNotification(`Welcome back, ${newUser.full_name}!`)
    setTimeout(() => setNotification(null), 4000)
    refreshUserData(newToken, newUser.role === 'ADMIN')
    // If user was trying to buy something before logging in, open checkout now
    if (pendingCheckoutProduct) {
      setSelectedProductForCheckout(pendingCheckoutProduct)
      setPendingCheckoutProduct(null)
    }
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('ezopy_token')
    setActiveView('store')
  }

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setIsCartOpen(true)
    setNotification(`Added "${product.title}" to cart`)
    setTimeout(() => setNotification(null), 2500)
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const totalCartAmount = cart.reduce((acc, item) => acc + item.product.price_bdt * item.quantity, 0)
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  // Direct SSLCommerz Checkout from Cart
  const handleCartSSLCommerzCheckout = async () => {
    if (cart.length === 0) return

    if (!user) {
      setIsCartOpen(false)
      setShowAuthModal(true)
      return
    }

    const primaryItem = cart[0].product
    const totalAmount = totalCartAmount

    try {
      setNotification('Connecting to SSLCommerz Sandbox...')
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${BACKEND_URL}/api/init-payment`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: totalAmount,
          product_name: `${cart.length} Course(s) (${primaryItem.title} & more)`,
          product_category: 'B.Sc. CSE Courses & Academic Subscriptions',
          customer: {
            name: user.full_name || 'EZOPY MART TECH Customer',
            email: user.email || 'customer@ezopymart.tech',
            phone: user.phone_number || '01700000000',
            address: 'Dhaka, Bangladesh',
            city: 'Dhaka',
            country: 'Bangladesh',
          },
        }),
      })

      const data = await response.json()
      if (data.status === 'SUCCESS' && (data.GatewayPageURL || data.redirectGatewayURL)) {
        window.location.href = data.GatewayPageURL || data.redirectGatewayURL
      } else {
        alert(data.message || 'Unable to open SSLCommerz Sandbox session')
      }
    } catch (e) {
      console.error(e)
      alert('Failed to connect to SSLCommerz sandbox server')
    }
  }

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  // Filter & Sort logic
  const filteredProducts = products
    .filter((p) => {
      // Category match
      let matchesCategory = false
      if (activeCategory === 'All') {
        matchesCategory = true
      } else if (activeCategory === 'Packages') {
        matchesCategory = p.product_type === 'PACKAGE'
      } else if (activeCategory === 'Single Tools') {
        matchesCategory = p.product_type === 'SINGLE_TOOL' && p.categoryTag !== 'Education'
      } else if (activeCategory === 'Education') {
        matchesCategory = Boolean(
          p.categoryTag === 'Education' ||
          (p.title && (p.title.includes('CSE') || p.title.includes('Coursera') || p.title.includes('ENG') || p.title.includes('MAT')))
        )
      } else {
        matchesCategory = p.categoryTag === activeCategory
      }

      // Year filter (if inside Education)
      if (matchesCategory && activeCategory === 'Education' && selectedYear !== 'All') {
        matchesCategory = p.year === selectedYear || (selectedYear === 'Bundles' && p.product_type === 'PACKAGE')
      }

      // Search match
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.courseCode && p.courseCode.toLowerCase().includes(q))

      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price_bdt - b.price_bdt
      if (sortBy === 'price-high') return b.price_bdt - a.price_bdt
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5)
      return 0
    })

  const handleCheckoutSuccess = (trx: Transaction) => {
    setSelectedProductForCheckout(null)
    refreshUserData()
    setActiveMemoData({
      memo: trx.memo,
      transaction: trx,
    })
    setNotification(`Success! "${trx.product_title || 'Product'}" is now added to your Active Subscriptions!`)
    setTimeout(() => setNotification(null), 5000)
  }

  const handleAdminUpdateStatus = async (trxId: string, status: string, creds?: string) => {
    if (!token) return
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/checkout/status/${trxId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          access_credentials: creds,
        }),
      })
      if (res.ok) {
        setNotification(`Transaction marked as ${status}`)
        setTimeout(() => setNotification(null), 3000)
        refreshUserData(token, true)
      }
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  const handleGenerateCustomMemo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/memos/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_id: generatorTrxId,
          memo_type: generatorMode,
          amount_bdt: parseFloat(generatorAmount) || 599.0,
          student_id: generatorStudentId,
          biller_name: generatorBiller,
        }),
      })
      const data = await res.json()
      setActiveMemoData({
        memo: data.memo,
        transaction: {
          transaction_id: generatorTrxId,
          amount_bdt: parseFloat(generatorAmount) || 599.0,
        },
      })
    } catch (err) {
      console.error('Failed to generate memo', err)
    }
  }

  return (
    <div
      dir={currentLangObj.dir}
      className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f17] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white transition-colors duration-200"
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-emerald-950/95 backdrop-blur-md text-white border border-emerald-500/50 text-xs shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 max-w-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold leading-relaxed">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/60 transition cursor-pointer flex-shrink-0"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#003d29] text-white text-xs py-2 px-4 sm:px-8 border-b border-emerald-900/50 relative z-50">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1700px] mx-auto">
          <div className="flex items-center gap-4 text-emerald-100/90 text-[11px]">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>Helpline:</span>
              <a href="tel:01531329222" className="hover:text-white transition underline underline-offset-2">01531329222</a>
              <span>/</span>
              <a href="tel:01560024587" className="hover:text-white transition underline underline-offset-2">01560024587</a>
            </span>
            <span className="hidden md:inline text-emerald-500">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-200">
              <svg className="w-3.5 h-3.5 fill-emerald-300 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <a href="https://wa.me/8801531329222" target="_blank" rel="noopener noreferrer" className="hover:text-white transition underline underline-offset-2">WhatsApp: +8801531329222</a>
            </span>
          </div>

          <div className="flex items-center gap-2 text-center text-[12px] font-semibold text-emerald-100">
            <span>{t.topBar.announcement}</span>
            <button
              onClick={() => {
                setActiveCategory('Education')
                setActiveView('store')
              }}
              className="underline text-amber-300 hover:text-amber-200 cursor-pointer font-bold"
            >
              {t.topBar.explore4Years}
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-emerald-200">
            <span className="bg-emerald-950/60 px-2 py-0.5 rounded text-emerald-300 font-bold border border-emerald-800">
              {t.topBar.currency}
            </span>
            <span className="hidden sm:inline text-emerald-300">{t.topBar.location}</span>

            {/* Theme Mode Selector (Night, Light, Auto) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsThemeMenuOpen(!isThemeMenuOpen)
                  setIsLangMenuOpen(false)
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-100 font-bold hover:text-white transition cursor-pointer shadow-xs active:scale-95"
                title="Theme: Night, Light, Auto based on system settings"
              >
                {themeMode === 'light' && <Sun className="w-3.5 h-3.5 text-amber-300" />}
                {themeMode === 'night' && <Moon className="w-3.5 h-3.5 text-sky-300" />}
                {themeMode === 'auto' && <Laptop className="w-3.5 h-3.5 text-emerald-300" />}
                <span className="text-[12px] font-bold capitalize">
                  {themeMode === 'auto' ? `Auto (${effectiveTheme})` : themeMode}
                </span>
                <ChevronDown className={`w-3 h-3 text-emerald-300 transition-transform ${isThemeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isThemeMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95"
                  style={{ minWidth: '13rem' }}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 flex items-center justify-between">
                    <span>Appearance / থিম</span>
                    <span className="text-[9px] lowercase font-normal text-emerald-600 dark:text-emerald-400">
                      active: {effectiveTheme}
                    </span>
                  </div>
                  <div className="py-1">
                    {THEME_OPTIONS.map((opt) => {
                      const IconComp = opt.icon
                      const isSelected = themeMode === opt.mode
                      return (
                        <button
                          key={opt.mode}
                          type="button"
                          onClick={() => {
                            setThemeMode(opt.mode)
                            setIsThemeMenuOpen(false)
                          }}
                          className={`w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-slate-800 text-[#003d29] dark:text-emerald-400 font-black'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className={`p-1 rounded-lg ${isSelected ? 'bg-emerald-100 dark:bg-slate-700 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                              <IconComp className="w-4 h-4" />
                            </span>
                            <span className="flex flex-col">
                              <span className="font-bold flex items-center gap-1.5">
                                {opt.label}
                                {opt.mode === 'auto' && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                                    System
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                {opt.desc}
                              </span>
                            </span>
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsLangMenuOpen(!isLangMenuOpen)
                  setIsThemeMenuOpen(false)
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-100 font-bold hover:text-white transition cursor-pointer shadow-xs active:scale-95"
                title="Change language / ভাষা পরিবর্তন করুন"
              >
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[12px]">{currentLangObj.flag} {currentLangObj.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-emerald-300 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95"
                  style={{ minWidth: '13rem' }}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
                    Select Language / ভাষা
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => handleLanguageChange(l.code)}
                        className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition cursor-pointer ${
                          language === l.code ? 'bg-emerald-50 dark:bg-slate-800 text-[#003d29] dark:text-emerald-400 font-black' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base leading-none">{l.flag}</span>
                          <span className="flex flex-col">
                            <span className="font-bold">{l.nativeName}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{l.name}</span>
                          </span>
                        </span>
                        {language === l.code && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0d131f]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo & Classy Tagline */}
          <div
            onClick={() => setActiveView('store')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 shadow-md p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden flex-shrink-0">
              <img src={ezopyLogo} alt="EZOPY MART TECH" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center uppercase">
                  EZOPY <span className="text-emerald-600 dark:text-emerald-400 ml-2 font-black">MART TECH</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-[#003d29] dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {t.nav.academicHub}
                </span>
                <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                  {t.nav.specialEdition}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {t.nav.dedication}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => {
                setActiveView('store')
                setActiveCategory('Education')
              }}
              className={`flex items-center gap-1.5 transition ${
                activeCategory === 'Education'
                  ? 'text-[#003d29] dark:text-emerald-400 font-black border-b-2 border-[#003d29] dark:border-emerald-400 pb-0.5'
                  : 'hover:text-[#003d29] dark:hover:text-emerald-400'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.nav.cseCourses}</span>
            </button>
            <button
              onClick={() => {
                setActiveView('store')
                setActiveCategory('AI Bundles')
              }}
              className={`hover:text-[#003d29] dark:hover:text-emerald-400 transition ${activeCategory === 'AI Bundles' ? 'text-[#003d29] dark:text-emerald-400 font-black border-b-2 border-[#003d29] dark:border-emerald-400 pb-0.5' : ''}`}
            >
              {t.nav.aiBundles}
            </button>
            <button
              onClick={() => {
                setActiveView('store')
                setActiveCategory('Single Tools')
              }}
              className={`hover:text-[#003d29] dark:hover:text-emerald-400 transition ${activeCategory === 'Single Tools' ? 'text-[#003d29] dark:text-emerald-400 font-black border-b-2 border-[#003d29] dark:border-emerald-400 pb-0.5' : ''}`}
            >
              {t.nav.singleTools}
            </button>
            <button
              onClick={() => setActiveView('memo-generator')}
              className={`flex items-center gap-1.5 transition ${
                activeView === 'memo-generator'
                  ? 'text-amber-800 dark:text-amber-300 font-bold'
                  : 'text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-500" />
              <span>{t.nav.billMemo}</span>
            </button>
            {user && (
              <button
                onClick={() => setActiveView('dashboard')}
                className={`transition ${activeView === 'dashboard' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'hover:text-emerald-700 dark:hover:text-emerald-400'}`}
              >
                {t.nav.dashboard} {user.role === 'ADMIN' ? `⚡ ${t.nav.admin}` : ''}
              </button>
            )}
          </nav>

          {/* Search Input Box */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder={t.nav.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 dark:focus:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full pl-4 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition placeholder-slate-400 dark:placeholder-slate-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          {/* Right Action Icons: Quick Theme Toggle, Account & Cart */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
            {/* Quick 1-Click Theme Toggle Button */}
            <button
              type="button"
              onClick={() => {
                const nextMode: ThemeMode = themeMode === 'light' ? 'night' : themeMode === 'night' ? 'auto' : 'light'
                setThemeMode(nextMode)
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title={`Theme: ${themeMode} (${effectiveTheme}). Click to switch: Night / Light / Auto`}
            >
              {effectiveTheme === 'night' ? (
                <Moon className="w-4 h-4 text-sky-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="hidden xl:inline capitalize text-[11px]">
                {themeMode === 'auto' ? `Auto` : themeMode}
              </span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700"
                >
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{user.full_name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold"
                >
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-[10px] text-slate-400 font-normal">{t.nav.studentUser}</span>
                  <span className="font-bold">{t.nav.account}</span>
                </div>
              </button>
            )}

            {/* Shopping Cart Pill Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#003d29] hover:bg-[#002f20] text-white transition shadow-md shadow-[#003d29]/20 active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline">
                {totalCartCount > 0 ? `৳ ${totalCartAmount}` : t.nav.cart}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 py-6 space-y-10">
        {activeView === 'dashboard' && user ? (
          <DashboardView
            user={user}
            token={token!}
            transactions={transactions}
            subscriptions={subscriptions}
            allTransactions={allTransactions}
            products={products}
            onRefresh={() => refreshUserData(token!, user.role === 'ADMIN')}
            onRefreshProducts={fetchProducts}
            onViewMemo={(trx) => setActiveMemoData({ memo: trx.memo, transaction: trx })}
            onUpdateStatus={handleAdminUpdateStatus}
          />
        ) : activeView === 'memo-generator' ? (
          /* Standalone Dutch-Bangla Bank Memo Generator */
          <div className="max-w-2xl mx-auto space-y-6 py-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Academic Tuition & Institutional Bill Payment Generator</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Dutch-Bangla Bank (NexusPay) Memo Generator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Generate authentic DBBL Bill Payment receipts for university tuition fees or Fund Transfer memos.
              </p>
            </div>

            <form
              onSubmit={handleGenerateCustomMemo}
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGeneratorMode('BILL_PAYMENT')}
                  className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition ${
                    generatorMode === 'BILL_PAYMENT'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  University Bill Payment (Tuition)
                </button>
                <button
                  type="button"
                  onClick={() => setGeneratorMode('FUND_TRANSFER')}
                  className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition ${
                    generatorMode === 'FUND_TRANSFER'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  Fund Transfer Memo
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Transaction ID (LID / TrxID)
                </label>
                <input
                  type="text"
                  value={generatorTrxId}
                  onChange={(e) => setGeneratorTrxId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#003d29] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Amount in BDT (৳)
                </label>
                <input
                  type="number"
                  value={generatorAmount}
                  onChange={(e) => setGeneratorAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#003d29] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              {generatorMode === 'BILL_PAYMENT' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                      Biller / Institution Name
                    </label>
                    <input
                      type="text"
                      value={generatorBiller}
                      onChange={(e) => setGeneratorBiller(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                      Student ID Number
                    </label>
                    <input
                      type="text"
                      value={generatorStudentId}
                      onChange={(e) => setGeneratorStudentId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-[#003d29] hover:bg-[#002f20] transition shadow-lg shadow-[#003d29]/20 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Generate Official NexusPay Receipt</span>
              </button>
            </form>
          </div>
        ) : (
          /* Main E-Commerce Shop View */
          <>
            {/* 4. SLEEK & COMPACT USER-FRIENDLY HERO BANNER */}
            <section className="relative rounded-2xl bg-gradient-to-r from-[#003d29] via-[#014730] to-[#0a2f22] text-white p-5 sm:p-7 md:p-8 overflow-hidden shadow-sm border border-emerald-800/40">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left Content */}
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-200 text-[11px] font-semibold backdrop-blur-xs border border-white/15">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.hero.badge}</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    {t.hero.headline}
                  </h1>

                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                    {t.hero.subtext}
                  </p>

                  {/* Actions & Highlights */}
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveCategory('Education')
                        const el = document.getElementById('products-grid-section')
                        el?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="px-5 py-2.5 rounded-full font-bold text-xs text-[#003d29] bg-white hover:bg-emerald-50 transition shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{t.hero.exploreBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setActiveView('memo-generator')}
                      className="px-4 py-2.5 rounded-full font-semibold text-xs text-emerald-200 bg-white/10 hover:bg-white/15 border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t.hero.billMemoBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Right Compact Highlights Pill Card */}
                <div className="w-full md:w-auto md:min-w-[280px] bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                      {t.hero.academicOverview}
                    </span>
                    <span className="text-[10px] font-extrabold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
                      {t.hero.creditsTotal}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-200 text-[11px]">
                    <span>{t.hero.curriculumLabel}</span>
                    <span className="font-bold text-white">{t.hero.curriculumValue}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-200 text-[11px]">
                    <span>{t.hero.autoVerifyLabel}</span>
                    <span className="font-bold text-emerald-300">{t.hero.autoVerifyValue}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-200 text-[11px]">
                    <span>{t.hero.onlineGatewayLabel}</span>
                    <span className="font-bold text-amber-300">{t.hero.onlineGatewayValue}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. POPULAR CATEGORIES ROW */}
            <section className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{t.categories.browseHeading}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {[
                  { key: 'Education', label: t.categories.education, icon: GraduationCap, count: t.categories.educationSub, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-[#003d29] dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
                  { key: 'All', label: t.categories.all, icon: Sparkles, count: `${products.length} ${t.categories.allSub}`, color: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700' },
                  { key: 'AI Bundles', label: t.categories.aiBundles, icon: Crown, count: t.categories.aiBundlesSub, color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
                  { key: 'Single Tools', label: t.categories.singleTools, icon: Laptop, count: t.categories.singleToolsSub, color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
                  { key: 'Writing & SEO', label: t.categories.writingSeo, icon: PenTool, count: t.categories.writingSeoSub, color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
                ].map((cat) => {
                  const Icon = cat.icon
                  const isActive = activeCategory === cat.key
                  return (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setActiveCategory(cat.key)
                        if (cat.key === 'Education') setSelectedYear('All')
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#003d29] text-white border-[#003d29] shadow-md shadow-[#003d29]/20'
                          : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 hover:shadow-xs'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/10 text-amber-300' : cat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-black block leading-tight">{cat.label}</span>
                        <span className={`text-[10px] ${isActive ? 'text-emerald-200' : 'text-slate-400 dark:text-slate-500'}`}>
                          {cat.count}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* 6. CSE YEAR NAVIGATOR (Visible when Education is active) */}
            {activeCategory === 'Education' && (
              <section className="bg-white dark:bg-[#111827] border border-emerald-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {t.yearNav.selectYear}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {t.yearNav.programDesc}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {[
                    { id: 'All', label: t.yearNav.allYears, desc: '140 Cr' },
                    { id: '1st Year', label: t.yearNav.yr1, desc: t.yearNav.yr1Desc },
                    { id: '2nd Year', label: t.yearNav.yr2, desc: t.yearNav.yr2Desc },
                    { id: '3rd Year', label: t.yearNav.yr3, desc: t.yearNav.yr3Desc },
                    { id: '4th Year', label: t.yearNav.yr4, desc: t.yearNav.yr4Desc },
                    { id: 'Bundles', label: t.yearNav.allInOne, desc: t.yearNav.allInOneDesc },
                  ].map((yr) => (
                    <button
                      key={yr.id}
                      onClick={() => setSelectedYear(yr.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        selectedYear === yr.id
                          ? 'bg-[#003d29] text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{yr.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded ${selectedYear === yr.id ? 'bg-white/20 text-white' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                        {yr.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* 7. FILTER PILLS & SORT ROW */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSortBy(sortBy === 'price-low' ? 'price-high' : 'price-low')}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>{sortBy === 'price-low' ? t.filters.priceLowToHigh : sortBy === 'price-high' ? t.filters.priceHighToLow : t.filters.sortBy}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setSortBy('rating')}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.filters.topRated}</span>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>{t.filters.sortBy}</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="featured">{t.filters.featured}</option>
                  <option value="price-low">{t.filters.priceLowToHigh}</option>
                  <option value="price-high">{t.filters.priceHighToLow}</option>
                  <option value="rating">{t.filters.topRated}</option>
                </select>
              </div>
            </div>

            {/* View Switcher for Education */}
            {activeCategory === 'Education' && (
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEducationViewMode('accordion')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                      educationViewMode === 'accordion'
                        ? 'bg-[#003d29] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{t.filters.viewAccordion}</span>
                  </button>
                  <button
                    onClick={() => setEducationViewMode('grid')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                      educationViewMode === 'grid'
                        ? 'bg-[#003d29] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{t.filters.viewGrid}</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold px-3 hidden sm:inline">
                  {t.filters.coreCoursesCount}
                </span>
              </div>
            )}

              {/* 8. OFFICIAL ACCORDION: COURSE PROFILES OF CSE CORE COURSES */}
              {activeCategory === 'Education' && educationViewMode === 'accordion' ? (
                <section className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
                  {/* Blue Header Tag matching user's image */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="inline-block bg-[#1d4ed8] text-white px-4 py-2 font-black text-sm tracking-wide rounded-md shadow-xs">
                      {t.accordion.headerTag}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      Department of Computer Science & Engineering • Core Undergraduate Curriculum
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Click any course bar below to expand its curriculum profile, credit hours, prerequisites, and subscribe with automated SSLCommerz sandbox payment and DBBL NexusPay memo generation.
                  </p>

                  {/* Accordion List (21 Core Courses exactly matching screenshot) */}
                  <div className="space-y-2">
                    {[
                      { code: 'CSE400', title: 'CSE400: Capstone Project', credits: '0 + 6 = 6 Credits (I, II, III)', prereq: '100+ Credits Completed', desc: 'Comprehensive capstone engineering project encompassing problem definition, literature review, architecture modeling, sprint development, thesis book & defense.', price: 250 },
                      { code: 'CSE487', title: 'CSE487: Computer and Cyber Security', credits: '3 Credits', prereq: 'CSE405 Computer Networks', desc: 'Symmetric & asymmetric cryptography (AES, RSA), network penetration testing, Wireshark packet auditing, digital forensics & Bangladesh Cyber Law.', price: 180 },
                      { code: 'CSE479', title: 'CSE479: Web Programming', credits: '3 + 1 = 4 Credits', prereq: 'CSE302 Database Systems', desc: 'Full-stack engineering: React.js, Node.js, Express, REST APIs, asynchronous JavaScript, state architecture & database connection with hands-on lab.', price: 190 },
                      { code: 'CSE442', title: 'CSE442: Microprocessors and Microcontrollers', credits: '3 + 1 = 4 Credits', prereq: 'CSE345 Digital Logic Design', desc: 'Intel 8086 microprocessor assembly programming, memory segmentation, 8051/AVR microcontrollers, ADC/DAC sensors & hardware interfacing lab.', price: 180 },
                      { code: 'CSE412', title: 'CSE412: Software Engineering', credits: '3 Credits', prereq: 'CSE347 SAD', desc: 'Software development lifecycle models, agile/scrum frameworks, architectural patterns, unit & integration test suites, CI/CD pipelines & quality metrics.', price: 170 },
                      { code: 'CSE405', title: 'CSE405: Computer Networks', credits: '3 + 1 = 4 Credits', prereq: 'CSE246 Algorithms', desc: 'OSI & TCP/IP stack, routing protocols (OSPF, BGP), TCP/UDP socket programming, VLSM subnetting & Cisco Packet Tracer simulation lab.', price: 190 },
                      { code: 'CSE399', title: 'CSE399: Cyber Ethics and Legal Framework', credits: '3 Credits', prereq: 'ENG102', desc: 'Professional computer ethics, ACM/IEEE guidelines, intellectual property, software licensing, GDPR privacy compliance & Bangladesh ICT act.', price: 140 },
                      { code: 'CSE370', title: 'CSE370: Mobile Programming', credits: '3 + 1 = 4 Credits', prereq: 'CSE110 Object Oriented Programming', desc: 'Native & cross-platform mobile apps: Android (Kotlin/Java) & Flutter, UI layouts, Room/SQLite database, Firebase Cloud messaging with lab.', price: 190 },
                      { code: 'CSE360', title: 'CSE360: Computer Architecture', credits: '3 Credits', prereq: 'CSE325 Operating Systems', desc: 'MIPS assembly instruction set, datapath & control units, pipelining hazards, cache memory mapping architectures and multiprocessors.', price: 180 },
                      { code: 'CSE347', title: 'CSE347: Information System Analysis and Design', credits: '3 + 1 = 4 Credits', prereq: 'CSE302 Database Systems', desc: 'System requirements specification (SRS), UML diagrams (Class, Sequence, Activity), design patterns, software testing plans & term project defense.', price: 170 },
                      { code: 'CSE345', title: 'CSE345: Digital Logic Design', credits: '3 + 1 = 4 Credits', prereq: 'CSE251 Electronic Circuits', desc: 'Boolean algebra, Karnaugh map minimization, combinational circuits, flip-flops, sequential finite state machines & Logisim hardware simulation lab.', price: 170 },
                      { code: 'CSE325', title: 'CSE325: Operating Systems', credits: '3 + 1 = 4 Credits', prereq: 'CSE207 Data Structures', desc: 'Process synchronization, CPU scheduling, semaphores, Banker deadlock avoidance, virtual memory paging, file systems & Linux C system calls lab.', price: 180 },
                      { code: 'CSE302', title: 'CSE302: Database Systems', credits: '3 + 1 = 4 Credits', prereq: 'CSE106 Discrete Mathematics', desc: 'Relational database schema design, advanced SQL queries, BCNF normalization, ACID transactions, B-Tree indexing & full-stack CRUD database project.', price: 190 },
                      { code: 'CSE251', title: 'CSE251: Electronic Circuits', credits: '3 + 1 = 4 Credits', prereq: 'CSE209 Electrical Circuits', desc: 'Semiconductor physics, diodes, BJTs, MOSFETs, operational amplifiers, rectifiers, filter circuits, frequency response & Proteus circuit lab.', price: 160 },
                      { code: 'CSE246', title: 'CSE246: Algorithms', credits: '3 + 1.5 = 4.5 Credits', prereq: 'CSE207 Data Structures', desc: 'Algorithm complexity, Divide & conquer, Greedy heuristics, Dynamic programming, Graph algorithms (Dijkstra, Bellman-Ford, Kruskal) & NP-completeness.', price: 200 },
                      { code: 'CSE209', title: 'CSE209: Electrical Circuits', credits: '3 + 1 = 4 Credits', prereq: 'None', desc: 'Ohm’s law, KVL/KCL, Thevenin & Norton circuit theorems, sinusoidal AC steady state, RLC resonance, power factor & electrical laboratory setups.', price: 160 },
                      { code: 'CSE207', title: 'CSE207: Data Structures', credits: '3 + 1 = 4 Credits', prereq: 'CSE110 Object Oriented Programming', desc: 'Arrays, linked lists, stacks, queues, binary search trees (BST), AVL trees, heaps, hash tables, graph representations with C++/Java lab tasks.', price: 190 },
                      { code: 'CSE200', title: 'CSE200: Computer-Aided Engineering Drawing', credits: '0 + 1 = 1 Credit', prereq: 'None', desc: 'AutoCAD 2D technical drafting, orthographic projections, isometric engineering views, sectioning & circuit schematic drawings with lab.', price: 130 },
                      { code: 'CSE110', title: 'CSE110: Object Oriented Programming', credits: '3 + 1.5 = 4.5 Credits', prereq: 'CSE106 Discrete Mathematics', desc: 'OOP concepts: classes, inheritance, polymorphism, abstract classes, interfaces, exception handling, multithreading & Java GUI lab projects.', price: 180 },
                      { code: 'CSE106', title: 'CSE106: Discrete Mathematics', credits: '3 Credits', prereq: 'CSE103 Structured Programming', desc: 'Propositional & predicate logic, set theory, relations, functions, mathematical induction, recurrence relations, combinatorics & graph theory.', price: 160 },
                      { code: 'CSE103', title: 'CSE103: Structured Programming', credits: '3 + 1.5 = 4.5 Credits', prereq: 'None', desc: 'C programming language fundamentals: conditional flow, loops, functions, arrays, strings, pointers, memory allocation, structures & file I/O lab.', price: 180 },
                    ].map((course) => {
                      const isExpanded = expandedCoreCourse === course.code
                      const matchingProd = products.find((p) => p.courseCode === course.code) || {
                        id: `ewu-${course.code.toLowerCase()}`,
                        title: course.title,
                        description: course.desc,
                        product_type: 'SINGLE_TOOL' as const,
                        price_bdt: course.price,
                        features: ['Lecture Slides & Notes', 'Lab Tasks & Solutions', 'Mid & Final Exam Question Bank'],
                        is_active: true,
                      }

                      return (
                        <div key={course.code} className="overflow-hidden rounded-md border border-[#003d29]/20 dark:border-emerald-800/40 transition-all">
                          <button
                            type="button"
                            onClick={() => setExpandedCoreCourse(isExpanded ? null : course.code)}
                            className="w-full bg-[#003d29] hover:bg-[#002f20] text-white font-bold text-sm sm:text-base px-5 py-3.5 flex items-center justify-between cursor-pointer transition select-none"
                          >
                            <span className="tracking-wide text-left">{course.title}</span>
                            <span className="text-2xl font-bold ml-4 w-6 h-6 flex items-center justify-center text-emerald-300">
                              {isExpanded ? '−' : '+'}
                            </span>
                          </button>

                          {isExpanded && (
                            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0c1322] border-t border-emerald-900/10 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-md">
                                    {t.accordion.credits}: {course.credits}
                                  </span>
                                  <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                                    {t.accordion.prerequisite}: {course.prereq === 'None' ? t.accordion.none : course.prereq}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-slate-400 dark:text-slate-500">Subscription Fee:</span>
                                  <span className="text-xl font-black text-[#003d29] dark:text-emerald-400 ml-1.5">৳ {course.price}.00</span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                {course.desc}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#151f30] border border-slate-200 dark:border-slate-800">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">Lecture Slides & Handouts</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#151f30] border border-slate-200 dark:border-slate-800">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">Lab Codes & Assignment Solutions</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#151f30] border border-slate-200 dark:border-slate-800">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">Solved Past Mid & Final Exams</span>
                                </div>
                              </div>

                              <div className="pt-3 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => addToCart(matchingProd)}
                                  className="px-5 py-2.5 rounded-full font-bold text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                  <span>{t.cards.addToCart}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!user) {
                                      setPendingCheckoutProduct(matchingProd)
                                      setShowAuthModal(true)
                                    } else {
                                      setSelectedProductForCheckout(matchingProd)
                                    }
                                  }}
                                  className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-[#003d29] hover:bg-[#002f20] transition shadow-md shadow-[#003d29]/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                                >
                                  <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                                  <span>{t.cards.buyNow} (SSLCommerz)</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              ) : (
                /* 8. PRODUCTS GRID (Card Grid View) */
                <section id="products-grid-section" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        {activeCategory === 'Education'
                          ? `Computer Science & Engineering Courses & Bundles (${selectedYear})`
                          : 'Subscriptions & Tools For You!'}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Showing {filteredProducts.length} verified courses & subscriptions with direct SSLCommerz sandbox & DBBL NexusPay verification.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((prod) => {
                  const isWishlisted = wishlist.includes(prod.id)
                  const isCSECourse = Boolean(prod.courseCode || prod.year)

                  return (
                    <div
                      key={prod.id}
                      className="group bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 relative"
                    >
                      {/* Top Bar: Badge & Wishlist */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {prod.badge || (isCSECourse ? 'B.Sc. CSE' : 'AI TOOL')}
                        </span>

                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                            isWishlisted
                              ? 'bg-rose-50 text-rose-500'
                              : 'bg-slate-100/80 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Visual Graphic Box */}
                      <div className={`w-full h-44 rounded-2xl bg-gradient-to-tr ${prod.bgTint || 'from-slate-100 to-gray-50 dark:from-slate-800/80 dark:to-slate-900'} flex flex-col items-center justify-center p-4 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-md flex items-center justify-center text-xl font-black text-[#003d29] dark:text-emerald-400 border border-transparent dark:border-slate-700">
                          {prod.courseCode ? (
                            <Code className="w-7 h-7 text-[#003d29] dark:text-emerald-400" />
                          ) : prod.product_type === 'PACKAGE' ? (
                            <Award className="w-7 h-7 text-amber-500" />
                          ) : (
                            <Sparkles className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>

                        {prod.courseCode && (
                          <span className="text-sm font-black text-slate-900 dark:text-white mt-2 font-mono">
                            {prod.courseCode}
                          </span>
                        )}

                        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 text-center line-clamp-1 mt-0.5">
                          {prod.title.replace(prod.courseCode || '', '').trim()}
                        </span>

                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                          {prod.credits ? prod.credits : prod.product_type === 'PACKAGE' ? 'Yearly Access' : 'Monthly Access'}
                        </span>
                      </div>

                      {/* Info & Details */}
                      <div className="space-y-2 pt-4">
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          {prod.year && (
                            <span className="font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              {prod.year} {prod.semester ? `• ${prod.semester}` : ''}
                            </span>
                          )}
                          {prod.prerequisite && (
                            <span className="font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                              Pre-req: {prod.prerequisite}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#003d29] dark:group-hover:text-emerald-400 transition line-clamp-1">
                          {prod.title}
                        </h3>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 min-h-[32px]">
                          {prod.description}
                        </p>

                        {/* Feature Checklist preview */}
                        <div className="pt-1 space-y-1">
                          {prod.features.slice(0, 2).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 truncate">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1.5 text-xs pt-1">
                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
                            ({prod.reviewsCount || 120})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="pt-2 flex items-baseline justify-between border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-xl font-black text-slate-900 dark:text-white">৳ {prod.price_bdt}</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1">
                              {prod.product_type === 'PACKAGE' ? '/ term' : '/ course'}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            Immediate Access
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: Add to Cart + Buy Now */}
                      <div className="pt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => addToCart(prod)}
                          className="py-2.5 px-3 rounded-full font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          <span>{t.cards.addToCart}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!user) {
                              setPendingCheckoutProduct(prod)
                              setShowAuthModal(true)
                            } else {
                              setSelectedProductForCheckout(prod)
                            }
                          }}
                          className="py-2.5 px-3 rounded-full font-bold text-xs text-white bg-[#003d29] hover:bg-[#002f20] transition shadow-md shadow-[#003d29]/20 active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>{t.cards.buyNow}</span>
                          <ArrowRight className="w-3 h-3 text-amber-300" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}
      </main>

      {/* 9. SLIDE-OVER SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-[#0f172a] shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#003d29] text-white flex items-center justify-center font-bold text-xs">
                    <ShoppingCart className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">{t.cartDrawer.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{totalCartCount} {t.cartDrawer.itemsSelected}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.cartDrawer.emptyTitle}</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      {t.cartDrawer.emptyDesc}
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {item.product.title}
                        </h4>
                        <span className="text-xs font-black text-[#003d29] dark:text-emerald-400">
                          ৳ {item.product.price_bdt}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>{t.cartDrawer.subtotal}</span>
                      <span>৳ {totalCartAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>{t.cartDrawer.fee}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{t.cartDrawer.free}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span>{t.cartDrawer.total}</span>
                      <span className="text-[#003d29] dark:text-emerald-400 text-base">৳ {totalCartAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCartSSLCommerzCheckout}
                    className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#003d29] hover:bg-[#002f20] transition shadow-lg shadow-[#003d29]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <CreditCard className="w-4 h-4 text-amber-300" />
                    <span>{t.cartDrawer.payBtn}</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400">
                    {t.cartDrawer.securityNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9.5 SECURE & TRUSTED SECTION (SoftMart IT Style) */}
      <section className="mt-14 pt-10 pb-12 bg-gradient-to-b from-transparent via-[#0d0f1e]/90 to-[#070812] border-t border-purple-500/20 text-white">
        <div className="w-full px-4 sm:px-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              <span>Secure &amp;</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">Trusted</span>
            </h2>
            <div className="h-0.5 w-14 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full mx-auto" />
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your payments and personal data are always protected.
            </p>
          </div>

          {/* Sleek Payment Gateway Showcase Box */}
          <div className="max-w-xl mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1b1736]/90 via-[#131129]/95 to-[#0b0a1a] border border-purple-500/30 text-center space-y-2.5 shadow-xl shadow-purple-950/30 backdrop-blur-md">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest text-amber-400 uppercase">
              <Lock className="w-3.5 h-3.5" />
              <span>100% SECURE PAYMENT VIA</span>
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-0.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600/20 to-purple-600/20 border border-rose-500/40 text-white font-extrabold text-base sm:text-lg">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>SSLCommerz</span>
              </div>
              <span className="text-slate-500 font-bold">&amp;</span>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/40 text-white font-extrabold text-base sm:text-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>DBBL NexusPay</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed max-w-md mx-auto">
              Easy Payment System — fast, secure transactions via bKash, Nagad, Rocket, DBBL Nexus &amp; Cards.
            </p>
          </div>

          {/* 3 Pillars - Clean, Borderless & Elegant */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="text-center space-y-2 px-2 group">
              <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 mx-auto flex items-center justify-center transition-transform group-hover:scale-110">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-wide">100% Fraud Protection</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                Secure processing keeps your money fully protected at every step of the transaction.
              </p>
            </div>

            <div className="text-center space-y-2 px-2 group">
              <div className="w-10 h-10 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 mx-auto flex items-center justify-center transition-transform group-hover:scale-110">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-wide">Service Guarantee</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                Non-functional services trigger automatic refunds. No questions asked, no delays.
              </p>
            </div>

            <div className="text-center space-y-2 px-2 group">
              <div className="w-10 h-10 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 mx-auto flex items-center justify-center transition-transform group-hover:scale-110">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-wide">Instant Support</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                Real human support available whenever you have a question or face an issue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. MULTI-COLUMN CONTACT & BRAND FOOTER */}
      <footer className="bg-[#070812] border-t border-slate-800/80 pt-8 pb-5 text-slate-400 text-xs">
        <div className="w-full px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                  <img src={ezopyLogo} alt="EZOPY MART TECH" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-white font-black text-sm block uppercase tracking-wide">EZOPY MART TECH</span>
                  <span className="text-[10px] text-purple-400 font-semibold block">Academic &amp; AI Cloud Hub</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                EZOPY MART TECH provides premium AI and learning tools at the most affordable prices in Bangladesh.
              </p>
              <div className="inline-block px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-300">
                ❤️ <span className="font-semibold text-white">Dedicated to Jannat Farhana Popy</span> • Curated by Shah Abdul Mazid
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-white">QUICK LINKS</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      setActiveView('store')
                      setActiveCategory('Packages')
                      window.scrollTo({ top: 450, behavior: 'smooth' })
                    }}
                    className="hover:text-white transition cursor-pointer text-left"
                  >
                    Packages
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('store')
                      setActiveCategory('Single Tools')
                      window.scrollTo({ top: 450, behavior: 'smooth' })
                    }}
                    className="hover:text-white transition cursor-pointer text-left"
                  >
                    Single Tools
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('store')
                      setActiveCategory('Education')
                      window.scrollTo({ top: 450, behavior: 'smooth' })
                    }}
                    className="hover:text-white transition cursor-pointer text-left"
                  >
                    B.Sc. CSE Courses
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (!user) setShowAuthModal(true)
                      else setActiveView('dashboard')
                    }}
                    className="hover:text-white transition cursor-pointer text-left"
                  >
                    Login Panel
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('memo-generator')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="hover:text-white transition cursor-pointer text-left"
                  >
                    NexusPay Bill Memo
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Support */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-white">LEGAL &amp; SUPPORT</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button
                    onClick={() => setActiveLegalModal('privacy')}
                    className="hover:text-white transition cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('refund')}
                    className="hover:text-white transition cursor-pointer text-left"
                  >
                    Refund Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('terms')}
                    className="hover:text-white transition cursor-pointer text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <a
                    href="mailto:info@ezopymarttech.com"
                    className="hover:text-white transition inline-block"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-white">CONTACT US</h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <a href="tel:01531329222" className="block hover:text-white transition">+8801531329222</a>
                    <a href="tel:01560024587" className="block hover:text-white transition">+8801560024587</a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 fill-emerald-400 flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <a
                    href="https://wa.me/8801531329222"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition"
                  >
                    +8801531329222 (WhatsApp)
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <a href="mailto:info@ezopymarttech.com" className="hover:text-white transition">
                    info@ezopymarttech.com
                  </a>
                </div>
              </div>

              {/* WE ACCEPT: Badges */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">WE ACCEPT:</span>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-[10px]">
                    SSLCommerz
                  </span>
                  <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-300 font-bold text-[10px]">
                    bKash
                  </span>
                  <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-300 font-bold text-[10px]">
                    Nagad
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-[10px]">
                    Rocket
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    NexusPay
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[10px]">
                    Cards
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar - Immediate place, 0-axis most left aligned, no gaps, DBBL removed */}
          <div className="mt-5 pt-3 border-t border-slate-800/80 text-left">
            <p className="text-[11px] text-slate-500">
              © 2026 <span className="text-slate-300 font-semibold">EZOPY MART TECH</span>. Developed by <span className="text-purple-300 font-medium">Shah Abdul Mazid</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Contact Button (SoftMart IT Style) */}
      <a
        href="https://wa.me/8801531329222?text=Hello%20EZOPY%20MART%20TECH%2C%20I%20need%20assistance"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
        title="Chat with us on WhatsApp (+8801531329222)"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="absolute right-16 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none border border-slate-700">
          Chat on WhatsApp (+880 1531-329222)
        </span>
      </a>

      {/* LEGAL & SUPPORT MODAL */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0d0f18] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                {activeLegalModal === 'privacy' && 'Privacy Policy'}
                {activeLegalModal === 'refund' && 'Refund Policy (Service Guarantee)'}
                {activeLegalModal === 'terms' && 'Terms of Service'}
              </h3>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              {activeLegalModal === 'privacy' && (
                <>
                  <p>
                    At <span className="text-white font-bold">EZOPY MART TECH</span>, we take the confidentiality and privacy of our students and customers seriously.
                  </p>
                  <p>
                    • We only collect essential information (Name, Email, Mobile number) strictly to provision access tokens, deliver course materials, and send payment confirmations.
                  </p>
                  <p>
                    • We never sell, rent, or share personal information with third parties. All financial processing is conducted through official secure channels (SSLCommerz, Dutch-Bangla Bank NexusPay, bKash, and Nagad).
                  </p>
                </>
              )}

              {activeLegalModal === 'refund' && (
                <>
                  <p className="text-emerald-400 font-bold">
                    ✓ 100% Service Guarantee &amp; Automatic Refund Policy
                  </p>
                  <p>
                    • In the event that any subscribed educational tool, course material, or license key is non-functional or encounters technical downtime that cannot be resolved within 24 hours, you are entitled to an immediate replacement or full 100% refund.
                  </p>
                  <p>
                    • Contact our dedicated support via WhatsApp (<span className="text-white font-semibold">+8801531329222</span>) or email (<span className="text-white font-semibold">info@ezopymarttech.com</span>) with your Transaction ID for rapid resolution.
                  </p>
                </>
              )}

              {activeLegalModal === 'terms' && (
                <>
                  <p>
                    • All B.Sc. CSE course subscriptions and academic materials are provided for individual learning and personal academic advancement.
                  </p>
                  <p>
                    • Access credentials and software licenses must not be redistributed, resold, or abused.
                  </p>
                  <p>
                    • Official payment references must correspond to valid Dutch-Bangla Bank or SSLCommerz transactions.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {selectedProductForCheckout && (
        <CheckoutModal
          product={selectedProductForCheckout}
          token={token}
          user={user}
          onSuccess={handleCheckoutSuccess}
          onClose={() => setSelectedProductForCheckout(null)}
          onRequireLogin={() => {
            setSelectedProductForCheckout(null)
            setShowAuthModal(true)
          }}
        />
      )}

      {activeMemoData && (
        <NexusPayMemoModal
          memo={activeMemoData.memo}
          transaction={activeMemoData.transaction}
          onClose={() => {
            setActiveMemoData(null)
            setActiveView('dashboard')
            refreshUserData()
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onSuccess={handleLoginSuccess}
          onClose={() => {
            setShowAuthModal(false)
            setPendingCheckoutProduct(null)
          }}
          titlePrompt={
            pendingCheckoutProduct
              ? `Sign in to purchase "${pendingCheckoutProduct.title}"`
              : undefined
          }
        />
      )}
    </div>
  )
}
