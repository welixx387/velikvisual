/*
 * English version of the site. The page is written in Russian; in English mode every text node and
 * the alt / aria-label / placeholder attributes are looked up here, including content that the
 * scripts add later (shop, cart, payment windows, toasts).
 * Language: ?lang=en|ru, then the saved choice, then the browser language.
 */
(() => {
  const RU_LANGS = ['ru', 'uk', 'be', 'kk'];
  let lang = null;
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'en' || q === 'ru') lang = q;
  try { if (!lang) lang = localStorage.getItem('vv-lang'); } catch (e) { /* private mode */ }
  if (lang !== 'en' && lang !== 'ru') {
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'ru';
    lang = RU_LANGS.includes(nav.slice(0, 2).toLowerCase()) ? 'ru' : 'en';
  }
  window.VV_LANG = lang;
  window.vvSetLang = (l) => {
    try { localStorage.setItem('vv-lang', l); } catch (e) { /* private mode */ }
    const u = new URL(location.href);
    u.searchParams.delete('lang');
    location.href = u.toString();
  };

  const D = {
    // head
    'VelikVisual — визуальный клиент для Minecraft 1.21–1.21.11': 'VelikVisual — visual client for Minecraft 1.21–1.21.11',
    'VelikVisual — стеклянный визуальный клиент для Minecraft 1.21–1.21.11 на Fabric: TargetHUD, TargetESP, JumpCircles, ChinaHat, плащи, крылья, питомцы и обмен конфигами.': 'VelikVisual — a glass visual client for Minecraft 1.21–1.21.11 on Fabric: TargetHUD, TargetESP, JumpCircles, ChinaHat, capes, wings, pets, shaders and config sharing.',
    'VelikVisual — визуальный клиент для Minecraft': 'VelikVisual — visual client for Minecraft',
    'Стекло, свет и плавность. Один файл для всех версий 1.21–1.21.11.': 'Glass, light and smoothness. One file for every version 1.21–1.21.11.',
    // nav
    'Функции': 'Features', 'Скриншоты': 'Screenshots', 'Магазин': 'Shop', 'Конфиги': 'Configs', 'Установка': 'Install',
    'Меню': 'Menu', 'Корзина': 'Cart', 'Купить': 'Buy',
    // hero
    'Визуальный клиент для Minecraft 1.21 — 1.21.11. Стекло, свет и плавные анимации — без читов и без лагов.': 'A visual client for Minecraft 1.21 — 1.21.11. Glass, light and smooth animations — no cheats and no lag.',
    'Купить клиент': 'Buy the client', 'Посмотреть в игре': 'See it in game',
    '1 файл': '1 file', 'все версии 1.21–1.21.11': 'all versions 1.21–1.21.11', 'визуальных функций': 'visual features',
    'дружит с Sodium и Iris': 'works with Sodium and Iris',
    // features
    'Всё, что видно —': 'Everything you see —', 'сделано красиво': 'made beautiful',
    'Собственный рендер интерфейса со стеклянными панелями и сглаживанием, одинаковый на всех версиях от 1.21 до 1.21.11.': 'Its own interface renderer with glass panels and anti-aliasing, identical on every version from 1.21 to 1.21.11.',
    'TargetHUD и TargetESP': 'TargetHUD and TargetESP',
    'Голова, здоровье с «призрачной» полоской урона, броня цели. На самой цели — круг, кольца или светящиеся призраки.': 'Head, health with a “ghost” damage bar and the target’s armor. On the target itself — a circle, rings or glowing ghosts.',
    'Круги на земле при прыжке, светящийся след, частицы-сферы, звёзды, сердца и искры с настоящей физикой.': 'Circles on the ground when you jump, a glowing trail, orb particles, stars, hearts and sparks with real physics.',
    'Меню на Right Shift': 'Menu on Right Shift',
    'Категории, поиск, слайдеры, выбор цвета, бинды и редактор HUD: перетаскивание и размер колесом мыши.': 'Categories, search, sliders, color picker, binds and a full-screen HUD editor with snapping.',
    'Косметика': 'Cosmetics',
    'Плащи с физикой ткани, крылья, нимбы, питомцы и ауры. Их видят все игроки с VelikVisual.': 'Capes with cloth physics, wings, halos, headwear, pets and auras. Everyone with VelikVisual sees them.',
    'Конфиги и коды': 'Configs and codes',
    'Сохраняйте настройки, делитесь коротким кодом и применяйте чужие сборки одним Ctrl+V.': 'Save your settings, share a short code and apply other players’ setups with one Ctrl+V.',
    'Одна сборка — все версии': 'One build — every version',
    'Внутри jar лежат отдельные сборки под каждую ветку Minecraft, Fabric сам загружает нужную. Никаких «скачайте другую версию».': 'The jar contains a separate build for each Minecraft branch and Fabric loads the right one. No “download another version”.',
    '7 в 1': '7 in 1', 'сборок в одном файле': 'builds in one file',
    // showcase
    'Прямо из игры': 'Straight from the game',
    'Без монтажа: так выглядит клиент в Minecraft 1.21.11. Перетаскивайте ленту или жмите стрелки.': 'No editing: this is how the client looks in Minecraft 1.21.11. Drag the strip or use the arrows.',
    'Назад': 'Back', 'Вперёд': 'Forward',
    'Крылья, плащ и нимб': 'Wings, cape and halo', 'Крылья «Ангел», стеклянный плащ, нимб': 'Angel wings, glass cape, halo', 'косметика': 'cosmetics',
    'Меню клиента': 'Client menu', 'Стеклянное меню': 'Glass menu',
    'TargetESP «Призраки» и TargetHUD': 'TargetESP “Ghosts” and TargetHUD', 'бой': 'combat',
    'TargetESP и TargetHUD': 'TargetESP and TargetHUD',
    'Раздел косметики': 'Cosmetics section', 'стили и показ другим': 'styles and showing to others',
    'Конфиги, пресеты, коды': 'Configs, presets, codes', 'обмен настройками': 'sharing settings',
    'Аура и питомец': 'Aura and pet', 'Аура, питомец и атмосфера': 'Aura, pet and atmosphere', 'ночь': 'night',
    // shop
    'Клиент и': 'Client &',
    'Покупка привязывается к нику в Minecraft. Косметика появляется в игре автоматически — у вас и у всех, кто играет с VelikVisual.': 'A purchase is tied to your Minecraft nickname. Cosmetics appear in the game automatically — for you and everyone who plays with VelikVisual.',
    'Всё': 'All', 'Клиент': 'Client', 'Плащи': 'Capes', 'Крылья': 'Wings', 'Нимбы': 'Halos', 'Головные уборы': 'Headwear',
    'Питомцы': 'Pets', 'Ауры': 'Auras', 'Наборы': 'Bundles',
    'В корзину': 'Add to cart', 'В корзине ✓': 'In cart ✓', 'Убрать': 'Remove',
    'Корзина пуста.': 'Your cart is empty.', 'Добавьте клиент или косметику.': 'Add the client or cosmetics.',
    'Хит': 'Hit', 'Выгода 175 ₽': 'Save 175 ₽',
    // products
    'Активация клиента на ваш ник навсегда: все функции, обновления и поддержка версий 1.21–1.21.11.': 'Lifetime client activation for your nickname: every feature, updates and support for 1.21–1.21.11.',
    'Плащ «Стекло»': 'Glass Cape', 'Прозрачный плащ с бегущим бликом и светящимися краями.': 'A transparent cape with a running highlight and glowing edges.',
    'Плащ «Ночь»': 'Night Cape', 'Чёрная ткань с мерцающими звёздами.': 'Black cloth with twinkling stars.',
    'Плащ «Тема»': 'Theme Cape', 'Переливается цветами вашей темы клиента.': 'Shimmers in the colors of your client theme.',
    'Крылья «Ангел»': 'Angel Wings', 'Белые стеклянные крылья, машут быстрее в прыжке.': 'White glass wings that flap faster when you jump.',
    'Крылья «Демон»': 'Demon Wings', 'Чёрные перья с белой светящейся кромкой.': 'Black feathers with a glowing white edge.',
    'Нимб «Свет»': 'Light Halo', 'Парящее кольцо света с двумя искрами.': 'A floating ring of light with two sparks.',
    'Нимб «Тема»': 'Theme Halo', 'Нимб в цветах вашей темы.': 'A halo in your theme colors.',
    'Питомец «Сфера»': 'Orb Pet', 'Светящийся шар-компаньон с тремя спутниками.': 'A glowing companion orb with three satellites.',
    'Питомец «Куб»': 'Cube Pet', 'Вращающийся стеклянный куб.': 'A spinning glass cube.',
    'Питомец «Кристалл»': 'Crystal Pet', 'Парящий октаэдр-кристалл.': 'A floating octahedron crystal.',
    'Аура «Искры»': 'Sparks Aura', 'Искры поднимаются вокруг игрока.': 'Sparks rise around the player.',
    'Аура «Снег»': 'Snow Aura', 'Снежинки падают вокруг вас.': 'Snowflakes fall around you.',
    'Набор «Всё и сразу»': 'Everything Bundle', 'Клиент + плащ «Стекло» + крылья «Ангел» + нимб + питомец «Сфера» + аура.': 'Client + Glass Cape + Angel Wings + halo + Orb Pet + aura.',
    'Плащ «Аврора»': 'Aurora Cape', 'Переливается зелёным, бирюзовым и фиолетовым, как северное сияние.': 'Shimmers green, teal and violet like the northern lights.',
    'Плащ «Пламя»': 'Flame Cape', 'Огненный градиент с мерцанием и искрами, летящими с края.': 'A fiery flickering gradient with sparks flying off the hem.',
    'Крылья «Неон»': 'Neon Wings', 'Тёмные перья с пульсирующей бирюзово-розовой кромкой.': 'Dark feathers with a pulsing teal-pink edge.',
    'Крылья «Бабочка»': 'Butterfly Wings', 'Стеклянные крылья бабочки с градиентом и светящимися пятнами.': 'Glass butterfly wings with a gradient and glowing spots.',
    'Нимб «Звёздный»': 'Starry Halo', 'Восемь звёздочек кружатся над головой.': 'Eight little stars circle above your head.',
    'Нимб «Двойной»': 'Double Halo', 'Два кольца, белое и в цвет темы, с искрами навстречу друг другу.': 'Two rings, white and theme-colored, with sparks running towards each other.',
    'Питомец «Звезда»': 'Star Pet', 'Золотая звезда со спутниками-искрами.': 'A golden star with spark satellites.',
    'Питомец «Сердце»': 'Heart Pet', 'Розовое сердце, которое бьётся.': 'A pink heart that beats.',
    'Аура «Сердечки»': 'Hearts Aura', 'Сердечки поднимаются вокруг игрока.': 'Hearts rise around the player.',
    'Аура «Пламя»': 'Flame Aura', 'Языки огня и огненное кольцо у ног.': 'Flames and a ring of fire at your feet.',
    'Корона': 'Crown', 'Золотая корона с мерцающими камнями.': 'A golden crown with twinkling gems.',
    'Кошачьи ушки': 'Cat Ears', 'Белые ушки с розовой серединкой, иногда подёргиваются.': 'White ears with pink insides that twitch now and then.',
    'Рога': 'Horns', 'Изогнутые рога с красным свечением на концах.': 'Curved horns with a red glow at the tips.',
    // configs
    'Готовые сборки': 'Ready-made setups', 'сообщества': 'from the community',
    'Скопируйте код, откройте меню клиента → «Конфиги» → «Вставить код». Свой конфиг можно прислать нам — лучшие попадут сюда.': 'Copy a code, open the client menu → “Configs” → “Paste code”. Send us your own config — the best ones end up here.',
    'Скопируйте код конфига на сайте': 'Copy a config code on the site', 'В игре нажмите': 'In game press',
    'Откройте «Конфиги» в меню': 'Open “Configs” in the menu', 'Нажмите «Вставить код» или': 'Click “Paste code” or press',
    'Скопировать код': 'Copy code', 'Скопировано ✓': 'Copied ✓', 'Код скопирован — вставьте его в меню «Конфиги»': 'Code copied — paste it in the “Configs” menu',
    'Не удалось загрузить конфиги.': 'Could not load configs.',
    'Максимум': 'Maximum', 'Минимал': 'Minimal', 'Стекло': 'Glass', 'Красиво': 'Pretty', 'Минимум': 'Minimum', 'Цвет': 'Color', 'Тёмный': 'Dark', 'Плоский': 'Flat',
    'Чистый стеклянный HUD, TargetHUD, круг на цели, искры при ударе и звук попадания.': 'A clean glass HUD, TargetHUD, a circle on the target, hit sparks and a hit sound.',
    'Все визуалы, атмосфера светлячков, призраки на цели и вся купленная косметика.': 'Every visual, firefly atmosphere, ghosts on the target and all your cosmetics.',
    'Только водяной знак и точка-прицел. Для слабых ПК и турниров.': 'Only the watermark and a dot crosshair. For weak PCs and tournaments.',
    'Фиолетово-розовая тема Velik поверх PvP-сборки, призраки вместо круга.': 'The violet-pink Velik theme on top of the PvP setup, ghosts instead of a circle.',
    'Плоские тёмные панели без стекла, минимум элементов.': 'Flat dark panels without glass, minimal elements.',
    // install
    'Две минуты': 'Two minutes', 'до запуска': 'to launch', 'Как установить': 'How to install',
    'Купите клиент': 'Buy the client', 'на свой ник Minecraft — функции включаются только у купивших.': 'for your Minecraft nickname — features work only for buyers.',
    'Установите': 'Install', 'для своей версии 1.21–1.21.11 (TLauncher, Modrinth, Prism — подойдёт любой).': 'for your version 1.21–1.21.11 (TLauncher, Modrinth, Prism — any launcher works).',
    'Положите': 'Put', 'и': 'and', 'под эту же версию в папку': 'for the same version into the folder',
    'Запустите игру под этим ником и нажмите': 'Launch the game with that nickname and press',
    'Скачать VelikVisual': 'Download VelikVisual', 'Требования': 'Requirements',
    '✓ Fabric Loader 0.15+ и Fabric API': '✓ Fabric Loader 0.15+ and Fabric API', '✓ Java 21 (лаунчер ставит сам)': '✓ Java 21 (the launcher installs it)',
    '✓ Совместим с Sodium, Iris, ModMenu': '✓ Compatible with Sodium, Iris, ModMenu',
    // faq
    'Вопросы': 'Questions', 'Это чит? Меня забанят?': 'Is it a cheat? Will I get banned?',
    'Нет. VelikVisual меняет только картинку у вас на экране: ничего не отправляет на сервер, не показывает игроков сквозь стены и не помогает в бою. Правила конкретного сервера всё равно стоит проверить.': 'No. VelikVisual only changes the picture on your screen: it sends nothing to the server, does not show players through walls and does not help in combat. Still, check the rules of your server.',
    'Как оплатить?': 'How do I pay?',
    'Добавьте товары в корзину, укажите ник и нажмите «Оформить заказ» — сайт покажет, как оплатить. Платёж проверяется автоматически.': 'Add items to the cart, enter your nickname and click “Checkout” — the site shows how to pay. Payments are checked automatically.',
    'Как получить косметику после оплаты?': 'How do I get cosmetics after paying?',
    'После подтверждения платежа покупка привязывается к нику, который вы указали при оформлении, и косметика сама включится в игре. Её увидят все игроки с VelikVisual.': 'Once the payment is confirmed, the purchase is tied to the nickname you entered and the cosmetics turn on in the game by themselves. Everyone with VelikVisual sees them.',
    'Можно скачать без покупки?': 'Can I download it without buying?',
    'Скачать файл может любой, но функции включаются только у ников, которые купили клиент. Без покупки VelikVisual ничего не меняет в игре и показывает подсказку, где его купить. После оплаты клиент активируется сам — переустанавливать ничего не нужно.': 'Anyone can download the file, but features only work for nicknames that bought the client. Without a purchase VelikVisual changes nothing in the game and shows where to buy it. After paying, the client activates by itself — no reinstall needed.',
    'Подойдёт ли мне версия?': 'Will it work on my version?',
    'Один файл работает на всех версиях от 1.21 до 1.21.11. Нужны Fabric Loader и Fabric API под вашу версию.': 'One file works on every version from 1.21 to 1.21.11. You need Fabric Loader and Fabric API for your version.',
    'Можно ли поменять цвета?': 'Can I change the colors?',
    'Да: в разделе «Клиент → Theme» есть 10 тем, включая свои цвета, стиль панелей (стекло или плоский), скругление, шрифт и прозрачность.': 'Yes: “Client → Theme” has 10 themes including your own colors, panel style (glass or flat), rounding, font, transparency and the interface language.',
    'Где хранятся конфиги?': 'Where are configs stored?', 'В папке': 'In the folder',
    '. Любой конфиг превращается в короткий код VV1:… — им удобно делиться в чатах.': '. Any config turns into a short VV1:… code that is easy to share in chats.',
    'Как поставить свой плащ или картинку в небо?': 'How do I use my own cape or a picture in the sky?',
    'Положите картинку в папку': 'Put a picture into the folder', '(плащи) или': '(capes) or', '(небо) и выберите стиль «Своя картинка». Обычные картинки и стандартные текстуры плащей 64×32 подходят. Свой плащ сразу видите вы; чтобы его видели все, напишите нам.': '(sky) and choose the “Own picture” style. Regular pictures and standard 64×32 cape textures both work. You see your own cape right away; to let everyone see it, contact us.',
    'Какие шейдеры есть в клиенте?': 'Which shaders does the client have?',
    'Модуль «Мир → Shaders»: пресеты «Яркий», «Кино», «Мечта», «Холод» и «Нуар» — цветокоррекция, мягкое свечение, виньетка и зернистость. Работают на всех версиях и вместе с Sodium.': 'The “World → Shaders” module: Vibrant, Cinematic, Dreamy, Cold and Noir presets — color grading, soft bloom, vignette and film grain. They work on every version and together with Sodium.',
    // footer
    'VelikVisual — неофициальная модификация. Не является продуктом Mojang Studios или Microsoft и не связана с ними. Minecraft — товарный знак Mojang Synergies AB.': 'VelikVisual is an unofficial modification. It is not a product of Mojang Studios or Microsoft and is not affiliated with them. Minecraft is a trademark of Mojang Synergies AB.',
    // cart
    'Закрыть': 'Close', 'Ник в Minecraft': 'Minecraft nickname', 'Например, Wel1xx': 'For example, Wel1xx',
    'Telegram или e-mail для связи': 'Telegram or e-mail', 'Итого': 'Total', 'Оформить заказ': 'Checkout',
    'Оплата картой любого банка через ЮMoney. Покупка выдаётся автоматически, обычно за 5–30 минут.': 'Pay by bank card via YooMoney. The purchase is delivered automatically, usually within 5–30 minutes.',
    'Оплата переводом на карту. Код заказа в комментарии — и мы выдадим покупку.': 'Pay by card transfer. Put the order code in the comment and we deliver the purchase.',
    'Укажите ник Minecraft: 3–16 символов, латиница, цифры и _': 'Enter your Minecraft nickname: 3–16 characters, Latin letters, digits and _',
    'Укажите Telegram или e-mail для связи': 'Enter a Telegram or e-mail',
    // payment windows
    'Шаг 1 из 2': 'Step 1 of 2', 'Шаг 2 из 2': 'Step 2 of 2', 'Оплата заказа': 'Order payment', 'Банк': 'Bank', 'Карта': 'Card',
    'СБП': 'SBP', 'Получатель': 'Recipient', 'Сумма': 'Amount', 'Комментарий': 'Comment', 'Копировать': 'Copy',
    'Переведите сумму по реквизитам и': 'Transfer the amount using the details and', 'обязательно вставьте код заказа в комментарий': 'be sure to put the order code in the comment',
    'к переводу — по нему мы узнаем ваш ник и покупки.': 'of the transfer — that is how we find your nickname and items.',
    'Реквизиты для перевода пришлёт продавец. Сохраните код заказа.': 'The seller will send the payment details. Keep your order code.',
    'Я оплатил': 'I have paid', 'Отмена': 'Cancel', 'Спасибо!': 'Thank you!', 'Отправить чек в Telegram': 'Send the receipt via Telegram',
    'Отправьте продавцу в Telegram скриншот чека и текст заказа — он уже скопирован, просто вставьте его в чат.': 'Send the seller a screenshot of the receipt and the order text in Telegram — it is already copied, just paste it into the chat.',
    'Мы найдём перевод по коду в комментарии и выдадим покупку. Если что-то будет не так, напишем вам:': 'We will find the transfer by the code in its comment and deliver your purchase. If something is wrong we will contact you:',
    'Скопировать заказ': 'Copy order', 'Готово': 'Done',
    'Проверка перевода обычно занимает до 24 часов. После подтверждения косметика сама появится в игре на нике': 'Checking a transfer usually takes up to 24 hours. After confirmation the cosmetics appear in the game for the nickname',
    'Заказ скопирован': 'Order copied', 'Спасибо! Ждите подтверждения.': 'Thank you! Please wait for confirmation.',
    'Текст заказа скопирован': 'Order text copied', 'Скопировано': 'Copied',
    'Оплата принята': 'Payment received', 'Выдаём покупку': 'Delivering your purchase',
    'Спасибо! Робот проверяет платежи каждые несколько минут и сам привяжет покупку к нику': 'Thank you! Our robot checks payments every few minutes and ties the purchase by itself to the nickname',
    '. Обычно это занимает 5–30 минут. Страницу можно закрыть.': '. It usually takes 5–30 minutes. You can close this page.',
    'Ждём подтверждения платежа…': 'Waiting for payment confirmation…', 'Скачать клиент': 'Download the client',
    'Готово! Зайдите в игру — покупка появится в течение 5 минут.': 'Done! Join the game — the purchase appears within 5 minutes.',
    'Готово! Зайдите в игру — покупка появится в течение 5 минут. Клиент активирован на ваш ник — скачайте его, если ещё не скачали.': 'Done! Join the game — the purchase appears within 5 minutes. The client is activated for your nickname — download it if you have not yet.',
    // marquee
    'Шейдеры': 'Shaders', 'Своё небо': 'Custom sky', 'Свои плащи': 'Custom capes',
  };

  const P = [
    [/^(.+) — в корзине$/, (m) => `${tr(m[1])} — added to cart`],
    [/^от (.+)$/, (m) => `by ${m[1]}`],
    [/^Заказ (.+)$/, (m) => `Order ${m[1]}`],
    [/^Ник: (.+)$/, (m) => `Nick: ${m[1]}`],
    [/^Связь: (.+)$/, (m) => `Contact: ${m[1]}`],
    [/^Товары: (.+)$/, (m) => `Items: ${m[1].split(', ').map(tr).join(', ')}`],
    [/^Сумма: (.+)$/, (m) => `Total: ${m[1]}`],
    [/^ За файлом клиента напишите продавцу (?:в )?и укажите код (.+)\.$/, (m) => ` For the client file contact the seller and give the code ${m[1]}.`],
    [/^Платёж получен, но сумма меньше стоимости заказа\. Напишите продавцу( в)?(?: и укажите код (.+)\.)?$/,
      (m) => `The payment arrived but it is less than the order total. Contact the seller${m[1] ? ' via' : ''}${m[2] ? ` and give the code ${m[2]}.` : ''}`],
    [/^и укажите код (.+)\.$/, (m) => `and give the code ${m[1]}.`],
  ];

  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  function tr(s) {
    const k = norm(s);
    if (!/[А-Яа-яЁё]/.test(k)) return s;
    if (D[k] !== undefined) return D[k];
    for (const [re, f] of P) {
      const m = re.exec(k);
      if (m) return f(m);
    }
    if (k.includes('\n')) return s.split('\n').map(tr).join('\n');
    return s;
  }
  window.vvT = (s) => (lang === 'en' ? tr(s) : s);

  if (lang !== 'en') return;
  // hide the Russian page until it is translated (with a safety timeout)
  const root = document.documentElement;
  root.lang = 'en';
  root.style.visibility = 'hidden';
  const show = () => { root.style.visibility = ''; };
  setTimeout(show, 1500);

  const ATTRS = ['alt', 'aria-label', 'placeholder', 'title'];
  function textNode(n) {
    const v = n.nodeValue;
    if (!/[А-Яа-яЁё]/.test(v)) return;
    const p = n.parentNode;
    if (p && p.nodeName === 'PRE') {
      n.nodeValue = v.split('\n').map((l) => tr(l)).join('\n');
      return;
    }
    const t = tr(v);
    if (t !== v) {
      const lead = v.match(/^\s*/)[0], trail = v.match(/\s*$/)[0];
      n.nodeValue = lead + norm(t) + trail;
    }
  }
  function element(el) {
    for (const a of ATTRS) {
      const v = el.getAttribute && el.getAttribute(a);
      if (v && /[А-Яа-яЁё]/.test(v)) el.setAttribute(a, tr(v));
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return textNode(root);
    if (root.nodeType !== 1) return;
    if (root.nodeName === 'SCRIPT' || root.nodeName === 'STYLE' || root.nodeName === 'CODE') return;
    element(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.nodeType === 1 && (n.nodeName === 'SCRIPT' || n.nodeName === 'STYLE' || n.nodeName === 'CODE') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    let n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) textNode(n);
      else element(n);
    }
  }
  window.vvI18n = walk;

  function start() {
    document.title = tr(document.title);
    for (const m of document.querySelectorAll('meta[name="description"], meta[property^="og:"]')) {
      const c = m.getAttribute('content');
      if (c) m.setAttribute('content', tr(c));
    }
    walk(document.body);
    new MutationObserver((list) => {
      for (const r of list) {
        if (r.type === 'characterData') textNode(r.target);
        else if (r.type === 'attributes') element(r.target);
        else r.addedNodes.forEach(walk);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    show();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
