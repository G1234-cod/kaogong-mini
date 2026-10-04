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
# 本地开发兜底：项目根 .env（setdefault 语义，同目录 .env 优先，线上部署不受影响）
_load_env(Path(__file__).resolve().parent.parent / '.env')

# 兼容根 .env 中的 APPID 写法（setdefault 语义下同目录 .env 的 WX_APPID 优先）
WX_APPID = os.environ.get('WX_APPID', '') or os.environ.get('APPID', '')
WX_APPSECRET = os.environ.get('WX_APPSECRET', '')
GLM_API_KEY = os.environ.get('GLM_API_KEY', '')
GLM_MODEL = os.environ.get('GLM_MODEL', 'glm-4-flash')
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-change-me')
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///kaogong.db')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', '')
# 腾讯位置服务 Key（.env 中写作中文键名「腾讯_API_KEY」，此处兼容英文别名与中文键名两种写法）
TENCENT_KEY = os.environ.get('TENCENT_KEY', '') or os.environ.get('腾讯_API_KEY', '')
# 一次性订阅消息模板 id（微信后台「订阅消息-公共模板库」选用后填入；前端 src/services/api/proxy.ts 需同步填写）
TMPL_TODO = os.environ.get('TMPL_TODO', '')  # 「待办提醒」类模板 → 周期待办到期提醒
TMPL_REVIEW = os.environ.get('TMPL_REVIEW', '')  # 「学习复习提醒」类模板 → 今日闪卡复习提醒
# ==== 开发期临时：演示账号（/auth/dev-login 账号密码登录，开发调试用） ====
# 上线前把字典清空 {} 即整体禁用（路由返回 403），或连同 main.py /auth/dev-login 一并删除
DEV_ACCOUNTS = {'demo': 'kaogong2026'}
