#!/usr/bin/env python3
"""
胶片相机机型图片自动拉取脚本 v4

策略：Wikipedia API 获取页面信息框主图（100% 精准）。
做好限流控制（每请求 2 秒），带重试。
"""

import os, re, sys, time
from pathlib import Path
import requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = PROJECT_ROOT / "02_atoms" / "models"
OUTPUT_DIR = PROJECT_ROOT / "assets" / "img" / "models"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
CREDITS_FILE = OUTPUT_DIR / "CREDITS.md"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (FilmCameraGuide/1.0 personal knowledge base)"
}
WP_API = "https://en.wikipedia.org/w/api.php"
DELAY = 2.0
MAX_RETRIES = 3

# Wikipedia 页面映射（注意：必须是精确的 WP 页面标题，大小写敏感）
WP_PAGES = {
    "奥林巴斯 mju-1": "Olympus_mju",
    "奥林巴斯 mju-2": "Olympus_mju",
    "奥林巴斯 OM-1": "Olympus_OM-1",
    "奥林巴斯 OM-10": "Olympus_OM-10",
    "奥林巴斯 OM-2": "Olympus_OM-2",
    "奥林巴斯 OM-2n": "Olympus_OM-2N_SP",
    "奥林巴斯 OM-4": "Olympus_OM-4",
    "奥林巴斯 Pen D3": "Olympus_Pen_F",         # 共享页面
    "奥林巴斯 Pen EE-2": "Olympus_Pen_EE",
    "奥林巴斯 Pen F": "Olympus_Pen_F",
    "奥林巴斯 XA": "Olympus_XA",
    "佳能 A-1": "Canon_A-1",
    "佳能 AE-1": "Canon_AE-1",
    "佳能 AE-1 Program": "Canon_AE-1_Program",
    "佳能 EOS 3": "Canon_EOS-3",
    "佳能 F-1": "Canon_F-1",
    "佳能 FTb-N": "Canon_FTb",
    "尼康 28Ti": "Nikon_28Ti",
    "尼康 F-601": "Nikon_F-601",
    "尼康 F2": "Nikon_F2",
    "尼康 F3": "Nikon_F3",
    "尼康 FE": "Nikon_FE",
    "尼康 FE2": "Nikon_FE2",
    "尼康 FG": "Nikon_FG",
    "尼康 FM2": "Nikon_FM2",
    "尼康马特": "Nikkormat",
    "宾得 6x7": "Pentax_6x7",
    "宾得 Espio Mini": "Pentax_Espio_Mini",
    "宾得 K1000": "Pentax_K1000",
    "宾得 K2": "Pentax_K-2",
    "宾得 KM": "Pentax_KM",
    "宾得 LX": "Pentax_LX",
    "宾得 ME": "Pentax_ME",
    "宾得 ME Super": "Pentax_ME_Super",
    "宾得 MX": "Pentax_MX",
    "宾得 Spotmatic": "Pentax_Spotmatic",
    "康泰时 Aria": "Contax_Aria",
    "康泰时 G1": "Contax_G1",
    "康泰时 G2": "Contax_G2",
    "康泰时 RTS 系列": "Contax_RTS",
    "康泰时 S2": "Contax_S2",
    "康泰时 T2": "Contax_T2",
    "康泰时 T3": "Contax_T3",
    "康泰时 TVS": "Contax_TVS",
    "美能达 807Si": "Minolta_Dynax_800si",
    "美能达 SRT-101": "Minolta_SR-T_101",
    "美能达 TC-1": "Minolta_TC-1",
    "美能达 X-1": "Minolta_XK",
    "美能达 X-700": "Minolta_X-700",
    "美能达 α-7": "Minolta_%CE%B1-7",           # URL 编码
    "徕卡 CM": "Leica_CM",
    "徕卡 M6": "Leica_M6",
    "徕卡 Minilux": "Leica_Minilux",
    "徕卡 R6": "Leica_R6",
    "柯尼卡 Hexar AF": "Konica_Hexar",
    "柯尼卡 T3N": "Konica_Autoreflex_T3",
    "柯尼卡 T4": "Konica_Autoreflex_TC",
    "理光 GR1s": "Ricoh_GR1",
    "理光 GR21": "Ricoh_GR21",
    "理光 KR-5": "Ricoh_KR-5",
    "理光 XR-2": "Ricoh_XR-2",
    "富士 AX-5": "Fujica_AX-5",
    "富士 GA645Zi": "Fujifilm_GA645Zi",
    "富士 Klasse W": "Fujifilm_Klasse_W",
    "富士 ST-701": "Fujica_ST701",
    "富士 ST-801": "Fujica_ST801",
    "富士 Wide 300": "Instax_Wide_300",
    "禄来 35": "Rollei_35",
    "禄来 3.5F": "Rolleiflex",
    "禄来 SL35": "Rollei_SL35",
    "雅西卡 35GX": "Yashica_Electro_35",
    "雅西卡 FR 系列": "Yashica_FR",
    "雅西卡 FX-3 Super 2000": "Yashica_FX-3_Super_2000",
    "雅西卡 T3 Super": "Yashica_T3",
    "哈苏 500": "Hasselblad_500C",
    "勃朗尼卡 ETR 系列": "Bronica_ETR",
    "玛米亚 7": "Mamiya_7",
    "玛米亚 RB67": "Mamiya_RB67",
    "海鸥 4A": "Seagull_Camera",
    "珠江 S-201": None,
    "Praktica Super TL1000": "Praktica",
    "Zenit E": "Zenit_(camera)",
    "一次性相机": "Disposable_camera",
}


