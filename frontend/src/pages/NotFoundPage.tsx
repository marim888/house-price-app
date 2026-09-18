import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="page">
      <div className="card">
        <h1>404</h1>
        <p className="subtitle">This page doesn't exist.</p>
        <Link className="submit-btn link-btn" to="/">
          Back to home
        </Link>
      </div>
    </main>
  )
}
