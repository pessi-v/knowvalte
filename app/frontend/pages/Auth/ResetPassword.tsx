import { Form } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import AuthCard from './AuthCard'

export default function ResetPassword({ token }: { token: string }) {
  return (
    <AuthCard title="Choose a new password">
      <Form action={`/passwords/${token}`} method="put">
        {({ processing }) => (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <Input id="password" type="password" name="password" autoComplete="new-password" required maxLength={72} />
            </Field>
            <Field>
              <FieldLabel htmlFor="password_confirmation">Repeat new password</FieldLabel>
              <Input id="password_confirmation" type="password" name="password_confirmation" autoComplete="new-password" required maxLength={72} />
            </Field>
            <Button type="submit" disabled={processing}>Save</Button>
          </FieldGroup>
        )}
      </Form>
    </AuthCard>
  )
}
