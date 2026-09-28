export function IntroLoader({ hidden }: { hidden: boolean }) {
  return (
    <div className={`intro-loader ${hidden ? 'intro-loader--hidden' : ''}`} aria-hidden={hidden}>
      <div className="intro-loader__mark">
        <span>NOIR</span>
        <strong>07</strong>
      </div>
      <div className="intro-loader__rule">
        <span />
      </div>
      <p>EXTRAIT DE PARFUM</p>
    </div>
  )
}
