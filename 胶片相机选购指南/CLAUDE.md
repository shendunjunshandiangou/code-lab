# 胶片相机选购指南：Agent 工作约定

## 唯一内容源

当前项目从 `胶片相机选购指南/` 根目录读取 Markdown 内容。

需要修改首页时，请编辑：

- `胶片相机选购指南/index.md`

需要修改知识内容时，请编辑：

- `胶片相机选购指南/02_atoms/`
- `胶片相机选购指南/04_knowledge/`

`胶片相机选购指南/quartz/content/` 是历史遗留副本，当前构建会通过 `ignorePatterns` 排除整个 `quartz/**` 目录。不要修改其中的文章或首页，否则提交虽然可能构建成功，但页面不会发生变化。

## 本地预览

在 `胶片相机选购指南/quartz` 目录运行：

```powershell
node quartz/bootstrap-cli.mjs build --serve --directory ..
```

访问终端输出的地址，通常是 `http://localhost:8080`。

## 提交前检查

运行：

```powershell
git diff --name-only origin/master...HEAD
```

确认内容修改没有落在：

```text
胶片相机选购指南/quartz/content/
```

首页改造应至少确认：

1. `胶片相机选购指南/index.md` 包含 `home-shell`。
2. `胶片相机选购指南/quartz/quartz/styles/custom.scss` 包含对应样式。
3. 使用 `--directory ..` 完成一次本地构建。
4. 不直接提交构建产物 `quartz/public/`。
