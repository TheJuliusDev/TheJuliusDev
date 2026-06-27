interface JoystickState {
  x: number;
  y: number;
  active: boolean;
}

export class VirtualJoystick {
  private base: HTMLElement;
  private stick: HTMLElement;
  private state: JoystickState = { x: 0, y: 0, active: false };
  private origin = { x: 0, y: 0 };
  private maxRadius = 40;
  private onChange: (state: JoystickState) => void;

  constructor(base: HTMLElement, stick: HTMLElement, onChange: (state: JoystickState) => void) {
    this.base = base;
    this.stick = stick;
    this.onChange = onChange;
    this.setup();
  }

  private setup(): void {
    this.base.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.base.getBoundingClientRect();
      this.origin.x = rect.left + rect.width / 2;
      this.origin.y = rect.top + rect.height / 2;
      this.state.active = true;
      this.update(touch.clientX, touch.clientY);
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (!this.state.active) return;
      e.preventDefault();
      const touch = e.touches[0];
      this.update(touch.clientX, touch.clientY);
    }, { passive: false });

    document.addEventListener('touchend', () => {
      if (!this.state.active) return;
      this.state = { x: 0, y: 0, active: false };
      this.stick.style.transform = 'translate(-50%, -50%)';
      this.onChange(this.state);
    });
  }

  private update(cx: number, cy: number): void {
    const dx = cx - this.origin.x;
    const dy = cy - this.origin.y;
    const dist = Math.hypot(dx, dy);
    const clamp = Math.min(dist, this.maxRadius);
    const angle = Math.atan2(dy, dx);

    const nx = Math.cos(angle) * clamp;
    const ny = Math.sin(angle) * clamp;

    this.stick.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
    this.state.x = nx / this.maxRadius;
    this.state.y = ny / this.maxRadius;
    this.onChange(this.state);
  }

  public getState(): JoystickState { return this.state; }
}
