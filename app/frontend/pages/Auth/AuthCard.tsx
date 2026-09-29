import { Head } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="page-container flex justify-center py-12">
      <Head title={title} />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-xl font-semibold">{title}</h1>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
