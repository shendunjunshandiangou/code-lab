#!/usr/bin/env python3
"""Register stage 1B tasks in instance _pipeline_tasks.md."""
from __future__ import annotations

import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
INSTANCE = REPO / "知识库" / "戴师兄-数据分析"
ARTICLES = INSTANCE / "01_articles"
RAW = INSTANCE / "00_raw"
TASKS = INSTANCE / "_pipeline_tasks.md"

PRIORITY_KEYWORDS = [
    "职业规划万字",
    "SQL入门免费",
    "求职必看全攻略",
    "找工作全攻略",
    "自学攻略",
    "自学课程",
    "7步解题",
    "系统求职课",
    "全网最良心",
]


def get_raw_name(article_path: Path) -> tuple[str, bool]:
    text = article_path.read_text(encoding="utf-8")
    m = re.search(r"^来源:\s*00_raw/(.+)$", text, re.M)
    if m:
        fn = m.group(1).strip()
        if (RAW / fn).exists():
            return fn, True
    if (RAW / article_path.name).exists():
        return article_path.name, True
    stem = article_path.stem
    for r in RAW.glob("*.md"):
        if r.stem == stem or r.stem.endswith(stem) or stem in r.stem:
            return r.name, True
    return article_path.name, False


def main() -> None:
    raw_set = {p.name for p in RAW.glob("*.md")}
    _ = raw_set  # noqa: F841

    priority_rows: list[str] = []
    other_rows: list[str] = []

    for art in sorted(ARTICLES.glob("*.md")):
        raw_name, has_raw = get_raw_name(art)
        if has_raw:
            row = f"| 2026-07-19 | {raw_name} | 1B | ⏳ | 追加文章正文 |"
        else:
            row = f"| 2026-07-19 | {raw_name} | 1B | ⛔ | 无对应 00_raw |"
        is_pri = any(k in art.name or k in raw_name for k in PRIORITY_KEYWORDS)
        (priority_rows if is_pri else other_rows).append(row)

    rows = priority_rows + other_rows
    pending = sum("⏳" in r for r in rows)
    skipped = sum("⛔" in r for r in rows)

    section = f"""

## 阶段 1B 任务表（2026-07-19 · 追加文章正文）

| 日期 | 原始字幕文件（00_raw/） | 执行阶段 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
""" + "\n".join(rows) + f"""

## 阶段 1B 队列状态

| 指标 | 数值 |
| --- | --- |
| ⏳ 待处理 | **{pending}** |
| ✅ 已完成 | **0** |
| ⛔ 跳过 | **{skipped}** |

> 执行入口：读取本表所有 ⏳ 的 1B 任务，按 `_prompts/02B_文章正文.md` 逐条处理；一次只处理一个文件。

## 阶段 1B 执行日志

<!-- 每完成 10 篇汇总一次进度 -->
"""

    content = TASKS.read_text(encoding="utf-8")
    if "## 阶段 1B 任务表" in content:
        print("1B section already exists, skip")
        return
    TASKS.write_text(content.rstrip() + section, encoding="utf-8")
    print(f"Appended {len(rows)} tasks ({pending} pending, {skipped} skipped)")


if __name__ == "__main__":
    main()
