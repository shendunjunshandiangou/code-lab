---
来源文章: "[[SQL到底要学到什么程度才够用？]]", "[[【戴师兄】SQL入门免费教程]]"
标签: [SQL]
---

# 窗口函数与 Top N 套路

## 一句话定义

Top N 题通用套路：窗口函数先打标排名 → 再筛选排名第 N 的行；同值多人时慎用 LIMIT，应用 DENSE_RANK 或 ROW_NUMBER。

## 详细说明

### 核心两步

1. 子查询/CTE 中用窗口函数排名
2. 外层 `WHERE rk = N` 或 `rk <= N`

### 三种排名函数

| 函数 | 同值行为 | 典型场景 |
| --- | --- | --- |
| `ROW_NUMBER()` | 强制不同序号 | 每月 Top3 歌曲 |
| `RANK()` | 跳号 | 竞赛排名 |
| `DENSE_RANK()` | 不跳号 | 入职倒数第 N 名（同日期多人同排名） |

### 为什么 LIMIT 不行

同入职日期可能有多人，`ORDER BY ... LIMIT 3` 无法全部取出同排名的人。

### 复杂 Top N 示例

多表关联 → 多条件筛选 → 按月+歌曲聚合 COUNT → `ROW_NUMBER() OVER(PARTITION BY month ORDER BY cnt DESC)` → 取 rk≤3。

## 相关原子

- [[数据分析-SQL-笔试面试套路题方法论]]
- [[数据分析-SQL-SQL入门课程知识框架]]
