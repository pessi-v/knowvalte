import { Head, Link, router } from '@inertiajs/react'
import type { AdminPage } from '@/types'

const MENU_LABELS = { none: '—', main: 'Main', footer: 'Footer' }

export default function Index({ pages }: { pages: AdminPage[] }) {
  return (
    <>
      <Head title="Pages" />
      <div className="admin-toolbar">
        <h1>Pages</h1>
        <Link href="/admin/pages/new" className="button">New page</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">URL</th>
            <th scope="col">Menu</th>
            <th scope="col">Status</th>
            <th scope="col"><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id}>
              <td><Link href={`/admin/pages/${page.id}/editor`}>{page.title}</Link></td>
              <td><a href={page.path} target="_blank" rel="noopener">{page.path}</a></td>
              <td>{MENU_LABELS[page.menu]}{page.menu !== 'none' && ` (${page.position})`}</td>
              <td>{page.published ? 'Published' : 'Draft'}</td>
              <td className="admin-table__actions">
                <Link href={`/admin/pages/${page.id}/editor`}>Edit content</Link>
                <Link href={`/admin/pages/${page.id}/edit`}>Settings</Link>
                {page.path !== '/' && (
                  <button
                    type="button"
                    className="link-button danger"
                    onClick={() => {
                      if (window.confirm(`Delete "${page.title}"?`)) router.delete(`/admin/pages/${page.id}`)
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
