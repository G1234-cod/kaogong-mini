# 配置加载：读取同目录 .env（无第三方依赖的极简实现），环境变量优先
import os
from pathlib import Path


def _load_env(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        k, _, v = line.partition('=')
        os.environ.setdefault(k.strip(), v.strip())


_load_env(Path(__file__).resolve().parent / '.env')

WX_APPID = os.environ.get('WX_APPID', '')
WX_APPSECRET = os.environ.get('WX_APPSECRET', '')
GLM_API_KEY = os.environ.get('GLM_API_KEY', '')
GLM_MODEL = os.environ.get('GLM_MODEL', 'glm-4-flash')
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-change-me')
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///kaogong.db')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', '')
USER_WHITELIST = {x.strip() for x in os.environ.get('USER_WHITELIST', '').split(',') if x.strip()}
