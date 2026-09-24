# 会话令牌：HMAC 签名的 openid.exp（无状态、无需额外依赖）
import base64
import hashlib
import hmac
import time

import config

TTL_MS = 180 * 24 * 3600 * 1000  # 180 天（与小程序端缓存登录态对齐）


def _b64(s: str) -> str:
    return base64.urlsafe_b64encode(s.encode()).decode().rstrip('=')


def _sig(payload: str) -> str:
    return _b64(hmac.new(config.SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest())


def make_token(openid: str) -> str:
    payload = _b64(f'{openid}.{int(time.time() * 1000) + TTL_MS}')
    return f'{payload}.{_sig(payload)}'


def parse_token(token: str) -> str | None:
    try:
        payload, sig = token.rsplit('.', 1)
        if not hmac.compare_digest(sig, _sig(payload)):
            return None
        openid_s, exp_s = base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4)).decode().split('.')
        if int(exp_s) < time.time() * 1000:
            return None
        return openid_s
    except Exception:
        return None
