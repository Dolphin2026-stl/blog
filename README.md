# 蔡涵的博客

正式入口：https://cai-han.com/blog/

备用入口：https://dolphin2026-stl.github.io/blog/

技术方案：Hexo 8 + NexT Muse + Node.js 24 + GitHub Actions + GitHub Pages。主页继续使用原有 Netlify 服务，以代理规则接入博客。

## 日常写作

首次克隆后安装 Node.js 24，运行 `npm ci`。

```bash
npm run new -- "文章英文短名"
npm run server
```

编辑 `source/_posts/文章英文短名.md`，标题可以改成中文；浏览器打开 http://localhost:4000/blog/ 预览。文件名用于固定链接，发布后尽量不要改。

修改顶部 `categories` 列表即可修改分类；新分类会自动生成页面。多个平行分类请写成 `categories: [[技术实践], [学习记录]]`，普通列表代表层级分类。`tags` 为平行标签列表。

图片放到 `source/images/`，正文写 `![说明](/blog/images/文件名.jpg)`。建议压缩图片并使用无空格的英文文件名。

`<!-- more -->` 上方是首页摘要。关于页面在 `source/about/index.md`，导航在 `_config.next.yml`，站点基本信息在 `_config.yml`。示例欢迎文章可删除。

## 发布

```bash
npm run build
git status
git add source/_posts/文章英文短名.md source/images/本次图片.jpg
git diff --cached
git commit -m "发布文章"
git push origin main
```

没有图片时省略图片路径。只暂存本次需要公开的文件，检查后提交；不要上传密码、令牌、私密文章。`source/_drafts/` 已忽略，草稿不要放到 `_posts`。

推送后在仓库 Actions 查看 **Publish Hexo blog**，构建和部署均成功后即可访问。Pages Settings 的 Source 应为 **GitHub Actions**。首次开通可使用 `gh api --method POST repos/Dolphin2026-stl/blog/pages -f build_type=workflow`。以后发布文章不需要改设置。Netlify 代理可能短暂缓存旧内容，稍后刷新即可。

## 托管结构

主页仓库为 Dolphin2026-stl/homepage-Version2.0，Netlify 的 `/blog/*` 规则代理到本仓库的 Pages。它必须位于 `/* → /index.html` 回退之前。不为本仓库设置自定义域名/CNAME，否则会与现有主页冲突。

GitHub Pages 默认入口与自定义域名共用 `/blog/` 路径，CSS、文章链接均使用这个前缀。canonical 指向正式入口。

## 依赖与排错

依赖锁文件必须提交；修改依赖后用 `npm install` 更新锁文件，CI 使用 `npm ci`。本地与 CI 使用 Node.js 24。

- 构建错误：先运行 `npm ci`，再运行 `npm run clean` 和 `npm run build`。
- 样式 404：检查 `_config.yml` 的 `root: /blog/`。
- `/blog/` 出现个人主页：检查 Netlify 代理规则顺序和主页部署是否成功。
- Pages 404：检查 Actions 部署结果和 Pages Source 设置。
- 修改文章日期后没显示：未来文章默认不生成，检查 Asia/Shanghai 时间。
