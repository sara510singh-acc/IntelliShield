import { useState } from 'react'
import './App.css'

const initialForm = {
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
}

const API_URL = 'http://localhost:8000/auth/register'

function Register() {
	const [form, setForm] = useState(initialForm)
	const [error, setError] = useState('')
	const [submitted, setSubmitted] = useState(false)

	function handleChange(event) {
		const { name, value } = event.target
		setForm((currentForm) => ({ ...currentForm, [name]: value }))
		setError('')
		setSubmitted(false)
	}

	async function handleSubmit(event) {
		event.preventDefault()

		if (!form.username.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
			setError('Please complete all fields.')
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

		try {
			const response = await fetch(API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: form.username.trim(),
					email: form.email.trim(),
					password: form.password,
				}),
			})

			const data = await response.json().catch(() => ({}))

			if (!response.ok) {
				throw new Error(data.detail || 'Registration failed.')
			}

			setError('')
			setSubmitted(true)
			setForm(initialForm)
		} catch (err) {
			setSubmitted(false)
			setError(err.message || 'Something went wrong while registering.')
		}
	}

	return (
		<main className="registration-page">
			<section className="registration-panel" aria-labelledby="registration-title">
				<div className="brand-mark" aria-hidden="true">IS</div>
				<p className="eyebrow">INTELLISHIELD</p>
				<h1 id="registration-title">Create your account</h1>
				<p className="intro-copy">Start protecting access with risk-adaptive authentication.</p>

				{submitted ? (
					<div className="success-message" role="status">
						<strong>Registration details received.</strong>
						<span>Your account has been created successfully.</span>
					</div>
				) : (
					<form className="registration-form" onSubmit={handleSubmit} noValidate>
						
						<label htmlFor="username">Username</label>
						<input id="username" name="username" onChange={handleChange} placeholder="Alex Johnson" type="text" value={form.username} />
						<label htmlFor="email">Work email</label>
						<input id="email" name="email" onChange={handleChange} placeholder="alex@company.com" type="email" value={form.email} />

						<div className="field-row">
							<div><label htmlFor="password">Password</label><input id="password" name="password" onChange={handleChange} placeholder="At least 8 characters" type="password" value={form.password} /></div>
							<div><label htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" name="confirmPassword" onChange={handleChange} placeholder="Repeat password" type="password" value={form.confirmPassword} /></div>
						</div>

						{error && <p className="form-error" role="alert">{error}</p>}
						<button className="submit-button" type="submit">Create account <span aria-hidden="true">→</span></button>
					</form>
				)}

				<p className="privacy-note">By creating an account, you agree to IntelliShield&apos;s terms and privacy policy.</p>
			</section>
			<aside className="registration-aside" aria-label="IntelliShield security information">
				<div className="aside-content"><p className="eyebrow">SECURITY, IN CONTEXT</p><h2>Authentication that adapts to the person behind the session.</h2><p>IntelliShield combines device trust and dynamic keystroke behavior to keep access proportional to risk.</p><div className="signal-summary"><span className="signal-dot" /><span>Continuous protection enabled</span></div></div>
			</aside>
		</main>
	)
}

export default Register
