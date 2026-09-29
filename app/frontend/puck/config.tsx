import type { Config, Slot } from '@puckeditor/core'
import type { ReactNode } from 'react'
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

// Blocks that belong at page level, not inside a layout block.
const PAGE_LEVEL = ['Hero', 'PageHeader', 'Section']

function youtubeEmbedUrl(url: string) {
  const id = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1]
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

export const config: Config<Props> = {
  // Page title, URL and description live in the page settings, not in Puck.
  root: { fields: {}, render: ({ children }) => <>{children}</> },
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
        <header className="hero">
          <div className="hero__body">
            <h1>{title}</h1>
            {text && <p className="hero__text">{text}</p>}
            {linkLabel && linkUrl && <a className="button" href={linkUrl}>{linkLabel}</a>}
          </div>
          <Img className="hero__image" {...image} />
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
        <header className="page-header">
          <h1>{title}</h1>
          {intro && <p className="lead">{intro}</p>}
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
      render: ({ text, level: Tag }) => <Tag>{text}</Tag>,
    },
    RichText: {
      label: 'Text',
      fields: { text: { type: 'richtext', label: 'Text', contentEditable: true } },
      defaultProps: { text: '<p>Write something…</p>' },
      render: ({ text }) => <div className="prose">{text}</div>,
    },
    Image: {
      fields: { ...imageFields, caption: { type: 'text', label: 'Caption' } },
      defaultProps: { image: null, alt: '', decorative: false, caption: '' },
      render: ({ caption, ...image }) =>
        image.image ? (
          <figure className="figure">
            <Img {...image} />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        ) : (
          <p className="placeholder">Choose an image</p>
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
        <p><a className={`button button--${variant}`} href={url}>{label}</a></p>
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
        <Items className={`grid gap--${gap}`} style={{ '--columns': columns } as React.CSSProperties} />
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
          className={`flex flex--${direction} gap--${gap}${itemWidth === 'equal' ? ' flex--equal' : ''}${wrap ? ' flex--wrap' : ''}`}
          style={{ justifyContent: justify, alignItems: align }}
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
        <article className="card">
          <Img className="card__image" {...image} />
          <h3>{title}</h3>
          {text && <p>{text}</p>}
          {linkUrl && <a href={linkUrl}>{linkLabel || 'Read more'}<span className="visually-hidden">: {title}</span></a>}
        </article>
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
          <div className="download">
            <a href={file.url} download>
              {label || file.filename}
              <span className="download__meta"> ({fileType(file)}, {formatSize(file.byte_size)})</span>
            </a>
            {description && <p>{description}</p>}
          </div>
        ) : (
          <p className="placeholder">Choose a file</p>
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
          <div className="video">
            <iframe src={src} title={title || 'YouTube video'} loading="lazy" allowFullScreen
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" />
          </div>
        ) : (
          <p className="placeholder">Paste a YouTube URL</p>
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
            { label: 'Brand colour', value: 'brand' },
          ],
        },
        content: { type: 'slot', label: 'Content', disallow: PAGE_LEVEL },
      },
      defaultProps: { background: 'none', content: [] },
      render: ({ background, content: Content }) => (
        <section className={`section section--${background}`}>
          <Content className="section__inner" />
        </section>
      ),
    },
  },
}

export default config
