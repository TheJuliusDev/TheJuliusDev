export interface Project {
  id: string;
  title: string;
  role: string;
  icon: string; // SVG string
  description: string;
  features: string[];
  stack: string[];
  link: string;
  previewUrl?: string;   // URL to iframe-preview (same as link if embeddable)
  screenshots?: string[]; // fallback image URLs if iframe is blocked
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string; // HTML string for the modal body
}

export interface AICard {
  id: string;
  icon: string; // SVG string
  title: string;
  description: string;
  tags: string[];
}

export interface Service {
  id: string;
  icon: string; // SVG string
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;       // e.g. "Founder, Danmos Elite Properties"
  quote: string;
  rating?: number;     // 1-5, defaults to 5
  initials: string;    // shown in the avatar circle (no photo needed)
  projectId?: string;  // optional link back to a PROJECTS entry
  accent?: 'teal' | 'blue' | 'purple'; // avatar ring color, defaults to teal
}

// ── SVG icon helpers ──────────────────────────────────────────────────────────
const svg = (path: string, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ${extra}>${path}</svg>`;

export const ICONS = {
  // Project icons
  creditCard: svg('<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>'),
  smartphone: svg('<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>'),
  car: svg('<path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14l4 4v4a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="17.5" cy="17.5" r="1.5"/>'),
  music: svg('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),
  bookOpen: svg('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  sparkles: svg('<path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/><path d="M5 3L5.8 5.2L8 6L5.8 6.8L5 9L4.2 6.8L2 6L4.2 5.2L5 3Z"/><path d="M19 13L19.8 15.2L22 16L19.8 16.8L19 19L18.2 16.8L16 16L18.2 15.2L19 13Z"/>'),
  // AI Lab icons
  dna: svg('<path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M10 9c-.5-1.997-.278-3.995 0-5.992"/><path d="M2 9c6.667 6 13.333 0 20 6"/>'),
  cpu: svg('<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>'),
  trophy: svg('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>'),
  zap: svg('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),

  // Service icons
  globe: svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
  rocket: svg('<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>'),
  layoutDashboard: svg('<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>'),
  barChart: svg('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
  paintbrush: svg('<path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3z"/><path d="M9 8c-2 2.5-2 5-2 5s2.5-.5 5-2"/>'),
  terminal: svg('<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'),
};

export const SKILL_ICONS: Record<string, string> = {
  'TypeScript': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/></svg>`,
  'JavaScript': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M14 9v7a2 2 0 0 1-4 0M9 9h2"/></svg>`,
  'React': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10"/><ellipse cx="12" cy="12" rx="10" ry="4"/></svg>`,
  'Next.js': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 19.5h20L12 2z"/><path d="M12 6l7 12H5"/></svg>`,
  'Node.js': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/></svg>`,
  'Tailwind': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12c0-3.3 1.65-5 5-5 3.3 0 4.15 1.65 5 3.3-.85 1.7-1.7 3.35-5 3.35C7.65 13.65 6 11.98 6 12z"/><path d="M11 17c0-3.3 1.65-5 5-5 3.3 0 4.15 1.65 5 3.3-.85 1.7-1.7 3.35-5 3.35C12.65 18.65 11 16.98 11 17z"/></svg>`,
  'Supabase': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  'Firebase': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 10H9l3-10z"/><path d="M9 12L4 22h16L9 12z"/><path d="M15 12l3 10"/></svg>`,
  'PostgreSQL': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6"/><path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6"/></svg>`,
  'REST APIs': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
  'Paystack': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  'Git': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>`,
  'Vercel': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 19.5h20L12 2z"/></svg>`,
  'Three.js': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l10 18H2L12 2z"/><path d="M7 14l5-8 5 8H7z"/></svg>`,
  'Python': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C7 2 8 6.5 8 6.5V10h8V8s1-6-4-6z"/><path d="M12 22c5 0 4-4.5 4-4.5V14H8v2s-1 6 4 6z"/><path d="M8 10H5s-3 .5-3 3 3 3 3 3h3"/><path d="M16 14h3s3-.5 3-3-3-3-3-3h-3"/><circle cx="10" cy="7" r="1"/><circle cx="14" cy="17" r="1"/></svg>`,
  'GSAP': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,

};


