import { Head } from '@inertiajs/react'
import { Render, type Data } from '@puckeditor/core'
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
      {!page.published && <p className="container draft-notice">Draft: only signed-in editors can see this page.</p>}
      <div className="page-content">
        {!hasTitle && <h1 className="container">{page.title}</h1>}
        <Render config={config} data={page.content} />
      </div>
    </>
  )
}
