import { Form, Head, Link } from '@inertiajs/react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { AdminPage } from '@/types'

const MENU_OPTIONS = [
  { value: 'none', label: 'No menu' },
  { value: 'main', label: 'Main navigation' },
  { value: 'footer', label: 'Footer' },
]

function errorsFor(errors: Record<string, string | string[]>, name: string) {
  const error = errors[name]
  if (!error) return undefined
  return (Array.isArray(error) ? error : [error]).map((message) => ({ message }))
}

export default function PageForm({ page }: { page: AdminPage }) {
  const isNew = page.id === null
  const title = isNew ? 'New page' : `Settings: ${page.title}`

  return (
    <>
      <Head title={title} />
      <h1 className="py-6 text-2xl font-semibold">{title}</h1>
      <Card className="max-w-2xl">
        <CardContent>
          <Form action={isNew ? '/admin/pages' : `/admin/pages/${page.id}`} method={isNew ? 'post' : 'patch'}>
            {({ errors, processing }) => (
              <FieldGroup>
                <Field data-invalid={!!errors.title || undefined}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input id="title" name="page[title]" defaultValue={page.title ?? ''} required
                    aria-invalid={!!errors.title || undefined} />
                  <FieldError errors={errorsFor(errors, 'title')} />
                </Field>
                <Field data-invalid={!!errors.slug || undefined}>
                  <FieldLabel htmlFor="slug">URL</FieldLabel>
                  <div className="flex items-center gap-1">
                    <span aria-hidden="true" className="text-muted-foreground">/</span>
                    <Input id="slug" name="page[slug]" defaultValue={page.slug ?? ''} required
                      aria-describedby="slug-hint" aria-invalid={!!errors.slug || undefined} />
                  </div>
                  <FieldDescription id="slug-hint">Lowercase letters, numbers and dashes. The home page is “home”.</FieldDescription>
                  <FieldError errors={errorsFor(errors, 'slug')} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="meta_description">Description for search engines and link previews</FieldLabel>
                  <Textarea id="meta_description" name="page[meta_description]" rows={2}
                    defaultValue={page.meta_description ?? ''} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="menu">Show in</FieldLabel>
                    <Select name="page[menu]" defaultValue={page.menu} items={MENU_OPTIONS}>
                      <SelectTrigger id="menu" className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MENU_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="position">Menu position</FieldLabel>
                    <Input id="position" name="page[position]" type="number" defaultValue={page.position} />
                  </Field>
                </div>
                <Field orientation="horizontal">
                  <input type="hidden" name="page[published]" value="0" />
                  <Checkbox id="published" name="page[published]" value="1" defaultChecked={page.published} />
                  <FieldLabel htmlFor="published">Published (visible to everyone)</FieldLabel>
                </Field>
                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={processing}>
                    {isNew ? 'Create and edit content' : 'Save settings'}
                  </Button>
                  <Link href="/admin/pages" className={buttonVariants({ variant: 'ghost' })}>Cancel</Link>
                </div>
              </FieldGroup>
            )}
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
