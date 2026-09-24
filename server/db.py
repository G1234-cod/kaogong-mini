# 数据库连接（SQLAlchemy 2.0；生产 MySQL，本地开发 sqlite 兜底）
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

import config

# MySQL 用 PyMySQL，sqlite 直连；pool_pre_ping 防断连
engine = create_engine(
    config.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    future=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, future=True)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    from importlib import import_module

    import_module('models')  # 注册表定义
    Base.metadata.create_all(engine)
