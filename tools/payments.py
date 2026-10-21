"""Робот оплаты VelikVisual.

Запускается GitHub Actions (.github/workflows/payments.yml) каждые 5 минут:
читает входящие платежи ЮMoney, находит в метке код заказа vv1.<ник>.<товары>.<rnd>,
проверяет сумму и записывает покупку в api/cosmetics.json. Итог по каждому заказу
пишется в api/orders.json — его читает страница оплаты на сайте.

Нужен секрет репозитория YOOMONEY_TOKEN (scope operation-history), его ставит
tools/connect_yoomoney.py. Без секрета робот ничего не делает.
"""
import datetime
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS_JS = os.path.join(ROOT, 'assets', 'js', 'products.js')
COSMETICS = os.path.join(ROOT, 'api', 'cosmetics.json')
ORDERS = os.path.join(ROOT, 'api', 'orders.json')
HEARTBEAT = os.path.join(ROOT, 'api', 'heartbeat.txt')

# ЮMoney берёт комиссию с получателя при оплате картой (~3%), поэтому зачисляется чуть меньше цены.
MIN_SHARE = 0.94
CODE_RE = re.compile(r'^vv1\.([A-Za-z0-9_]{3,16})\.([0-9a-z]+)\.([0-9a-z]{2,8})$')
LOOKBACK_DAYS = 30
KEEP_OPS = 5000


def load_products(path=PRODUCTS_JS):
    s = open(path, encoding='utf-8').read()
    body = s[s.index('window.VV_PRODUCTS'):]
    body = body[body.index('['):body.index('];') + 1]
    body = re.sub(r',\s*([\]}])', r'\1', body)
    return {p['n']: p for p in json.loads(body)}


def decode(code, products):
    m = CODE_RE.match(code or '')
    if not m:
        return None
    mask = int(m.group(2), 36)
    items = [p for n, p in sorted(products.items()) if mask >> n & 1]
    if not items or sum(1 << p['n'] for p in items) != mask:
        return None
    return {'nick': m.group(1), 'items': items, 'sum': sum(p['price'] for p in items)}


def process(operations, products, cosmetics, orders, now):
    """Применяет новые платежи. Возвращает список строк-итогов (пустой, если ничего не изменилось)."""
    seen = set(orders.setdefault('ops', []))
    book = orders.setdefault('orders', {})
    players = cosmetics.setdefault('players', {})
    done = []
    for op in sorted(operations, key=lambda o: o.get('datetime', '')):
        op_id = str(op.get('operation_id', ''))
        if not op_id or op_id in seen:
            continue
        if op.get('direction') != 'in' or op.get('status') != 'success':
            continue
        code = (op.get('label') or '').strip()
        order = decode(code, products)
        if not order:
            continue
        seen.add(op_id)
        orders['ops'].append(op_id)
        amount = float(op.get('amount') or 0)
        entry = {'nick': order['nick'], 'items': [p['id'] for p in order['items']], 'at': now}
        if code in book and book[code].get('status') == 'granted':
            continue
        if amount + 0.01 < order['sum'] * MIN_SHARE:
            entry['status'] = 'underpaid'
            book[code] = entry
            done.append(f"{code}: underpaid")
            continue
        key = order['nick'].lower()
        player = dict(players.get(key) or {})
        for p in order['items']:
            player.update(p.get('grant') or {})
        players[key] = player
        entry['status'] = 'granted'
        book[code] = entry
        done.append(f"{order['nick']} +{','.join(entry['items'])}")
    orders['ops'] = orders['ops'][-KEEP_OPS:]
    return done


def api(method, token, params):
    req = urllib.request.Request(
        f'https://yoomoney.ru/api/{method}',
        data=urllib.parse.urlencode(params).encode(),
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/x-www-form-urlencoded'},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode('utf-8'))


def fetch_operations(token, since):
    ops, start = [], None
    for _ in range(10):
        params = {'type': 'deposition', 'records': 100, 'details': 'false', 'from': since}
        if start:
            params['start_record'] = start
        res = api('operation-history', token, params)
        if res.get('error'):
            raise RuntimeError(f"ЮMoney: {res['error']}")
        ops += res.get('operations', [])
        start = res.get('next_record')
        if not start:
            break
    return ops


def read_json(path, default):
    try:
        return json.load(open(path, encoding='utf-8'))
    except FileNotFoundError:
        return default


def write_json(path, data):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')


def output(name, value):
    path = os.environ.get('GITHUB_OUTPUT')
    if path:
        with open(path, 'a', encoding='utf-8') as f:
            f.write(f'{name}={value}\n')


def heartbeat_due(now):
    # GitHub отключает расписание в публичном репозитории после 60 дней без коммитов.
    try:
        last = int(subprocess.check_output(['git', 'log', '-1', '--format=%ct'], cwd=ROOT).decode().strip())
    except Exception:
        return False
    return now.timestamp() - last > 45 * 86400


def main():
    now = datetime.datetime.now(datetime.timezone.utc)
    token = os.environ.get('YOOMONEY_TOKEN', '').strip()
    if not token:
        print('YOOMONEY_TOKEN не задан — автооплата не подключена, пропускаю.')
        output('changed', 'false')
        return 0
    since = (now - datetime.timedelta(days=LOOKBACK_DAYS)).strftime('%Y-%m-%dT%H:%M:%S.000+00:00')
    ops = fetch_operations(token, since)
    products = load_products()
    cosmetics = read_json(COSMETICS, {'version': 1, 'admins': [], 'players': {}})
    orders = read_json(ORDERS, {'version': 1, 'orders': {}, 'ops': []})
    done = process(ops, products, cosmetics, orders, now.strftime('%Y-%m-%dT%H:%M:%SZ'))
    print(f'Входящих платежей за {LOOKBACK_DAYS} дней: {len(ops)}, новых заказов: {len(done)}')
    for line in done:
        print(' ', line)
    if done:
        write_json(COSMETICS, cosmetics)
        write_json(ORDERS, orders)
        output('changed', 'true')
        output('summary', '; '.join(done)[:200])
    elif heartbeat_due(now):
        with open(HEARTBEAT, 'w', encoding='utf-8', newline='\n') as f:
            f.write(now.isoformat() + '\n')
        output('changed', 'true')
        output('summary', 'heartbeat')
    else:
        output('changed', 'false')
    return 0


if __name__ == '__main__':
    sys.exit(main())
