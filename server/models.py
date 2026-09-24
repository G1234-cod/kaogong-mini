# 表结构：users（白名单账号）/ user_data（18 域按 key 存 JSON）/ rewards（奖池）/ grants（发放记录）
import time

from sqlalchemy import BigInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from db import Base


def now_ms() -> int:
    return int(time.time() * 1000)


class User(Base):
    __tablename__ = 'users'

    openid: Mapped[str] = mapped_column(String(64), primary_key=True)
    role: Mapped[str] = mapped_column(String(8), default='user')  # user | guest
    nickname: Mapped[str] = mapped_column(String(64), default='')
    created_at: Mapped[int] = mapped_column(BigInteger, default=now_ms)


class UserData(Base):
    __tablename__ = 'user_data'

    openid: Mapped[str] = mapped_column(String(64), primary_key=True)
    key: Mapped[str] = mapped_column(String(32), primary_key=True)  # AppData 域名
    value: Mapped[str] = mapped_column(Text)  # JSON 文本
    ts: Mapped[int] = mapped_column(BigInteger, default=0)


class Reward(Base):
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
