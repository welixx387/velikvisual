/*
 * Товары магазина. Здесь меняются цены, названия и описания.
 *
 * Важно:
 *  - "n" — постоянный номер товара (0–40). Он зашифрован в коде заказа, по нему робот понимает,
 *    что купили. Никогда не меняйте "n" у существующих товаров, новым давайте следующий свободный.
 *  - Файл читает и сайт, и робот оплаты, поэтому пишите как сейчас: кавычки "", без комментариев внутри [ ].
 *  - grant — что записать игроку в api/cosmetics.json после оплаты.
 */
window.VV_PRODUCTS = [
  {"n":0,"id":"client","cat":"client","name":"VelikVisual Client","desc":"Активация клиента на ваш ник навсегда: все функции, обновления и поддержка версий 1.21–1.21.11.","price":299,"badge":"Хит","pv":"client","grant":{"client":"lifetime"}},
  {"n":1,"id":"cape-glass","cat":"cape","name":"Плащ «Стекло»","desc":"Прозрачный плащ с бегущим бликом и светящимися краями.","price":149,"pv":"cape glass","grant":{"cape":"glass"}},
  {"n":2,"id":"cape-night","cat":"cape","name":"Плащ «Ночь»","desc":"Чёрная ткань с мерцающими звёздами.","price":149,"pv":"cape night","grant":{"cape":"night"}},
  {"n":3,"id":"cape-theme","cat":"cape","name":"Плащ «Тема»","desc":"Переливается цветами вашей темы клиента.","price":199,"pv":"cape theme","grant":{"cape":"theme"}},
  {"n":4,"id":"wings-angel","cat":"wings","name":"Крылья «Ангел»","desc":"Белые стеклянные крылья, машут быстрее в прыжке.","price":249,"badge":"New","pv":"wings angel","grant":{"wings":"angel"}},
  {"n":5,"id":"wings-demon","cat":"wings","name":"Крылья «Демон»","desc":"Чёрные перья с белой светящейся кромкой.","price":249,"pv":"wings demon","grant":{"wings":"demon"}},
  {"n":6,"id":"halo-light","cat":"halo","name":"Нимб «Свет»","desc":"Парящее кольцо света с двумя искрами.","price":99,"pv":"halo","grant":{"halo":"light"}},
  {"n":7,"id":"halo-theme","cat":"halo","name":"Нимб «Тема»","desc":"Нимб в цветах вашей темы.","price":129,"pv":"halo theme","grant":{"halo":"theme"}},
  {"n":8,"id":"pet-orb","cat":"pet","name":"Питомец «Сфера»","desc":"Светящийся шар-компаньон с тремя спутниками.","price":149,"pv":"orb","grant":{"pet":"orb"}},
  {"n":9,"id":"pet-cube","cat":"pet","name":"Питомец «Куб»","desc":"Вращающийся стеклянный куб.","price":179,"pv":"cube","grant":{"pet":"cube"}},
  {"n":10,"id":"pet-crystal","cat":"pet","name":"Питомец «Кристалл»","desc":"Парящий октаэдр-кристалл.","price":199,"pv":"crystal","grant":{"pet":"crystal"}},
  {"n":11,"id":"aura-sparks","cat":"aura","name":"Аура «Искры»","desc":"Искры поднимаются вокруг игрока.","price":129,"pv":"aura","grant":{"aura":"sparks"}},
  {"n":12,"id":"aura-snow","cat":"aura","name":"Аура «Снег»","desc":"Снежинки падают вокруг вас.","price":129,"pv":"aura snow","grant":{"aura":"snow"}},
  {"n":13,"id":"bundle","cat":"bundle","name":"Набор «Всё и сразу»","desc":"Клиент + плащ «Стекло» + крылья «Ангел» + нимб + питомец «Сфера» + аура.","price":899,"badge":"Выгода 175 ₽","pv":"bundle","grant":{"client":"lifetime","cape":"glass","wings":"angel","halo":"light","pet":"orb","aura":"sparks"}},
  {"n":14,"id":"cape-aurora","cat":"cape","name":"Плащ «Аврора»","desc":"Переливается зелёным, бирюзовым и фиолетовым, как северное сияние.","price":199,"badge":"New","pv":"cape aurora","grant":{"cape":"aurora"}},
  {"n":15,"id":"cape-flame","cat":"cape","name":"Плащ «Пламя»","desc":"Огненный градиент с мерцанием и искрами, летящими с края.","price":199,"pv":"cape flame","grant":{"cape":"flame"}},
  {"n":16,"id":"wings-neon","cat":"wings","name":"Крылья «Неон»","desc":"Тёмные перья с пульсирующей бирюзово-розовой кромкой.","price":279,"badge":"New","pv":"wings neon","grant":{"wings":"neon"}},
  {"n":17,"id":"wings-butterfly","cat":"wings","name":"Крылья «Бабочка»","desc":"Стеклянные крылья бабочки с градиентом и светящимися пятнами.","price":279,"pv":"wings butterfly","grant":{"wings":"butterfly"}},
  {"n":18,"id":"halo-stars","cat":"halo","name":"Нимб «Звёздный»","desc":"Восемь звёздочек кружатся над головой.","price":149,"pv":"halo stars","grant":{"halo":"stars"}},
  {"n":19,"id":"halo-double","cat":"halo","name":"Нимб «Двойной»","desc":"Два кольца, белое и в цвет темы, с искрами навстречу друг другу.","price":129,"pv":"halo double","grant":{"halo":"double"}},
  {"n":20,"id":"pet-star","cat":"pet","name":"Питомец «Звезда»","desc":"Золотая звезда со спутниками-искрами.","price":179,"pv":"star","grant":{"pet":"star"}},
  {"n":21,"id":"pet-heart","cat":"pet","name":"Питомец «Сердце»","desc":"Розовое сердце, которое бьётся.","price":179,"pv":"heart","grant":{"pet":"heart"}},
  {"n":22,"id":"aura-hearts","cat":"aura","name":"Аура «Сердечки»","desc":"Сердечки поднимаются вокруг игрока.","price":149,"pv":"aura hearts","grant":{"aura":"hearts"}},
  {"n":23,"id":"aura-flame","cat":"aura","name":"Аура «Пламя»","desc":"Языки огня и огненное кольцо у ног.","price":149,"pv":"aura flame","grant":{"aura":"flame"}},
  {"n":24,"id":"hat-crown","cat":"hat","name":"Корона","desc":"Золотая корона с мерцающими камнями.","price":199,"badge":"New","pv":"hat crown","grant":{"hat":"crown"}},
  {"n":25,"id":"hat-ears","cat":"hat","name":"Кошачьи ушки","desc":"Белые ушки с розовой серединкой, иногда подёргиваются.","price":149,"pv":"hat ears","grant":{"hat":"ears"}},
  {"n":26,"id":"hat-horns","cat":"hat","name":"Рога","desc":"Изогнутые рога с красным свечением на концах.","price":179,"pv":"hat horns","grant":{"hat":"horns"}}
];

/*
 * Код заказа: vv1.<ник>.<товары>.<случайные символы>
 * <товары> — битовая маска номеров "n" в base36. По коду робот и admin.html понимают, кто что купил.
 */
window.VV_ORDER = {
  encode(nick, ids) {
    let mask = 0;
    for (const id of ids) {
      const p = window.VV_PRODUCTS.find((x) => x.id === id);
      if (p) mask += 2 ** p.n;
    }
    const rnd = Math.random().toString(36).slice(2, 6).padEnd(4, '0');
    return `vv1.${nick}.${mask.toString(36)}.${rnd}`;
  },
  decode(code) {
    const m = /^vv1\.([A-Za-z0-9_]{3,16})\.([0-9a-z]+)\.([0-9a-z]{2,8})$/.exec(String(code || '').trim());
    if (!m) return null;
    const mask = parseInt(m[2], 36);
    const items = window.VV_PRODUCTS.filter((p) => Math.floor(mask / 2 ** p.n) % 2 === 1);
    const known = items.reduce((s, p) => s + 2 ** p.n, 0);
    if (!items.length || known !== mask) return null;
    return { code: m[0], nick: m[1], items, sum: items.reduce((s, p) => s + p.price, 0) };
  },
};
