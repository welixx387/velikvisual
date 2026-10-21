"""Подключение автооплаты ЮMoney к сайту VelikVisual (запускается один раз).

Что делает:
  1. Помогает получить доступ к истории платежей вашего кошелька ЮMoney (только чтение).
  2. Сохраняет доступ в секрет репозитория YOOMONEY_TOKEN (через GitHub CLI `gh`).
  3. Вписывает номер кошелька в assets/js/config.js и публикует сайт.
После этого робот .github/workflows/payments.yml сам проверяет платежи и выдаёт покупки.

Запуск:  python tools/connect_yoomoney.py
"""
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
import webbrowser

REPO = 'welixx387/velikvisual'
SITE = 'https://velikvisual.online'
REDIRECT = f'{SITE}/admin.html'
SCOPE = 'account-info operation-history'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, 'assets', 'js', 'config.js')

for stream in (sys.stdout, sys.stderr):
    try:
        stream.reconfigure(encoding='utf-8')
    except Exception:
        pass


def post(url, params, token=None):
    # Через curl: Python на некоторых компьютерах зависает на запросах к ЮMoney.
    # Настройки передаются через stdin, чтобы токен не попадал в командную строку.
    def q(v):
        return '"' + v.replace('\\', '\\\\').replace('"', '\\"') + '"'
    conf = [f'url = {q(url)}', 'request = "POST"', 'header = "Content-Type: application/x-www-form-urlencoded"',
            f'data = {q(urllib.parse.urlencode(params))}', 'silent', 'max-time = 30', 'retry = 3', 'retry-all-errors']
    if token:
        conf.append(f'header = {q("Authorization: Bearer " + token)}')
    try:
        out = subprocess.run(['curl', '-K', '-'], input='\n'.join(conf).encode('utf-8'), capture_output=True, timeout=150)
    except (OSError, subprocess.TimeoutExpired) as e:
        return {'error': f'curl: {e}'}
    body = out.stdout.decode('utf-8', 'replace')
    try:
        res = json.loads(body)
    except ValueError:
        res = None
    return res if isinstance(res, dict) else {'error': f'нет ответа от ЮMoney (curl {out.returncode}): {body[:200]}'}


def wait_for_code(port=8765, timeout=20 * 60):
    """Принимает код от admin.html (редирект на http://127.0.0.1:8765/cb?code=...)."""
    from http.server import BaseHTTPRequestHandler, HTTPServer
    got = {}

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            if 'code' in q or 'error' in q:
                got['code'] = (q.get('code') or [''])[0]
                got['error'] = (q.get('error_description') or q.get('error') or [''])[0]
            ok = bool(got.get('code'))
            body = ('<!doctype html><meta charset="utf-8"><title>VelikVisual</title>'
                    '<body style="background:#050506;color:#f4f4f6;font:18px system-ui;display:grid;place-items:center;height:100vh;margin:0">'
                    f'<div>{"Готово! Доступ передан, автооплата подключается. Эту вкладку можно закрыть." if ok else "ЮMoney не дал доступ. Попробуйте ещё раз."}</div>')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(body.encode('utf-8'))

        def log_message(self, *a):
            pass

    srv = HTTPServer(('127.0.0.1', port), Handler)
    srv.timeout = 2
    import time
    end = time.time() + timeout
    while 'code' not in got and time.time() < end:
        srv.handle_request()
    srv.server_close()
    return got.get('code', ''), got.get('error', 'время ожидания вышло')


def run(cmd, **kw):
    return subprocess.run(cmd, cwd=ROOT, check=True, **kw)


