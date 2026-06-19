import { useTheme } from '@/composables/useTheme'

export default function TorchToggle() {
  const { isDark, toggle } = useTheme()
  const label = isDark ? '切换到亮色模式' : '切换到暗色模式'

  return (
    <button aria-label={label} aria-pressed={!isDark} className="torch-float" title={label} type="button" onClick={toggle}>
      <span className="container">
        <input aria-hidden="true" tabIndex={-1} type="checkbox" checked={!isDark} readOnly />
        <span className="torch">
          <span className="head">
            <span className="face top"><span /><span /><span /><span /></span>
            <span className="face left"><span /><span /><span /><span /></span>
            <span className="face right"><span /><span /><span /><span /></span>
          </span>
          <span className="stick">
            <span className="side side-left">
              {Array.from({ length: 16 }, (_, index) => <span key={index} />)}
            </span>
            <span className="side side-right">
              {Array.from({ length: 16 }, (_, index) => <span key={index} />)}
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}
