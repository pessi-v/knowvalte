import { Form, Head } from '@inertiajs/react'

export default function ResetPassword({ token }: { token: string }) {
  return (
    <div className="container narrow">
      <Head title="Choose a new password" />
      <h1>Choose a new password</h1>
      <Form action={`/passwords/${token}`} method="put" className="stack">
        {({ processing }) => (
          <>
            <div className="field">
              <label htmlFor="password">New password</label>
              <input id="password" type="password" name="password" autoComplete="new-password" required maxLength={72} />
            </div>
            <div className="field">
              <label htmlFor="password_confirmation">Repeat new password</label>
              <input id="password_confirmation" type="password" name="password_confirmation" autoComplete="new-password" required maxLength={72} />
            </div>
            <button type="submit" className="button" disabled={processing}>Save</button>
          </>
        )}
      </Form>
    </div>
  )
}
