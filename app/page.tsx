'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: { email?: string; password?: string } = {}
    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@gmail\.com$/i.test(normalizedEmail)) {
      nextErrors.email = 'Please use a valid @gmail.com address.'
    }

    if (!password) {
      nextErrors.password = 'Please enter your password.'
    } else if (password.length < 8) {
      nextErrors.password = 'Your password must be at least 8 characters.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      window.localStorage.setItem('catalino-notes-email', normalizedEmail)
      router.push('/notes')
    }
  }

  return (
    <main className="login-page">
      <section className="login-shell" aria-label="Sign in to Catalino Notes">
        <div className="welcome-panel">
          <Link className="brand brand-light" href="/" aria-label="Catalino Notes home">
            <span className="brand-mark" aria-hidden="true">c.</span>
            <span>catalino<span className="brand-muted">notes</span></span>
          </Link>

          <div className="welcome-copy">
            <span className="eyebrow eyebrow-light">A little room to think</span>
            <h1>Make space<br />for your <em>next idea.</em></h1>
            <p>Your thoughts, plans, and little sparks of inspiration — all in one calm place.</p>
          </div>

          <div className="note-illustration" aria-hidden="true">
            <div className="float-dot dot-one" />
            <div className="float-dot dot-two" />
            <div className="illustration-note">
              <div className="illustration-note-top"><span /><span /><span /></div>
              <div className="illustration-label">A thought for today</div>
              <div className="illustration-line line-long" />
              <div className="illustration-line line-medium" />
              <div className="illustration-highlight"><span>✳</span> Start where you are.</div>
            </div>
            <div className="illustration-spark">✳</div>
          </div>

          <div className="welcome-footer">
            <span>✦</span> A softer place for your thoughts.
          </div>
        </div>

        <div className="form-panel">
          <div className="form-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Let’s get you<br />back to your notes.</h2>
            <p>Sign in with your Gmail to continue.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <div className={`input-wrap${errors.email ? ' input-error' : ''}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4.5 7 7.5 5.5L19.5 7" /></svg>
                <input
                  autoComplete="email"
                  id="email"
                  name="email"
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (errors.email) setErrors((current) => ({ ...current, email: undefined }))
                  }}
                  placeholder="you@gmail.com"
                  type="email"
                  value={email}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
            </div>

            <div className="field-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <span className="field-hint">8+ characters</span>
              </div>
              <div className={`input-wrap${errors.password ? ' input-error' : ''}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v2" /></svg>
                <input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (errors.password) setErrors((current) => ({ ...current, password: undefined }))
                  }}
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
              </div>
              {errors.password && <p className="field-error" id="password-error">{errors.password}</p>}
            </div>

            <button className="submit-button" type="submit">
              Open my notes <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="demo-note">This is a local demo — any Gmail address and an 8-character password will work.</p>
          <div className="form-bottom"><span>YOUR MIND, A LITTLE MORE ORGANIZED</span><span>✳</span></div>
        </div>
      </section>
    </main>
  )
}
