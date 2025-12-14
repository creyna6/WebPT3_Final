import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from './assets/Components/Login.jsx'
import Hub from './assets/Components/Hub.jsx'

function ProtectedRoute({ children }) {
  const sessionId = localStorage.getItem("sessionId")
  const user = localStorage.getItem("user")

  if (!sessionId || !user) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <div id="main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/hub"
            element={
              <ProtectedRoute>
                <Hub />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
