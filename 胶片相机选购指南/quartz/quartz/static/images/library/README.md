# 本地图片库

此目录保存网站中已经确认来源、并由 `scripts/localize-images.mjs` 缓存到仓库的图片。

维护规则：

- 页面展示优先使用本地文件，避免依赖第三方站点的实时重定向和限流。
- 图片作者、原始文件页和许可证仍保留在对应 Markdown 的 `image_credit`、`image_source`、`image_license` 与正文图注中。
- 自动脚本目前只处理 Wikimedia Commons 的 `Special:Redirect/file` 图片地址。
- 尚未确认授权或来源的机型继续使用文字占位，不直接抓取来源不明的网络图片。
- 新增或替换图片后，需要继续保留原始来源信息，不能只保留本地文件。