export const PROJECTS: Project[] = [
  {
    id: 'payric',
    title: 'Payric',
    role: 'Founder & Lead Developer',
    icon: ICONS.creditCard,
    description: 'Simple, powerful accounting SaaS built specifically for Nigerian small businesses and freelancers. Bringing financial clarity to the people who need it most.',
    features: ['Invoicing & billing', 'Expense tracking', 'Income management', 'Financial reports & analytics'],
    stack: ['TypeScript', 'Supabase', 'Paystack', 'Node.js', 'Vite'],
    link: 'https://payric.com.ng',
    previewUrl: 'https://payric.com.ng',
    featured: true,
  },
  {
  id: 'roadesigns',
  title: 'ROA Designs',
  role: 'Creative Frontend Portfolio',
  icon: ICONS.sparkles,   // ✨ creative / luxury / fashion
  description: 'A premium interactive developer portfolio featuring cinematic animations, immersive scrolling, refined typography, and a modern luxury-inspired user experience.',
  features: [
    'Immersive scroll animations',
    'Creative portfolio showcase',
    'Premium UI/UX experience'
  ],
  stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
  link: 'https://roadesigns.vercel.app',
  previewUrl: 'https://roadesigns.vercel.app'
},
  {
    id: 'supra',
    title: 'Toyota Supra Showcase',
    role: 'Frontend Developer',
    icon: ICONS.car,
    description: 'An interactive 3D car showcase built with React, featuring smooth transitions and an immersive automotive design language.',
    features: ['Interactive 3D elements', 'Smooth transitions', 'Responsive design'],
    stack: ['React', 'Tailwind CSS', 'JavaScript'],
    link: 'https://supramaxed.netlify.app',
    previewUrl: 'https://supramaxed.netlify.app',
  },
  {
    id: 'dlex',
    title: 'Dlex Gold Official',
    role: 'Frontend Developer',
    icon: ICONS.music,
    description: 'Official artist website for Dlex Gold featuring biography, media gallery, and music releases with a sleek modern design.',
    features: ['Biography section', 'Media gallery', 'Music releases', 'Social integration'],
    stack: ['HTML', 'JavaScript', 'Tailwind CSS'],
    link: 'https://dlexgoldofficial.netlify.app',
    previewUrl: 'https://dlexgoldofficial.netlify.app',
  },
  {
    id: 'eduflow',
    title: 'EduFlow LMS',
    role: 'Full Stack Developer',
    icon: ICONS.bookOpen,
    description: 'A comprehensive learning management system with structured career paths for aspiring developers.',
    features: ['Frontend path', 'Backend path', 'Full Stack path', 'Progress tracking'],
    stack: ['React', 'Firebase', 'Tailwind CSS'],
    link: 'https://eduflowroadmap.netlify.app',
    previewUrl: 'https://eduflowroadmap.netlify.app',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How I Built Payric: From Idea to SaaS',
    excerpt: 'The story of building a full financial management platform from scratch — the technical decisions, the mistakes, and what I learned.',
    category: 'SaaS',
    date: 'Jan 2026',
    readTime: '8 min',
    tags: ['Payric', 'TypeScript', 'Supabase', 'Paystack', 'SaaS'],
    content: `
      <p class="article-intro">Building a SaaS from scratch while teaching yourself the stack is equal parts exhilarating and humbling. Here's the unfiltered version of how Payric came to exist.</p>
      <h3>The Problem Worth Solving</h3>
      <p>Most Nigerian small business owners track their finances in notebooks, WhatsApp messages, or scattered Excel sheets. The existing tools — QuickBooks, Wave, Xero — were built for Western markets and either too expensive, too complex, or didn't support Naira or Nigerian bank integrations properly.</p>
      <p>I wanted to build something <strong>specifically for them</strong>. Not adapted — built from the ground up.</p>
      <h3>Choosing the Stack</h3>
      <p>I went with <code>TypeScript</code> end-to-end. On the frontend, vanilla TS compiled with Vite. Backend on Node.js with Express. Database on Supabase (PostgreSQL + Auth + Realtime). Payments via Paystack.</p>
      <ul>
        <li>Supabase handled auth, RLS policies, and realtime updates out of the box</li>
        <li>Paystack's webhook system made subscription billing manageable</li>
        <li>TypeScript caught so many bugs before runtime — easily the best decision</li>
        <li>Vite made the dev loop fast enough to stay in flow for hours</li>
      </ul>
      <h3>The Hardest Parts</h3>
      <p>Row-Level Security in Supabase is incredibly powerful but easy to get wrong. I spent two days debugging a bug where users could see each other's invoices — a nightmare from a security standpoint. The fix was a single missing RLS policy clause, but finding it required understanding how PostgREST evaluates policies.</p>
      <p>The other hard thing was scope creep. I kept adding features — multi-currency, team accounts, tax reporting — before the core was solid. Eventually I forced myself back to the essentials: invoicing, expense tracking, income management. Ship that first.</p>
      <h3>What I'd Do Differently</h3>
      <p>I'd write tests earlier. Not TDD-style, but at least integration tests for the critical payment and auth flows. I also underestimated how long the onboarding UX would take to get right — the first version had users drop off before completing setup.</p>
      <p>But overall: <strong>shipping is better than perfecting</strong>. Payric exists because I stopped waiting until it was "ready."</p>
    `,
  },
  {
    id: '2',
    title: 'My TypeScript Journey: From Any to Strict',
    excerpt: 'How I went from writing messy JavaScript to embracing strict TypeScript and why it changed how I think about code.',
    category: 'TypeScript',
    date: 'Dec 2025',
    readTime: '5 min',
    tags: ['TypeScript', 'JavaScript', 'Best Practices'],
    content: `
      <p class="article-intro">I used to write <code>any</code> everywhere and call it TypeScript. Then I turned on strict mode. My codebase had 47 errors. Best thing that ever happened to my code.</p>
      <h3>The Before Times</h3>
      <p>Early on, TypeScript felt like a bureaucratic overhead on JavaScript. I'd add types to function parameters and call it done. <code>any</code> was my escape hatch for anything complex. My tsconfig had <code>"strict": false</code>.</p>
      <p>The problem was I was getting the syntax of TypeScript without the benefit. Runtime errors still caught me off guard.</p>
      <h3>What Strict Mode Actually Does</h3>
      <p>Enabling <code>"strict": true</code> turns on several checks at once:</p>
      <ul>
        <li><code>strictNullChecks</code> — no more assuming values exist; you must handle null and undefined explicitly</li>
        <li><code>noImplicitAny</code> — every untyped variable must be declared; no silent <code>any</code></li>
        <li><code>strictFunctionTypes</code> — function parameter types checked covariantly</li>
        <li><code>strictPropertyInitialization</code> — class properties must be initialized in the constructor</li>
      </ul>
      <h3>The Mindset Shift</h3>
      <p>Strict TypeScript forces you to <strong>think about data shapes before you write logic</strong>. Define your interfaces first. Think about what can be null. Think about what a function can actually receive vs what you assume it receives.</p>
      <p>This sounds annoying. It is, briefly. Then it becomes automatic. And then you stop writing null reference bugs entirely.</p>
      <h3>Practical Tips</h3>
      <p>Don't try to migrate a whole codebase at once. Enable strict on new files. Fix errors in order of importance. Use <code>unknown</code> instead of <code>any</code> — it forces you to narrow before using. And embrace utility types: <code>Partial&lt;T&gt;</code>, <code>Pick&lt;T&gt;</code>, <code>Omit&lt;T&gt;</code> are your friends.</p>
    `,
  },
  {
    id: '3',
    title: 'Learning Three.js: 3D on the Web',
    excerpt: 'Breaking down the journey of learning 3D graphics programming in the browser and building this very portfolio.',
    category: 'Three.js',
    date: 'Nov 2025',
    readTime: '6 min',
    tags: ['Three.js', 'WebGL', 'JavaScript', 'Animation'],
    content: `
      <p class="article-intro">The universe background you're looking at right now was the scariest thing I'd ever tried to build. Here's how I got there from zero WebGL knowledge.</p>
      <h3>Why 3D on the Web</h3>
      <p>Most portfolios look the same. Hero section, about, projects, contact. I wanted something that felt like a place — somewhere with depth and motion that reflected how I actually think about building software: as a craft with a lot of moving pieces orbiting a central idea.</p>
      <p>Three.js was the obvious starting point. It abstracts WebGL into something a JavaScript developer can actually use without a graphics programming background.</p>
      <h3>The Learning Path</h3>
      <p>I followed a simple progression:</p>
      <ul>
        <li>Three.js fundamentals — Scene, Camera, Renderer, the render loop</li>
        <li>Geometry and Materials — understanding meshes, lights, and shading</li>
        <li>Particles — BufferGeometry for large point clouds (this is the star field)</li>
        <li>Animation — RAF loop, delta time, easing functions</li>
        <li>Interaction — raycasting for mouse-based hover effects</li>
      </ul>
      <h3>Building the Universe Background</h3>
      <p>The star field uses a <code>BufferGeometry</code> with ~1200 points scattered in a sphere. Each frame I rotate the geometry slightly on the Y axis — a simple trick that gives the sense of drifting through space without any complex physics.</p>
      <p>The skill planets in the about section use an offscreen <code>canvas</code> element rendered with the 2D Context API — not Three.js at all. Sometimes the simpler tool is the right one.</p>
      <h3>Performance Lessons</h3>
      <p>Three.js is fast, but the browser isn't a GPU. Key lessons: dispose of geometries and materials when removing objects, avoid creating new objects inside the render loop, use <code>requestAnimationFrame</code> correctly and respect <code>prefers-reduced-motion</code> — some users need the animations off entirely.</p>
    `,
  },
  {
    id: '4',
    title: 'Understanding Differentiation in ML',
    excerpt: 'Making sense of the math behind machine learning — how derivatives power gradient descent and why it matters.',
    category: 'AI / Math',
    date: 'Oct 2025',
    readTime: '7 min',
    tags: ['Machine Learning', 'Math', 'Python', 'Gradient Descent'],
    content: `
      <p class="article-intro">I avoided the math in ML for too long. When I finally sat down with derivatives and the chain rule, everything clicked. This is the explanation I wish I'd had.</p>
      <h3>Why It Matters</h3>
      <p>Every time you train a neural network, gradient descent runs thousands of times. It nudges model weights in the direction that reduces error. That direction is calculated using derivatives — specifically, the partial derivative of the loss function with respect to each weight.</p>
      <p>If you're using ML as a black box, you can get by without this. But if you want to understand <em>why</em> your model isn't converging, or why changing the learning rate matters, you need the math.</p>
      <h3>The Derivative, Simply</h3>
      <p>A derivative measures how much a function's output changes when its input changes by a tiny amount. If <code>f(x) = x²</code>, then <code>f'(x) = 2x</code>. At <code>x = 3</code>, the function is increasing at rate 6. That's the slope of the curve at that point.</p>
      <p>In ML, our function is the <strong>loss function</strong> — a measure of how wrong our model's predictions are. We want to find the weights that minimize it.</p>
      <h3>Gradient Descent Step by Step</h3>
      <ul>
        <li>Start with random weights</li>
        <li>Make a prediction using current weights</li>
        <li>Calculate the loss (e.g. mean squared error)</li>
        <li>Compute the gradient — derivative of loss w.r.t. each weight</li>
        <li>Update each weight by subtracting the gradient × learning rate</li>
        <li>Repeat until loss is minimized</li>
      </ul>
      <h3>The Chain Rule in Backprop</h3>
      <p>Neural networks have many layers. To compute gradients through them, we use the chain rule — if <code>z = f(g(x))</code>, then <code>dz/dx = f'(g(x)) × g'(x)</code>. Backpropagation is just the chain rule applied systematically from the output layer backward to the input layer.</p>
      <p>Once this clicked for me, PyTorch's <code>autograd</code> stopped feeling like magic. It's just automatic differentiation — tracking the computation graph and applying the chain rule automatically.</p>
    `,
  },
  {
    id: '5',
    title: 'Becoming a Full Stack Developer at 18',
    excerpt: 'What it actually takes to go from zero to shipping production apps as a self-taught developer in Nigeria.',
    category: 'Career',
    date: 'Sep 2025',
    readTime: '9 min',
    tags: ['Career', 'Self-Taught', 'Nigeria', 'Learning'],
    content: `
      <p class="article-intro">I didn't go to a coding bootcamp. I don't have a computer science degree. I started with YouTube tutorials at 15 in Ibadan and figured it out as I went. Here's what actually worked.</p>
      <h3>The First Year: Just HTML and CSS</h3>
      <p>I spent the first year building static websites. Not because I was being strategic — I just didn't know about JavaScript yet. Looking back, that foundation was invaluable. I understood the DOM, how browsers render, how styles cascade. Developers who skip this later struggle to debug layout issues.</p>
      <p>My first "project" was a fan page for a footballer. It was terrible. It was also the best thing I built that year because I finished it.</p>
      <h3>The JavaScript Wall</h3>
      <p>Everyone hits this. JavaScript looks like English until it doesn't. Closures, <code>this</code>, asynchronous code, the event loop — these concepts aren't intuitive. The trick is to <strong>build something broken and fix it</strong> rather than reading tutorials until it "makes sense."</p>
      <p>Build a to-do list. Break it. Read the error. Fix it. Repeat 50 times. You'll understand JavaScript.</p>
      <h3>Going Full Stack</h3>
      <p>The jump to backend felt enormous. REST APIs, databases, authentication, server deployment — each could be its own career. I chose Node.js because I already knew JavaScript. Supabase made the database layer approachable. Vercel made deployment trivially easy.</p>
      <ul>
        <li>Learn one backend language/runtime, not three</li>
        <li>Use managed services (Supabase, PlanetScale, Railway) early — infrastructure is a distraction when learning</li>
        <li>Build something real: a CRUD app isn't a toy if someone uses it</li>
        <li>Read other people's code — GitHub is a library of patterns</li>
      </ul>
      <h3>The Nigeria Factor</h3>
      <p>Learning to code in Nigeria has unique friction. Inconsistent internet, power cuts mid-session, limited access to paid resources, and a tech ecosystem that's still maturing. But it also builds a particular resilience. When you debug by candlelight during load-shedding, you learn to focus.</p>
      <p>The community is also growing fast. The builders here are solving real problems for a billion-person market. <strong>Being early in a market that's just waking up</strong> is an advantage, not a disadvantage.</p>
      <h3>What Actually Moves You Forward</h3>
      <p>Not courses. Not tutorials. Not planning the perfect project. <strong>Shipping things.</strong> Every app you finish — however rough — teaches you something a tutorial never can. Ship bad code. Improve it. Ship again. That's the whole job.</p>
    `,
  },
];

