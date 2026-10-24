"""Выдача покупки вручную: запускается формой «Выдать покупку» (.github/workflows/grant.yml).

Можно указать код заказа vv1.… (из комментария к переводу) — тогда ник и товары берутся из него,
или ник и нужную косметику в полях формы. «убрать» снимает косметику, «не менять» оставляет как есть.
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import payments  # noqa: E402

KEEP, REMOVE = 'не менять', 'убрать'
SLOTS = ['cape', 'wings', 'halo', 'hat', 'pet', 'aura']


def env(name):
    return (os.environ.get(name) or '').strip()


def main():
    cosmetics = payments.read_json(payments.COSMETICS, {'version': 1, 'admins': [], 'players': {}})
    players = cosmetics.setdefault('players', {})
    order = env('ORDER')
    grant, nick = {}, env('NICK')
    if order:
        found = re.search(r'vv1\.[A-Za-z0-9_]{3,16}\.[0-9a-z]+\.[0-9a-z]{2,8}', order)
        decoded = payments.decode(found.group(0), payments.load_products()) if found else None
        if not decoded:
            print(f'Не понял код заказа: {order}')
            return 1
        nick = decoded['nick']
        for p in decoded['items']:
            grant.update(p.get('grant') or {})
    if not re.fullmatch(r'[A-Za-z0-9_]{3,16}', nick):
        print('Укажите ник (3–16 символов: латиница, цифры, _) или код заказа.')
        return 1
    key = nick.lower()
    player = dict(players.get(key) or {})
    player.update(grant)
    if env('CLIENT') == 'true':
        player['client'] = 'lifetime'
    for slot in SLOTS:
        v = env(slot.upper())
        if not v or v == KEEP:
            continue
        if v == REMOVE:
            player.pop(slot, None)
        else:
            player[slot] = v
    if player:
        players[key] = player
    else:
        players.pop(key, None)
    payments.write_json(payments.COSMETICS, cosmetics)
    text = ', '.join(f'{k}: {v}' for k, v in player.items()) or 'ничего'
    print(f'{nick} → {text}')
    summary = os.environ.get('GITHUB_STEP_SUMMARY')
    if summary:
        with open(summary, 'a', encoding='utf-8') as f:
            f.write(f'### Выдано: {nick}\n\n{text}\n\nКосметика появится в игре в течение 5 минут.\n')
    payments.output('summary', f'{nick}: {text}'[:200])
    return 0


if __name__ == '__main__':
    sys.exit(main())
