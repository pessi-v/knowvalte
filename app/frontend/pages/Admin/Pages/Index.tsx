import { Head, Link, router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { AdminPage } from '@/types'

const MENU_LABELS = { none: '—', main: 'Main', footer: 'Footer' }

function DeleteButton({ page }: { page: AdminPage }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" className="text-destructive" />}>
        Delete<span className="sr-only"> {page.title}</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{page.title}”?</AlertDialogTitle>
          <AlertDialogDescription>The page and its content are removed. This can't be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => router.delete(`/admin/pages/${page.id}`)}>
            Delete page
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Index({ pages }: { pages: AdminPage[] }) {
  return (
    <>
      <Head title="Pages" />
      <div className="flex items-center justify-between py-6">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <Link href="/admin/pages/new" className={buttonVariants()}><Plus aria-hidden="true" />New page</Link>
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Menu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/pages/${page.id}/editor`} className="hover:underline">{page.title}</Link>
                </TableCell>
                <TableCell><a href={page.path} target="_blank" rel="noopener" className="text-muted-foreground hover:underline">{page.path}</a></TableCell>
                <TableCell>{MENU_LABELS[page.menu]}{page.menu !== 'none' && ` (${page.position})`}</TableCell>
                <TableCell>
                  <Badge variant={page.published ? 'default' : 'secondary'}>{page.published ? 'Published' : 'Draft'}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/pages/${page.id}/editor`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                      Edit content<span className="sr-only"> of {page.title}</span>
                    </Link>
                    <Link href={`/admin/pages/${page.id}/edit`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                      Settings<span className="sr-only"> for {page.title}</span>
                    </Link>
                    {page.path !== '/' && <DeleteButton page={page} />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
