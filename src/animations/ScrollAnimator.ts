export class ScrollAnimator {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ?? '0';
            setTimeout(() => el.classList.add('visible'), parseInt(delay, 10));
            this.observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    this.observe();
  }

  private observe(): void {
    document.querySelectorAll('[data-aos], .timeline-item, .project-card, .skill-chip, .blog-card, .ai-card, .roadmap-card, .service-card').forEach((el) => {
      this.observer.observe(el);
    });
  }

  public refresh(): void {
    this.observe();
  }
}

export function animateCounters(): void {
  const els = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      const target = parseInt(el.dataset.count ?? '0', 10);
      let current = 0;
      const step = target / 50;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toString() + (el.dataset.suffix ?? '');
        if (current >= target) clearInterval(timer);
      }, 30);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

export function initHeroRoles(): void {
  const roles = document.querySelectorAll('.role-item');
  if (!roles.length) return;
  let idx = 0;
  setInterval(() => {
    roles.forEach(r => r.classList.remove('active'));
    idx = (idx + 1) % roles.length;
    roles[idx].classList.add('active');
  }, 2000);
}

export function initNavScroll(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

export function initMobileMenu(): void {
  const btn = document.getElementById('navHamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const toggle = () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  };

  btn.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }));
}

export function initKonamiCode(callback: () => void): void {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
  let idx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.code === code[idx]) {
      idx++;
      if (idx === code.length) { callback(); idx = 0; }
    } else { idx = 0; }
  });
}
