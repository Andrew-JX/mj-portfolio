# MJ Portfolio

面向国内大前端求职场景的工程师作品集，主线强调全栈工程化、性能安全、可部署交付，其次展示三维可视化与移动端架构实践。

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Tailwind CSS v4

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

当前站点使用 `createWebHashHistory()`，因此部署到 Vercel、静态服务器或对象存储时，不需要额外的 SPA rewrite 规则也能避免子路由刷新 404。

如果后续改成 history 路由，再补 `vercel.json` rewrite 到 `/index.html` 即可。

## Content Maintenance

后续维护入口尽量收敛为两个位置：

- `src/data/projects.ts`
  维护项目列表、详情文案、链接、面试追问、AI 协作说明
- `public/resume.pdf`
  维护对外展示的最新简历 PDF

页面层已经按数据驱动组织，新增项目时优先只改 `src/data/projects.ts`。

## Project Structure

```text
src/
  data/
    projects.ts
  pages/
    AboutPage.vue
    ProjectsPage.vue
    ProjectDetailPage.vue
    SkillsPage.vue
    ResumePage.vue
  router/
    index.ts
  styles/
    app.css
  App.vue
  main.ts
  types.ts
public/
  resume.pdf
```

## Notes

- Skills 页面证据链接会直接跳到项目详情页。
- Resume 页面默认读取 `public/resume.pdf`。
- 作品集主题为深色底 + 蓝色点缀，优先强调工程感与信息密度。
