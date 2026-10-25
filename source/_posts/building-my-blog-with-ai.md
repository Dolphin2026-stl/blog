---
title: AI 时代搭建个人博客：从 Markdown 到自己的网址
date: 2026-10-25 22:30:00
categories:
  - 技术实践
tags:
  - AI
  - Hexo
  - GitHub Pages
description: 用 Hexo、GitHub Actions 和 GitHub Pages 搭建博客，并接入已有个人主页的 /blog/ 路径。
---

我已经有了个人主页 `cai-han.com`，这次想给它加上一个能持续写文章的地方。目标很具体：平时只写 Markdown，提交后自动发布，并且能从同一个域名进入博客。

这篇文章记录这次搭建采用的结构和操作方法。文末心得是 AI 协助整理的初稿，之后会随着实际使用继续补充。

<!-- more -->

## 先把三件事分清楚

搭博客可以拆成三件事：写文章、生成网页、把网页放到线上。

1. **Markdown** 是文章源文件，保存标题、正文、分类等信息。
2. **Hexo** 把 Markdown 和主题模板组合成 HTML、CSS 与 JavaScript 等静态文件。
3. **GitHub Pages** 托管生成的文件，**GitHub Actions** 则负责在每次推送后自动构建和发布。

这样不必为每篇文章单独写网页，也不用为了静态博客维护一台服务器。主题选用 NexT 的 Muse 风格，以正文阅读为主，并保留分类、归档、文章目录与手机布局。

## 已有主页，博客放在哪里？

我的个人主页使用 React，部署在 Netlify。如果把域名直接改到 GitHub Pages，原主页也会受影响。因此这次保留主页原来的托管，把博客放进独立的 `blog` 仓库。

访问链路是：

```text
cai-han.com/              → 原来的 Netlify 个人主页
cai-han.com/blog/         → Netlify 代理 → GitHub Pages 博客
GitHub blog 仓库 main 分支 → Actions 构建 → Pages 发布
```

这里的关键是 **`/blog/` 是路径，不是新的域名**。DNS 只能处理主机名，不能单独把 `/blog/` 指向另一个平台；需要由现有网站的托管服务处理路径规则。

Netlify 的规则要放在原有的 SPA 回退规则前面：

```toml
[[redirects]]
  from = "/blog"
  to = "/blog/"
  status = 301

[[redirects]]
  from = "/blog/*"
  to = "https://dolphin2026-stl.github.io/blog/:splat"
  status = 200
  force = true
```

`200` 在这里表示代理转发，浏览器地址仍然是自己的域名。GitHub Pages 的默认地址也可作为备用入口。

## 初始化与配置

本项目使用 Node.js 24，并用 `.nvmrc` 让本地和自动构建保持一致。项目提交 `package-lock.json`，自动构建使用 `npm ci` 按锁文件安装。

如果要从零开始，可使用 Hexo 的初始化命令；如果使用本仓库，直接克隆并安装即可：

```bash
git clone https://github.com/Dolphin2026-stl/blog.git
cd blog
npm ci
```

配置最容易忽略的是网址和根路径：

```yaml
url: https://cai-han.com/blog
root: /blog/
language: zh-CN
timezone: Asia/Shanghai
theme: next
```

`url` 用于站点的正式链接，`root` 决定资源和站内链接的路径前缀。博客在子目录下运行时，不能默认所有资源都从网站根目录加载。

## 写第一篇文章

```bash
npm run new -- "我的下一篇文章"
```

Hexo 会在 `source/_posts/` 新建 Markdown 文件。顶部信息可以这样写：

```yaml
---
title: 我的下一篇文章
date: 2026-10-26 10:00:00
categories:
  - 学习记录
tags:
  - AI
---
```

正文里放入 `<!-- more -->`，首页就会只展示它前面的摘要。图片可以放在 `source/images/`，引用路径写成 `/blog/images/文件名.jpg`。

暂时不发布的内容放在 `source/_drafts/`。这个目录已加入 Git 忽略规则，但仍要在提交前检查暂存内容，避免把个人资料或敏感内容混进公开文章。

## 预览、构建与发布

```bash
npm run server
# 浏览器打开 http://localhost:4000/blog/

npm run build
```

本地确认后，把本次文章和图片提交到 `main`：

```bash
git add source/_posts/我的下一篇文章.md
git commit -m "发布新文章"
git push
```

GitHub Actions 会准备 Linux 环境，安装相同版本的 Node.js 和锁定的依赖，运行 Hexo，再把 `public/` 发布到 Pages。生成目录不需要手动提交。

## 要检查的东西比“构建成功”多一点

构建成功说明生成程序能运行，但不能证明读者能顺利阅读。我会重点看首页和文章能否打开、分类和归档链接是否正确、CSS 是否加载，以及手机上有没有横向溢出。

接入 `/blog/` 时，还需要检查直接打开文章深层链接的情况。如果它被原主页的 SPA 回退规则接管，就会出现网址看起来是博客、内容却是个人主页的问题。

## 这次搭建留下的几点思考

以下是这次实践的心得初稿，仍待日常写作验证。

**AI 缩短了实现过程，但清楚描述目标依然有用。** “搭一个博客”之外，还要说明已有主页、域名如何复用、是否保留旧内容、文章以后怎么发布。约束越具体，Agent 越容易做出可继续维护的结果。

**理解基本链路，才能判断结果。** 不必逐行写出所有配置，但知道 Markdown 如何变成 HTML、构建和托管分别负责什么，遇到空白页面或链接错误时就有排查方向。

**先让写作流程顺畅，再慢慢调整外观。** 对个人博客来说，长期价值来自内容积累。先做到新建文件、预览、提交就能发布，比一开始堆很多功能更适合当前需求。

下一步就是实际使用它：记录做过的项目、读过的材料，以及那些当时想通、过几天又容易忘记的细节。

## 参考资料

- [Hexo 官方文档](https://hexo.io/docs/)
- [NexT 官方文档](https://theme-next.js.org/)
- [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Netlify 代理与重写](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)
