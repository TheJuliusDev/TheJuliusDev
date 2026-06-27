function drawRoundedBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  if (h < r) r = h;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function initCharts(): void {
  const stackData = [
    { label: 'TypeScript', value: 90, color: '#3178c6' },
    { label: 'React/Next', value: 85, color: '#61dafb' },
    { label: 'Node.js', value: 80, color: '#68a063' },
    { label: 'CSS/Tailwind', value: 88, color: '#38bdf8' },
    { label: 'Supabase', value: 78, color: '#3ecf8e' },
    { label: 'Three.js', value: 60, color: '#00d4b4' },
  ];

  const focusData = [
    { label: 'SaaS', value: 40, color: '#00d4b4' },
    { label: 'Frontend', value: 30, color: '#4f8cff' },
    { label: 'Backend', value: 20, color: '#8b5cf6' },
    { label: 'AI', value: 10, color: '#ec4899' },
  ];

  const timelineData = [
    { year: '2020', count: 1 }, { year: '2021', count: 2 }, { year: '2022', count: 2 },
    { year: '2023', count: 3 }, { year: '2024', count: 5 }, { year: '2025', count: 4 },
    { year: '2026', count: 2 },
  ];

  const stackObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { drawStackChart(e.target as HTMLCanvasElement, stackData); stackObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });

  const focusObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { drawDonutChart(e.target as HTMLCanvasElement, focusData); focusObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });

  const tlObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { drawTimelineChart(e.target as HTMLCanvasElement, timelineData); tlObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });

  const s = document.getElementById('stackChart');
  const f = document.getElementById('focusChart');
  const t = document.getElementById('timelineChart');
  if (s) stackObs.observe(s);
  if (f) focusObs.observe(f);
  if (t) tlObs.observe(t);
}

function drawStackChart(canvas: HTMLCanvasElement, data: { label: string; value: number; color: string }[]): void {
  const ctx = canvas.getContext('2d')!;
  canvas.width = canvas.parentElement!.clientWidth - 56;
  canvas.height = 200;
  const { width: W, height: H } = canvas;
  ctx.clearRect(0, 0, W, H);

  const barH = Math.max(16, (H - 20) / data.length - 6);
  const maxVal = 100;
  const labelW = 100;
  const barArea = W - labelW - 60;

  data.forEach((d, i) => {
    const y = i * (barH + 6);
    ctx.font = '11px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#7a7a9a';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(d.label, labelW - 8, y + barH / 2);

    // Background bar
    const bg = ctx.createLinearGradient(labelW, 0, labelW + barArea, 0);
    bg.addColorStop(0, 'rgba(255,255,255,0.04)');
    bg.addColorStop(1, 'rgba(255,255,255,0.02)');
    drawRoundedBar(ctx, labelW, y, barArea, barH, 4);
    ctx.fillStyle = bg; ctx.fill();

    // Filled bar (animated via timeout)
    const targetW = (d.value / maxVal) * barArea;
    let animW = 0;
    const step = targetW / 40;
    const barGrad = ctx.createLinearGradient(labelW, 0, labelW + targetW, 0);
    barGrad.addColorStop(0, d.color + 'aa');
    barGrad.addColorStop(1, d.color);

    const anim = () => {
      if (animW >= targetW) {
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = d.color;
        ctx.textAlign = 'left';
        ctx.fillText(`${d.value}%`, labelW + targetW + 8, y + barH / 2);
        return;
      }
      animW = Math.min(animW + step, targetW);
      ctx.clearRect(labelW, y, barArea + 60, barH);
      drawRoundedBar(ctx, labelW, y, animW, barH, 4);
      ctx.fillStyle = barGrad; ctx.fill();
      requestAnimationFrame(anim);
    };
    setTimeout(() => requestAnimationFrame(anim), i * 80);
  });
}

function drawDonutChart(canvas: HTMLCanvasElement, data: { label: string; value: number; color: string }[]): void {
  const ctx = canvas.getContext('2d')!;
  canvas.width = canvas.parentElement!.clientWidth - 56;
  canvas.height = 200;
  const { width: W, height: H } = canvas;
  ctx.clearRect(0, 0, W, H);

  const cx = H / 2 + 10, cy = H / 2, r = H / 2 - 16, inner = r * 0.6;
  const total = data.reduce((s, d) => s + d.value, 0);
  let startAngle = -Math.PI / 2;
  let animProgress = 0;

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    animProgress = Math.min(animProgress + 0.04, 1);

    data.forEach(d => {
      const angle = (d.value / total) * Math.PI * 2 * animProgress;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + angle);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      startAngle += angle;
    });

    // Center hole
    ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = '#111120'; ctx.fill();

    // Center text
    ctx.font = 'bold 14px "Syne", sans-serif';
    ctx.fillStyle = '#f0f0f5';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Focus', cx, cy);

    startAngle = -Math.PI / 2;

    // Legend
    data.forEach((d, i) => {
      const lx = H + 20, ly = 20 + i * 40;
      ctx.fillStyle = d.color;
      ctx.beginPath(); ctx.arc(lx, ly, 6, 0, Math.PI * 2); ctx.fill();
      ctx.font = '12px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#7a7a9a';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${d.label} ${d.value}%`, lx + 14, ly);
    });

    if (animProgress < 1) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

function drawTimelineChart(canvas: HTMLCanvasElement, data: { year: string; count: number }[]): void {
  const ctx = canvas.getContext('2d')!;
  canvas.width = canvas.parentElement!.clientWidth - 56;
  canvas.height = 160;
  const { width: W, height: H } = canvas;
  ctx.clearRect(0, 0, W, H);

  const pad = { l: 40, r: 20, t: 20, b: 30 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;
  const maxVal = Math.max(...data.map(d => d.count));
  const step = chartW / (data.length - 1);

  const points = data.map((d, i) => ({
    x: pad.l + i * step,
    y: pad.t + chartH - (d.count / maxVal) * chartH,
  }));

  // Grid lines
  for (let i = 0; i <= maxVal; i++) {
    const y = pad.t + chartH - (i / maxVal) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1; ctx.stroke();
  }

  // Area fill
  const areaGrad = ctx.createLinearGradient(0, pad.t, 0, pad.t + chartH);
  areaGrad.addColorStop(0, 'rgba(0,212,180,0.3)');
  areaGrad.addColorStop(1, 'rgba(0,212,180,0)');

  let animProgress = 0;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    animProgress = Math.min(animProgress + 0.05, 1);
    const animCount = Math.floor(animProgress * (points.length - 1));

    if (animCount < 1) { requestAnimationFrame(draw); return; }

    // Area
    ctx.beginPath();
    ctx.moveTo(points[0].x, pad.t + chartH);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 1; i <= animCount; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.lineTo(points[animCount].x, pad.t + chartH);
    ctx.closePath();
    ctx.fillStyle = areaGrad; ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i <= animCount; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.strokeStyle = '#00d4b4'; ctx.lineWidth = 2.5; ctx.stroke();

    // Dots & labels
    for (let i = 0; i <= animCount; i++) {
      ctx.beginPath(); ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4b4'; ctx.fill();
      ctx.strokeStyle = '#0a0a14'; ctx.lineWidth = 2; ctx.stroke();
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#7a7a9a';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(data[i].year, points[i].x, pad.t + chartH + 6);
      if (animProgress > 0.8) {
        ctx.fillStyle = '#00d4b4'; ctx.textBaseline = 'bottom';
        ctx.fillText(String(data[i].count), points[i].x, points[i].y - 6);
      }
    }

    if (animProgress < 1) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
