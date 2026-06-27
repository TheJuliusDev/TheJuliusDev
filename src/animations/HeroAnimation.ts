import gsap from 'gsap';

export function playHeroEntrance(): void {
  const tl = gsap.timeline({ delay: 0.2 });

  tl.fromTo('.hero-badge',
    { opacity: 0, y: -20, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
  );

  tl.fromTo('.name-line',
    { opacity: 0, y: 60, skewY: 4 },
    { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.15, ease: 'expo.out' },
    '-=0.3'
  );

  tl.fromTo('.hero-handle',
    { opacity: 0, letterSpacing: '0.4em' },
    { opacity: 1, letterSpacing: '0.1em', duration: 0.7, ease: 'power2.out' },
    '-=0.5'
  );

  tl.fromTo('.hero-roles',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  );

  tl.fromTo('.hero-subtitle',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  );

  tl.fromTo('.hero-actions .btn',
    { opacity: 0, y: 20, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)' },
    '-=0.3'
  );

  tl.fromTo('.hero-scroll-hint',
    { opacity: 0 },
    { opacity: 1, duration: 0.8 },
    '-=0.2'
  );
}

export function playLoaderOut(onComplete: () => void): void {
  const loader = document.getElementById('loader');
  if (!loader) { onComplete(); return; }

  gsap.to(loader, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.inOut',
    onComplete: () => {
      loader.classList.add('hidden');
      onComplete();
    },
  });
}

export function animateLoaderProgress(fill: HTMLElement, onDone: () => void): void {
  const text = document.querySelector('.loader-text') as HTMLElement | null;
  const steps = [
    { width: '20%', label: 'Loading Three.js...' },
    { width: '45%', label: 'Building Universe...' },
    { width: '70%', label: 'Placing Stars...' },
    { width: '90%', label: 'Almost ready...' },
    { width: '100%', label: 'Welcome, Julius.' },
  ];

  const tl = gsap.timeline();
  steps.forEach((s, i) => {
    tl.to(fill, { width: s.width, duration: 0.4, ease: 'power1.inOut' }, i * 0.35);
    if (text) {
      tl.to(text, {
        duration: 0.1,
        onStart: () => { text.textContent = s.label; },
      }, i * 0.35);
    }
  });

  tl.call(onDone, [], '+=0.3');
}

export function initSectionReveal(): void {
  // Smooth section title reveals with GSAP scroll
  const titles = document.querySelectorAll('.section-title');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      gsap.fromTo(entry.target,
        { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.out' }
      );
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  titles.forEach(t => revealObs.observe(t));
}
