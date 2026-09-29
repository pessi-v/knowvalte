import { usePage } from '@inertiajs/react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'

export default function Flash() {
  const { flash } = usePage()
  return (
    <div aria-live="polite" className="empty:hidden flex flex-col gap-2 py-4">
      {flash.notice && (
        <Alert>
          <CircleCheck aria-hidden="true" />
          <AlertTitle>{flash.notice}</AlertTitle>
        </Alert>
      )}
      {flash.alert && (
        <Alert variant="destructive" role="alert">
          <CircleAlert aria-hidden="true" />
          <AlertTitle>{flash.alert}</AlertTitle>
        </Alert>
      )}
    </div>
  )
}
