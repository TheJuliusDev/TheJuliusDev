export class SecretArea {
  private overlay: HTMLElement;

  constructor() {
    this.overlay = document.getElementById('secretArea')!;
    document.getElementById('secretClose')?.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('open')) this.close();
    });
  }

  public open(): void {
    this.overlay.classList.add('open');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  public close(): void {
    this.overlay.classList.remove('open');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
