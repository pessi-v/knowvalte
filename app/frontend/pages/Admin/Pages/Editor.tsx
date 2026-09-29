import type { FormDataConvertible } from '@inertiajs/core'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { Puck, type Data } from '@puckeditor/core'
import '@puckeditor/core/puck.css'
import '@/styles/admin.css'
import config from '@/puck/config'
import type { AdminPage } from '@/types'

type Props = { page: AdminPage & { content: Data } }

export default function Editor({ page }: Props) {
  const { flash } = usePage()

  return (
    <>
      <Head title={`Editing ${page.title}`} />
      <Puck
        config={config}
        data={page.content}
        headerTitle={page.title}
        headerPath={page.path}
        onPublish={(data) => {
          // Sent as JSON; the cast only satisfies Inertia's form data typing.
          const content = data as unknown as FormDataConvertible
          router.patch(`/admin/pages/${page.id}/publish`, { content }, { preserveScroll: true, preserveState: true })
        }}
        overrides={{
          headerActions: ({ children }) => (
            <>
              {flash.notice && <span className="editor-flash" role="status">{flash.notice}</span>}
              {flash.alert && <span className="editor-flash editor-flash--alert" role="alert">{flash.alert}</span>}
              <Link href="/admin/pages">Back to pages</Link>
              <a href={page.path} target="_blank" rel="noopener">View page</a>
              {children}
            </>
          ),
        }}
      />
    </>
  )
}
