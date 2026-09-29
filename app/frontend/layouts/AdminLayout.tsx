import { Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import Flash from './Flash'
import '@/styles/admin.css'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { auth } = usePage().props

  return (
    <div className="admin">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="admin-header">
        <Link href="/admin" className="admin-header__title">KnowValTE admin</Link>
        <nav aria-label="Admin">
          <ul>
            <li><Link href="/admin/pages">Pages</Link></li>
            <li><a href="/" target="_blank" rel="noopener">View site</a></li>
          </ul>
        </nav>
        {auth.user && (
          <div className="admin-header__user">
            <span>{auth.user.email_address}</span>
            <Link href="/session" method="delete" as="button">Sign out</Link>
          </div>
        )}
      </header>
      <main id="main" className="admin-main" tabIndex={-1}>
        <Flash />
        {children}
      </main>
    </div>
  )
}
