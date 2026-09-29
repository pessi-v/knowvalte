import { useId, useState } from 'react'
import type { CustomField } from '@puckeditor/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { csrfToken } from '@/lib/csrf'

export type Upload = {
  url: string
  filename: string
  byte_size: number
  content_type: string
}

async function upload(file: File): Promise<Upload> {
  const body = new FormData()
  body.append('file', file)
  const response = await fetch('/admin/uploads', {
    method: 'POST',
    body,
    headers: { 'X-CSRF-Token': csrfToken(), Accept: 'application/json' },
  })
  const json = await response.json()
  if (!response.ok) throw new Error(json.error ?? 'Upload failed.')
  return json
}

// A Puck field that uploads a file to Active Storage and stores its URL and metadata.
export function uploadField(label: string, accept: string): CustomField<Upload | null> {
  return {
    type: 'custom',
    label,
    render: function UploadInput({ value, onChange, readOnly }) {
      const inputId = useId()
      const [error, setError] = useState<string | null>(null)
      const [busy, setBusy] = useState(false)

      return (
        <div className="flex flex-col gap-2">
          <Label htmlFor={inputId}>{label}</Label>
          {value && (
            <div className="flex items-center gap-2 text-sm break-all">
              {value.content_type.startsWith('image/') && <img src={value.url} alt="" className="size-12 rounded object-cover" />}
              <span className="flex-1">{value.filename}</span>
              {!readOnly && <Button type="button" variant="outline" size="sm" onClick={() => onChange(null)}>Remove</Button>}
            </div>
          )}
          <Input
            id={inputId}
            type="file"
            accept={accept}
            disabled={readOnly || busy}
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) return
              setBusy(true)
              setError(null)
              try {
                onChange(await upload(file))
              } catch (e) {
                setError((e as Error).message)
              } finally {
                setBusy(false)
                event.target.value = ''
              }
            }}
          />
          {busy && <p className="text-sm text-muted-foreground">Uploading…</p>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
      )
    },
  }
}
