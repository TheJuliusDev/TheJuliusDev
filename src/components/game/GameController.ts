import { BugHunter } from '../../game/bug-hunter/engine/BugHunter.js';
import { VirtualJoystick } from '../../game/bug-hunter/player/VirtualJoystick.js';

const HI_SCORE_KEY = 'thejuliusdev_hiscore';

export class GameController {
  private overlay: HTMLElement;
  private canvas: HTMLCanvasElement;
  private game: BugHunter | null = null;
  private isOpen = false;

  constructor() {
    this.overlay = document.getElementById('gameOverlay')!;
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.setupTriggers();
    this.setupClose();
    this.setupGameOver();
  }

  private setupTriggers(): void {
    const openGame = () => this.open();
    document.getElementById('heroGameBtn')?.addEventListener('click', openGame);
    document.getElementById('navGameBtn')?.addEventListener('click', openGame);
  }

  private setupClose(): void {
    document.getElementById('gameClose')?.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  private setupGameOver(): void {
    document.getElementById('restartBtn')?.addEventListener('click', () => {
      const goEl = document.getElementById('gameOver');
      if (goEl) { goEl.classList.remove('show'); goEl.setAttribute('aria-hidden', 'true'); }
      this.game?.reset();
      this.game?.start();
    });
    document.getElementById('closeGameBtn')?.addEventListener('click', () => this.close());
  }

  public open(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.overlay.classList.add('open');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const isMobile = window.innerWidth < 768;

    this.game = new BugHunter(this.canvas, {
      hud: {
        score: (n: number) => { const el = document.getElementById('gameScore'); if (el) el.textContent = String(n); },
        level: (n: number) => { const el = document.getElementById('gameLevel'); if (el) el.textContent = String(n); },
        hp: (n: number) => {
          const el = document.getElementById('gameHP');
          if (el) {
            const heartFull = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
            const heartEmpty = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a6a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
            el.innerHTML = heartFull.repeat(Math.max(0, n)) + heartEmpty.repeat(Math.max(0, 3 - n));
          }
        },
      },
      onGameOver: (score: number) => {
        const prev = parseInt(localStorage.getItem(HI_SCORE_KEY) ?? '0', 10);
        const hi = Math.max(prev, score);
        localStorage.setItem(HI_SCORE_KEY, String(hi));
        const goEl = document.getElementById('gameOver');
        const fsEl = document.getElementById('finalScore');
        const hiEl = document.getElementById('hiScore');
        if (fsEl) fsEl.textContent = String(score);
        if (hiEl) hiEl.textContent = String(hi);
        if (goEl) { goEl.classList.add('show'); goEl.setAttribute('aria-hidden', 'false'); }
      },
    });

    this.game.start();

    if (isMobile) {
      const base = document.getElementById('joystickBase');
      const stick = document.getElementById('joystickStick');
      if (base && stick) {
        new VirtualJoystick(base, stick, (state) => {
          this.game?.setJoystick(state);
        });
      }
      const fireBtn = document.getElementById('fireBtn');
      fireBtn?.addEventListener('touchstart', () => this.game?.setFire(true), { passive: true });
      fireBtn?.addEventListener('touchend', () => this.game?.setFire(false), { passive: true });
    }
  }

  public close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.game?.stop();
    this.game = null;
    this.overlay.classList.remove('open');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.getElementById('gameOver')?.classList.remove('show');
  }
}
