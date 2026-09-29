import { Form, Head, Link } from '@inertiajs/react'

export default function SignIn() {
  return (
    <div className="container narrow">
      <Head title="Sign in" />
      <h1>Sign in</h1>
      <Form action="/session" method="post" className="stack">
        {({ processing }) => (
          <>
            <div className="field">
              <label htmlFor="email_address">Email address</label>
              <input id="email_address" type="email" name="email_address" autoComplete="username" required autoFocus />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" name="password" autoComplete="current-password" required maxLength={72} />
            </div>
            <button type="submit" className="button" disabled={processing}>Sign in</button>
          </>
        )}
      </Form>
      <p><Link href="/passwords/new">Forgot password?</Link></p>
    </div>
  )
}
