# 外部上游调用：微信 code2Session/access_token/订阅消息 + 天气/地理编码/一言/智能问答/POI
# 所有第三方 Key 只存在于服务端环境变量，绝不下发客户端
import json
import re
import time

import httpx

import config

TIMEOUT = httpx.Timeout(8.0)

# WMO 天气代码 → 中文描述（Open-Meteo）
WEATHER_CODE = {
    0: '晴', 1: '晴间多云', 2: '多云', 3: '阴',
    45: '雾', 48: '雾凇',
    51: '小毛毛雨', 53: '毛毛雨', 55: '大毛毛雨',
    56: '冻毛毛雨', 57: '强冻毛毛雨',
    61: '小雨', 63: '中雨', 65: '大雨',
    66: '冻雨', 67: '强冻雨',
    71: '小雪', 73: '中雪', 75: '大雪', 77: '雪粒',
    80: '小阵雨', 81: '阵雨', 82: '强阵雨',
    85: '小阵雪', 86: '大阵雪',
    95: '雷阵雨', 96: '雷阵雨伴冰雹', 99: '强雷阵雨伴冰雹',
}


async def wx_code2session(code: str) -> str | None:
    """code → openid；未配置 AppSecret 时返回 None（dev 模式由上层兜底）"""
    if not config.WX_APPID or not config.WX_APPSECRET:
        return None
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        r = await client.get(
            'https://api.weixin.qq.com/sns/jscode2session',
            params={
                'appid': config.WX_APPID,
                'secret': config.WX_APPSECRET,
                'js_code': code,
                'grant_type': 'authorization_code',
            },
        )
        data = r.json()
        return data.get('openid')


# ---- 微信 access_token 与一次性订阅消息下发 ----
_TOKEN_CACHE: dict = {'token': '', 'expire_at': 0.0}


async def wx_access_token() -> str | None:
    """获取 access_token（内存缓存，过期前 5 分钟复用；未配 AppSecret 返回 None）"""
    if not config.WX_APPID or not config.WX_APPSECRET:
        return None
    now = time.time()
    if _TOKEN_CACHE['token'] and now < _TOKEN_CACHE['expire_at']:
        return _TOKEN_CACHE['token']
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        r = await client.get(
            'https://api.weixin.qq.com/cgi-bin/token',
            params={
                'grant_type': 'client_credential',
                'appid': config.WX_APPID,
                'secret': config.WX_APPSECRET,
            },
        )
        d = r.json()
    token = d.get('access_token')
    if not token:
        print(f'[wx_access_token] 获取失败: {d}', flush=True)
        return None
    _TOKEN_CACHE['token'] = token
    _TOKEN_CACHE['expire_at'] = now + float(d.get('expires_in', 7200)) - 300  # 提前 5 分钟刷新
    return token


async def subscribe_send(openid: str, tmpl_id: str, page: str, data: dict) -> bool:
    """一次性订阅消息下发（成功返回 True；额度扣减由调用方在成功后执行）。
    data 为字段值映射（如 {'thing1': '洗衣服', 'time2': '2026-09-25 07:30'}），
    字段 key 以所选公共模板详情为准（新式 thing1/time2 或旧式 keyword1）。
    """
    token = await wx_access_token()
    if not token:
        return False
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        r = await client.post(
            'https://api.weixin.qq.com/cgi-bin/message/subscribe/send',
            params={'access_token': token},
            json={
                'touser': openid,
                'template_id': tmpl_id,
                'page': page,
                'data': {k: {'value': v} for k, v in data.items()},
            },
        )
        d = r.json()
    if d.get('errcode') != 0:
        print(f'[subscribe_send] openid={openid} tmpl={tmpl_id} err={d}', flush=True)
        return False
    return True


