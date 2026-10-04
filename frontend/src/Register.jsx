
import { useState } from 'react'
import './App.css'

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function Register({ onNavigate })  {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    setError('')
    setSubmitted(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError('Please complete all fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    if (form.password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      })

      if (response.status === 409) {
        setError('An account with this email already exists.')
        return
      }

      if (response.status === 422) {
        setError('Please check your details and try again.')
        return
      }

      if (!response.ok) {
        setError('Registration failed. Please try again.')
        return
      }

      let registeredUser
      try {
        registeredUser = await response.json()
      } catch {
        setError('Registration could not be confirmed. Please try again.')
        return
      }

      if (
        !registeredUser ||
        registeredUser.id == null ||
        typeof registeredUser.full_name !== 'string' ||
        typeof registeredUser.email !== 'string'
      ) {
        setError('Registration could not be confirmed. Please try again.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Could not connect to IntelliShield. Check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="registration-page">
      <section
        className="registration-panel"
        aria-labelledby="registration-title"
      >
        <div className="brand-mark" aria-hidden="true">
          IS
        </div>

        <p className="eyebrow">INTELLISHIELD</p>

        <h1 id="registration-title">Create your account</h1>

        <p className="intro-copy">
          Start protecting access with risk-adaptive authentication.
        </p>

        {submitted ? (
          <div className="success-message" role="status">
            <strong>Account created successfully.</strong>
            <span>Your IntelliShield account is ready.</span>
            <button
              className="submit-button"
              type="button"
              onClick={() => setSubmitted(false)}
            >
              Back to registration
              <span aria-hidden="true">←</span>
            </button>
          </div>
        ) : (
          <form
            className="registration-form"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isSubmitting}
          >
            <label htmlFor="fullName">Full name</label>
            <input
              autoComplete="name"
              id="fullName"
              name="fullName"
              onChange={handleChange}
              placeholder="Alex Morgan"
              value={form.fullName}
              aria-invalid={Boolean(error)}
              disabled={isSubmitting}
            />

            <label htmlFor="email">Work email</label>
            <input
              autoComplete="email"
              id="email"
              name="email"
              onChange={handleChange}
              placeholder="alex@company.com"
              type="email"
              value={form.email}
              aria-invalid={Boolean(error)}
              disabled={isSubmitting}
            />

            <div className="field-row">
              <div>
                <label htmlFor="password">Password</label>
                <input
                  autoComplete="new-password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  type="password"
                  value={form.password}
                  aria-invalid={Boolean(error)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  autoComplete="new-password"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Repeat password"
                  type="password"
                  value={form.confirmPassword}
                  aria-invalid={Boolean(error)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button className="submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        )}

        <p className="privacy-note">
          By creating an account, you agree to IntelliShield&apos;s terms and
          privacy policy.
        </p>

        <p className="privacy-note sign-in-prompt">
          Already have an account?{' '}
          <button type="button" className="text-link-button inline-link-button" onClick={() => onNavigate('login')}>
            Sign in
          </button>
        </p>
      </section>

      <aside
        className="registration-aside"
        aria-label="IntelliShield security information"
      >
        <div className="aside-content">
          <p className="eyebrow">SECURITY, IN CONTEXT</p>

          <h2>
            Authentication that adapts to the person behind the session.
          </h2>

          <p>
            IntelliShield combines device trust and behavioral signals to help
            keep access decisions proportional to risk.
          </p>

          <div className="signal-summary">
            <span className="signal-dot" aria-hidden="true" />
            <span>Risk-aware authentication</span>
          </div>
        </div>
      </aside>
    </main>
  )
}

export default Register