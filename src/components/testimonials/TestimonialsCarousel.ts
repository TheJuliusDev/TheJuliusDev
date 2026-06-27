import gsap from 'gsap';
import { TESTIMONIALS, PROJECTS, Testimonial } from '../../utils/data.js';

const ICON_QUOTE = `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 7C6.5 7 4 9.5 4 12.5c0 2.8 2 5 4.7 5.4-.3 1.3-1.2 2.4-2.7 3.1l.6 1.5c3-1 5.4-3.4 5.4-7.5V12c0-2.8-1-5-3-5h.5zM18 7c-3 0-5.5 2.5-5.5 5.5 0 2.8 2 5 4.7 5.4-.3 1.3-1.2 2.4-2.7 3.1l.6 1.5c3-1 5.4-3.4 5.4-7.5V12c0-2.8-1-5-3-5h.5z"/></svg>`;
const ICON_STAR = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const ICON_ARROW_LEFT  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ICON_ARROW_RIGHT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICON_PAUSE = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
const ICON_PLAY  = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;

const AUTOPLAY_MS = 6000;

export class TestimonialsCarousel {
  private root: HTMLElement;
  private track: HTMLElement;
  private dotsEl: HTMLElement;
  private slides: HTMLElement[] = [];
  private index = 0;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private isPaused = false;
  private isAnimating = false;
  private playToggleBtn!: HTMLButtonElement;

  // Drag/swipe state
  private dragStartX = 0;
  private dragDeltaX = 0;
  private isDragging = false;

  constructor(container: HTMLElement) {
    this.root = container;
    this.root.innerHTML = this.buildMarkup();
    this.track = this.root.querySelector('.testi-track')!;
    this.dotsEl = this.root.querySelector('.testi-dots')!;

    this.slides = Array.from(this.root.querySelectorAll('.testi-slide'));
    this.renderDots();
    this.bindControls();
    this.bindDrag();
    this.bindKeyboard();
    this.bindVisibilityPause();
    this.goTo(0, false);
    this.startAutoplay();
    this.observeEntrance();
  }

  // ── Markup ──────────────────────────────────────────────────────────────
  private buildMarkup(): string {
    const slidesHtml = TESTIMONIALS.map((t, i) => this.slideMarkup(t, i)).join('');

    return `
      <div class="testi-stage">
        <button class="testi-nav testi-nav--prev" id="testiPrev" aria-label="Previous testimonial">${ICON_ARROW_LEFT}</button>

        <div class="testi-viewport">
          <div class="testi-track">${slidesHtml}</div>
        </div>

        <button class="testi-nav testi-nav--next" id="testiNext" aria-label="Next testimonial">${ICON_ARROW_RIGHT}</button>
      </div>

      <div class="testi-controls">
        <div class="testi-dots" role="tablist" aria-label="Choose testimonial"></div>
        <button class="testi-play-toggle" id="testiPlayToggle" aria-label="Pause autoplay" title="Pause autoplay">
          ${ICON_PAUSE}
        </button>
      </div>
    `;
  }

  private slideMarkup(t: Testimonial, i: number): string {
    const accent = t.accent ?? 'teal';
    const rating = t.rating ?? 5;
    const stars = Array.from({ length: 5 }, (_, s) =>
      `<span class="testi-star${s < rating ? ' filled' : ''}">${ICON_STAR}</span>`
    ).join('');

    const project = t.projectId ? PROJECTS.find(p => p.id === t.projectId) : null;
    const projectTag = project
      ? `<a href="#projects" class="testi-project-tag" data-project-id="${project.id}">${project.icon}<span>${project.title}</span></a>`
      : '';

    return `
      <div class="testi-slide" data-index="${i}" aria-hidden="${i === 0 ? 'false' : 'true'}" role="group" aria-roledescription="slide" aria-label="Testimonial ${i + 1} of ${TESTIMONIALS.length}">
        <div class="testi-card testi-accent--${accent}">
          <div class="testi-quote-icon">${ICON_QUOTE}</div>
          <div class="testi-stars" aria-hidden="true">${stars}</div>
          <p class="testi-quote">${t.quote}</p>
          <div class="testi-footer">
            <div class="testi-avatar testi-accent--${accent}">${t.initials}</div>
            <div class="testi-person">
              <span class="testi-name">${t.name}</span>
              <span class="testi-role">${t.role}</span>
            </div>
            ${projectTag}
          </div>
        </div>
      </div>
    `;
  }

