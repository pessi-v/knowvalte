import { Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import Flash from './Flash'

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { props: { site, auth }, url } = usePage()
  const currentPath = url.split('?')[0]

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="site-logo">{site.name}</Link>
          <nav aria-label="Main">
            <ul className="site-nav">
              {site.navigation.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} aria-current={currentPath === link.path ? 'page' : undefined}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <div className="container"><Flash /></div>
        {children}
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <nav aria-label="Footer">
            <ul>
              {site.footer.map((link) => (
                <li key={link.path}><Link href={link.path}>{link.title}</Link></li>
              ))}
              {auth.user ? <li><Link href="/admin">Admin</Link></li> : null}
            </ul>
          </nav>
          <ul className="social" aria-label="Follow us">
            {site.social.map((s) => (
              <li key={s.name}><a href={s.url} rel="me noopener">{s.name}</a></li>
            ))}
          </ul>
          <p className="funding">
            {/* TODO: official EU emblem and the exact funding statement required by the grant agreement. */}
            Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not
            necessarily reflect those of the European Union or the granting authority. Neither the European Union nor
            the granting authority can be held responsible for them.
          </p>
        </div>
      </footer>
    </>
  )
}
