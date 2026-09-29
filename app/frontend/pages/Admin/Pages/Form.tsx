import { Form, Head, Link } from '@inertiajs/react'
import type { AdminPage } from '@/types'

function FieldError({ errors, name }: { errors: Record<string, string | string[]>; name: string }) {
  const error = errors[name]
  if (!error) return null
  return <p className="field-error" id={`${name}-error`}>{Array.isArray(error) ? error.join(', ') : error}</p>
}

export default function PageForm({ page }: { page: AdminPage }) {
  const isNew = page.id === null
  const title = isNew ? 'New page' : `Settings: ${page.title}`

  return (
    <>
      <Head title={title} />
      <h1>{title}</h1>
      <Form
        action={isNew ? '/admin/pages' : `/admin/pages/${page.id}`}
        method={isNew ? 'post' : 'patch'}
        className="admin-form"
      >
        {({ errors, processing }) => (
          <>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input id="title" name="page[title]" defaultValue={page.title ?? ''} required
                aria-describedby={errors.title ? 'title-error' : undefined} />
              <FieldError errors={errors} name="title" />
            </div>
            <div className="field">
              <label htmlFor="slug">URL</label>
              <div className="input-prefix">
                <span aria-hidden="true">/</span>
                <input id="slug" name="page[slug]" defaultValue={page.slug ?? ''} required
                  aria-describedby={`slug-hint${errors.slug ? ' slug-error' : ''}`} />
              </div>
              <p className="hint" id="slug-hint">Lowercase letters, numbers and dashes. The home page is “home”.</p>
              <FieldError errors={errors} name="slug" />
            </div>
            <div className="field">
              <label htmlFor="meta_description">Description for search engines and link previews</label>
              <textarea id="meta_description" name="page[meta_description]" rows={2}
                defaultValue={page.meta_description ?? ''} />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="menu">Show in</label>
                <select id="menu" name="page[menu]" defaultValue={page.menu}>
                  <option value="none">No menu</option>
                  <option value="main">Main navigation</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="position">Menu position</label>
                <input id="position" name="page[position]" type="number" defaultValue={page.position} />
              </div>
            </div>
            <div className="field field--checkbox">
              <input type="hidden" name="page[published]" value="0" />
              <input id="published" type="checkbox" name="page[published]" value="1" defaultChecked={page.published} />
              <label htmlFor="published">Published (visible to everyone)</label>
            </div>
            <div className="actions">
              <button type="submit" className="button" disabled={processing}>
                {isNew ? 'Create and edit content' : 'Save settings'}
              </button>
              <Link href="/admin/pages">Cancel</Link>
            </div>
          </>
        )}
      </Form>
    </>
  )
}
