# 贴纸图去白底 + 压缩工具（可重复使用）
# 用法：把新图片放到本目录，然后在本目录执行：
# cd .\src/assets/images/
# python remove_bg.py                     # 扣白底 + 按 --max-size 缩放（默认 512px）
#       python remove_bg.py --force       # 忽略“已处理/无白底/已量化”判断，从备份原图重新处理全部图片
#       python remove_bg.py --max-size 0  # 不缩放，仅扣白底
#       python remove_bg.py --max-size 1024  # 最长边缩到 1024px（保持宽高比与透明通道）
#       python remove_bg.py --colors 256  # 缩放后再量化到 256 色调色板（体积骤降，边缘抗锯齿略损）
# 原理：从图片四边泛洪填充去除「连通的白底」→ 透明，并对边界做 1px 羽化消除白边；
#       角色身体内部的白色（如小白兔、My Melody 白脸）不与边缘连通，会完整保留。
# 压缩：
#   --max-size N  最长边缩放到 N px（LANCZOS 高质量重采样）；0=不缩放。贴纸图源图常 1200px+
#                 而实际只显示几十~一两百 px，缩到 512px 视觉无损且体积大降。默认 512。
#   --colors N    缩放到 P 模式（调色板），FASTOCTREE 量化到 N 色；0=不量化（默认）。
#                 卡通贴纸为平涂色，量化到 256 色体积可再降数倍，但会轻微硬化抗锯齿边缘。
# 说明：JPG/WebP 不支持透明通道，扣图结果保存为同名 .png 并删除原文件（原图已备份）。
# 安全：首次处理前自动把原图备份到 %TEMP%\kaogong-img-backup（同名只备份一次）。
# 幂等：已是透明背景、或没有连通白底、或尺寸已达标的图片会自动跳过，重复执行不会磨损边缘。
import os
import shutil
import sys
from collections import deque
from PIL import Image

SRC = os.path.dirname(os.path.abspath(__file__))   # 脚本所在目录即图片目录
BACKUP = os.path.join(os.environ.get("TEMP", r"C:\Temp"), "kaogong-img-backup")
EXTS = (".png", ".jpg", ".jpeg", ".webp")          # 扫描的图片格式
WHITE_MIN = 242      # min(r,g,b) >= 此值视为白底候选（角色淡粉/淡黄远低于此）
FEATHER_FROM = 165   # 边界环上 min 通道高于此值的像素做羽化
SKIP_ALPHA_PCT = 5   # 透明像素占比超过此值（%）则视为已处理，跳过
MIN_BG_PCT = 3       # 去除白底占比低于此值（%）则视为无需扣图，跳过
FORCE = "--force" in sys.argv


def _arg(name, default, cast=int):
    """解析形如 `--name value` 的命令行参数；缺省/非法时返回 default"""
    for i, a in enumerate(sys.argv):
        if a == name and i + 1 < len(sys.argv):
            try:
                return cast(sys.argv[i + 1])
            except (TypeError, ValueError):
                return default
    return default


MAX_SIZE = _arg("--max-size", 512)   # 最长边缩放上限 px；0=不缩放
COLORS = _arg("--colors", 0)         # 量化颜色数；0=不量化


def remove_bg(im):
    """就地去除与边缘连通的白底并羽化边界，返回去除的白底像素数"""
    w, h = im.size
    data = list(im.getdata())      # [(r,g,b,a), ...] 一维排列，避免逐像素慢速访问
    n = w * h

    def whiteish(i):
        r, g, b, a = data[i]
        return min(r, g, b) >= WHITE_MIN

    # 从四边 BFS 泛洪，只标记与边缘连通的白底
    bg = bytearray(n)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            i = y * w + x
            if not bg[i] and whiteish(i):
                bg[i] = 1
                q.append((x, y))
    for y in range(1, h - 1):
        for x in (0, w - 1):
            i = y * w + x
            if not bg[i] and whiteish(i):
                bg[i] = 1
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h:
                j = ny * w + nx
                if not bg[j] and whiteish(j):
                    bg[j] = 1
                    q.append((nx, ny))

    total_bg = 0
    # 透明化
    for i in range(n):
        if bg[i]:
            total_bg += 1
            r, g, b, a = data[i]
            data[i] = (r, g, b, 0)

    # 边界羽化：与透明区相邻的浅色像素按白度降低 alpha，消除锯齿白边
    for y in range(h):
        for x in range(w):
            i = y * w + x
            if bg[i]:
                continue
            near = ((x > 0 and bg[i - 1]) or (x < w - 1 and bg[i + 1])
                    or (y > 0 and bg[i - w]) or (y < h - 1 and bg[i + w]))
            if not near:
                continue
            r, g, b, a = data[i]
            m = min(r, g, b)
            if m > FEATHER_FROM:
                ratio = (m - FEATHER_FROM) / (255 - FEATHER_FROM)
                data[i] = (r, g, b, int(a * (1 - ratio)))

    im.putdata(data)
    return total_bg