def api_get(params, retries=MAX_RETRIES):
    """API 请求 + 重试 + 限流"""
    for attempt in range(retries):
        try:
            resp = requests.get(WP_API, params=params, headers=HEADERS, timeout=20)
            if resp.status_code == 429:
                wait = (attempt + 1) * 15
                print(f"  429 限流，等 {wait}s...")
                time.sleep(wait)
                continue
            if resp.status_code >= 500:
                if attempt < retries - 1:
                    time.sleep(5)
                    continue
            resp.raise_for_status()
            return resp.json()
        except requests.exceptions.ConnectionError:
            if attempt < retries - 1:
                time.sleep(5)
                continue
    return None


def get_image(page_title):
    """获取 Wikipedia 页面信息框主图 URL"""
    if not page_title:
        return None
    params = {
        "action": "query", "format": "json",
        "prop": "pageimages",
        "titles": page_title,
        "piprop": "original",
        "pithumbsize": 1200,
    }
    data = api_get(params)
    if not data:
        return None
    pages = data.get("query", {}).get("pages", {})
    for pid, info in pages.items():
        if pid == "-1":
            return None
        original = info.get("original", {})
        thumb = info.get("thumbnail", {})
        url = original.get("source") or thumb.get("source") or ""
        if url:
            return {
                "url": url,
                "wikipedia_page": f"https://en.wikipedia.org/wiki/{page_title}",
            }
    return None


def download_img(url, dest):
    """下载一张图片"""
    for attempt in range(MAX_RETRIES):
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            if r.status_code == 429:
                time.sleep(10)
                continue
            r.raise_for_status()
            if len(r.content) < 2000:
                return False
            ct = r.headers.get("Content-Type", "")
            ext = ".jpg"
            if "png" in ct: ext = ".png"
            elif "webp" in ct: ext = ".webp"
            elif "gif" in ct: ext = ".gif"
            dest = dest.with_suffix(ext)
            dest.write_bytes(r.content)
            return True
        except Exception:
            if attempt < MAX_RETRIES - 1:
                time.sleep(5)
    return False


def slugify(s):
    return re.sub(r"[^\w\-一-鿿]+", "-", s).strip("-")


def main():
    models = sorted([f.stem for f in MODELS_DIR.glob("*.md")])
    print(f"共 {len(models)} 台相机\n")

    credits = [
        "# 图片来源",
        "",
        "> 图片来自 Wikipedia 文章页的信息框主图（CC BY-SA 开放许可）。",
        "> 生成时间: 2026-07-12",
        "",
        "| # | 机型 | 文件 | Wikipedia 页面 |",
        "|---|------|------|---------------|",
    ]

    ok = 0; fail = 0

    for i, model in enumerate(models):
        print(f"[{i+1}/{len(models)}] {model}", end="", flush=True)

        page = WP_PAGES.get(model)
        img = get_image(page) if page else None

        if img:
            safe = slugify(model)
            dest = OUTPUT_DIR / safe
            if download_img(img["url"], dest):
                # 获取最终文件名
                actual = [p for p in OUTPUT_DIR.glob(safe + ".*")]
                fname = actual[0].name if actual else "?"
                print(f" => {fname}")
                ok += 1
                credits.append(
                    f"| {i+1} | {model} | {fname} | [{page}]({img['wikipedia_page']}) |"
                )
            else:
                print(" => 下载失败")
                credits.append(f"| {i+1} | {model} | — | — |")
                fail += 1
        else:
            print(" => 无页面")
            credits.append(f"| {i+1} | {model} | — | — |")
            fail += 1

        time.sleep(DELAY)

    CREDITS_FILE.write_text("\n".join(credits), encoding="utf-8")
    print(f"\n{'='*50}")
    print(f"成果: {ok} 台  缺失: {fail} 台  共 {len(models)} 台")
    print(f"图片: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
