import type { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'real-scene-3d-platform',
    title: '实景三维数据管理平台（政企项目）',
    subtitle: 'WebGIS / 三维可视化（脱敏介绍）',
    period: '2024.08 - 2025.01',
    role: '前端开发实习生：三维交互组件封装 / 兼容性排障 / 接口联调',
    tech: ['Vue3', 'TypeScript', 'Cesium', 'EarthSDK', 'Pinia', 'Vue Router'],
    summary:
      '面向三维地理数据管理与分析的 Web 平台：多源三维数据加载、空间分析与业务可视化展示。',
    bullets: [
      '基于 Vue3 + Cesium + EarthSDK 实现地形测量、体积计算、角度分析等三维交互功能，并封装为独立组件（measure / volume / analysis），降低与业务页面耦合度，提升复用与维护效率。',
      '在 Cesium / EarthSDK / SuperMap 并存场景下排查版本兼容问题并进行接口差异适配，定位并解决 SDK 升级导致的渲染异常与 API 不兼容问题。',
      '对三维数据加载与渲染流程进行拆分与封装，提升可维护性；使用 Spring Boot 接口进行数据交互，参与接口联调与问题排查。',
    ],
    links: {
      live:'https://blog.csdn.net/weixin_51983847/article/details/142140218?spm=1001.2014.3001.5501'
    },
    note:
      '说明：政企项目不公开代码与数据，本页面仅展示脱敏职责与技术要点；后续可补充公开视频/GIF（不含敏感信息）。',
  },

  {
    slug: 'studysmart-android',
    title: 'StudySmart 学习助手 App',
    subtitle: 'Android / Kotlin / Jetpack Compose',
    role: '独立开发：功能实现 + 架构组织（MVVM）',
    tech: ['Kotlin', 'Jetpack Compose', 'Room', 'Retrofit', 'WorkManager', 'AlarmManager'],
    summary: '智能学习伴侣：任务规划、学习会话、进度追踪，支持学习提醒与后台任务。',
    bullets: [
      '基于 Kotlin + Jetpack Compose 开发移动端应用，采用 MVVM 架构组织 UI 与状态。',
      '使用 Room 实现本地数据持久化，Retrofit 进行网络请求。',
      '集成 WorkManager / AlarmManager 实现后台任务与学习提醒。',
    ],
    links: {
      repo: 'https://github.com/Andrew-JX/fit5046-studyapp.git',
      video: '把你云端视频链接粘贴到这里（后面你补）',
    },
    note: '建议：你上传一个 60~90 秒功能演示视频（登录/任务/番茄钟/进度）就够有说服力。',
  },

  {
    slug: 'fit5032-fitness-center',
    title: 'Fitness Center（FIT5032 课程项目）',
    subtitle: 'Vue / Firebase Hosting',
    role: '课程项目交付：页面与基础流程实现 + 在线部署',
    tech: ['Vue', 'Firebase Hosting'],
    summary: '课程大作业：完成可在线访问的 Web 应用，用于展示工程交付与部署能力。',
    bullets: [
      '完成课程要求的核心页面与基础流程（以项目实际实现为准，可在此补充：登录/表单/路由等）。',
      '部署到 Firebase Hosting，提供可访问链接，方便演示与验收。',
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
      '前端使用 Vue 实现图片上传、识别结果展示与业务流程页面。',
      '后端基于 Spring Boot 提供 RESTful API，完成用户管理与数据交互。',
      '使用 PyTorch + ResNet-18 实现图像识别推理，前端通过接口获取识别结果；系统支持 Web 与微信小程序访问，形成完整业务闭环。',
    ],
    links: {},
    note: '如果你愿意后续补：模型推理接口的请求/响应示例、以及一段演示视频（更加分）。',
  },

  {
    slug: 'reservoir-3d-prototype',
    title: '水库三维可视化原型系统（Academic Prototype）',
    subtitle: 'Three.js / WebGL',
    role: '三维渲染与交互原型探索',
    tech: ['Three.js', 'WebGL', 'Ruoyi（集成）'],
    summary: '浏览器端三维场景渲染与基础交互，重点验证三维渲染流程与工程实践。',
    bullets: [
      '基于 Three.js + WebGL 实现浏览器端三维场景渲染与基础交互。',
      '调研并实践场景构建、相机控制、模型加载与渲染流程。',
      '使用 若依（Ruoyi）后台管理框架完成基础页面集成与数据管理（教学/原型性质）。',
    ],
    links: {},
  },
]
