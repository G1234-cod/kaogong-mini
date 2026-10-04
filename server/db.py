# 数据库连接（SQLAlchemy 2.0；生产/本地均为 SQLite，DATABASE_URL 可切 MySQL 零代码）
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

import config

# SQLite 直连；切 MySQL 时用 PyMySQL，pool_pre_ping 防断连
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

    from sqlalchemy import text

    import_module('models')  # 注册表定义
    Base.metadata.create_all(engine)
    # 幂等迁移：已有部署的 users 表补 last_seen_at 列（create_all 不改已存在表）
    with engine.begin() as conn:
        try:
            conn.execute(text('ALTER TABLE users ADD COLUMN last_seen_at INTEGER NOT NULL DEFAULT 0'))
        except Exception:
            pass  # 列已存在（SQLite 不支持 IF NOT EXISTS 的 ADD COLUMN）
