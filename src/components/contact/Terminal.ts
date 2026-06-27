interface TerminalCommand {
  response: string;
  link?: string;
  special?: 'secret' | 'game';
}

export class Terminal {
  private input: HTMLInputElement;
  private body: HTMLElement;
  private onSecret: () => void;
  private onGame: () => void;
  private history: string[] = [];
  private historyIdx = -1;

  private static readonly COMMANDS: Record<string, TerminalCommand> = {
    'help': {
      response: 'Available commands: connect julius | email | github | linkedin | twitter | payric | help | clear'
    },
    'connect julius': {
      response: '> Connecting to Julius Ayodeji... \n> Full Stack Developer | Ibadan, Nigeria\n> Status: [OPEN] Open to freelance & collaboration'
    },
    'email': {
      response: '> Opening email channel...',
      link: 'mailto:juliu.ayodeji@email.com'
    },
    'github': {
      response: '> Navigating to GitHub profile...',
      link: 'https://github.com/TheJuliusDev'
    },
    'linkedin': {
      response: '> Opening LinkedIn profile...',
      link: 'https://linkedin.com/in/thejuliusdev'
    },
    'twitter': {
      response: '> Opening Twitter/X profile...',
      link: 'https://x.com/thejuliusdev'
    },
    'payric': {
      response: '> Launching Payric — Finance SaaS for Nigerian businesses...',
      link: 'https://payric.com.ng'
    },
    'sudo reveal': {
      response: '> [WARN] Authentication required... Processing...\n> ACCESS GRANTED — Welcome to the secret area.',
      special: 'secret'
    },
    'game': {
      response: '> Launching Bug Hunter...',
      special: 'game'
    },
    'clear': { response: '__CLEAR__' },
    'whoami': { response: '> julius — Full Stack Developer, Founder, Builder' },
    'ls': { response: '> projects/  skills/  about/  contact/  secret/' },
    'pwd': { response: '> /thejuliusdev/universe' },
    'date': { response: `> ${new Date().toISOString()}` },
  };

  constructor(input: HTMLInputElement, body: HTMLElement, onSecret: () => void, onGame: () => void) {
    this.input = input;
    this.body = body;
    this.onSecret = onSecret;
    this.onGame = onGame;
    this.setup();
  }

  private setup(): void {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.execute(this.input.value.trim());
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIdx < this.history.length - 1) {
          this.historyIdx++;
          this.input.value = this.history[this.history.length - 1 - this.historyIdx] ?? '';
        }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIdx > 0) {
          this.historyIdx--;
          this.input.value = this.history[this.history.length - 1 - this.historyIdx] ?? '';
        } else { this.historyIdx = -1; this.input.value = ''; }
      }
    });

    // Clickable commands in terminal
    this.body.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t.classList.contains('t-cmd')) {
        const cmd = t.textContent?.trim() ?? '';
        this.input.value = cmd;
        this.execute(cmd);
      }
    });

    // Focus only when user explicitly clicks the terminal area
    this.body.addEventListener('click', () => this.input.focus());
  }

  private execute(cmd: string): void {
    if (!cmd) return;
    this.history.push(cmd);
    this.historyIdx = -1;

    const lower = cmd.toLowerCase();
    const command = Terminal.COMMANDS[lower];

    this.addLine(`<span class="t-prompt">julius@universe:~$</span> <span class="t-text">${this.escHtml(cmd)}</span>`);
    this.input.value = '';

    if (!command) {
      if (lower.startsWith('sudo') && lower !== 'sudo reveal') {
        this.addLine(`<span class="t-error">sudo: permission denied — try 'sudo reveal'</span>`);
      } else {
        this.addLine(`<span class="t-error">command not found: ${this.escHtml(cmd)} — type 'help' for commands</span>`);
      }
      return;
    }

    if (command.response === '__CLEAR__') {
      this.body.innerHTML = '';
      return;
    }

    const lines = command.response.split('\n');
    lines.forEach((line, i) => {
      setTimeout(() => {
        this.addLine(`<span class="t-text">${line}</span>`);
      }, i * 60);
    });

    const totalDelay = lines.length * 60 + 100;

    if (command.link) {
      setTimeout(() => {
        this.addLine(`<span class="t-text">→ <a href="${command.link}" target="_blank" rel="noopener" class="t-link">${command.link}</a></span>`);
        window.open(command.link, '_blank', 'noopener');
      }, totalDelay);
    }

    if (command.special === 'secret') {
      setTimeout(() => this.onSecret(), totalDelay + 200);
    }
    if (command.special === 'game') {
      setTimeout(() => this.onGame(), totalDelay + 200);
    }
  }

  private addLine(html: string): void {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = html;
    this.body.appendChild(div);
    this.body.scrollTop = this.body.scrollHeight;
  }

  private escHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