async def get_weather(lat: float, lon: float) -> dict | None:
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        r = await client.get(
            'https://api.open-meteo.com/v1/forecast',
            params={
                'latitude': lat,
                'longitude': lon,
                'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code',
                'daily': 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                'timezone': 'auto',
                'forecast_days': 1,
            },
        )
        d = r.json()
    cur, daily = d.get('current') or {}, d.get('daily') or {}
    if not cur:
        return None
    code = cur.get('weather_code', 0)
    return {
        'temp': cur.get('temperature_2m', 0),
        'feels': cur.get('apparent_temperature', 0),
        'humidity': cur.get('relative_humidity_2m', 0),
        'code': code,
        'desc': WEATHER_CODE.get(code, '未知'),
        'tMax': (daily.get('temperature_2m_max') or [0])[0],
        'tMin': (daily.get('temperature_2m_min') or [0])[0],
        'rainProb': (daily.get('precipitation_probability_max') or [0])[0],
        'fetchedAt': __import__('time').time() * 1000,
    }


async def search_cities(q: str) -> list[dict]:
    """城市搜索（Open-Meteo Geocoding，中文）→ GeoCandidate[]"""
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        r = await client.get(
            'https://geocoding-api.open-meteo.com/v1/search',
            params={'name': q, 'language': 'zh', 'count': 8},
        )
        results = r.json().get('results') or []
    out = []
    for it in results:
        admin2 = it.get('admin2') or ''
        out.append({
            'name': it.get('name', ''),
            'province': it.get('admin1', ''),
            'city': admin2 if admin2.endswith('市') else (admin2 + '市' if admin2 else None),
            'lat': it.get('latitude', 0),
            'lon': it.get('longitude', 0),
        })
    return out


# ai_geocode 简单内存缓存（同关键词不重复问 GLM）
_GEO_CACHE: dict[str, list[dict]] = {}

GEO_PROMPT = (
    '你是中国行政区划与地理坐标专家。用户给出一个可能含错别字、口语化或不完整的中国地名'
    '（如"洛阳市龙区"实为"洛龙区"），请判断它实际指哪里，并给出精确经纬度（小数点后至少 4 位）。'
    '只输出一个 JSON 数组（不要输出任何其他文字或代码块标记），最多 3 项，按可能性从高到低排序；'
    '每一项形如 {"name": 标准区县名（保留区/县/市后缀，如"洛龙区"）或城市名（不带"市"字）, '
    '"province": 省名, "city": 地级市名（带"市"字）, "lat": 纬度数字, "lon": 经度数字}。'
    '若完全无法判断，输出 []。'
)


async def ai_geocode(q: str) -> list[dict]:
    """模糊/错别字地名兜底：GLM 解析归属（省/市/区县）+ 精确经纬度 → GeoCandidate[]"""
    key = q.strip()
    if not key or not config.GLM_API_KEY:
        return []
    if key in _GEO_CACHE:
        return _GEO_CACHE[key]
    text = await glm_chat([
        {'role': 'system', 'content': GEO_PROMPT},
        {'role': 'user', 'content': key},
    ])
    out: list[dict] = []
    seen: set[str] = set()
    m = re.search(r'\[.*\]', text, re.S)
    if m:
        try:
            items = json.loads(m.group(0))
        except Exception:
            items = []
        for it in items if isinstance(items, list) else []:
            if not isinstance(it, dict):
                continue
            try:
                lat, lon = float(it['lat']), float(it['lon'])
            except (KeyError, TypeError, ValueError):
                continue
            if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                continue
            name = str(it.get('name') or '').strip()
            if not name or name in seen:
                continue
            seen.add(name)
            city = str(it.get('city') or '').strip() or None
            if city and not city.endswith('市'):
                city += '市'
            out.append({
                'name': name,
                'province': str(it.get('province') or '').strip(),
                'city': city,
                'lat': lat,
                'lon': lon,
            })
    if len(_GEO_CACHE) > 200:  # 防无限增长
        _GEO_CACHE.clear()
    _GEO_CACHE[key] = out
    return out