def already_done(im):
    """透明像素占比过高 → 已处理过，跳过（防止重复羽化磨损边缘）"""
    w, h = im.size
    transparent = sum(1 for p in im.getdata() if p[3] == 0)
    return transparent * 100.0 / (w * h) >= SKIP_ALPHA_PCT


def compress(im, max_size, colors, already_quantized):
    """缩放 + 量化，返回 (im, 是否发生变化)。

    max_size：最长边缩放上限，0 或已 ≤ 上限则跳过缩放（幂等）。
    colors：调色板颜色数，0 或已量化（already_quantized）则跳过（避免二次量化磨损）。
    """
    changed = False
    w, h = im.size
    if max_size and max(w, h) > max_size:
        im.thumbnail((max_size, max_size), Image.LANCZOS)
        changed = True
    if colors and not already_quantized:
        # RGBA 量化仅支持 FASTOCTREE / libimagequant，透明通道会写入 tRNS 保留
        im = im.quantize(colors=colors, method=Image.FASTOCTREE)
        changed = True
    return im, changed


def backup_once(src, stem):
    """首次处理前备份原图；同一张图（同名不同后缀）只备份一次"""
    os.makedirs(BACKUP, exist_ok=True)
    if any(os.path.exists(os.path.join(BACKUP, stem + e)) for e in EXTS):
        return
    shutil.copy2(src, os.path.join(BACKUP, stem + os.path.splitext(src)[1]))


def force_source(stem, current):
    """--force 时优先用备份原图重新扣取，避免在已羽化的边缘上二次加工"""
    for e in EXTS:
        bak = os.path.join(BACKUP, stem + e)
        if os.path.exists(bak):
            return bak
    return current


def main():
    for name in sorted(os.listdir(SRC)):
        stem, ext = os.path.splitext(name)
        if ext.lower() not in EXTS:
            continue
        src = os.path.join(SRC, name)
        out = os.path.join(SRC, stem + ".png")   # JPG/WebP 不支持透明，统一输出 PNG

        work = force_source(stem, src) if FORCE else src
        raw = Image.open(work)
        already_q = raw.mode == "P"              # 已是调色板模式 → 量化幂等判断
        im = raw.convert("RGBA")

        # 1) 扣白底（已是透明背景则跳过）
        removed = False
        pct = 0.0
        if FORCE or not already_done(im):
            total_bg = remove_bg(im)
            pct = total_bg * 100.0 / (im.size[0] * im.size[1])
            if FORCE or pct >= MIN_BG_PCT:
                removed = True

        # 2) 压缩（缩放 + 可选量化）
        im, squeezed = compress(im, MAX_SIZE, COLORS, already_q and not FORCE)

        if not removed and not squeezed:
            print(f"{name}: 无需处理，跳过")
            continue

        backup_once(src, stem)
        im.save(out, optimize=True)
        if out != src:
            os.remove(src)   # 结果已生成同名 PNG，删除原 JPG/WebP（已备份）

        # 校验：四角应透明，中心应不透明（统一转 RGBA 读 alpha，兼容量化后的 P 模式）
        w, h = im.size
        px = Image.open(out).convert("RGBA").load()
        corners = [px[0, 0][3], px[w - 1, 0][3], px[0, h - 1][3], px[w - 1, h - 1][3]]
        center_a = px[w // 2, h // 2][3]
        mode = "P" if im.mode == "P" else "RGBA"
        renamed = "" if out == src else f" → {os.path.basename(out)}"
        print(f"{name}{renamed}: {w}x{h} {mode} 扣图{pct:.1f}% 角alpha={corners} 中心alpha={center_a}")


if __name__ == "__main__":
    main()
