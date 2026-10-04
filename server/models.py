# 表结构：users（账号档案，含 guest 到访）/ user_data（18 域按 key 存 JSON）/ tasks（任务定义）/ visits（日活统计）/ grants（直接发券）/ subscriptions（一次性订阅额度）
# 旧 rewards 表（奖池定义）已由 tasks 表替代，保留不读
import time

from sqlalchemy import BigInteger, Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from db import Base


def now_ms() -> int:
    return int(time.time() * 1000)


class User(Base):
    __tablename__ = 'users'

    openid: Mapped[str] = mapped_column(String(64), primary_key=True)
    role: Mapped[str] = mapped_column(String(8), default='user')  # user | guest
    nickname: Mapped[str] = mapped_column(String(64), default='')  # B 端备注昵称（与用户自填 settings.nickname 互不覆盖）
    created_at: Mapped[int] = mapped_column(BigInteger, default=now_ms)
    last_seen_at: Mapped[int] = mapped_column(BigInteger, default=0)


class UserData(Base):
    __tablename__ = 'user_data'

    openid: Mapped[str] = mapped_column(String(64), primary_key=True)
    key: Mapped[str] = mapped_column(String(32), primary_key=True)  # AppData 域名
    value: Mapped[str] = mapped_column(Text)  # JSON 文本
    ts: Mapped[int] = mapped_column(BigInteger, default=0)


class Task(Base):
    """任务定义（B 端发布；达成判定在 C 端，见 doc/05）"""

    __tablename__ = 'tasks'

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    title: Mapped[str] = mapped_column(String(64), default='')
    emoji: Mapped[str] = mapped_column(String(16), default='🎁')
    description: Mapped[str] = mapped_column(Text, default='')
    cond_type: Mapped[str] = mapped_column(String(16), default='streak')  # streak|total_full|weekend_full|mood3|pomo_day
    cond_param: Mapped[int] = mapped_column(Integer, default=0)
    mode: Mapped[str] = mapped_column(String(8), default='auto')  # auto=达成自动入袋 | code=达成生成兑换码
    hidden: Mapped[bool] = mapped_column(Boolean, default=False)
    scope: Mapped[str] = mapped_column(String(8), default='all')  # all=全员 | users=指定
    target_openids: Mapped[str] = mapped_column(Text, default='[]')  # scope='users' 时的 JSON 数组
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[int] = mapped_column(BigInteger, default=now_ms)


class Visit(Base):
    """每日活跃去重记录（login / snapshot / 写操作成功时落当日行）"""

    __tablename__ = 'visits'

    openid: Mapped[str] = mapped_column(String(64), primary_key=True)
    day: Mapped[str] = mapped_column(String(10), primary_key=True)  # YYYY-MM-DD（服务器本地时区）


class Subscription(Base):
    """一次性订阅额度（用户接受 +1 / 下发成功 -1，可累积；个人主体无长期订阅）"""

    __tablename__ = 'subscriptions'

    openid: Mapped[str] = mapped_column(String(64), primary_key=True)
    tmpl_id: Mapped[str] = mapped_column(String(64), primary_key=True)  # 订阅消息模板 id
    count: Mapped[int] = mapped_column(Integer, default=0)  # 剩余可下发次数


class Reward(Base):
    """旧奖池表（已由 tasks 替代，保留兼容历史数据）"""

    __tablename__ = 'rewards'

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    title: Mapped[str] = mapped_column(String(64), default='')
    emoji: Mapped[str] = mapped_column(String(16), default='🎁')
    description: Mapped[str] = mapped_column(Text, default='')


class Grant(Base):
    __tablename__ = 'grants'

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    openid: Mapped[str] = mapped_column(String(64), index=True)
    title: Mapped[str] = mapped_column(String(64), default='')
    emoji: Mapped[str] = mapped_column(String(16), default='🎁')
    description: Mapped[str] = mapped_column(Text, default='')
    granted_at: Mapped[int] = mapped_column(BigInteger, default=now_ms, index=True)
