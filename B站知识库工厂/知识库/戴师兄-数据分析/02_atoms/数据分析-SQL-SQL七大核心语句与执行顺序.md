---
来源文章: "[[【戴师兄】如何自学SQL？Tableau如何通过SQL直连数据库？SQL有哪些知识点？数据库要学到什么程度？]]", "[[SQL到底要学到什么程度才够用？]]"
标签: [SQL]
---

# SQL 七大核心语句与执行顺序

## 一句话定义

SQL 由 SELECT/FROM/WHERE/GROUP BY/HAVING/ORDER BY/LIMIT 七语句构成；书写顺序与执行顺序不同，数据库按 FROM 先行单向执行。

## 详细说明

### 七大语句

`SELECT · FROM · WHERE · GROUP BY · HAVING · ORDER BY · LIMIT`

各主流数据库用法一致，语法顺序不能随意调换。

### 执行顺序

```text
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

### 书写 vs 执行

| 人写（以终为始） | 数据库跑 |
| --- | --- |
| SELECT 在前 | FROM 最先 |

先想清楚要什么字段（SELECT），再想从哪张表取（FROM）；数据库必须先定位表才高效。

### 单向执行

运行到后面步骤不会回头重新执行前面步骤。

## 相关原子

- [[数据分析-SQL-SQL是什么一大能力两大属性]]
- [[数据分析-SQL-子查询WHERE IN与FROM子查询]]