  private renderDots(): void {
    this.dotsEl.innerHTML = TESTIMONIALS.map((_, i) =>
      `<button class="testi-dot" role="tab" aria-selected="${i === 0}" aria-label="Go to testimonial ${i + 1}" data-index="${i}"></button>`
    ).join('');

    this.dotsEl.querySelectorAll<HTMLButtonElement>('.testi-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const i = parseInt(dot.dataset.index ?? '0', 10);
        this.goTo(i);
        this.restartAutoplay();
      });
    });
  }

  // ── Controls ────────────────────────────────────────────────────────────
  private bindControls(): void {
    this.root.querySelector('#testiPrev')!.addEventListener('click', () => {
      this.prev();
      this.restartAutoplay();
    });
    this.root.querySelector('#testiNext')!.addEventListener('click', () => {
      this.next();
      this.restartAutoplay();
    });

    this.playToggleBtn = this.root.querySelector('#testiPlayToggle')!;
    this.playToggleBtn.addEventListener('click', () => {
      this.isPaused ? this.startAutoplay() : this.stopAutoplay();
    });

    // Clicking a project tag scrolls to Projects without also dragging the slide
    this.root.querySelectorAll('.testi-project-tag').forEach(tag => {
      tag.addEventListener('click', (e) => e.stopPropagation());
    });

    // Pause on hover, resume on leave (desktop nicety, doesn't fight manual pause)
    this.root.addEventListener('mouseenter', () => this.pauseForHover());
    this.root.addEventListener('mouseleave', () => this.resumeFromHover());
  }

  private hoverPausedAutoplay = false;
  private pauseForHover(): void {
    if (this.isPaused) return; // already manually paused, leave it alone
    if (this.autoplayTimer) { this.stopAutoplay(true); this.hoverPausedAutoplay = true; }
  }
  private resumeFromHover(): void {
    if (this.hoverPausedAutoplay) { this.hoverPausedAutoplay = false; this.startAutoplay(true); }
  }

  private bindKeyboard(): void {
    this.root.setAttribute('tabindex', '0');
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { this.prev(); this.restartAutoplay(); }
      if (e.key === 'ArrowRight') { this.next(); this.restartAutoplay(); }
    });
  }

  // Pause autoplay entirely when the tab isn't visible (saves cycles, avoids
  // a jarring jump-ahead when the user comes back to the tab)
  private bindVisibilityPause(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoplay(true);
      } else if (!this.isPaused) {
        this.startAutoplay(true);
      }
    });
  }

  // ── Drag / swipe ────────────────────────────────────────────────────────
  private bindDrag(): void {
    const viewport = this.root.querySelector('.testi-viewport') as HTMLElement;

    const onDown = (clientX: number) => {
      this.isDragging = true;
      this.dragStartX = clientX;
      this.dragDeltaX = 0;
      this.track.style.transition = 'none';
      this.stopAutoplay(true);
    };
    const onMove = (clientX: number) => {
      if (!this.isDragging) return;
      this.dragDeltaX = clientX - this.dragStartX;
      const pct = (this.dragDeltaX / viewport.clientWidth) * 100;
      this.track.style.transform = `translateX(calc(${-this.index * 100}% + ${pct}%))`;
    };
    const onUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.track.style.transition = '';
      const threshold = viewport.clientWidth * 0.18;
      if (this.dragDeltaX > threshold) this.prev();
      else if (this.dragDeltaX < -threshold) this.next();
      else this.goTo(this.index); // snap back
      if (!this.isPaused) this.startAutoplay(true);
    };

    // Touch
    viewport.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
    viewport.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
    viewport.addEventListener('touchend', onUp);

    // Mouse drag (desktop)
    viewport.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(e.clientX); });
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onUp);
  }

  // ── Slide transitions ──────────────────────────────────────────────────
  private goTo(i: number, animate = true): void {
    const len = TESTIMONIALS.length;
    this.index = ((i % len) + len) % len;

    this.slides.forEach((slide, si) => {
      slide.setAttribute('aria-hidden', String(si !== this.index));
    });

    this.dotsEl.querySelectorAll<HTMLButtonElement>('.testi-dot').forEach((dot, di) => {
      dot.setAttribute('aria-selected', String(di === this.index));
    });

    const xPercent = -this.index * 100;
    if (animate) {
      gsap.to(this.track, { xPercent, duration: 0.55, ease: 'power3.out' });
      const activeCard = this.slides[this.index].querySelector('.testi-card');
      if (activeCard) {
        gsap.fromTo(activeCard,
          { opacity: 0.4, y: 8, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: 0.08, ease: 'power2.out' }
        );
      }
    } else {
      gsap.set(this.track, { xPercent });
    }
  }

  private next(): void {
    if (this.isAnimating) return;
    this.guardAnimating();
    this.goTo(this.index + 1);
  }

  private prev(): void {
    if (this.isAnimating) return;
    this.guardAnimating();
    this.goTo(this.index - 1);
  }

  private guardAnimating(): void {
    this.isAnimating = true;
    setTimeout(() => { this.isAnimating = false; }, 580);
  }

  // ── Autoplay ────────────────────────────────────────────────────────────
  private startAutoplay(silent = false): void {
    if (!silent) this.isPaused = false;
    this.updatePlayToggle();
    this.stopAutoplay(true);
    this.autoplayTimer = setInterval(() => this.next(), AUTOPLAY_MS);
  }

  private stopAutoplay(silent = false): void {
    if (!silent) this.isPaused = true;
    this.updatePlayToggle();
    if (this.autoplayTimer) { clearInterval(this.autoplayTimer); this.autoplayTimer = null; }
  }

  private restartAutoplay(): void {
    if (this.isPaused) return;
    this.startAutoplay(true);
  }

  private updatePlayToggle(): void {
    if (!this.playToggleBtn) return;
    this.playToggleBtn.innerHTML = this.isPaused ? ICON_PLAY : ICON_PAUSE;
    this.playToggleBtn.setAttribute('aria-label', this.isPaused ? 'Resume autoplay' : 'Pause autoplay');
    this.playToggleBtn.title = this.isPaused ? 'Resume autoplay' : 'Pause autoplay';
  }

  // ── Entrance animation (consistent with the rest of the site's scroll reveals) ──
  private observeEntrance(): void {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(this.root,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    obs.observe(this.root);
  }
}