async def reverse_geocode(lat: float, lon: float) -> dict:
    """坐标反查地名：腾讯地图（简体）优先；BigDataCloud 兜底（zh-Hans 简体）"""
    if config.TENCENT_KEY:
        try:
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                r = await client.get(
                    'https://apis.map.qq.com/ws/geocoder/v1/',
                    params={'location': f'{lat},{lon}', 'key': config.TENCENT_KEY, 'get_poi': 0},
                )
                d = r.json()
            comp = (d.get('result') or {}).get('address_component') or {}
            city = comp.get('city') or ''
            name = comp.get('district') or city or comp.get('province') or ''
            if d.get('status') == 0 and name:
                return {
                    'name': name,
                    'province': comp.get('province', ''),
                    'city': city if not city or city.endswith('市') else city + '市',
                    'lat': lat,
                    'lon': lon,
                }
        except Exception:
            pass  # 腾讯失败回退 BigDataCloud
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        r = await client.get(
            'https://api.bigdatacloud.net/data/reverse-geocode-client',
            params={'latitude': lat, 'longitude': lon, 'localityLanguage': 'zh-Hans'},
        )
        d = r.json()
    city = d.get('city') or d.get('locality') or ''
    return {
        'name': d.get('locality') or city or '未知位置',
        'province': d.get('principalSubdivision', ''),
        'city': city if not city or city.endswith('市') else city + '市',
        'lat': lat,
        'lon': lon,
    }


def _haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """两点直线距离（米），POI 距离兜底用"""
    import math
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


async def poi_around(lat: float, lon: float, keyword: str = '', radius: int = 1000) -> list[dict]:
    """腾讯地图周边搜索（Key 服务端持有）→ POI[]"""
    if not config.TENCENT_KEY:
        return []
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        r = await client.get(
            'https://apis.map.qq.com/ws/place/v1/search',
            params={
                'keyword': keyword or '附近',
                'boundary': f'nearby({lat},{lon},{radius})',
                'key': config.TENCENT_KEY,
                'page_size': 10,
                'orderby': 'distance',
            },
        )
        d = r.json()
    if d.get('status') != 0:
        return []
    out = []
    for it in d.get('data') or []:
        loc = it.get('location') or {}
        plat, plon = loc.get('lat', 0), loc.get('lng', 0)
        dist = it.get('distance')
        if not isinstance(dist, (int, float)):
            # 上游 distance 字段不稳定，用直线距离兜底（Haversine 近似）
            dist = round(_haversine_m(lat, lon, plat, plon))
        out.append({
            'id': it.get('id', ''),
            'name': it.get('title', ''),
            'address': it.get('address', ''),
            'category': it.get('category', ''),
            'lat': plat,
            'lon': plon,
            'tel': it.get('tel', ''),
            'distance': dist,
        })
    return out


async def hitokoto() -> str | None:
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        r = await client.get('https://v1.hitokoto.cn/', params={'encode': 'json', 'min_length': 10})
        d = r.json()
    text = d.get('hitokoto')
    if not text:
        return None
    src = d.get('from') or ''
    return f'{text}——{src}' if src else text


async def glm_chat(messages: list[dict]) -> str:
    """智能问答（GLM 系列，Key 服务端持有）；非流式，供内部（如 ai_geocode）复用"""
    if not config.GLM_API_KEY:
        return '智能问答尚未配置服务端密钥，请联系管理员。'
    async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:
        r = await client.post(
            'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            headers={'Authorization': f'Bearer {config.GLM_API_KEY}'},
            json={'model': config.GLM_MODEL, 'messages': messages},
        )
        d = r.json()
    try:
        return d['choices'][0]['message']['content']
    except Exception:
        return '暂时没想好怎么回答，稍后再试吧。'


async def glm_chat_stream(messages: list[dict]):
    """智能问答流式版：转发智谱 SSE，逐段 yield 文本增量（供 StreamingResponse 直出）"""
    if not config.GLM_API_KEY:
        yield '智能问答尚未配置服务端密钥，请联系管理员。'
        return
    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, read=60.0)) as client:
            async with client.stream(
                'POST',
                'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                headers={'Authorization': f'Bearer {config.GLM_API_KEY}'},
                json={'model': config.GLM_MODEL, 'messages': messages, 'stream': True},
            ) as resp:
                async for line in resp.aiter_lines():
                    # SSE 事件行：data: {...} / data: [DONE]
                    if not line.startswith('data:'):
                        continue
                    payload = line[5:].strip()
                    if not payload or payload == '[DONE]':
                        continue
                    try:
                        d = json.loads(payload)
                    except Exception:
                        continue
                    delta = ((d.get('choices') or [{}])[0].get('delta') or {}).get('content')
                    if delta:
                        yield delta
    except Exception:
        yield '暂时没想好怎么回答，稍后再试吧。'
