import { usePage } from '@inertiajs/react'

export default function Flash() {
  const { flash } = usePage()
  return (
    <div aria-live="polite">
      {flash.notice && <p className="flash flash--notice">{flash.notice}</p>}
      {flash.alert && <p className="flash flash--alert" role="alert">{flash.alert}</p>}
    </div>
  )
}
