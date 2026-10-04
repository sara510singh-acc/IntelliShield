import { useState } from 'react'
import './App.css'

const initialForm = {
  email: '',
  password: '',
}

function Login({ onNavigate }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [riskInfo, setRiskInfo] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    setError('')
    setSuccessMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    if (!form.email.trim() || !form.password) {
      setError('Please enter both email and password.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          device_id: `browser-${Date.now()}`,
          user_agent: navigator.userAgent,
          ip_address: 'client-side-ip-unknown',
        }),
      })

      if (response.status === 401) {
        setError('Invalid email or password.')
        return
      }

      if (response.status === 403) {
        setError('High-risk login detected. Additional verification is required.')
        return
      }

      if (response.status === 422) {
        setError('Please check your login details and try again.')
        return
      }

      if (!response.ok) {
        setError('Login failed. Please try again.')
        return
      }

      const data = await response.json()

      setSuccessMessage('Login successful.')
      setRiskInfo({
        riskLevel: data.risk_level,
        riskScore: data.risk_score,
        requiresMfa: data.requires_mfa,
      })

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch {
      setError('Unable to reach IntelliShield. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="registration-page">
      <section className="registration-panel" aria-labelledby="login-title">
        <h1 id="login-title" style={{ marginBottom: '12px' }}>
          IntelliShield
        </h1>

        <p className="eyebrow" style={{ marginBottom: '8px' }}>
          SECURE ACCESS
        </p>

        <p className="intro-copy" style={{ marginBottom: '0' }}>
          Enter your organization credentials
        </p>

        <form className="registration-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Work email</label>
          <input
            autoComplete="email"
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="alex@company.com"
            disabled={isSubmitting}
          />

          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={isSubmitting}
          />

          <div className="login-options-row">
            <label className="remember-device" htmlFor="remember-device">
              <input
                id="remember-device"
                type="checkbox"
                checked={false}
                onChange={() => {}}
              />
              <span>Remember this device</span>
            </label>

            <button type="button" className="text-link-button">
              Forgot password?
            </button>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          {successMessage && (
            <div className="success-message" role="status">
              <strong>{successMessage}</strong>
              {riskInfo && (
                <span>
                  Risk level: {riskInfo.riskLevel} · Score: {riskInfo.riskScore} · MFA required:{' '}
                  {riskInfo.requiresMfa ? 'Yes' : 'No'}
                </span>
              )}
            </div>
          )}

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="privacy-note" style={{ marginTop: '22px', textAlign: 'center' }}>
          New to IntelliShield?{' '}
          <button type="button" className="text-link-button inline-link-button" onClick={() => onNavigate('register')}>
            Register now
          </button>
        </p>
      </section>

      <aside className="registration-aside" aria-label="Adaptive authentication summary">
        <div className="aside-content">
          <p className="eyebrow">SECURITY, IN CONTEXT</p>

          <h2>Risk-aware access without adding friction to trusted sessions.</h2>

          <p className="aside-intro">
            IntelliShield evaluates device trust, context, and behavioral signals
            before allowing a sign-in to proceed.
          </p>

          <div className="aside-callout">
            <div className="callout-row">
              <span className="signal-dot" aria-hidden="true" />
              <span>Session trusted</span>
            </div>
            <strong>Low risk</strong>
          </div>
        </div>
      </aside>
    </main>
  )
}

export default Login
