import { createRouter, createWebHashHistory } from 'vue-router'
import AboutPage from '../pages/AboutPage.vue'
import ProjectsPage from '../pages/ProjectsPage.vue'
import ProjectDetailPage from '../pages/ProjectDetailPage.vue'
import SkillsPage from '../pages/SkillsPage.vue'
import ResumePage from '../pages/ResumePage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: AboutPage },
    { path: '/projects', component: ProjectsPage },
    { path: '/projects/:slug', component: ProjectDetailPage },
    { path: '/skills', component: SkillsPage },
    { path: '/resume', component: ResumePage },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
