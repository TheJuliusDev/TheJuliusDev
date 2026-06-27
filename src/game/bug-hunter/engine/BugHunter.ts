interface Vec2 { x: number; y: number; }
interface GameObject { x: number; y: number; w: number; h: number; alive: boolean; }
interface Player extends GameObject { vx: number; vy: number; hp: number; invincible: number; }
interface Bug extends GameObject { vx: number; vy: number; hp: number; type: number; points: number; }
interface Laser extends GameObject { vy: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number; }
interface HUDCallbacks { score: (n: number) => void; level: (n: number) => void; hp: (n: number) => void; }
interface GameCallbacks { hud: HUDCallbacks; onGameOver: (score: number) => void; }

export class BugHunter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private W = 800; private H = 520;
  private player!: Player;
  private bugs: Bug[] = [];
  private lasers: Laser[] = [];
  private particles: Particle[] = [];
  private score = 0;
  private level = 1;
  private paused = false;
  private running = false;
  private animId = 0;
  private spawnTimer = 0;
  private spawnRate = 120;
  private keys = new Set<string>();
  private joystick: Vec2 = { x: 0, y: 0 };
  private fireHeld = false;
  private fireTimer = 0;
  private cb: GameCallbacks;
  private lastTime = 0;
  private stars: { x: number; y: number; s: number; speed: number }[] = [];

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.cb = callbacks;
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.initStars();
    this.setupInput();
    this.reset();
  }

  private initStars(): void {
    for (let i = 0; i < 80; i++) {
      this.stars.push({ x: Math.random() * this.W, y: Math.random() * this.H, s: Math.random() * 1.5 + 0.3, speed: Math.random() * 0.5 + 0.2 });
    }
  }

  private setupInput(): void {
    window.addEventListener('keydown', (e) => {
      if (!this.running) return;
      this.keys.add(e.code);
      if (e.code === 'Space') { e.preventDefault(); this.fireLaser(); }
      if (e.code === 'KeyP') this.paused = !this.paused;
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
  }

  public setJoystick(v: Vec2): void { this.joystick = v; }
  public setFire(held: boolean): void { this.fireHeld = held; }

  public reset(): void {
    this.player = { x: this.W / 2 - 18, y: this.H - 80, w: 36, h: 36, vx: 0, vy: 0, hp: 3, alive: true, invincible: 0 };
    this.bugs = []; this.lasers = []; this.particles = [];
    this.score = 0; this.level = 1; this.spawnTimer = 0; this.spawnRate = 120;
    this.cb.hud.score(0); this.cb.hud.level(1); this.cb.hud.hp(3);
  }

  public start(): void { this.running = true; this.loop(0); }
  public stop(): void { this.running = false; cancelAnimationFrame(this.animId); }

  private loop(now: number): void {
    if (!this.running) return;
    this.animId = requestAnimationFrame((t) => this.loop(t));
    const dt = Math.min((now - this.lastTime) / 16.67, 3);
    this.lastTime = now;
    if (!this.paused) this.update(dt);
    this.draw();
  }

  private update(dt: number): void {
    const p = this.player;

    const moveX = (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? -1 : 0)
      + (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0)
      + this.joystick.x;
    const moveY = (this.keys.has('KeyW') || this.keys.has('ArrowUp') ? -1 : 0)
      + (this.keys.has('KeyS') || this.keys.has('ArrowDown') ? 1 : 0)
      + this.joystick.y;

    p.vx += moveX * 0.6; p.vy += moveY * 0.6;
    p.vx *= 0.82; p.vy *= 0.82;
    p.x = Math.max(0, Math.min(this.W - p.w, p.x + p.vx * dt));
    p.y = Math.max(0, Math.min(this.H - p.h, p.y + p.vy * dt));
    if (p.invincible > 0) p.invincible -= dt;

    if (this.fireHeld) {
      this.fireTimer -= dt;
      if (this.fireTimer <= 0) { this.fireLaser(); this.fireTimer = 12; }
    }

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnRate) { this.spawnTimer = 0; this.spawnBug(); }

    this.bugs.forEach(b => {
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x < 0 || b.x > this.W - b.w) b.vx *= -1;
      if (b.y > this.H) b.alive = false;
    });

    this.lasers.forEach(l => { l.y += l.vy * dt; if (l.y < -20) l.alive = false; });

    this.lasers.forEach(l => {
      if (!l.alive) return;
      this.bugs.forEach(b => {
        if (!b.alive) return;
        if (this.aabb(l, b)) {
          b.hp--; l.alive = false;
          this.spawnParticles(b.x + b.w / 2, b.y + b.h / 2, b.hp <= 0 ? 12 : 4);
          if (b.hp <= 0) {
            b.alive = false; this.score += b.points;
            this.cb.hud.score(this.score);
            if (this.score >= this.level * 50) this.levelUp();
          }
        }
      });
    });

    if (p.invincible <= 0) {
      this.bugs.forEach(b => {
        if (!b.alive) return;
        if (this.aabb(b, p)) {
          b.alive = false; p.hp--; p.invincible = 90;
          this.cb.hud.hp(p.hp);
          this.spawnParticles(p.x + p.w / 2, p.y, 8, '#ff6b6b');
          if (p.hp <= 0) { p.alive = false; this.running = false; this.cb.onGameOver(this.score); }
        }
      });
    }

    this.particles.forEach(pt => { pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += 0.05 * dt; pt.life -= dt; });
    this.bugs = this.bugs.filter(b => b.alive);
    this.lasers = this.lasers.filter(l => l.alive);
    this.particles = this.particles.filter(pt => pt.life > 0);
    this.stars.forEach(s => { s.y += s.speed * dt; if (s.y > this.H) { s.y = 0; s.x = Math.random() * this.W; } });
  }

  private aabb(a: GameObject, b: GameObject): boolean {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  private fireLaser(): void {
    this.lasers.push({ x: this.player.x + this.player.w / 2 - 3, y: this.player.y, w: 6, h: 20, alive: true, vy: -9 });
    if (this.level >= 3) {
      this.lasers.push({ x: this.player.x + 4, y: this.player.y, w: 4, h: 16, alive: true, vy: -9 });
      this.lasers.push({ x: this.player.x + this.player.w - 8, y: this.player.y, w: 4, h: 16, alive: true, vy: -9 });
    }
  }

  private spawnBug(): void {
    const types = [
      { hp: 1, points: 10, speedRange: [0.8, 1.8] as [number,number] },
      { hp: 2, points: 20, speedRange: [1.2, 2.2] as [number,number] },
      { hp: 3, points: 40, speedRange: [0.5, 1.2] as [number,number] },
    ];
    const typeIdx = Math.min(Math.floor(Math.random() * (1 + this.level * 0.5)), 2);
    const t = types[typeIdx];
    const sz = 20 + Math.random() * 8;
    const spd = (t.speedRange[0] + Math.random() * (t.speedRange[1] - t.speedRange[0])) * (1 + this.level * 0.12);
    this.bugs.push({
      x: Math.random() * (this.W - sz), y: -sz, w: sz, h: sz,
      vx: (Math.random() - 0.5) * 2 * spd, vy: spd,
      hp: t.hp + Math.floor(this.level / 3),
      alive: true, type: typeIdx, points: t.points,
    });
  }

  private levelUp(): void {
    this.level++; this.spawnRate = Math.max(40, this.spawnRate - 10);
    this.cb.hud.level(this.level);
    for (let i = 0; i < 20; i++) this.spawnParticles(this.W / 2, this.H / 2, 1, '#00d4b4');
  }

  private spawnParticles(x: number, y: number, count: number, color = '#ffaa00'): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 4 + 1;
      this.particles.push({ x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, life: 40 + Math.random() * 20, maxLife: 60, color, size: Math.random() * 4 + 1 });
    }
  }

  private draw(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);
    ctx.fillStyle = '#02020a'; ctx.fillRect(0, 0, this.W, this.H);

    this.stars.forEach(s => {
      ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.3 + s.s * 0.2})`; ctx.fill();
    });

    this.particles.forEach(pt => {
      ctx.globalAlpha = pt.life / pt.maxLife;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size * (pt.life / pt.maxLife), 0, Math.PI * 2);
      ctx.fillStyle = pt.color; ctx.fill();
    });
    ctx.globalAlpha = 1;

    this.lasers.forEach(l => {
      const grad = ctx.createLinearGradient(l.x, l.y + l.h, l.x, l.y);
      grad.addColorStop(0, '#00d4b4'); grad.addColorStop(1, 'rgba(0,212,180,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(l.x, l.y, l.w, l.h, 3); ctx.fill();
    });

    const bugColors = ['#ff4444', '#ff8800', '#ff00ff'];
    this.bugs.forEach(b => {
      ctx.save();
      ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
      const col = bugColors[b.type] ?? '#ff4444';
      ctx.shadowColor = col; ctx.shadowBlur = 12;
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(0, 0, b.w / 2, b.h / 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7;
      [-b.h/4, 0, b.h/4].forEach((ly, i) => {
        ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo((i % 2 === 0 ? -1 : 1) * (b.w / 2 + 6), ly - 4); ctx.stroke();
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-b.w/6, -b.h/6, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(b.w/6, -b.h/6, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(-b.w/6, -b.h/6, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(b.w/6, -b.h/6, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });

    const p = this.player;
    if (p.alive && (p.invincible <= 0 || Math.floor(p.invincible / 6) % 2 === 0)) {
      ctx.save();
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.shadowColor = '#00d4b4'; ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(0, -p.h / 2); ctx.lineTo(p.w / 2, p.h / 2);
      ctx.lineTo(p.w / 4, p.h / 3); ctx.lineTo(-p.w / 4, p.h / 3);
      ctx.lineTo(-p.w / 2, p.h / 2); ctx.closePath();
      const shipGrad = ctx.createLinearGradient(0, -p.h / 2, 0, p.h / 2);
      shipGrad.addColorStop(0, '#00d4b4'); shipGrad.addColorStop(1, '#4f8cff');
      ctx.fillStyle = shipGrad; ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath(); ctx.ellipse(0, 0, 5, 7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    if (this.paused) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, this.W, this.H);
      ctx.font = 'bold 36px "Syne", sans-serif'; ctx.fillStyle = '#00d4b4';
      ctx.textAlign = 'center'; ctx.fillText('PAUSED', this.W / 2, this.H / 2);
      ctx.font = '16px "JetBrains Mono", monospace'; ctx.fillStyle = '#7a7a9a';
      ctx.fillText('Press P to resume', this.W / 2, this.H / 2 + 36);
    }
  }
}
