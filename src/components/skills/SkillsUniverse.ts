interface Planet {
  name: string;
  icon: string;
  color: string;
  orbit: number;
  angle: number;
  speed: number;
  size: number;
}

export class SkillsUniverse {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private planets: Planet[] = [];
  private animId = 0;
  private mouse = { x: 0, y: 0 };
  private hovered: Planet | null = null;

  private static readonly SKILLS: Omit<Planet, 'angle'>[] = [
    { name: 'TypeScript', icon: 'TS', color: '#3178c6', orbit: 120, speed: 0.008, size: 20 },
    { name: 'React', icon: 'Re', color: '#61dafb', orbit: 120, speed: 0.008, size: 18 },
    { name: 'Next.js', icon: 'Nx', color: '#ffffff', orbit: 160, speed: 0.006, size: 18 },
    { name: 'Node.js', icon: 'No', color: '#68a063', orbit: 160, speed: 0.006, size: 18 },
    { name: 'Supabase', icon: 'Sb', color: '#3ecf8e', orbit: 200, speed: 0.005, size: 20 },
    { name: 'Three.js', icon: '3J', color: '#00d4b4', orbit: 200, speed: 0.005, size: 18 },
    { name: 'Tailwind', icon: 'Tw', color: '#38bdf8', orbit: 240, speed: 0.004, size: 16 },
    { name: 'PostgreSQL', icon: 'Pg', color: '#336791', orbit: 240, speed: 0.004, size: 16 },
    { name: 'Git', icon: 'Gi', color: '#f05032', orbit: 280, speed: 0.003, size: 16 },
    { name: 'Paystack', icon: 'Ps', color: '#00c3f7', orbit: 280, speed: 0.003, size: 16 },
    { name: 'Vercel', icon: 'Vc', color: '#ffffff', orbit: 320, speed: 0.0025, size: 16 },
    { name: 'Python', icon: 'Py', color: '#ffd343', orbit: 320, speed: 0.0025, size: 16 },
  ];

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    this.planets = SkillsUniverse.SKILLS.map((s, i) => ({
      ...s, angle: (i / SkillsUniverse.SKILLS.length) * Math.PI * 2,
    }));

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - r.left) * (this.canvas.width / r.width);
      this.mouse.y = (e.clientY - r.top) * (this.canvas.height / r.height);
    });
    this.canvas.addEventListener('mouseleave', () => { this.hovered = null; });
    this.start();
  }

  private resize(): void {
    const r = this.canvas.parentElement!.getBoundingClientRect();
    this.canvas.width = r.width;
    this.canvas.height = r.height || 400;
  }

  private cx(): number { return this.canvas.width / 2; }
  private cy(): number { return this.canvas.height / 2; }

  private start(): void {
    const draw = () => {
      this.animId = requestAnimationFrame(draw);
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const cx = this.cx(), cy = this.cy();

      // Orbits
      const orbits = [...new Set(this.planets.map(p => p.orbit))];
      orbits.forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Center sun
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
      grad.addColorStop(0, 'rgba(0,212,180,0.6)');
      grad.addColorStop(0.5, 'rgba(79,140,255,0.2)');
      grad.addColorStop(1, 'rgba(0,212,180,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4b4';
      ctx.fill();
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TJD', cx, cy);

      // Planets
      this.hovered = null;
      this.planets.forEach(p => {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.orbit;
        const y = cy + Math.sin(p.angle) * p.orbit;

        const dist = Math.hypot(this.mouse.x - x, this.mouse.y - y);
        const isHovered = dist < p.size + 10;
        if (isHovered) this.hovered = p;
        const scale = isHovered ? 1.4 : 1;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, p.size * scale * 1.5);
        glow.addColorStop(0, p.color + '66');
        glow.addColorStop(1, p.color + '00');
        ctx.beginPath();
        ctx.arc(x, y, p.size * scale * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? p.color : p.color + 'cc';
        ctx.fill();

        ctx.font = `bold ${8 * scale}px "JetBrains Mono", monospace`;
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.icon, x, y);

        if (isHovered) {
          ctx.font = '11px "Space Grotesk", sans-serif';
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.fillText(p.name, x, y - p.size * scale - 10);
        }
      });

      this.canvas.style.cursor = this.hovered ? 'pointer' : 'default';
    };
    draw();
  }

  public destroy(): void { cancelAnimationFrame(this.animId); }
}