def main():
    try:
        run(['gh', 'auth', 'status'], capture_output=True)
    except (OSError, subprocess.CalledProcessError):
        print('Нужен GitHub CLI (gh), вошедший в аккаунт welixx387: https://cli.github.com, затем `gh auth login`.')
        return 1

    # Без вопросов: connect_yoomoney.py <client_id> <код со страницы admin.html>
    # или connect_yoomoney.py --listen <client_id>: ждёт код от admin.html#connect=<client_id>
    args = sys.argv[1:]
    listen = bool(args) and args[0] == '--listen'
    if listen:
        args = args[1:]
    client_id = args[0].strip() if args else ''
    code = args[1].strip() if len(args) > 1 else ''
    secret = ''
    if listen and client_id:
        print(f'Жду подтверждения: откройте {REDIRECT}#connect={client_id} и нажмите «Продолжить».', flush=True)
        code, error = wait_for_code()
        if not code:
            print(f'ЮMoney не дал доступ: {error}')
            return 1

    if not client_id:
        print(__doc__.split('Запуск:')[0])
        print('Шаг 1. Зарегистрируйте приложение в ЮMoney (страница сейчас откроется):')
        print('        Название ............ VelikVisual')
        print(f'        Адрес сайта ......... {SITE}')
        print('        Почта ............... ваша почта')
        print(f'        Redirect URI ........ {REDIRECT}')
        print('        Notification URI .... оставьте пустым')
        print('        Галочку «Проверять подлинность приложения (OAuth2 client_secret)» НЕ ставьте.')
        print('     Нажмите «Подтвердить» и скопируйте client_id.\n')
        webbrowser.open('https://yoomoney.ru/myservices/new')
        client_id = input('Вставьте client_id: ').strip()
        if not client_id:
            return 1
        secret = input('client_secret (если ставили галочку; иначе просто Enter): ').strip()

    if not code:
        q = urllib.parse.urlencode({'client_id': client_id, 'response_type': 'code', 'redirect_uri': REDIRECT, 'scope': SCOPE})
        print('\nШаг 2. В браузере нажмите «Разрешить». Откроется страница сайта с кодом — скопируйте его.')
        webbrowser.open(f'https://yoomoney.ru/oauth/authorize?{q}')
        code = input('Вставьте код со страницы: ').strip()
        if not code:
            return 1

    params = {'code': code, 'client_id': client_id, 'grant_type': 'authorization_code', 'redirect_uri': REDIRECT}
    if secret:
        params['client_secret'] = secret
    res = post('https://yoomoney.ru/oauth/token', params)
    token = res.get('access_token')
    if not token:
        print(f'ЮMoney не выдал доступ: {res.get("error", res)}. Код одноразовый — запустите скрипт ещё раз.')
        return 1

    # сначала сохраняем доступ: код одноразовый, второй раз токен не получить
    run(['gh', 'secret', 'set', 'YOOMONEY_TOKEN', '--repo', REPO], input=token.encode())
    print('Доступ сохранён в секрет репозитория YOOMONEY_TOKEN.', flush=True)

    info = post('https://yoomoney.ru/api/account-info', {}, token)
    wallet = str(info.get('account', ''))
    if not re.fullmatch(r'\d{11,20}', wallet):
        print(f'Не удалось узнать номер кошелька: {info}. Впишите его в assets/js/config.js (yoomoneyWallet) вручную.')
        return 2
    print(f'Кошелёк: {wallet}', flush=True)

    git = ['git', '-c', 'user.name=welixx387', '-c', 'user.email=welixx387@users.noreply.github.com']
    run(['git', 'pull', '--rebase', '--autostash', '-q'])
    s = open(CONFIG, encoding='utf-8').read()
    s2 = re.sub(r'yoomoneyWallet:\s*"[^"]*"', f'yoomoneyWallet: "{wallet}"', s, count=1)
    if s2 != s:
        with open(CONFIG, 'w', encoding='utf-8', newline='\n') as f:
            f.write(s2)
        run(git + ['commit', '-q', '-m', 'Enable ЮMoney auto payments', '--', 'assets/js/config.js'])
        run(['git', 'push', '-q'])
        print('Номер кошелька вписан в config.js, сайт обновится через 1–2 минуты.', flush=True)

    run(['gh', 'workflow', 'run', 'payments.yml', '--repo', REPO])
    print('\nГотово! Автооплата подключена: робот проверяет платежи каждые 5 минут и сам выдаёт покупки.')
    print('Деньги приходят на кошелёк ЮMoney — вывести их можно на любую карту в приложении ЮMoney.')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        sys.exit(1)
