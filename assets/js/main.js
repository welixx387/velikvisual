(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // phones and tablets: lighter background, no mouse-only effects
  const lite = matchMedia('(hover: none), (max-width: 640px)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ------------------------------------------------------------ toast
  let toastTimer;
  window.vvToast = (msg) => {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('on'), 2400);
  };

  window.vvCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  };

  // ------------------------------------------------------------ background: liquid light
  const cv = $('#bg');
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  const blobs = Array.from({ length: lite ? 3 : 5 }, (_, i) => ({
    r: 260 + i * 70, sx: 0.00007 + i * 0.000025, sy: 0.00005 + i * 0.00003, ph: i * 1.7, a: 0.05 + (i % 2) * 0.03,
  }));
  const dust = Array.from({ length: lite ? 50 : 140 }, () => ({
    x: Math.random(), y: Math.random(), z: 0.3 + Math.random() * 0.7, s: Math.random() * 6.28, v: 0.00002 + Math.random() * 0.00006,
  }));
  function resize() {
    // mobile browsers fire resize while the address bar hides on scroll; re-allocating the canvas then makes it flicker
    if (W && innerWidth === W && Math.abs(innerHeight - H) < 160) return;
    dpr = Math.min(lite ? 1 : 1.5, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', (e) => { mouse.tx = e.clientX; mouse.ty = e.clientY; }, { passive: true });

  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const scroll = scrollY * 0.15;
    for (const b of blobs) {
      const x = W * (0.5 + 0.42 * Math.sin(t * b.sx + b.ph));
      const y = H * (0.45 + 0.38 * Math.cos(t * b.sy + b.ph * 1.3)) - (scroll % H) * 0.2;
      const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      g.addColorStop(0, `rgba(255,255,255,${b.a})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - b.r, y - b.r, b.r * 2, b.r * 2);
    }
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;
    if (mouse.x > -1000) {
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 340);
      g.addColorStop(0, 'rgba(255,255,255,0.07)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(mouse.x - 340, mouse.y - 340, 680, 680);
    }
    for (const d of dust) {
      d.y -= d.v * 16 * d.z;
      if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
      const x = d.x * W + Math.sin(t * 0.0004 + d.s) * 18 * d.z;
      const y = ((d.y * H - scroll * d.z) % H + H) % H;
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.002 + d.s * 3));
      ctx.fillStyle = `rgba(255,255,255,${0.5 * tw * d.z})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.6 + d.z * 1.1, 0, 6.283);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    if (!reduce && !document.hidden) requestAnimationFrame(frame);
    else running = false;
  }
  let running = true;
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !reduce && !running) { running = true; requestAnimationFrame(frame); }
  });

  // ------------------------------------------------------------ title letters
  $$('[data-split]').forEach((el, wi) => {
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'c';
      s.textContent = ch;
      s.style.animationDelay = `${0.08 + wi * 0.25 + i * 0.05}s`;
      el.appendChild(s);
    });
  });

  // ------------------------------------------------------------ 3D logo prism
  const prism = $('#prism');
  let px = 0, py = 0, ptx = 0, pty = 0;
  addEventListener('pointermove', (e) => {
    ptx = (e.clientX / innerWidth - 0.5) * 2;
    pty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  function tilt(t) {
    px += (ptx - px) * 0.06;
    py += (pty - py) * 0.06;
    const idle = Math.sin(t * 0.0006) * 8;
    if (prism) prism.style.transform = `rotateY(${px * 28 + idle}deg) rotateX(${-py * 22}deg)`;
    if (!reduce) requestAnimationFrame(tilt);
  }
  requestAnimationFrame(tilt);

  // ------------------------------------------------------------ reveal on scroll
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  window.vvReveal = (root = document) => $$('.reveal:not(.in)', root).forEach((el) => io.observe(el));
  window.vvReveal();

  // ------------------------------------------------------------ cursor spotlight on glass cards
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest && e.target.closest('.spot');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });

  // ------------------------------------------------------------ marquee
  const words = ['TargetESP', 'Шейдеры', 'JumpCircles', 'Своё небо', 'HitParticles', 'Свои плащи', 'Крылья', 'Hitboxes', 'Конфиги', '1.21 — 1.21.11'];
  const fill = (el, offset) => {
    if (!el) return;
    const html = words.map((w, i) => `<span class="${(i + offset) % 2 ? 'o' : ''}">${w}</span><span class="star">✦</span>`).join('');
    el.innerHTML = html + html;
  };
  fill($('#mq1'), 0);
  fill($('#mq2'), 1);

  // ------------------------------------------------------------ mini gui toggles
  const sws = $$('#miniGui .sw');
  setInterval(() => {
    const s = sws[Math.floor(Math.random() * sws.length)];
    if (s) s.classList.toggle('on');
  }, 1300);

  // ------------------------------------------------------------ gallery: drag + arrows + lightbox
  const gal = $('#gallery');
  if (gal) {
    let down = false, sx = 0, sl = 0, moved = 0;
    // drag-to-scroll is for the mouse only; touch already scrolls natively
    gal.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = gal.scrollLeft; gal.classList.add('drag'); });
    addEventListener('pointerup', () => { down = false; gal.classList.remove('drag'); });
    gal.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      gal.scrollLeft = sl - dx;
    });
    const step = () => (gal.querySelector('.shot')?.offsetWidth || 600) + 22;
    $('#gPrev')?.addEventListener('click', () => gal.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('#gNext')?.addEventListener('click', () => gal.scrollBy({ left: step(), behavior: 'smooth' }));
    const lb = $('#lightbox');
    gal.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img || moved > 6) return;
      lb.querySelector('img').src = img.src;
      lb.classList.add('on');
    });
    lb.addEventListener('click', () => lb.classList.remove('on'));
  }

  // ------------------------------------------------------------ socials
  const cfg = window.VV_CONFIG || {};
  const soc = $('#socials');
  if (soc) {
    const links = [];
    if (cfg.telegram) links.push(`<a class="btn ghost sm" href="${cfg.telegram}" target="_blank" rel="noopener">Telegram</a>`);
    if (cfg.discord) links.push(`<a class="btn ghost sm" href="${cfg.discord}" target="_blank" rel="noopener">Discord</a>`);
    links.push('<a class="btn primary sm" href="#shop">Купить клиент</a>');
    soc.innerHTML = links.join('');
  }

  // ------------------------------------------------------------ language
  const langBtn = $('#langBtn');
  if (langBtn) {
    langBtn.textContent = window.VV_LANG === 'en' ? 'RU' : 'EN';
    langBtn.addEventListener('click', () => window.vvSetLang(window.VV_LANG === 'en' ? 'ru' : 'en'));
  }

  // ------------------------------------------------------------ mobile menu
  const nav = $('#nav'), burger = $('#burger');
  const setMenu = (on) => { nav.classList.toggle('open', on); burger && burger.setAttribute('aria-expanded', String(on)); };
  burger && burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('#nav .links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setMenu(false); });

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setMenu(false);
      $('#lightbox')?.classList.remove('on');
      window.vvCloseAll && window.vvCloseAll();
    }
  });
})();
