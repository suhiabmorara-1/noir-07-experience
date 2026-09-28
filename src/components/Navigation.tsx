const links = [
  { href: '#the-scent', label: 'THE SCENT' },
  { href: '#the-object', label: 'THE OBJECT' },
  { href: '#story', label: 'STORY' },
]

export function Navigation() {
  return (
    <header className="navigation">
      <a className="brand-mark" href="#top" aria-label="NOIR 07 — العودة إلى البداية">
        <span>NOIR</span>
        <b>07</b>
      </a>
      <nav aria-label="التنقل الرئيسي">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <span className="navigation__edition">PARIS · 2026</span>
    </header>
  )
}
