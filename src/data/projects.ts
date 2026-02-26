import type { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'sharp-training',
    title: '锐练 SharpTraining（训练 / 饮食 / 身体数据记录）',
    subtitle: '训练数据化 + 饮食反馈闭环 + 多端同步（可在线体验）',
    period: '2026.01 - Now',
    role: '独立开发：产品设计 + 前端实现 + 云端同步 + 部署交付',
    tech: [
      'Vite',
      'React',
      'TypeScript',
      'TDesign React',
      'TailwindCSS',
      'dayjs',
      'Node.js',
      'Express',
      'PostgreSQL(JSONB)',
      'WebSocket(ws)',
      'Docker',
      'docker compose',
      'Nginx',
    ],
    summary:
      '面向训练人群的记录工具：把训练（动作/组数/重量/强度）、饮食（热量与三大营养素）与身体数据（体重/体脂/可选经期）统一建模，支持长期趋势回看，让“进步”可追踪。',
    bullets: [
      '数据模型：以动作/组数/重量/强度为核心，支持训练记录与回看，便于长期对比与复盘。',
      '营养闭环：记录热量与三大营养素，重点呈现长期趋势，减少“只看当天”的噪声干扰。',
      '同步方案：Express 提供空间级别快照读写接口（/api/state/:spaceId），PostgreSQL(JSONB) 存储；WebSocket 推送变更，提升多端一致性体验。',
      '部署落地：Docker compose 编排；Nginx 托管前端静态资源并同域转发 /api 与 /ws，便于一键部署与后续扩展。',
    ],
    links: {
      live: 'http://124.221.65.3:8080',
      repo: 'https://github.com/Andrew-JX/SharpTraining.git',
    },

  },

  {
    slug: 'real-scene-3d-platform',
    title: '实景三维数据管理平台（政企项目）',
    subtitle: 'WebGIS / 三维可视化（脱敏介绍）',
    period: '2024.08 - 2025.01',
    role: '前端开发实习生：三维交互组件封装 / 兼容性排障 / 接口联调',
    tech: ['Vue3', 'TypeScript', 'Cesium', 'EarthSDK', 'Pinia', 'Vue Router'],
    summary:
      '面向三维地理数据管理与分析的 Web 平台：支持多源三维数据加载、空间分析与业务可视化展示。',
    bullets: [
      '工程架构：基于 Vue3 + Vue Router + Pinia 组织多模块业务页面，推动三维分析能力在页面中可维护地落地。',
      '组件封装：实现地形测量、体积计算、角度分析等三维交互功能，并沉淀为独立组件（measure / volume / analysis），降低三维逻辑与业务页面耦合。',
      '兼容排障：在 Cesium / EarthSDK / SuperMap 并存场景下进行版本兼容问题排查与接口差异适配，解决渲染异常与 API 不兼容问题。',
      '联调交付：对三维数据加载与渲染流程做拆分封装；与 Spring Boot 接口联调，协助定位并修复线上/联调问题。',
    ],
    links: {
      live: 'https://blog.csdn.net/weixin_51983847/article/details/142140218?spm=1001.2014.3001.5501',
    },
    note:
      '说明：政企项目不公开代码与数据，本页面仅展示脱敏职责与技术要点。上方链接为相关介绍文章/记录。',
  },

  {
    slug: 'studysmart-android',
    title: 'StudySmart 学习助手 App',
    subtitle: 'Android / Kotlin / Jetpack Compose',
    role: '独立开发：功能实现 + 架构组织（MVVM）',
    tech: ['Kotlin', 'Jetpack Compose', 'Room', 'Retrofit', 'WorkManager', 'AlarmManager'],
    summary: '学习与任务管理 App：任务规划、学习会话与进度追踪，支持提醒与后台任务。',
    bullets: [
      '架构组织：采用 MVVM 管理 UI 状态与业务逻辑，提升可维护性与扩展性。',
      '数据与网络：使用 Room 做本地持久化；Retrofit 负责网络请求与数据获取。',
      '提醒能力：集成 WorkManager / AlarmManager，实现学习提醒与后台任务调度。',
    ],
    links: {
      repo: 'https://github.com/Andrew-JX/fit5046-studyapp.git',
      video: '',
    },
  },

  {
    slug: 'fit5032-fitness-center',
    title: 'Fitness Center（FIT5032 课程项目）',
    subtitle: 'Vue / Firebase Hosting',
    role: '课程项目交付：页面实现 + 线上部署',
    tech: ['Vue', 'Firebase Hosting'],
    summary: '课程项目：完成可在线访问的 Web 应用，验证从开发到上线的完整交付流程。',
    bullets: [
      '页面实现：按课程需求完成核心页面与基础交互流程（表单/路由/数据展示等）。',
      '部署上线：通过 Firebase Hosting 发布静态站点，提供可访问链接用于演示与验收。',
    ],
    links: {
      live: 'https://fit5032-fitness.web.app/',
      repo: 'https://github.com/Andrew-JX/fit5032-FitnessCenter.git',
    },
  },

  {
    slug: 'agri-recognition',
    title: '农产品自动识别系统（毕业设计）',
    subtitle: '前后端分离 + AI 推理',
    period: '2024.01 - 2024.04',
    role: '全栈实现：前端页面 + 后端 API + 模型推理联调',
    tech: ['Vue', 'Spring Boot', 'PyTorch', 'ResNet-18', 'RESTful API'],
    summary: '用户上传图片即可识别农产品类别，并支持溯源查询；Web 与微信小程序可访问。',
    bullets: [
      '前端：使用 Vue 实现图片上传、识别结果展示与业务流程页面。',
      '后端：基于 Spring Boot 提供 RESTful API，完成用户管理与数据交互。',
      'AI 推理：使用 PyTorch + ResNet-18 完成识别推理；前端通过接口获取结果并展示，形成端到端闭环。',
    ],
    links: {},
  },

  {
    slug: 'reservoir-3d-prototype',
    title: '水库三维可视化原型系统（Academic Prototype）',
    subtitle: 'Three.js / WebGL',
    role: '三维渲染与交互原型探索',
    tech: ['Three.js', 'WebGL', 'Ruoyi（集成）'],
    summary: '浏览器端三维场景渲染与基础交互原型，用于验证三维渲染流程与工程集成思路。',
    bullets: [
      '渲染与交互：基于 Three.js + WebGL 实现基础场景渲染与交互控制。',
      '流程实践：调研并实践场景构建、相机控制、模型加载与渲染流程。',
      '工程集成：与若依（Ruoyi）后台框架做基础页面集成与数据管理（教学/原型性质）。',
    ],
    links: {},
  },
]
