# velikvisual.online

Сайт VelikVisual: лендинг, магазин клиента и косметики, галерея конфигов.
Хостинг — GitHub Pages (репозиторий `welixx387/velikvisual`), домен `velikvisual.online` (DNS в Timeweb).

## Что где лежит

| Файл | Зачем |
|---|---|
| `assets/js/config.js` | **Настройки магазина**: кошелёк ЮMoney, Telegram, Discord |
| `assets/js/shop.js` | Список товаров и цены (`PRODUCTS`) |
| `api/cosmetics.json` | **Кто что купил** — это читает мод в игре |
| `configs/configs.json` | Конфиги в галерее на сайте |
| `CNAME` | Домен для GitHub Pages |

Любой файл можно поправить прямо на github.com: открыть файл → значок карандаша → «Commit changes». Через минуту сайт обновится.

## 1. Включить оплату

В `assets/js/config.js`:

```js
yoomoneyWallet: "4100118012345678", // номер вашего кошелька ЮMoney
telegram: "https://t.me/ваш_ник",
```

С кошельком кнопка «Оформить заказ» ведёт на оплату картой через ЮMoney. В истории платежа вы увидите метку вида `VV-ABC123|Ник|wings-angel,cape-glass`: это номер заказа, ник и товары.

Без кошелька заказ оформляется как заявка: покупатель копирует текст заказа и пишет вам в Telegram.

## 2. Выдать косметику после оплаты

Откройте `api/cosmetics.json` и добавьте ник покупателя:

```json
{
  "version": 1,
  "admins": ["Wel1xx"],
  "players": {
    "steve123": { "cape": "glass", "wings": "angel" },
    "alex_pro": { "halo": "light", "pet": "cube", "aura": "snow" }
  }
}
```

Ник пишется **маленькими буквами**. Мод проверяет файл раз в 5 минут, и косметика сама появляется у игрока. Её видят все, у кого стоит VelikVisual.

| Косметика | Ключ | Стили |
|---|---|---|
| Плащ | `cape` | `glass`, `night`, `theme` |
| Крылья | `wings` | `angel`, `demon`, `theme` |
| Нимб | `halo` | `light`, `theme` |
| Питомец | `pet` | `orb`, `cube`, `crystal` |
| Аура | `aura` | `sparks`, `snow`, `theme` |

Ники из `admins` получают всю косметику бесплатно.

## 3. Добавить конфиг в галерею

1. В игре: меню → «Конфиги» → у нужного конфига кнопка «Код».
2. Добавьте запись в `configs/configs.json`:

```json
{ "name": "Мой конфиг", "author": "Ник", "tags": ["PvP"], "desc": "Короткое описание", "code": "VV1:..." }
```
