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
    slug: 'fit5032-fitness-center',
    title: 'Fitness Center（FIT5032 Coursework）',
    subtitle: '课程项目：登录/业务流程（Firebase Hosting）',
    type: 'Coursework',
    stack: ['Vue', 'Firebase'],
    role: '前端开发 / 课程交付',
    status: 'Live',
    links: {
      live: 'https://fit5032-fitness.web.app/',
      repo: 'https://github.com/Andrew-JX/fit5032-FitnessCenter.git',
    },
    overview: [
      '课程大作业：实现基础业务页面与登录流程，并完成云端部署。',
      '用于展示工程交付能力（可访问链接 + 可运行仓库）。',
    ],
    highlights: [
      '在线可访问（Firebase Hosting）',
      '具备完整工程结构（可复现构建与部署）',
    ],
    whatILearned: [
      '从本地开发到云端部署的完整链路',
      '登录与页面路由的工程化组织方式',
    ],
  },

  {
    slug: 'studysmart-android',
    title: 'StudySmart 学习助手 App（Android）',
    subtitle: 'Kotlin / Jetpack Compose / MVVM（用视频演示证明交付）',
    type: 'Product',
    stack: ['Kotlin', 'Jetpack Compose', 'Room', 'Retrofit', 'WorkManager', 'AlarmManager'],
    role: '独立开发（移动端功能实现 + 架构搭建）',
    status: 'Live',
    links: {
      repo: 'https://github.com/Andrew-JX/fit5046-studyapp.git',
      video: '（这里换成你上传云端的视频链接）',
    },
    overview: [
      '智能学习伴侣：任务规划、学习会话、进度追踪、Pomodoro 等。',
      '重点展示：端侧工程能力 + 数据持久化 + 后台任务与提醒。',
    ],
    highlights: [
      'MVVM 架构组织 UI/状态/数据层',
      'Room 本地持久化，Retrofit 网络请求',
      'WorkManager / AlarmManager 实现后台任务与学习提醒',
    ],
    whatILearned: [
      '端侧架构与数据流：UI → ViewModel → Repository → DB/Network',
      '后台任务与提醒的可靠性处理（生命周期、权限、定时策略）',
    ],
  },
]
