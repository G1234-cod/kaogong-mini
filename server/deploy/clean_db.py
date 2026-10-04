# 清空服务器全部业务数据（账号/用户数据/日活/订阅/发券/任务/旧奖池）
# 用途：发版前清空测试期产生的数据（任务表 Task 由服务重启时 seed 自动重建 10 项预设）
# 用法：scp 到服务器后用 venv 执行，见 doc/08「日常发版」
#   scp server/deploy/clean_db.py aly:/tmp/clean_db.py
#   ssh aly "/opt/kaogong-api/venv/bin/python /tmp/clean_db.py"
import sys

sys.path.insert(0, '/opt/kaogong-api')

from sqlalchemy import delete, select
from db import SessionLocal
from models import User, UserData, Task, Visit, Subscription, Reward, Grant

TABLES = [User, UserData, Task, Visit, Subscription, Reward, Grant]

s = SessionLocal()

before = {t.__name__: s.execute(select(t)).scalars().all().__len__() for t in TABLES}
for cls in TABLES:
    s.execute(delete(cls))
s.commit()
after = {t.__name__: s.execute(select(t)).scalars().all().__len__() for t in TABLES}

s.close()
print('BEFORE:', before, flush=True)
print('AFTER :', after, flush=True)
print('DONE（重启服务后 Task 自动 seed）', flush=True)
