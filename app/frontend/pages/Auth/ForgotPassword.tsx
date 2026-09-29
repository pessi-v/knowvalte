import { Form, Head } from '@inertiajs/react'

export default function ForgotPassword() {
  return (
    <div className="container narrow">
      <Head title="Forgot your password?" />
      <h1>Forgot your password?</h1>
      <Form action="/passwords" method="post" className="stack">
        {({ processing }) => (
          <>
            <div className="field">
              <label htmlFor="email_address">Email address</label>
              <input id="email_address" type="email" name="email_address" autoComplete="username" required autoFocus />
            </div>
            <button type="submit" className="button" disabled={processing}>Email reset instructions</button>
          </>
        )}
      </Form>
    </div>
  )
}
