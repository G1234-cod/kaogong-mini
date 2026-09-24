# 外部上游调用：微信 code2Session + 天气/地理编码/一言/智能问答
# 所有第三方 Key 只存在于服务端环境变量，绝不下发客户端
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


async def reverse_geocode(lat: float, lon: float) -> dict:
    """坐标反查地名（BigDataCloud，免 Key）"""
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        r = await client.get(
            'https://api.bigdatacloud.net/data/reverse-geocode-client',
            params={'latitude': lat, 'longitude': lon, 'localityLanguage': 'zh'},
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
    """智能问答（GLM 系列，Key 服务端持有）"""
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
