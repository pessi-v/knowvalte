import { Head } from '@inertiajs/react'
import { Render, type Data } from '@puckeditor/core'
import { Alert, AlertTitle } from '@/components/ui/alert'
import config from '@/puck/config'

type Props = {
  page: {
    title: string
    meta_description: string | null
    published: boolean
    path: string
    content: Data
  }
}

const TITLE_COMPONENTS = ['Hero', 'PageHeader']

export default function Show({ page }: Props) {
  const hasTitle = TITLE_COMPONENTS.includes(page.content.content?.[0]?.type)

  return (
    <>
      <Head title={page.path === '/' ? '' : page.title}>
        {page.meta_description && <meta name="description" content={page.meta_description} />}
      </Head>
      {!page.published && (
        <div className="page-container pt-4">
          <Alert><AlertTitle>Draft: only signed-in editors can see this page.</AlertTitle></Alert>
        </div>
      )}
      {!hasTitle && <h1 className="page-container pt-8 pb-4 text-4xl font-bold tracking-tight">{page.title}</h1>}
      <Render config={config} data={page.content} />
    </>
  )
}
