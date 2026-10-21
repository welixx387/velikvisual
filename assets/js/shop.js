(() => {
  const cfg = window.VV_CONFIG || {};
  const cur = cfg.currency || '₽';
  const $ = (s, r = document) => r.querySelector(s);

  const PRODUCTS = window.VV_PRODUCTS || [];

  const CATS = [['all', 'Всё'], ['client', 'Клиент'], ['cape', 'Плащи'], ['wings', 'Крылья'], ['halo', 'Нимбы'], ['pet', 'Питомцы'], ['aura', 'Ауры'], ['bundle', 'Наборы']];

  const figure = (inner = '', back = false) => `<div class="pv-figure">${inner}<div class="headb"></div><div class="torso"></div><div class="legs"></div></div>`;
  const wings = (cls) => `<div class="pv-wings ${cls}"><div class="wing l"><svg><use href="#wing"/></svg></div><div class="wing r"><svg style="transform:scaleX(-1)"><use href="#wing"/></svg></div></div>`;
  const aura = (snow) => `<div class="pv-aura ${snow ? 'snow' : ''}">${Array.from({ length: 12 }, (_, i) => `<i style="left:${20 + (i * 53) % 60}%;animation-delay:${(i * 0.37) % 2.6}s"></i>`).join('')}</div>`;
  function preview(pv) {
    const [kind, style] = pv.split(' ');
    switch (kind) {
      case 'client': return '<img class="pv-client" src="assets/img/logo.svg" alt="">';
      case 'cape': return figure(`<div class="cape ${style}"></div>`);
      case 'wings': return wings(style) + figure();
      case 'halo': return `<div class="pv-halo ${style || ''}"></div>` + figure();
      case 'orb': return '<div class="pv-orb"></div>';
      case 'cube': return '<div class="pv-cube">' + '<i></i>'.repeat(6) + '</div>';
      case 'crystal': return '<div class="pv-crystal"><svg viewBox="0 0 64 100"><polygon points="32,2 62,50 32,98 2,50" fill="rgba(255,255,255,.12)" stroke="#fff" stroke-width="1.6"/><polyline points="2,50 32,62 62,50" fill="none" stroke="#fff" stroke-opacity=".7"/><line x1="32" y1="2" x2="32" y2="62" stroke="#fff" stroke-opacity=".5"/><line x1="32" y1="62" x2="32" y2="98" stroke="#fff" stroke-opacity=".5"/></svg></div>';
      case 'aura': return aura(style === 'snow') + figure();
      case 'bundle': return '<div class="pv-bundle"><div class="pv-orb"></div><img class="pv-client" style="width:90px;height:90px" src="assets/img/logo.svg" alt=""><div class="pv-cube"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>';
      default: return '';
    }
  }

  // ------------------------------------------------------------ catalog
  const grid = $('#products');
  grid.innerHTML = PRODUCTS.map((p, i) => `
    <article class="product glass spot reveal ${['', 'd1', 'd2', 'd3'][i % 4]}" data-cat="${p.cat}" data-id="${p.id}">
      <div class="stage">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}${preview(p.pv)}</div>
      <div class="meta">
        <span class="tag">${CATS.find((c) => c[0] === p.cat)[1]}</span>
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <div class="buy"><span class="price">${p.price} <small>${cur}</small></span><button class="btn primary sm add" data-add="${p.id}">В корзину</button></div>
      </div>
    </article>`).join('');
  window.vvReveal && window.vvReveal(grid);

  const tabs = $('#tabs');
  tabs.innerHTML = CATS.map(([k, n], i) => `<button data-cat="${k}" class="${i ? '' : 'on'}">${n}</button>`).join('');
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    tabs.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    const c = b.dataset.cat;
    grid.querySelectorAll('.product').forEach((el) => el.classList.toggle('hide', c !== 'all' && el.dataset.cat !== c));
  });

  // ------------------------------------------------------------ cart
  const KEY = 'vv-cart';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || '[]').filter((id) => PRODUCTS.some((p) => p.id === id)); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* private mode */ } };
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  function render() {
    const count = $('#cartCount');
    count.textContent = cart.length;
    count.classList.toggle('on', cart.length > 0);
    const items = $('#items');
    items.innerHTML = cart.length ? cart.map((id) => {
      const p = byId(id);
      return `<div class="item"><div><b>${p.name}</b><small>${CATS.find((c) => c[0] === p.cat)[1]}</small></div><span>${p.price} ${cur}</span><button class="rm" data-rm="${id}" aria-label="Убрать">&times;</button></div>`;
    }).join('') : '<div class="empty">Корзина пуста.<br>Добавьте клиент или косметику.</div>';
    $('#total').textContent = `${cart.reduce((s, id) => s + byId(id).price, 0)} ${cur}`;
    document.querySelectorAll('[data-add]').forEach((b) => {
      const inCart = cart.includes(b.dataset.add);
      b.classList.toggle('added', inCart);
      b.textContent = inCart ? 'В корзине ✓' : 'В корзину';
    });
    $('#checkout').disabled = cart.length === 0;
    $('#payNote').textContent = cfg.yoomoneyWallet ? 'Оплата картой любого банка через ЮMoney. Покупка выдаётся автоматически за 5–15 минут.' : 'Оплата переводом на карту. Код заказа в комментарии — и мы выдадим покупку.';
  }

  const overlay = $('#overlay'), drawer = $('#drawer'), modal = $('#modal');
  const openCart = () => { overlay.classList.add('on'); drawer.classList.add('on'); };
  window.vvCloseAll = () => { overlay.classList.remove('on'); drawer.classList.remove('on'); modal.classList.remove('on'); };
  $('#cartOpen').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', window.vvCloseAll);
  overlay.addEventListener('click', window.vvCloseAll);

  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const id = add.dataset.add;
      if (!cart.includes(id)) {
        cart.push(id);
        save();
        render();
        const c = $('#cartCount');
        c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
        window.vvToast && window.vvToast(`${byId(id).name} — в корзине`);
      } else {
        openCart();
      }
      return;
    }
    const rm = e.target.closest('[data-rm]');
    if (rm) {
      cart = cart.filter((x) => x !== rm.dataset.rm);
      save();
      render();
    }
  });

  // ------------------------------------------------------------ checkout
  // auto: ЮMoney + робот (.github/workflows/payments.yml) выдаёт покупку сам.
  // manual: перевод на карту, код заказа в комментарии, выдача через admin.html.
  const auto = !!cfg.yoomoneyWallet;
  const nickOk = (n) => /^[A-Za-z0-9_]{3,16}$/.test(n);
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  if (auto) $('#contact').closest('.field').hidden = true;

  $('#checkout').addEventListener('click', () => {
    const nick = $('#nick').value.trim();
    const contact = $('#contact').value.trim();
    if (!nickOk(nick)) {
      window.vvToast('Укажите ник Minecraft: 3–16 символов, латиница, цифры и _');
      $('#nick').focus();
      return;
    }
    if (!auto && !contact) {
      window.vvToast('Укажите Telegram или e-mail для связи');
      $('#contact').focus();
      return;
    }
    const code = window.VV_ORDER.encode(nick, cart);
    const sum = cart.reduce((s, x) => s + byId(x).price, 0);
    const list = cart.map((x) => byId(x).name).join(', ');

    if (auto) {
      const f = document.createElement('form');
      f.method = 'POST';
      f.action = 'https://yoomoney.ru/quickpay/confirm';
      const fields = {
        receiver: cfg.yoomoneyWallet, 'quickpay-form': 'button', targets: `VelikVisual: ${list}`.slice(0, 150),
        paymentType: 'AC', sum: String(sum), label: code,
        successURL: `${cfg.siteUrl || location.origin}/#paid=${code}`,
      };
      for (const [k, v] of Object.entries(fields)) {
        const i = document.createElement('input');
        i.type = 'hidden'; i.name = k; i.value = v;
        f.appendChild(i);
      }
      document.body.appendChild(f);
      f.submit();
      return;
    }

    const summary = `Заказ ${code}\nНик: ${nick}\nСвязь: ${contact}\nТовары: ${list}\nСумма: ${sum} ${cur}`;
    showPayment({ code, nick, contact, sum, summary });
  });

  // ------------------------------------------------------------ manual payment: transfer to card
  function payRow(label, value, copy) {
    const btn = copy == null ? '' : `<button class="btn ghost sm" data-copy="${esc(copy)}">Копировать</button>`;
    return `<div class="pay-row"><span>${label}</span><b>${esc(value)}</b>${btn}</div>`;
  }
  function showPayment(o) {
    const p = cfg.pay || {};
    const rows = [];
    if (p.bank) rows.push(payRow('Банк', p.bank));
    if (p.card) rows.push(payRow('Карта', p.card, p.card.replace(/\s+/g, '')));
    if (p.phone) rows.push(payRow('СБП', p.phone, p.phone.replace(/[^\d+]/g, '')));
    if (p.recipient) rows.push(payRow('Получатель', p.recipient));
    rows.push(payRow('Сумма', `${o.sum} ${cur}`, String(o.sum)));
    rows.push(payRow('Комментарий', o.code, o.code));
    const hasDetails = !!(p.card || p.phone);
    modal.innerHTML = `
      <span class="eyebrow">Шаг 1 из 2</span>
      <h3>Оплата заказа</h3>
      <p>${hasDetails ? 'Переведите сумму по реквизитам и <b>обязательно вставьте код заказа в комментарий</b> к переводу — по нему мы узнаем ваш ник и покупки.' : 'Реквизиты для перевода пришлёт продавец. Сохраните код заказа.'}</p>
      <div class="pay">${rows.join('')}</div>
      <div class="row"><button class="btn primary" id="paid">Я оплатил</button><button class="btn ghost" id="closeModal">Отмена</button></div>`;
    drawer.classList.remove('on');
    overlay.classList.add('on');
    modal.classList.add('on');
    $('#closeModal').addEventListener('click', window.vvCloseAll);
    $('#paid').addEventListener('click', () => showReceipt(o));
  }
  function showReceipt(o) {
    const tg = cfg.telegram ? `<a class="btn primary" href="${esc(cfg.telegram)}" target="_blank" rel="noopener">Отправить чек в Telegram</a>` : '';
    if (cfg.telegram) window.vvCopy(o.summary);
    modal.innerHTML = `
      <span class="eyebrow">Шаг 2 из 2</span>
      <h3>Спасибо!</h3>
      <p>${cfg.telegram
        ? 'Отправьте продавцу в Telegram скриншот чека и текст заказа — он уже скопирован, просто вставьте его в чат.'
        : `Мы найдём перевод по коду в комментарии и выдадим покупку. Если что-то будет не так, напишем вам: <b>${esc(o.contact)}</b>.`}</p>
      <pre id="orderText"></pre>
      <div class="row">${tg}<button class="btn ghost" id="copyOrder">Скопировать заказ</button><button class="btn ghost" id="done">Готово</button></div>
      <p class="note">Проверка перевода обычно занимает до 24 часов. После подтверждения косметика сама появится в игре на нике <b>${esc(o.nick)}</b>.</p>`;
    $('#orderText').textContent = o.summary;
    $('#copyOrder').addEventListener('click', async () => { await window.vvCopy(o.summary); window.vvToast('Заказ скопирован'); });
    $('#done').addEventListener('click', () => {
      cart = [];
      save();
      render();
      window.vvCloseAll();
      window.vvToast('Спасибо! Ждите подтверждения.');
    });
    if (cfg.telegram) window.vvToast('Текст заказа скопирован');
  }
  modal.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    await window.vvCopy(b.dataset.copy);
    window.vvToast('Скопировано');
  });

  // ------------------------------------------------------------ after ЮMoney: wait for the robot
  function watchOrder(code) {
    const o = window.VV_ORDER.decode(code);
    if (!o) return;
    cart = [];
    save();
    render();
    const items = o.items.map((p) => payRow(p.name, `${p.price} ${cur}`)).join('');
    modal.innerHTML = `
      <span class="eyebrow">Оплата принята</span>
      <h3>Выдаём покупку</h3>
      <p>Спасибо! Робот проверяет платежи каждые несколько минут и сам привяжет покупку к нику <b>${esc(o.nick)}</b>. Обычно это занимает 5–15 минут. Страницу можно закрыть.</p>
      <div class="pay">${items}</div>
      <div class="wait" id="wait"><i></i><span>Ждём подтверждения платежа…</span></div>
      <div class="row" id="waitRow"><button class="btn ghost" id="closeModal">Закрыть</button></div>`;
    overlay.classList.add('on');
    modal.classList.add('on');
    $('#closeModal').addEventListener('click', window.vvCloseAll);
    history.replaceState(null, '', location.pathname);

    const started = Date.now();
    const check = async () => {
      if (!modal.classList.contains('on')) return;
      let st = null;
      try {
        const r = await fetch(`api/orders.json?t=${Date.now()}`, { cache: 'no-store' });
        st = ((await r.json()).orders || {})[o.code];
      } catch (e) { /* retry later */ }
      if (st && st.status === 'granted') {
        const client = o.items.some((p) => p.grant.client);
        $('#wait').classList.add('ok');
        $('#wait').innerHTML = `<i></i><span>Готово! Зайдите в игру — покупка появится в течение 5 минут.${client && !cfg.clientDownload ? ` За файлом клиента напишите продавцу${cfg.telegram ? ` <a href="${esc(cfg.telegram)}" target="_blank" rel="noopener">в Telegram</a>` : ''} и укажите код ${esc(o.code)}.` : ''}</span>`;
        if (client && cfg.clientDownload) $('#waitRow').insertAdjacentHTML('afterbegin', `<a class="btn primary" href="${esc(cfg.clientDownload)}">Скачать клиент</a>`);
        return;
      }
      if (st) {
        $('#wait').classList.add('bad');
        $('#wait').innerHTML = `<i></i><span>Платёж получен, но сумма меньше стоимости заказа. Напишите продавцу${cfg.telegram ? ` в <a href="${esc(cfg.telegram)}" target="_blank" rel="noopener">Telegram</a>` : ''} и укажите код ${esc(o.code)}.</span>`;
        return;
      }
      if (Date.now() - started < 40 * 60 * 1000) setTimeout(check, 20000);
    };
    check();
  }

  render();
  const paid = /^#paid=(.+)$/.exec(location.hash);
  if (paid) setTimeout(() => watchOrder(decodeURIComponent(paid[1])), 300);
})();
