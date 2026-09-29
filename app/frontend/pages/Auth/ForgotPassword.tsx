import { Form } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import AuthCard from './AuthCard'

export default function ForgotPassword() {
  return (
    <AuthCard title="Forgot your password?">
      <Form action="/passwords" method="post">
        {({ processing }) => (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email_address">Email address</FieldLabel>
              <Input id="email_address" type="email" name="email_address" autoComplete="username" required autoFocus />
            </Field>
            <Button type="submit" disabled={processing}>Email reset instructions</Button>
          </FieldGroup>
        )}
      </Form>
    </AuthCard>
  )
}
