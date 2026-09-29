import type { Config, Slot } from '@puckeditor/core'
import type { CSSProperties, ReactNode } from 'react'
import { FileText } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card as UiCard, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { uploadField, type Upload } from './UploadField'

// Components editors can place on pages. Rendering is shared by the editor
// preview and the public site (<Render />), so what editors see is what visitors get.
//
// Accessibility: each page has exactly one <h1> (Hero or PageHeader, or the page
// title as a fallback, see Pages/Show.tsx); images require alt text unless marked
// decorative; downloads show their type and size.

const IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
const DOCUMENT_TYPES = '.pdf,.docx,.pptx,.xlsx,.odt,.csv'

type ImageProps = { image: Upload | null; alt: string; decorative: boolean }

const imageFields = {
  image: uploadField('Image', IMAGE_TYPES),
  alt: { type: 'textarea', label: 'Alt text (describe the image for screen reader users)' },
  decorative: {
    type: 'radio',
    label: 'Decorative image (no alt text needed)',
    options: [{ label: 'No', value: false }, { label: 'Yes', value: true }],
  },
} as const

function Img({ image, alt, decorative, className }: ImageProps & { className?: string }) {
  if (!image) return null
  return <img className={className} src={image.url} alt={decorative ? '' : alt} loading="lazy" />
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function fileType(upload: Upload) {
  return upload.filename.split('.').pop()?.toUpperCase() ?? 'File'
}

type Props = {
  Hero: { title: string; text: string; linkLabel: string; linkUrl: string } & ImageProps
  PageHeader: { title: string; intro: string }
  Heading: { text: string; level: 'h2' | 'h3' | 'h4' }
  RichText: { text: ReactNode }
  Image: ImageProps & { caption: string }
  Button: { label: string; url: string; variant: 'primary' | 'secondary' }
  Grid: { columns: number; gap: Gap; items: Slot }
  Flex: {
    direction: 'row' | 'column'
    justify: 'start' | 'center' | 'end' | 'space-between'
    align: 'stretch' | 'start' | 'center' | 'end'
    itemWidth: 'auto' | 'equal'
    wrap: boolean
    gap: Gap
    items: Slot
  }
  Card: { title: string; text: string; linkLabel: string; linkUrl: string } & ImageProps
  Download: { file: Upload | null; label: string; description: string }
  Video: { url: string; title: string }
  Section: { background: 'none' | 'muted' | 'brand'; content: Slot }
}

type Gap = 'none' | 'small' | 'medium' | 'large'

const gapField = {
  type: 'select',
  label: 'Spacing between items',
  options: [
    { label: 'None', value: 'none' },
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ],
} as const

// Full class names so Tailwind can find them.
const GAP_CLASSES: Record<Gap, string> = { none: 'gap-0', small: 'gap-3', medium: 'gap-6', large: 'gap-12' }
const JUSTIFY_CLASSES = { start: 'justify-start', center: 'justify-center', end: 'justify-end', 'space-between': 'justify-between' }
const ALIGN_CLASSES = { stretch: 'items-stretch', start: 'items-start', center: 'items-center', end: 'items-end' }

// shadcn's buttons are sized for app screens; public-site buttons are larger.
const SITE_BUTTON = 'h-11 px-5 text-base'

const HEADING_CLASSES = {
  h2: 'mt-10 mb-3 text-3xl font-semibold tracking-tight',
  h3: 'mt-8 mb-2 text-2xl font-semibold',
  h4: 'mt-6 mb-2 text-xl font-semibold',
}
const SECTION_CLASSES = {
  none: '',
  muted: 'bg-muted',
  brand: 'bg-primary text-primary-foreground [&_.prose]:prose-invert',
}

function Placeholder({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">{children}</p>
}

// Blocks that belong at page level, not inside a layout block.
const PAGE_LEVEL = ['Hero', 'PageHeader', 'Section']

function youtubeEmbedUrl(url: string) {
  const id = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1]
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

export const config: Config<Props> = {
  // Page title, URL and description live in the page settings, not in Puck.
  root: { fields: {}, render: ({ children }) => <div className="page-content">{children}</div> },
  categories: {
    layout: { title: 'Layout', components: ['Section', 'Grid', 'Flex'] },
    text: { title: 'Text', components: ['PageHeader', 'Hero', 'Heading', 'RichText', 'Button'] },
    media: { title: 'Media & files', components: ['Image', 'Video', 'Download', 'Card'] },
  },
  components: {
    Hero: {
      label: 'Hero (page title with image)',
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        text: { type: 'textarea', label: 'Text', contentEditable: true },
        linkLabel: { type: 'text', label: 'Button label' },
        linkUrl: { type: 'text', label: 'Button link' },
        ...imageFields,
      },
      defaultProps: { title: 'Page title', text: '', linkLabel: '', linkUrl: '', image: null, alt: '', decorative: false },
      render: ({ title, text, linkLabel, linkUrl, ...image }) => (
        <header className={cn('grid items-center gap-8 py-12', image.image && 'md:grid-cols-2')}>
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
            {text && <p className="text-xl text-muted-foreground">{text}</p>}
            {linkLabel && linkUrl && <a className={cn(buttonVariants(), SITE_BUTTON)} href={linkUrl}>{linkLabel}</a>}
          </div>
          <Img className="rounded-xl" {...image} />
        </header>
      ),
    },
    PageHeader: {
      label: 'Page header (title and intro)',
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        intro: { type: 'textarea', label: 'Intro', contentEditable: true },
      },
      defaultProps: { title: 'Page title', intro: '' },
      render: ({ title, intro }) => (
        <header className="flex flex-col gap-3 pt-8 pb-4">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          {intro && <p className="max-w-3xl text-xl text-muted-foreground">{intro}</p>}
        </header>
      ),
    },
    Heading: {
      fields: {
        text: { type: 'text', label: 'Text', contentEditable: true },
        level: {
          type: 'select',
          label: 'Level',
          options: [
            { label: 'Heading 2', value: 'h2' },
            { label: 'Heading 3', value: 'h3' },
            { label: 'Heading 4', value: 'h4' },
          ],
        },
      },
      defaultProps: { text: 'Heading', level: 'h2' },
      render: ({ text, level: Tag }) => <Tag className={HEADING_CLASSES[Tag]}>{text}</Tag>,
    },
    RichText: {
      label: 'Text',
      fields: { text: { type: 'richtext', label: 'Text', contentEditable: true } },
      defaultProps: { text: '<p>Write something…</p>' },
      render: ({ text }) => (
        <div className="my-4">
          <div className="prose max-w-prose prose-neutral">{text}</div>
        </div>
      ),
    },
    Image: {
      fields: { ...imageFields, caption: { type: 'text', label: 'Caption' } },
      defaultProps: { image: null, alt: '', decorative: false, caption: '' },
      render: ({ caption, ...image }) =>
        image.image ? (
          <figure className="my-8">
            <Img className="rounded-lg" {...image} />
            {caption && <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption>}
          </figure>
        ) : (
          <Placeholder>Choose an image</Placeholder>
        ),
    },
    Button: {
      fields: {
        label: { type: 'text', label: 'Label' },
        url: { type: 'text', label: 'Link' },
        variant: {
          type: 'radio',
          label: 'Style',
          options: [{ label: 'Primary', value: 'primary' }, { label: 'Secondary', value: 'secondary' }],
        },
      },
      defaultProps: { label: 'Read more', url: '/', variant: 'primary' },
      render: ({ label, url, variant }) => (
        <div className="my-4"><a className={cn(buttonVariants({ variant: variant === 'primary' ? 'default' : 'outline' }), SITE_BUTTON)} href={url}>{label}</a></div>
      ),
    },
    // Equal columns that collapse to fewer columns on narrow screens.
    Grid: {
      label: 'Grid',
      fields: {
        columns: {
          type: 'select',
          label: 'Columns (on wide screens)',
          options: [1, 2, 3, 4, 5, 6].map((n) => ({ label: n === 1 ? '1 column' : `${n} columns`, value: n })),
        },
        gap: gapField,
        items: { type: 'slot', label: 'Items', disallow: PAGE_LEVEL },
      },
      defaultProps: { columns: 3, gap: 'medium', items: [] },
      render: ({ columns, gap = 'medium', items: Items }) => (
        <Items
          className={cn('my-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--col-min)),1fr))]', GAP_CLASSES[gap])}
          style={{ '--col-min': `calc(72rem / ${columns} - 3rem)` } as CSSProperties}
        />
      ),
    },
    // Items in a row or column, for things like button groups or logos.
    Flex: {
      label: 'Flex',
      fields: {
        direction: {
          type: 'radio',
          label: 'Direction',
          options: [{ label: 'Row', value: 'row' }, { label: 'Column', value: 'column' }],
        },
        justify: {
          type: 'select',
          label: 'Justify (along the direction)',
          options: [
            { label: 'Start', value: 'start' },
            { label: 'Center', value: 'center' },
            { label: 'End', value: 'end' },
            { label: 'Space between', value: 'space-between' },
          ],
        },
        align: {
          type: 'select',
          label: 'Align (across the direction)',
          options: [
            { label: 'Stretch', value: 'stretch' },
            { label: 'Start', value: 'start' },
            { label: 'Center', value: 'center' },
            { label: 'End', value: 'end' },
          ],
        },
        itemWidth: {
          type: 'radio',
          label: 'Item width',
          options: [{ label: 'Fit content', value: 'auto' }, { label: 'Equal', value: 'equal' }],
        },
        wrap: {
          type: 'radio',
          label: 'Wrap onto new lines',
          options: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
        },
        gap: gapField,
        items: { type: 'slot', label: 'Items', disallow: PAGE_LEVEL },
      },
      defaultProps: {
        direction: 'row', justify: 'start', align: 'stretch', itemWidth: 'auto', wrap: true, gap: 'medium', items: [],
      },
      render: ({ direction, justify, align, itemWidth, wrap, gap, items: Items }) => (
        <Items
          className={cn(
            'my-8 flex',
            direction === 'column' ? 'flex-col' : 'flex-row',
            wrap && 'flex-wrap',
            itemWidth === 'equal' && direction === 'row' && '*:min-w-[min(100%,12rem)] *:flex-1',
            JUSTIFY_CLASSES[justify], ALIGN_CLASSES[align], GAP_CLASSES[gap],
          )}
        />
      ),
    },
    Card: {
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        text: { type: 'textarea', label: 'Text', contentEditable: true },
        linkLabel: { type: 'text', label: 'Link label' },
        linkUrl: { type: 'text', label: 'Link' },
        ...imageFields,
      },
      defaultProps: { title: 'Card title', text: '', linkLabel: '', linkUrl: '', image: null, alt: '', decorative: true },
      render: ({ title, text, linkLabel, linkUrl, ...image }) => (
        <UiCard className="h-full">
          <Img {...image} />
          <CardHeader>
            <CardTitle><h3 className="text-lg font-semibold">{title}</h3></CardTitle>
            {text && <CardDescription className="text-base">{text}</CardDescription>}
          </CardHeader>
          {linkUrl && (
            <CardContent className="mt-auto">
              <a href={linkUrl} className="font-medium underline">{linkLabel || 'Read more'}<span className="sr-only">: {title}</span></a>
            </CardContent>
          )}
        </UiCard>
      ),
    },
    Download: {
      label: 'Download (document)',
      fields: {
        file: uploadField('File', DOCUMENT_TYPES),
        label: { type: 'text', label: 'Link text' },
        description: { type: 'textarea', label: 'Description' },
      },
      defaultProps: { file: null, label: '', description: '' },
      render: ({ file, label, description }) =>
        file ? (
          <div className="my-4 flex gap-3">
            <FileText aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground" />
            <div>
              <a href={file.url} download className="font-semibold underline">
                {label || file.filename}
                <span className="font-normal text-muted-foreground"> ({fileType(file)}, {formatSize(file.byte_size)})</span>
              </a>
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          </div>
        ) : (
          <Placeholder>Choose a file</Placeholder>
        ),
    },
    Video: {
      label: 'YouTube video',
      fields: {
        url: { type: 'text', label: 'YouTube URL' },
        title: { type: 'text', label: 'Video title (for screen readers)' },
      },
      defaultProps: { url: '', title: '' },
      render: ({ url, title }) => {
        const src = youtubeEmbedUrl(url)
        return src ? (
          <div className="my-8 aspect-video">
            <iframe src={src} title={title || 'YouTube video'} loading="lazy" allowFullScreen className="size-full rounded-lg"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" />
          </div>
        ) : (
          <Placeholder>Paste a YouTube URL</Placeholder>
        )
      },
    },
    Section: {
      fields: {
        background: {
          type: 'select',
          label: 'Background',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Muted', value: 'muted' },
            { label: 'Dark', value: 'brand' },
          ],
        },
        content: { type: 'slot', label: 'Content', disallow: PAGE_LEVEL },
      },
      defaultProps: { background: 'none', content: [] },
      render: ({ background, content: Content }) => (
        <section data-full-bleed className={cn('py-12', SECTION_CLASSES[background])}>
          <Content className="page-container" />
        </section>
      ),
    },
  },
}

export default config
