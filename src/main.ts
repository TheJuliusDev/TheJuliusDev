import './styles/global.css';
import { Universe } from './three/scene/Universe.js';
import { SkillsUniverse } from './components/skills/SkillsUniverse.js';
import { Terminal } from './components/contact/Terminal.js';
import { GameController } from './components/game/GameController.js';
import { SecretArea } from './components/contact/SecretArea.js';
import { TestimonialsCarousel } from './components/testimonials/TestimonialsCarousel.js';
import { ScrollAnimator, animateCounters, initHeroRoles, initNavScroll, initMobileMenu, initKonamiCode } from './animations/ScrollAnimator.js';
import { playHeroEntrance, playLoaderOut, animateLoaderProgress, initSectionReveal } from './animations/HeroAnimation.js';
import { renderProjects, renderBlog, renderAILab, renderServices, renderSkillChips } from './utils/render.js';
import { initCharts } from './components/stats/Charts.js';

async function bootstrap(): Promise<void> {
  // Render all content first
  renderProjects();
  renderBlog();
  renderAILab();
  renderServices();
  renderSkillChips();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loaderFill = document.querySelector('.loader-fill') as HTMLElement | null;

  if (prefersReducedMotion) {
    // Skip animation for accessibility
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    init();
    window.dispatchEvent(new Event('tjd:loaded'));
    return;
  }

  if (loaderFill) {
    animateLoaderProgress(loaderFill, () => {
      playLoaderOut(() => {
        init();
        window.dispatchEvent(new Event('tjd:loaded'));
      });
    });
  } else {
    init();
    window.dispatchEvent(new Event('tjd:loaded'));
  }
}

function init(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // Three.js Universe
  const canvas = document.getElementById('universe-canvas') as HTMLCanvasElement;
  if (canvas && !prefersReducedMotion) {
    new Universe({ canvas, isMobile });
  }

  // Nav
  initNavScroll();
  initMobileMenu();

  // Hero
  playHeroEntrance();
  initHeroRoles();

  // Scroll animations
  const scrollAnimator = new ScrollAnimator();
  animateCounters();
  initSectionReveal();

  // Skills Universe (desktop only)
  const skillsContainer = document.getElementById('skills-universe');
  if (skillsContainer && !isMobile && !prefersReducedMotion) {
    new SkillsUniverse(skillsContainer);
  }

  // Charts
  initCharts();

  // Testimonials
  const testimonialsContainer = document.getElementById('testimonialsCarousel');
  if (testimonialsContainer) {
    new TestimonialsCarousel(testimonialsContainer);
  }

  // Game
  const game = new GameController();

  // Secret Area
  const secret = new SecretArea();

  // Terminal
  const termInput = document.getElementById('terminalInput') as HTMLInputElement | null;
  const termBody = document.getElementById('terminalBody');
  if (termInput && termBody) {
    new Terminal(
      termInput,
      termBody,
      () => secret.open(),
      () => game.open()
    );
  }

  // Konami code
  initKonamiCode(() => {
    secret.open();
  });

  // Refresh scroll observer after dynamic content renders
  setTimeout(() => {
    scrollAnimator.refresh();
  }, 100);
}

// ── Theme toggle ─────────────────────────────────────────────
function initThemeToggle(): void {
  const html = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  if (!btn) return;

  // Persist preference across reloads
  const saved = localStorage.getItem('tjd-theme');
  if (saved === 'light' || saved === 'dark') {
    html.setAttribute('data-theme', saved);
  }

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') ?? 'dark';
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('tjd-theme', next);
  });
}

initThemeToggle();

// Start
bootstrap().catch((err) => {
  console.error(err);
  // Something broke before we could hide the loader — don't leave the
  // person staring at a frozen splash screen with no way out.
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('stuck');
});
