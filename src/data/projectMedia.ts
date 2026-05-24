import type { ProjectMedia } from '@/types'

export const projectMediaMap: Record<string, ProjectMedia> = {
  'fitmind-ai': {
    slug: 'fitmind-ai',
    eyebrow: 'AI training copilot',
    title: 'Insight stream',
    caption: 'Deterministic analytics layered with assistant responses and guided review states.',
    metrics: ['SSE', 'Tool loop', 'Analytics'],
    tone: 'ember',
  },
  easemove: {
    slug: 'easemove',
    eyebrow: 'Mobility data product',
    title: 'Comfort map',
    caption: 'Climate-aware route comparison with map storytelling and layered city signals.',
    metrics: ['Maps', 'Compare', '3D route'],
    tone: 'ocean',
  },
  ruilian: {
    slug: 'ruilian',
    eyebrow: 'Training platform',
    title: 'Shared space',
    caption: 'Multi-device records, live sync, and role-aware collaboration around health data.',
    metrics: ['Realtime', 'Spaces', 'Sync'],
    tone: 'forest',
  },
  sunsafe: {
    slug: 'sunsafe',
    eyebrow: 'Public health web app',
    title: 'UV diary',
    caption: 'Daily logging, profile state, and public data combined into a calmer prevention flow.',
    metrics: ['Diary', 'UV', 'Cloudinary'],
    tone: 'sunset',
  },
  'real-scene-3d': {
    slug: 'real-scene-3d',
    eyebrow: 'Spatial visualization',
    title: 'Scene engine',
    caption: 'Measurement, analysis, and multi-engine 3D behavior wrapped into reusable tools.',
    metrics: ['Cesium', '3D', 'GIS'],
    tone: 'violet',
  },
  'agri-identification': {
    slug: 'agri-identification',
    eyebrow: 'AI classification',
    title: 'Recognition flow',
    caption: 'Image upload, inference, and traceability folded into a clear product loop.',
    metrics: ['ResNet', 'Upload', 'Mini app'],
    tone: 'mono',
  },
  studysmart: {
    slug: 'studysmart',
    eyebrow: 'Mobile productivity',
    title: 'Study planner',
    caption: 'Task, session, and reminder architecture shaped for repeatable mobile workflows.',
    metrics: ['Compose', 'Room', 'Alarm'],
    tone: 'forest',
  },
  'fit5032-fitness': {
    slug: 'fit5032-fitness',
    eyebrow: 'Course delivery',
    title: 'Fitness landing',
    caption: 'A lean web delivery piece focused on clear structure, deployment, and accessibility.',
    metrics: ['Vue', 'Hosting', 'Web'],
    tone: 'sunset',
  },
}

export function getProjectMedia(slug: string): ProjectMedia {
  return (
    projectMediaMap[slug] ?? {
      slug,
      eyebrow: 'Project preview',
      title: 'Visual placeholder',
      caption: 'A shared placeholder frame that can be replaced with a real asset later.',
      metrics: ['Preview', 'Asset-ready', 'Interactive'],
      tone: 'mono',
    }
  )
}
