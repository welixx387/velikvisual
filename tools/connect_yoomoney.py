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
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(url, data=urllib.parse.urlencode(params).encode(), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', 'replace')
        try:
            return json.loads(body)
        except ValueError:
            return {'error': f'HTTP {e.code}: {body[:200]}'}


def run(cmd, **kw):
    return subprocess.run(cmd, cwd=ROOT, check=True, **kw)


def main():
    try:
        run(['gh', 'auth', 'status'], capture_output=True)
    except (OSError, subprocess.CalledProcessError):
        print('Нужен GitHub CLI (gh), вошедший в аккаунт welixx387: https://cli.github.com, затем `gh auth login`.')
        return 1

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

    info = post('https://yoomoney.ru/api/account-info', {}, token)
    wallet = str(info.get('account', ''))
    if not re.fullmatch(r'\d{11,20}', wallet):
        print(f'Не удалось узнать номер кошелька: {info}')
        return 1
    print(f'\nКошелёк: {wallet}')

    run(['gh', 'secret', 'set', 'YOOMONEY_TOKEN', '--repo', REPO], input=token.encode())
    print('Доступ сохранён в секрет репозитория YOOMONEY_TOKEN.')

    s = open(CONFIG, encoding='utf-8').read()
    s2 = re.sub(r'yoomoneyWallet:\s*"[^"]*"', f'yoomoneyWallet: "{wallet}"', s, count=1)
    if s2 != s:
        with open(CONFIG, 'w', encoding='utf-8', newline='\n') as f:
            f.write(s2)
        git = ['git', '-c', 'user.name=welixx387', '-c', 'user.email=welixx387@users.noreply.github.com']
        run(['git', 'pull', '--rebase', '-q'])
        run(git + ['commit', '-q', '-m', 'Enable ЮMoney auto payments', '--', 'assets/js/config.js'])
        run(['git', 'push', '-q'])
        print('Номер кошелька вписан в config.js, сайт обновится через 1–2 минуты.')

    run(['gh', 'workflow', 'run', 'payments.yml', '--repo', REPO])
    print('\nГотово! Автооплата подключена: робот проверяет платежи каждые 5 минут и сам выдаёт покупки.')
    print('Деньги приходят на кошелёк ЮMoney — вывести их можно на любую карту в приложении ЮMoney.')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        sys.exit(1)
