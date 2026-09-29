import { Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import Flash from './Flash'
import SkipLink from './SkipLink'

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { props: { site, auth }, url } = usePage()
  const currentPath = url.split('?')[0]

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <SkipLink />
        <header className="border-b">
          <div className="page-container flex flex-wrap items-center justify-between gap-4 py-3">
            <Link href="/" className="text-xl font-bold text-foreground no-underline">{site.name}</Link>
            <nav aria-label="Main">
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {site.navigation.map((link) => {
                  const current = currentPath === link.path
                  return (
                    <li key={link.path}>
                      <Link
                        href={link.path}
                        aria-current={current ? 'page' : undefined}
                        className={cn(
                          'border-b-2 border-transparent py-1 text-muted-foreground hover:text-foreground',
                          current && 'border-foreground text-foreground',
                        )}
                      >
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          <div className="page-container"><Flash /></div>
          {children}
        </main>

        <footer className="mt-16 border-t py-8 text-sm">
          <div className="page-container flex flex-col gap-4">
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {site.footer.map((link) => (
                  <li key={link.path}><Link href={link.path} className="underline">{link.title}</Link></li>
                ))}
                {auth.user ? <li><Link href="/admin" className="underline">Admin</Link></li> : null}
              </ul>
            </nav>
            <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Follow us">
              {site.social.map((s) => (
                <li key={s.name}><a href={s.url} rel="me noopener" className="underline">{s.name}</a></li>
              ))}
            </ul>
            <p className="max-w-3xl text-muted-foreground">
              {/* TODO: official EU emblem and the exact funding statement required by the grant agreement. */}
              Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not
              necessarily reflect those of the European Union or the granting authority. Neither the European Union nor
              the granting authority can be held responsible for them.
            </p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
