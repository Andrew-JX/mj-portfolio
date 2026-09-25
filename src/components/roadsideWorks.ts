import { inkRoadBillboards } from '@/data/inkRoad'
import { projectMediaMap } from '@/data/projectMedia'
import { projects } from '@/data/projects'
import type { InkRoadBillboardSpec } from '@/components/inkRoadScene'

// 路边广告牌与首页作品横条共用同一份内容：取自 Projects 已有的项目信息，找不到详情页的项目不展示
export const roadsideWorks: InkRoadBillboardSpec[] = inkRoadBillboards.flatMap((board) => {
  const project = projects.find((item) => item.slug === board.slug)
  if (!project) return []
  const media = projectMediaMap[board.slug]
  return [{
    ...board,
    eyebrow: media?.eyebrow ?? project.positionTag,
    caption: media?.caption ?? project.oneLiner,
    metrics: media?.metrics ?? project.stack.slice(0, 3),
    tone: media?.tone ?? 'mono',
    period: project.period,
  }]
})
