import { Form, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import AuthCard from './AuthCard'

export default function SignIn() {
  return (
    <AuthCard title="Sign in">
      <Form action="/session" method="post">
        {({ processing }) => (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email_address">Email address</FieldLabel>
              <Input id="email_address" type="email" name="email_address" autoComplete="username" required autoFocus />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" name="password" autoComplete="current-password" required maxLength={72} />
            </Field>
            <Button type="submit" disabled={processing}>Sign in</Button>
            <Link href="/passwords/new" className="text-sm text-muted-foreground underline hover:text-foreground">Forgot password?</Link>
          </FieldGroup>
        )}
      </Form>
    </AuthCard>
  )
}
