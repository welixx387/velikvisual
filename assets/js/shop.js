(() => {
  const cfg = window.VV_CONFIG || {};
  const cur = cfg.currency || '₽';
  const $ = (s, r = document) => r.querySelector(s);

  // grant: what gets written to api/cosmetics.json for the buyer's nickname
  const PRODUCTS = [
    { id: 'client', cat: 'client', name: 'VelikVisual Client', desc: 'Клиент навсегда: все функции, обновления и поддержка версий 1.21–1.21.11.', price: 299, badge: 'Хит', pv: 'client', grant: { client: 'lifetime' } },
    { id: 'cape-glass', cat: 'cape', name: 'Плащ «Стекло»', desc: 'Прозрачный плащ с бегущим бликом и светящимися краями.', price: 149, pv: 'cape glass', grant: { cape: 'glass' } },
    { id: 'cape-night', cat: 'cape', name: 'Плащ «Ночь»', desc: 'Чёрная ткань с мерцающими звёздами.', price: 149, pv: 'cape night', grant: { cape: 'night' } },
    { id: 'cape-theme', cat: 'cape', name: 'Плащ «Тема»', desc: 'Переливается цветами вашей темы клиента.', price: 199, pv: 'cape theme', grant: { cape: 'theme' } },
    { id: 'wings-angel', cat: 'wings', name: 'Крылья «Ангел»', desc: 'Белые стеклянные крылья, машут быстрее в прыжке.', price: 249, badge: 'New', pv: 'wings angel', grant: { wings: 'angel' } },
    { id: 'wings-demon', cat: 'wings', name: 'Крылья «Демон»', desc: 'Чёрные перья с белой светящейся кромкой.', price: 249, pv: 'wings demon', grant: { wings: 'demon' } },
    { id: 'halo-light', cat: 'halo', name: 'Нимб «Свет»', desc: 'Парящее кольцо света с двумя искрами.', price: 99, pv: 'halo', grant: { halo: 'light' } },
    { id: 'halo-theme', cat: 'halo', name: 'Нимб «Тема»', desc: 'Нимб в цветах вашей темы.', price: 129, pv: 'halo theme', grant: { halo: 'theme' } },
    { id: 'pet-orb', cat: 'pet', name: 'Питомец «Сфера»', desc: 'Светящийся шар-компаньон с тремя спутниками.', price: 149, pv: 'orb', grant: { pet: 'orb' } },
    { id: 'pet-cube', cat: 'pet', name: 'Питомец «Куб»', desc: 'Вращающийся стеклянный куб.', price: 179, pv: 'cube', grant: { pet: 'cube' } },
    { id: 'pet-crystal', cat: 'pet', name: 'Питомец «Кристалл»', desc: 'Парящий октаэдр-кристалл.', price: 199, pv: 'crystal', grant: { pet: 'crystal' } },
    { id: 'aura-sparks', cat: 'aura', name: 'Аура «Искры»', desc: 'Искры поднимаются вокруг игрока.', price: 129, pv: 'aura', grant: { aura: 'sparks' } },
    { id: 'aura-snow', cat: 'aura', name: 'Аура «Снег»', desc: 'Снежинки падают вокруг вас.', price: 129, pv: 'aura snow', grant: { aura: 'snow' } },
    { id: 'bundle', cat: 'bundle', name: 'Набор «Всё и сразу»', desc: 'Клиент + плащ «Стекло» + крылья «Ангел» + нимб + питомец «Сфера» + аура.', price: 899, badge: 'Выгода 175 ₽', pv: 'bundle', grant: { client: 'lifetime', cape: 'glass', wings: 'angel', halo: 'light', pet: 'orb', aura: 'sparks' } },
  ];
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
    $('#payNote').textContent = cfg.yoomoneyWallet ? 'Оплата картой через ЮMoney. Чек придёт на почту.' : 'Оплата переводом на карту или по СБП. После перевода отправьте чек — мы проверим и выдадим покупку.';
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
  const nickOk = (n) => /^[A-Za-z0-9_]{3,16}$/.test(n);
  function orderId() {
    const t = Date.now().toString(36).toUpperCase();
    return `VV-${t.slice(-6)}`;
  }
  $('#checkout').addEventListener('click', () => {
    const nick = $('#nick').value.trim();
    const contact = $('#contact').value.trim();
    if (!nickOk(nick)) {
      window.vvToast('Укажите ник Minecraft: 3–16 символов, латиница, цифры и _');
      $('#nick').focus();
      return;
    }
    if (!contact) {
      window.vvToast('Укажите Telegram или e-mail для связи');
      $('#contact').focus();
      return;
    }
    const id = orderId();
    const sum = cart.reduce((s, x) => s + byId(x).price, 0);
    const list = cart.map((x) => byId(x).name).join(', ');
    const grant = Object.assign({}, ...cart.map((x) => byId(x).grant));
    const summary = `Заказ ${id}\nНик: ${nick}\nСвязь: ${contact}\nТовары: ${list}\nСумма: ${sum} ${cur}\nВыдать: ${JSON.stringify(grant)}`;

    if (cfg.yoomoneyWallet) {
      const f = document.createElement('form');
      f.method = 'POST';
      f.action = 'https://yoomoney.ru/quickpay/confirm';
      const fields = {
        receiver: cfg.yoomoneyWallet, 'quickpay-form': 'shop', targets: `VelikVisual: ${list}`.slice(0, 150),
        paymentType: 'AC', sum: String(sum), label: `${id}|${nick}|${cart.join(',')}`.slice(0, 64),
        successURL: `${cfg.siteUrl || location.origin}/#thanks`,
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

    showPayment({ id, nick, sum, summary });
  });

  // ------------------------------------------------------------ manual payment: transfer + receipt
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
    rows.push(payRow('Комментарий', o.id, o.id));
    const hasDetails = !!(p.card || p.phone);
    modal.innerHTML = `
      <span class="eyebrow">Шаг 1 из 2</span>
      <h3>Оплата заказа ${o.id}</h3>
      <p>${hasDetails ? 'Переведите сумму по реквизитам и <b>обязательно укажите код заказа в комментарии</b> к переводу — так мы найдём ваш платёж.' : 'Реквизиты для перевода пришлёт продавец в Telegram. Напишите ему код заказа.'}</p>
      <div class="pay">${rows.join('')}</div>
      <div class="row"><button class="btn primary" id="paid">Я оплатил — отправить чек</button><button class="btn ghost" id="closeModal">Отмена</button></div>`;
    drawer.classList.remove('on');
    overlay.classList.add('on');
    modal.classList.add('on');
    $('#closeModal').addEventListener('click', window.vvCloseAll);
    $('#paid').addEventListener('click', () => showReceipt(o));
  }
  function showReceipt(o) {
    window.vvCopy(o.summary);
    const tg = cfg.telegram ? `<a class="btn primary" href="${esc(cfg.telegram)}" target="_blank" rel="noopener">Открыть Telegram</a>` : '';
    modal.innerHTML = `
      <span class="eyebrow">Шаг 2 из 2</span>
      <h3>Отправьте чек</h3>
      <p>Сделайте скриншот чека из приложения банка и отправьте его продавцу${cfg.telegram ? ' в Telegram' : ''} вместе с текстом заказа — он уже скопирован, просто вставьте его в чат.</p>
      <pre id="orderText"></pre>
      <div class="row">${tg}<button class="btn ghost" id="copyOrder">Скопировать ещё раз</button><button class="btn ghost" id="done">Готово</button></div>
      <p class="note">Проверка чека обычно занимает до 24 часов. После подтверждения косметика сама появится в игре на нике <b>${esc(o.nick)}</b>, а клиент пришлют в чат.</p>`;
    $('#orderText').textContent = o.summary;
    $('#copyOrder').addEventListener('click', async () => { await window.vvCopy(o.summary); window.vvToast('Заказ скопирован'); });
    $('#done').addEventListener('click', () => {
      cart = [];
      save();
      render();
      window.vvCloseAll();
      window.vvToast('Спасибо! Ждите подтверждения чека.');
    });
    window.vvToast('Текст заказа скопирован');
  }
  modal.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    await window.vvCopy(b.dataset.copy);
    window.vvToast('Скопировано');
  });

  if (location.hash === '#thanks') {
    cart = [];
    save();
    setTimeout(() => window.vvToast('Спасибо! Оплата получена — покупка появится в игре в течение нескольких минут.'), 600);
  }
  render();
})();
