#!/usr/bin/env python3
"""
给每篇机型笔记添加图片搜索链接

在正文中插入一个搜索链接，读者点击即可查看该机型的外观照片。
"""

import urllib.parse
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = PROJECT_ROOT / "02_atoms" / "models"

# 中→英搜索词映射
SEARCH_MAP = {
    "奥林巴斯 mju-1": "Olympus mju 35mm camera",
    "奥林巴斯 mju-2": "Olympus mju-II 35mm camera",
    "奥林巴斯 OM-1": "Olympus OM-1 SLR camera",
    "奥林巴斯 OM-10": "Olympus OM-10 camera",
    "奥林巴斯 OM-2": "Olympus OM-2 camera",
    "奥林巴斯 OM-2n": "Olympus OM-2n camera",
    "奥林巴斯 OM-4": "Olympus OM-4 camera",
    "奥林巴斯 Pen D3": "Olympus Pen D3 camera",
    "奥林巴斯 Pen EE-2": "Olympus Pen EE-2 camera",
    "奥林巴斯 Pen F": "Olympus Pen F half-frame camera",
    "奥林巴斯 XA": "Olympus XA camera",
    "佳能 A-1": "Canon A-1 SLR camera",
    "佳能 AE-1": "Canon AE-1 SLR camera",
    "佳能 AE-1 Program": "Canon AE-1 Program camera",
    "佳能 EOS 3": "Canon EOS 3 film camera",
    "佳能 F-1": "Canon F-1 SLR camera",
    "佳能 FTb-N": "Canon FTb camera",
    "尼康 28Ti": "Nikon 28Ti camera",
    "尼康 F-601": "Nikon F-601 camera",
    "尼康 F2": "Nikon F2 camera",
    "尼康 F3": "Nikon F3 camera",
    "尼康 FE": "Nikon FE camera",
    "尼康 FE2": "Nikon FE2 camera",
    "尼康 FG": "Nikon FG camera",
    "尼康 FM2": "Nikon FM2 camera",
    "尼康马特": "Nikkormat camera",
    "宾得 6x7": "Pentax 6x7 medium format camera",
    "宾得 Espio Mini": "Pentax Espio Mini camera",
    "宾得 K1000": "Pentax K1000 camera",
    "宾得 K2": "Pentax K2 camera",
    "宾得 KM": "Pentax KM camera",
    "宾得 LX": "Pentax LX camera",
    "宾得 ME": "Pentax ME camera",
    "宾得 ME Super": "Pentax ME Super camera",
    "宾得 MX": "Pentax MX camera",
    "宾得 Spotmatic": "Pentax Spotmatic camera",
    "康泰时 Aria": "Contax Aria camera",
    "康泰时 G1": "Contax G1 camera",
    "康泰时 G2": "Contax G2 camera",
    "康泰时 RTS 系列": "Contax RTS camera",
    "康泰时 S2": "Contax S2 camera",
    "康泰时 T2": "Contax T2 camera",
    "康泰时 T3": "Contax T3 camera",
    "康泰时 TVS": "Contax TVS camera",
    "美能达 807Si": "Minolta 807Si camera",
    "美能达 SRT-101": "Minolta SRT-101 camera",
    "美能达 TC-1": "Minolta TC-1 camera",
    "美能达 X-1": "Minolta X-1 camera",
    "美能达 X-700": "Minolta X-700 camera",
    "美能达 α-7": "Minolta Dynax 7 camera",
    "徕卡 CM": "Leica CM camera",
    "徕卡 M6": "Leica M6 camera",
    "徕卡 Minilux": "Leica Minilux camera",
    "徕卡 R6": "Leica R6 camera",
    "柯尼卡 Hexar AF": "Konica Hexar AF camera",
    "柯尼卡 T3N": "Konica Autoreflex T3 camera",
    "柯尼卡 T4": "Konica Autoreflex T4 camera",
    "理光 GR1s": "Ricoh GR1 camera",
    "理光 GR21": "Ricoh GR21 camera",
    "理光 KR-5": "Ricoh KR-5 camera",
    "理光 XR-2": "Ricoh XR-2 camera",
    "富士 AX-5": "Fujica AX-5 camera",
    "富士 GA645Zi": "Fujifilm GA645Zi camera",
    "富士 Klasse W": "Fujifilm Klasse W camera",
    "富士 ST-701": "Fujica ST701 camera",
    "富士 ST-801": "Fujica ST801 camera",
    "富士 Wide 300": "Fujifilm Instax Wide 300 camera",
    "禄来 35": "Rollei 35 camera",
    "禄来 3.5F": "Rolleiflex 3.5F TLR camera",
    "禄来 SL35": "Rollei SL35 camera",
    "雅西卡 35GX": "Yashica Electro 35 GX camera",
    "雅西卡 FR 系列": "Yashica FR camera",
    "雅西卡 FX-3 Super 2000": "Yashica FX-3 Super 2000 camera",
    "雅西卡 T3 Super": "Yashica T3 Super camera",
    "哈苏 500": "Hasselblad 500C camera",
    "勃朗尼卡 ETR 系列": "Bronica ETR camera",
    "玛米亚 7": "Mamiya 7 camera",
    "玛米亚 RB67": "Mamiya RB67 camera",
    "海鸥 4A": "Seagull 4A TLR camera",
    "珠江 S-201": "Pearl River S-201 camera",
    "Praktica Super TL1000": "Praktica Super TL1000 camera",
    "Zenit E": "Zenit E camera",
    "一次性相机": "disposable film camera",
}


def build_search_link(query: str) -> str:
    """生成 Google 图片搜索链接"""
    encoded = urllib.parse.quote(query)
    return f"https://www.google.com/search?tbm=isch&q={encoded}"


def main():
    model_files = sorted(MODELS_DIR.glob("*.md"))
    print(f"处理 {len(model_files)} 篇机型笔记...\n")

    updated = 0
    skipped = 0

    for filepath in model_files:
        model_name = filepath.stem
        query = SEARCH_MAP.get(model_name, f"{model_name} camera")
        url = build_search_link(query)

        content = filepath.read_text(encoding="utf-8")

        # 检查是否已有图片链接
        if "tbm=isch" in content:
            print(f"  {model_name}: 已有链接，跳过")
            skipped += 1
            continue

        # 在 "## 一句话定位" 前面插入图片链接
        marker = "## 一句话定位"
        if marker not in content:
            print(f"  {model_name}: [X] 未找到 '一句话定位'")
            skipped += 1
            continue

        image_line = (
            f"> [!image] {model_name} 外观参考\n"
            f"> 点击查看 [{query}]({url})\n\n"
        )

        content = content.replace(marker, image_line + marker, 1)
        filepath.write_text(content, encoding="utf-8")
        print(f"  {model_name}: 已添加 -> {query[:50]}...")
        updated += 1

    print(f"\n完成: 更新 {updated} 篇, 跳过 {skipped} 篇, 共 {len(model_files)} 篇")


if __name__ == "__main__":
    main()
