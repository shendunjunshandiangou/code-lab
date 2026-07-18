# -*- coding: utf-8
import re
from pathlib import Path

BASE = Path(r"d:\项目\B站知识库工厂\知识库\戴师兄-数据分析")
ART = BASE / "01_articles"
TASKS = BASE / "_pipeline_tasks.md"

FILES = """大厂分析师凭什么年薪40万？仅仅是懂业务就够了吗？.md
大厂分析师手把手教你面试！.md
大厂用人标准首度公开！想进大厂一定要这样准备！笔试面试需要注意哪些点又该如何准备？大厂HR最喜欢的简历长啥样？大厂背调怎么过？大厂用人标准和筛选条件.md
如何用AI提升面试能力？.md
如何自学数据分析？到底要学多久？应不应该报课？数据分析师有专业和学历要求吗？哪些专业更适合做数据分析？.md
如何让面试通过率飙升？附项目复盘与表达技巧！.md
小白能学数据分析吗？要不要入行？.md
干好这两件事，数据分析师就让你玩明白了！数据分析师最核心的工作内容。数据分析师是干什么的_.md
年薪30万以下，数据分析不拼天赋！.md
当你四月底才开始准备求职....md
快问快答 _ 9年土木转数分，后悔没早点跑路....md
我们测了20款主流AI，第一名和最后一名，差别太大了.md
我是如何停止精神内耗的？摆脱完美主义，重新掌控自我！.md
戴师兄x喜乐君丨Tableau还是最优选吗？.md
数分与数仓，哪个更吃香？.md
数据分析劝退帖子要不要信？如何辩证看待？.md
数据分析只用学4个工具？！！有哪些自学资料？如何自学？最短学习路径该怎么规划？SQL_Tableau_Python要学到什么程度？Python和R到底学哪个？.md
数据分析掌握到什么程度才能应聘？.md
数据分析求职必看的【找工作攻略】它来了！薪资岗位、工作内容、简历、面试、笔试、谈薪、offer选择一网打尽！系统学习求职底层原理和潜规则！助力转型就业求职季！.md
数据看不懂，分析全白搭：3 步教会你如何真正读懂数据！.md
有了AI，我们的工作还能撑多久？.md
有效提升分析思维的5本经典书籍推荐，数据分析师必读.md
毕业半年薪资3翻，我的1.8万月薪逆袭之旅.md
没数分经历，咋入行？.md
没经验、空窗期、转行、大龄……统统有解！.md
电商人の所有结局【内附】求职路径规划.md
离明星最近的一次！！！祝大家毕业快乐！.md
考研？就业？三年后哪个更有前途？.md
聊聊我的职业_刚毕业就能年薪15万？数据分析师一年到底可以赚多少？工资有多高？各年龄阶段对应月薪如何？.md
聊聊我的职业_数据分析师是干什么的？带你了解数据分析师的日常工作~.md
能进大厂的都是什么人？我能进吗？.md
虚荣指标背后，可行动指标究竟藏在哪？【戴你精读精益数据分析】.md
被AI替代，还有的救！.md
认真聊聊 转行数分 还值得吗？.md
让AI帮我写分析报告，结果.....md
起薪50W？现在入局跨境电商，希音怎么样？.md
转行必看！帮你0经验混进任何行业！.md
迄今为止最抽象的一场面试出现了....md
金三银四求职，这些技巧必知！.md
零基础如何用AI学数据分析？.md
非常好的Python视频，使我大脑旋转🧠💫_Pandas_数据处理_数据分析_可视化_基础知识_自学.md""".strip().split("\n")

def count_han_body(path):
    text = path.read_text(encoding="utf-8")
    m = re.search(r"## 文章正文\s*\n(.*)", text, re.DOTALL)
    if not m:
        return None, "no body"
    body = m.group(1).strip()
    if body.count("## 文章正文") > 0:
        return None, "duplicate body"
    han = len(re.findall(r"[\u4e00-\u9fff]", body))
    return han, "ok"

text = TASKS.read_text(encoding="utf-8")
completed = []
skipped = []
failed = []

for fn in FILES:
    p = ART / fn
    if not p.exists():
        failed.append((fn, "file missing"))
        continue
    wc, status = count_han_body(p)
    if status != "ok":
        failed.append((fn, status))
        continue
    # update pipeline row
    pat = rf"(\| 2026-07-19 \| {re.escape(fn)} \| 1B \| )⏳( \| 追加文章正文.*?\|)"
    repl = rf"\1✅\2".replace(r"\2", f" ✅ | 追加文章正文，{wc}字 |")
    new_text, n = re.subn(pat, repl, text)
    if n:
        text = new_text
        completed.append((fn, wc))
    else:
        # try already ✅ - update word count in remark
        pat2 = rf"(\| 2026-07-19 \| {re.escape(fn)} \| 1B \| ✅ \| 追加文章正文)(?:，\d+字)?( \|)"
        new_text2, n2 = re.subn(pat2, rf"\1，{wc}字\2", text)
        if n2:
            text = new_text2
            completed.append((fn, wc))
        else:
            failed.append((fn, "pipeline row not found"))

# update queue stats
done_count = len(completed)
text = re.sub(
    r"(\| ⏳ 待处理 \| \*\*)\d+(\*\* \|)",
    lambda m: f"{m.group(1)}{max(0, 127 - done_count)}{m.group(2)}" if "127" in m.group(0) else m.group(0),
    text,
    count=1,
)
text = re.sub(
    r"(\| ✅ 已完成 \| \*\*)\d+(\*\* \|)",
    lambda m: f"{m.group(1)}{done_count}{m.group(2)}" if m.group(1).endswith("| **") else m.group(0),
    text,
    count=1,
)

log = f"\n### 2026-07-19 · 阶段1B batch4（{len(completed)} 篇）\n"
for fn, wc in completed:
    log += f"- **{fn[:50]}**：正文 {wc} 字\n"

if "### 2026-07-19 · 阶段1B batch4" not in text:
    text = text.replace("<!-- 每完成 10 篇汇总一次进度 -->", "<!-- 每完成 10 篇汇总一次进度 -->" + log)

TASKS.write_text(text, encoding="utf-8")

print("COMPLETED", len(completed))
for x in completed:
    print(x[0][:55], x[1])
print("FAILED", len(failed))
for x in failed:
    print(x[0][:55], x[1])
