(() => {
  const grid = document.querySelector('#cfgGrid');
  if (!grid) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  fetch('configs/configs.json', { cache: 'no-cache' })
    .then((r) => r.json())
    .then(({ configs }) => {
      grid.innerHTML = configs.map((c, i) => `
        <article class="cfg glass spot reveal ${['', 'd1', 'd2'][i % 3]}">
          <div class="top"><h4>${esc(c.name)}</h4><span class="by">от ${esc(c.author)}</span></div>
          <div class="chips">${(c.tags || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
          <p>${esc(c.desc)}</p>
          <code title="${esc(c.code)}">${esc(c.code)}</code>
          <button class="btn primary sm" data-code="${i}">Скопировать код</button>
        </article>`).join('');
      window.vvReveal && window.vvReveal(grid);
      grid.addEventListener('click', async (e) => {
        const b = e.target.closest('[data-code]');
        if (!b) return;
        await window.vvCopy(configs[+b.dataset.code].code);
        b.textContent = 'Скопировано ✓';
        window.vvToast('Код скопирован — вставьте его в меню «Конфиги»');
        setTimeout(() => { b.textContent = 'Скопировать код'; }, 1800);
      });
    })
    .catch(() => { grid.innerHTML = '<p class="sub">Не удалось загрузить конфиги.</p>'; });
})();
