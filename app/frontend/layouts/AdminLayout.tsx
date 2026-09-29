import { Link, router, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import Flash from './Flash'
import SkipLink from './SkipLink'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { auth } = usePage().props

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-muted/40">
        <SkipLink />
        <header className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b bg-background px-6 py-3">
          <Link href="/admin" className="font-semibold">KnowValTE admin</Link>
          <nav aria-label="Admin">
            <ul className="flex gap-5 text-sm text-muted-foreground [&_a:hover]:text-foreground">
              <li><Link href="/admin/pages">Pages</Link></li>
              <li><a href="/" target="_blank" rel="noopener">View site</a></li>
            </ul>
          </nav>
          {auth.user && (
            <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
              <span>{auth.user.email_address}</span>
              <Button variant="outline" size="sm" onClick={() => router.delete('/session')}>Sign out</Button>
            </div>
          )}
        </header>
        <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-6 pb-12 focus:outline-none">
          <Flash />
          {children}
        </main>
      </div>
    </TooltipProvider>
  )
}
