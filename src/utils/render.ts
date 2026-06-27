import { PROJECTS, BLOG_POSTS, AI_CARDS, SERVICES, SKILL_CHIPS, SKILL_ICONS, Project } from './data.js';

const FEATURED_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

// ── SVG icons used in the preview modal ──────────────────────────────────────
const ICON_EXTERNAL = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
const ICON_CLOSE    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICON_RELOAD   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
const ICON_MOBILE   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`;
const ICON_DESKTOP  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
const ICON_WARNING  = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

// ── Project Cards ─────────────────────────────────────────────────────────────
export function renderProjects(): void {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map(p => `
    <div class="project-card${p.featured ? ' featured' : ''}" data-project-id="${p.id}">
      <div class="project-card-header">
        <div class="project-icon">${p.icon}</div>
        ${p.featured ? `<div class="project-badge">${FEATURED_ICON} FEATURED</div>` : ''}
        <h3 class="project-title">${p.title}</h3>
        <div class="project-role">${p.role}</div>
      </div>
      <div class="project-card-body">
        <p class="project-desc">${p.description}</p>
        <ul class="project-features">
          ${p.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <div class="project-stack">
          ${p.stack.map(s => `<span>${s}</span>`).join('')}
        </div>
      </div>
      <div class="project-card-footer">
        <button class="project-link project-preview-btn" data-project-id="${p.id}" aria-label="Preview ${p.title}">
          Preview
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>
        <a href="${p.link}" target="_blank" rel="noopener" class="project-link project-external-btn" aria-label="Open ${p.title} externally">
          ${ICON_EXTERNAL}
        </a>
      </div>
    </div>
  `).join('');

  // Delegate click on preview buttons
  grid.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.project-preview-btn') as HTMLElement | null;
    if (!btn) return;
    const id = btn.dataset.projectId;
    if (!id) return;
    const project = PROJECTS.find(p => p.id === id);
    if (project) openProjectPreview(project);
  });
}

// ── Project Preview Modal ────────────────────────────────────────────────────
let previewOverlay: HTMLElement | null = null;

function getOrCreatePreviewModal(): HTMLElement {
  if (previewOverlay) return previewOverlay;

  previewOverlay = document.createElement('div');
  previewOverlay.id = 'projectPreviewOverlay';
  previewOverlay.className = 'preview-overlay';
  previewOverlay.setAttribute('role', 'dialog');
  previewOverlay.setAttribute('aria-modal', 'true');
  previewOverlay.setAttribute('aria-hidden', 'true');
  previewOverlay.setAttribute('aria-label', 'Project preview');

  previewOverlay.innerHTML = `
    <div class="preview-modal" id="previewModal">

      <!-- Header bar (browser chrome style) -->
      <div class="preview-header">
        <div class="preview-header-left">
          <div class="preview-dots">
            <span class="preview-dot preview-dot--close" id="previewDotClose" title="Close"></span>
            <span class="preview-dot preview-dot--min"   title="Minimise"></span>
            <span class="preview-dot preview-dot--max"   title="Fullscreen"></span>
          </div>
          <div class="preview-title-wrap">
            <span class="preview-project-icon" id="previewProjectIcon"></span>
            <span class="preview-project-name" id="previewProjectName"></span>
          </div>
        </div>

        <div class="preview-urlbar">
          <span class="preview-urlbar-lock">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <span class="preview-urlbar-text" id="previewUrl"></span>
        </div>

        <div class="preview-header-right">
          <!-- Viewport toggles -->
          <button class="preview-tool-btn active" id="previewDesktopBtn" title="Desktop view" aria-label="Desktop view">
            ${ICON_DESKTOP}
          </button>
          <button class="preview-tool-btn" id="previewMobileBtn" title="Mobile view" aria-label="Mobile view">
            ${ICON_MOBILE}
          </button>
          <div class="preview-divider"></div>
          <!-- Reload -->
          <button class="preview-tool-btn" id="previewReloadBtn" title="Reload" aria-label="Reload preview">
            ${ICON_RELOAD}
          </button>
          <!-- Open externally -->
          <a class="preview-tool-btn" id="previewExternalBtn" href="#" target="_blank" rel="noopener" title="Open in new tab" aria-label="Open in new tab">
            ${ICON_EXTERNAL}
          </a>
          <!-- Close -->
          <button class="preview-tool-btn preview-close-btn" id="previewCloseBtn" title="Close" aria-label="Close preview">
            ${ICON_CLOSE}
          </button>
        </div>
      </div>

      <!-- Viewport wrapper (width changes for mobile mode) -->
      <div class="preview-viewport" id="previewViewport">

        <!-- Loading spinner shown while iframe loads -->
        <div class="preview-loading" id="previewLoading">
          <div class="preview-spinner"></div>
          <span>Loading preview…</span>
          <div class="preview-loading-slow" id="previewLoadingSlow">
            <p>Still loading. This can happen on slower connections.</p>
            <div class="preview-loading-actions">
              <button class="btn btn-primary" id="previewSlowReloadBtn" type="button">
                ${ICON_RELOAD} Reload
              </button>
              <a class="btn btn-ghost" id="previewSlowExternalLink" href="#" target="_blank" rel="noopener">
                ${ICON_EXTERNAL} Open in new tab
              </a>
            </div>
          </div>
        </div>

        <!-- The iframe -->
        <iframe
          id="previewIframe"
          class="preview-iframe"
          title="Project preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          loading="lazy"
        ></iframe>

        <!-- Fallback shown if iframe is blocked -->
        <div class="preview-fallback" id="previewFallback" style="display:none">
          <div class="preview-fallback-icon">${ICON_WARNING}</div>
          <h3>Preview Blocked</h3>
          <p>This site doesn't allow embedding. Open it in a new tab instead.</p>
          <a class="btn btn-primary preview-fallback-link" id="previewFallbackLink" href="#" target="_blank" rel="noopener">
            ${ICON_EXTERNAL} Open Live Site
          </a>
          <!-- Screenshot gallery (populated if project has screenshots) -->
          <div class="preview-screenshots" id="previewScreenshots"></div>
        </div>

      </div>

      <!-- Footer: stack tags -->
      <div class="preview-footer">
        <div class="preview-stack" id="previewStack"></div>
        <span class="preview-footer-hint">Press <kbd>Esc</kbd> to close</span>
      </div>

    </div>
  `;

  document.body.appendChild(previewOverlay);

  // ── Event wiring ────────────────────────────────────────────────────────────
  const iframe   = previewOverlay.querySelector('#previewIframe')   as HTMLIFrameElement;
  const loading  = previewOverlay.querySelector('#previewLoading')  as HTMLElement;
  const fallback = previewOverlay.querySelector('#previewFallback') as HTMLElement;

  // After this many ms with no 'load' event, surface a "still loading" prompt
  // with Reload / Open in new tab so slow connections never feel stuck.
  const SLOW_LOAD_MS = 8000;
  let slowLoadTimer: ReturnType<typeof setTimeout> | null = null;

  function clearSlowLoadTimer() {
    if (slowLoadTimer) { clearTimeout(slowLoadTimer); slowLoadTimer = null; }
    loading.classList.remove('is-slow');
  }

  function startSlowLoadTimer() {
    clearSlowLoadTimer();
    slowLoadTimer = setTimeout(() => {
      loading.classList.add('is-slow');
    }, SLOW_LOAD_MS);
  }

  function reloadIframe() {
    if (!iframe.src) return;
    loading.style.display  = 'flex';
    loading.classList.remove('is-slow');
    fallback.style.display = 'none';
    iframe.style.display   = 'block';
    const src = iframe.src;
    iframe.src = 'about:blank';
    requestAnimationFrame(() => { iframe.src = src; });
    startSlowLoadTimer();
  }

  // Iframe load success
  iframe.addEventListener('load', () => {
    clearSlowLoadTimer();
    loading.style.display = 'none';
    // Give a brief moment — if src is blocked the iframe body stays empty
    setTimeout(() => {
      try {
        // Cross-origin access throws; if it succeeds the page loaded fine
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc || !doc.body || doc.body.innerHTML.trim() === '') {
          showFallback();
        }
      } catch {
        // Cross-origin = likely loaded fine (we just can't inspect it)
        // The iframe IS showing content; keep it visible
      }
    }, 800);
  });

  // Iframe error (net::ERR_BLOCKED_BY_RESPONSE etc.)
  iframe.addEventListener('error', () => {
    clearSlowLoadTimer();
    loading.style.display = 'none';
    showFallback();
  });

  function showFallback() {
    clearSlowLoadTimer();
    iframe.style.display = 'none';
    fallback.style.display = 'flex';
    loading.style.display  = 'none';
  }

  // Close button & dot
  const closeFn = () => closeProjectPreview();
  previewOverlay.querySelector('#previewCloseBtn')!.addEventListener('click', closeFn);
  previewOverlay.querySelector('#previewDotClose')!.addEventListener('click', closeFn);

  // Backdrop click
  previewOverlay.addEventListener('click', (e) => {
    if (e.target === previewOverlay) closeFn();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewOverlay?.classList.contains('open')) closeFn();
  });

  // Reload (header button)
  previewOverlay.querySelector('#previewReloadBtn')!.addEventListener('click', reloadIframe);

  // Reload (inline "still loading" prompt button — the one users actually
  // see when a preview hangs, especially on mobile where the header icon is small)
  previewOverlay.querySelector('#previewSlowReloadBtn')!.addEventListener('click', reloadIframe);

  // Viewport toggles
  const viewport   = previewOverlay.querySelector('#previewViewport') as HTMLElement;
  const desktopBtn = previewOverlay.querySelector('#previewDesktopBtn') as HTMLButtonElement;
  const mobileBtn  = previewOverlay.querySelector('#previewMobileBtn')  as HTMLButtonElement;

  desktopBtn.addEventListener('click', () => {
    viewport.classList.remove('preview-viewport--mobile');
    desktopBtn.classList.add('active');
    mobileBtn.classList.remove('active');
  });

  mobileBtn.addEventListener('click', () => {
    viewport.classList.add('preview-viewport--mobile');
    mobileBtn.classList.add('active');
    desktopBtn.classList.remove('active');
  });

  // Stash helpers on the element so openProjectPreview/closeProjectPreview can reuse them
  (previewOverlay as any)._startSlowLoadTimer = startSlowLoadTimer;
  (previewOverlay as any)._clearSlowLoadTimer = clearSlowLoadTimer;

  return previewOverlay;
}

function openProjectPreview(project: Project): void {
  const overlay  = getOrCreatePreviewModal();
  const iframe   = overlay.querySelector('#previewIframe')    as HTMLIFrameElement;
  const loading  = overlay.querySelector('#previewLoading')   as HTMLElement;
  const fallback = overlay.querySelector('#previewFallback')  as HTMLElement;
  const viewport = overlay.querySelector('#previewViewport')  as HTMLElement;

  // Reset state
  iframe.style.display   = 'block';
  fallback.style.display = 'none';
  loading.style.display  = 'flex';
  loading.classList.remove('is-slow');
  viewport.classList.remove('preview-viewport--mobile');
  overlay.querySelector('#previewDesktopBtn')!.classList.add('active');
  overlay.querySelector('#previewMobileBtn')!.classList.remove('active');

  // Populate header
  (overlay.querySelector('#previewProjectIcon') as HTMLElement).innerHTML = project.icon;
  (overlay.querySelector('#previewProjectName') as HTMLElement).textContent = project.title;
  (overlay.querySelector('#previewUrl') as HTMLElement).textContent = (project.previewUrl ?? project.link).replace(/^https?:\/\//, '');

  // External link
  const extBtn = overlay.querySelector('#previewExternalBtn') as HTMLAnchorElement;
  extBtn.href = project.link;

  const fallbackLink = overlay.querySelector('#previewFallbackLink') as HTMLAnchorElement;
  fallbackLink.href  = project.link;

  // "Still loading" prompt's own external link, kept in sync per-project
  const slowExternalLink = overlay.querySelector('#previewSlowExternalLink') as HTMLAnchorElement | null;
  if (slowExternalLink) slowExternalLink.href = project.link;

  // Stack tags in footer
  (overlay.querySelector('#previewStack') as HTMLElement).innerHTML =
    project.stack.map(s => `<span>${s}</span>`).join('');

  // Screenshot gallery in fallback
  const screenshotsEl = overlay.querySelector('#previewScreenshots') as HTMLElement;
  if (project.screenshots?.length) {
    screenshotsEl.innerHTML = project.screenshots
      .map(src => `<img src="${src}" alt="${project.title} screenshot" loading="lazy" />`)
      .join('');
    screenshotsEl.style.display = 'grid';
  } else {
    screenshotsEl.innerHTML = '';
    screenshotsEl.style.display = 'none';
  }

  // Load iframe
  iframe.src = project.previewUrl ?? project.link;

  // Start the "still loading?" watchdog so slow connections always get a way out
  (overlay as any)._startSlowLoadTimer?.();

  // Show overlay
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectPreview(): void {
  if (!previewOverlay) return;
  previewOverlay.classList.remove('open');
  previewOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  (previewOverlay as any)._clearSlowLoadTimer?.();

  // Unload iframe to stop background network activity
  setTimeout(() => {
    const iframe = previewOverlay?.querySelector('#previewIframe') as HTMLIFrameElement | null;
    if (iframe) iframe.src = '';
  }, 300);
}

// ── Blog ──────────────────────────────────────────────────────────────────────
export function renderBlog(): void {
  const grid = document.getElementById('blogGrid');
  const filters = document.getElementById('blogFilters');
  if (!grid || !filters) return;

  const categories = ['All', ...new Set(BLOG_POSTS.map(p => p.category))];

  filters.innerHTML = categories.map(c => `
    <button class="blog-filter-btn${c === 'All' ? ' active' : ''}" data-cat="${c}" role="tab" aria-selected="${c === 'All'}">${c}</button>
  `).join('');

  grid.innerHTML = BLOG_POSTS.map(p => `
    <div class="blog-card" data-category="${p.category}" data-post-id="${p.id}" role="button" tabindex="0" aria-label="Read article: ${p.title}">
      <div class="blog-category">${p.category}</div>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <div class="blog-meta">
        <span>${p.date}</span>
        <span>${p.readTime} read</span>
      </div>
      <div class="blog-card-cta">
        Read article
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </div>
  `).join('');

  filters.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.blog-filter-btn') as HTMLElement | null;
    if (!btn) return;
    const cat = btn.dataset.cat ?? 'All';
    filters.querySelectorAll('.blog-filter-btn').forEach(b => {
      const isActive = b === btn;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', String(isActive));
    });
    grid.querySelectorAll<HTMLElement>('.blog-card').forEach(card => {
      const show = cat === 'All' || card.dataset.category === cat;
      card.style.display = show ? '' : 'none';
    });
  });

  grid.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.blog-card') as HTMLElement | null;
    if (!card) return;
    const id = card.dataset.postId;
    if (!id) return;
    const post = BLOG_POSTS.find(p => p.id === id);
    if (post) openArticleModal(post);
  });
  grid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = (e.target as HTMLElement).closest('.blog-card') as HTMLElement | null;
      if (!card) return;
      const id = card.dataset.postId;
      if (!id) return;
      const post = BLOG_POSTS.find(p => p.id === id);
      if (post) openArticleModal(post);
    }
  });
}

// ── Article Modal (unchanged) ─────────────────────────────────────────────────
function getOrCreateModal(): HTMLElement {
  let overlay = document.getElementById('articleOverlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'articleOverlay';
  overlay.className = 'article-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="article-modal" id="articleModal" role="document">
      <div class="article-modal-header">
        <div class="article-modal-meta">
          <span class="article-modal-cat" id="articleCat"></span>
          <span class="article-modal-sep">·</span>
          <span id="articleDate"></span>
        </div>
        <button class="article-close" id="articleClose" aria-label="Close article">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="article-modal-body">
        <h2 id="articleTitle"></h2>
        <div id="articleContent"></div>
      </div>
      <div class="article-modal-footer">
        <div class="article-tags" id="articleTags"></div>
        <div class="article-read-time">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span id="articleReadTime"></span>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeArticleModal();
  });
  overlay.querySelector('#articleClose')!.addEventListener('click', closeArticleModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay!.classList.contains('open')) closeArticleModal();
  });

  return overlay;
}

function openArticleModal(post: typeof BLOG_POSTS[0]): void {
  const overlay = getOrCreateModal();
  const modal   = overlay.querySelector('#articleModal') as HTMLElement;

  (overlay.querySelector('#articleCat') as HTMLElement).textContent      = post.category;
  (overlay.querySelector('#articleDate') as HTMLElement).textContent     = post.date;
  (overlay.querySelector('#articleTitle') as HTMLElement).textContent    = post.title;
  (overlay.querySelector('#articleContent') as HTMLElement).innerHTML    = post.content;
  (overlay.querySelector('#articleReadTime') as HTMLElement).textContent = post.readTime + ' read';
  (overlay.querySelector('#articleTags') as HTMLElement).innerHTML =
    post.tags.map(t => `<span>${t}</span>`).join('');

  modal.scrollTop = 0;
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeArticleModal(): void {
  const overlay = document.getElementById('articleOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ── AI Lab, Services, Skills (unchanged) ──────────────────────────────────────
export function renderAILab(): void {
  const container = document.getElementById('aiCards');
  if (!container) return;
  container.innerHTML = AI_CARDS.map(c => `
    <div class="ai-card">
      <div class="ai-card-icon">${c.icon}</div>
      <h3>${c.title}</h3>
      <p>${c.description}</p>
      <div class="ai-card-tags">${c.tags.map(t => `<span>${t}</span>`).join('')}</div>
    </div>
  `).join('');
}

export function renderServices(): void {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  grid.innerHTML = SERVICES.map(s => `
    <div class="service-card">
      <div class="service-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
    </div>
  `).join('');
}

export function renderSkillChips(): void {
  const grid     = document.getElementById('skillsGrid');
  const carousel = document.getElementById('skillsCarousel');
  if (!grid && !carousel) return;

  const html = SKILL_CHIPS.map(s => {
    const icon = SKILL_ICONS[s.name] ?? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`;
    return `
      <div class="skill-chip">
        <div class="skill-chip-icon">${icon}</div>
        <div class="skill-chip-name">${s.name}</div>
      </div>
    `;
  }).join('');

  if (grid)     grid.innerHTML     = html;
  if (carousel) carousel.innerHTML = html;
}