export const AI_CARDS: AICard[] = [
  {
    id: '1',
    icon: ICONS.dna,
    title: 'Data Analysis Projects',
    description: 'Exploratory data analysis on Nigerian economic datasets, uncovering patterns in SME financial behavior using Pandas and Matplotlib.',
    tags: ['Python', 'Pandas', 'Matplotlib', 'EDA'],
  },
  {
    id: '2',
    icon: ICONS.cpu,
    title: 'ML Experiments',
    description: 'Building and training classification models to predict loan default risk for small businesses using Scikit-learn.',
    tags: ['Scikit-learn', 'NumPy', 'Classification'],
  },
  {
    id: '3',
    icon: ICONS.trophy,
    title: 'Kaggle Projects',
    description: 'Participating in Kaggle competitions focused on financial and economic datasets. Learning competitive ML techniques.',
    tags: ['Kaggle', 'Competition', 'Feature Engineering'],
  },
  {
    id: '4',
    icon: ICONS.zap,
    title: 'AI Tools Integration',
    description: 'Integrating OpenAI GPT-4o and Groq AI into web applications to power smart features in SaaS products.',
    tags: ['OpenAI', 'Groq', 'GPT-4o', 'APIs'],
  },
];

export const SERVICES: Service[] = [
  { id: '1', icon: ICONS.globe,           title: 'Full Stack Web Development', description: 'End-to-end web applications with modern tech — TypeScript, React/Next.js, Node.js, and cloud databases.' },
  { id: '2', icon: ICONS.rocket,          title: 'SaaS Development',           description: 'From MVP to production-ready SaaS with authentication, subscriptions, dashboards, and real-time features.' },
  { id: '3', icon: ICONS.zap,             title: 'MVP Development',            description: 'Fast, lean, and shippable. I build MVPs that validate ideas quickly without sacrificing code quality.' },
  { id: '4', icon: ICONS.creditCard,      title: 'Fintech Solutions',          description: 'Payment integrations, financial dashboards, invoicing systems — especially for the African market.' },
  { id: '5', icon: ICONS.barChart,        title: 'Dashboard Systems',          description: 'Data-rich admin dashboards with real-time analytics, charts, and intuitive management interfaces.' },
  { id: '6', icon: ICONS.paintbrush,      title: 'UI/UX Implementation',       description: 'Pixel-perfect, responsive, and accessible implementations of premium UI designs with smooth animations.' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Daodu Abiodun',
    role: 'CEO, Danmos Elite Properties',
    quote: 'Julius took our brief — a luxury real estate brand in Ibadan — and turned it into a site that actually feels premium. Every section loads fast and the design choices made our listings look like they belong in a different price bracket.',
    rating: 5,
    initials: 'DA',
    accent: 'teal',
  },
  {
    id: '2',
    name: 'Daodu Bunmi',
    role: 'Founder, ROA Designs',
    quote: "We needed a website that truly represented our brand—something modern, memorable, and professional. Julius quickly understood our vision and transformed it into a clean, visually stunning website that perfectly reflects who we are. The entire experience, from design to performance, exceeded our expectations, and we've received countless compliments from clients since launch",
    rating: 5,
    initials: 'DB',
    accent: 'blue',
  },
  {
    id: '3',
    name: 'Williams Okafor',
    role: 'Small business owner',
    quote: "Julius reached out and asked if I'd be interested in trying an early version of Payric. Even though it's still in development, I was impressed by how intuitive everything felt. He genuinely listened to my feedback, made improvements based on real-world use, and it's clear he's building something that will make managing finances much simpler for small businesses. I'm excited to see the final product.",
    rating: 5,
    initials: 'WO',
    projectId: 'payric',
    accent: 'teal',
  },
  {
    id: '4',
    name: 'Chiamaka Eze',
    role: 'Creative Director, freelance collaboration',
    quote: "Worked with Julius on a fast-turnaround frontend build. Communicative, organized, and the kind of developer who tells you when something won't work instead of just nodding. The final product shipped on time and matched the design exactly.",
    rating: 5,
    initials: 'CE',
    accent: 'purple',
  },
];

export const SKILL_CHIPS = [
  { name: 'TypeScript' },
  { name: 'JavaScript' },
  { name: 'React' },
  { name: 'Next.js' },
  { name: 'Node.js' },
  { name: 'Tailwind' },
  { name: 'Supabase' },
  { name: 'Firebase' },
  { name: 'PostgreSQL' },
  { name: 'REST APIs' },
  { name: 'Paystack' },
  { name: 'Git' },
  { name: 'Vercel' },
  { name: 'Three.js' },
  { name: 'Python' },
  { name: 'GSAP' },
];