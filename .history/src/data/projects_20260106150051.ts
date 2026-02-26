import type { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'real-scene-3d-platform',
    title: '实景三维数据管理平台',
    subtitle: 'WebGIS / 三维可视化（政企项目，脱敏 Case Study）',
    type: 'Case Study',
    stack: ['Vue3', 'TypeScript', 'Cesium', 'EarthSDK', 'Pinia', 'Vue Router'],
    role: '前端开发（3D 交互组件封装 / 兼容性排障 / 接口联调）',
    status: 'Private',
    links: {
      live:'https://blog.csdn.net/weixin_51983847/article/details/142140218?spm=1001.2014.3001.5501'
    },
    overview: [
      '面向三维地理数据管理与分析的 Web 平台，支持多源三维数据加载、空间分析与业务可视化展示。',
      '项目涉及三维交互工具（测量、体积、角度/可视化分析等）的组件化封装，并处理多引擎并存下的版本兼容问题。',
    ],
    highlights: [
      '将三维分析逻辑抽离为独立组件（降低与业务页面耦合，提升复用与维护效率）',
      '处理 Cesium / EarthSDK / SuperMap 并存场景的接口差异与版本兼容问题，定位 SDK 升级导致的渲染异常',
      '与后端接口进行数据交互，参与联调与问题排查',
    ],
    whatILearned: [
      '三维交互工具的可复用组件设计：状态管理、事件流、UI 面板与渲染逻辑解耦',
      '复杂 SDK 兼容排障：最小化复现、版本对比、适配层设计',
    ],
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
