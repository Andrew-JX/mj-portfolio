# MJ Portfolio

面向 AI 应用开发、AI 全栈、AI 产品经理和 AI 解决方案岗位的个人作品集。站点强调可解释的 AI 产品链路、全栈工程化交付、可部署项目证据和简历快速浏览。

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- GSAP

## Local Development

```bash
npm install
npm run dev
```

本地构建：

```bash
npm run build
```

本地预览生产包：

```bash
npm run preview
```

## Deployment

当前站点使用 React Router 的 `HashRouter`，部署到 Vercel、Cloudflare Pages、静态服务器或对象存储时，不需要额外的 SPA rewrite 规则也能避免子路由刷新 404。

Gitee Pages 项目页需要子路径 base，构建时设置：

```bash
DEPLOY_TARGET=gitee npm run build
```

默认构建 base 为 `/`，适用于 Vercel / Cloudflare 等根路径部署。

## Content Maintenance

后续维护入口尽量收敛在两个位置：

- `src/data/projects.ts`
  维护项目列表、详情文案、链接、面试追问、AI 协作说明。
- `public/resume1.pdf` 与 `public/resume2.pdf`
  维护对外展示的两份简历 PDF。

页面层已经按数据驱动组织，新增项目时优先只改 `src/data/projects.ts`，必要时再补 `src/data/projectMedia.ts` 中的预览视觉配置。

## Project Structure

```text
src/
  components/
    ProjectPreviewFrame.tsx
    TorchToggle.tsx
  composables/
    useTheme.ts
  data/
    projectMedia.ts
    projects.ts
  pages/
    AboutPage.tsx
    ProjectsPage.tsx
    ProjectDetailPage.tsx
    SkillsPage.tsx
    ResumePage.tsx
  router/
    index.tsx
  styles/
    app.css
  App.tsx
  main.tsx
  types.ts
public/
  resume1.pdf
  resume2.pdf
```

## Notes

- 首页保留 GSAP 首屏入场、压力标题、3D 能力轮播、typing 文案和项目卡片磁吸效果。
- Projects 页面保留搜索、分类筛选、卡片入场动画和详情页跳转。
- Resume 页面默认读取 `public/resume1.pdf` 与 `public/resume2.pdf`，路径通过 `import.meta.env.BASE_URL` 适配不同部署 base。
