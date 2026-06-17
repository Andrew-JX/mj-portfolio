import { useTheme } from '@/composables/useTheme'

export default function TorchToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <div className="torch-float" title={isDark ? '切换到亮色模式' : '切换到暗色模式'}>
      <label className="container">
        <input type="checkbox" checked={!isDark} onChange={toggle} />
        <div className="torch">
          <div className="head">
            <div className="face top"><div /><div /><div /><div /></div>
            <div className="face left"><div /><div /><div /><div /></div>
            <div className="face right"><div /><div /><div /><div /></div>
          </div>
          <div className="stick">
            <div className="side side-left">
              {Array.from({ length: 16 }, (_, index) => <div key={index} />)}
            </div>
            <div className="side side-right">
              {Array.from({ length: 16 }, (_, index) => <div key={index} />)}
            </div>
          </div>
        </div>
      </label>
    </div>
  )
}
