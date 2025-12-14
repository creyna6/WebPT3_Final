import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../ComponentCSS/Login.css'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      localStorage.setItem("sessionId", data.sessionId)
      localStorage.setItem("user", JSON.stringify(data.user))

      navigate("/hub")

    } catch (err) {
      setError("Network error. Please try again.")
    }
  }

  return (
    <div id="container">
      <div id="container2">
        <h2>Homework Hub Login</h2>

        <form id="form" onSubmit={handleSubmit}>
          <div id="username-container">
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div id="password-container">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button id="submit-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
