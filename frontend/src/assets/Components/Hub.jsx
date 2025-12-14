import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import '../ComponentCSS/Hub.css'

const Hub = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [dueDate, setDueDate] = useState("")

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [editDue, setEditDue] = useState("")

  const API = "http://localhost:4000/api"

  const handleLogout = () => {
    localStorage.removeItem("sessionId")
    localStorage.removeItem("user")
    navigate("/")
  }

  const loadItems = () => {
    fetch(`${API}/items`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => {
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        })
        setItems(sorted)
      })
  }

  useEffect(() => {
    loadItems()
  }, [])

  const addItem = () => {
    if (!title.trim()) return

    fetch(`${API}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: desc, dueDate })
    })
      .then(res => res.json())
      .then(newItem => {
        setTitle("")
        setDesc("")
        setDueDate("")
        loadItems()
      })
  }

  const deleteItem = (id) => {
    fetch(`${API}/items/${id}`, { method: "DELETE" })
      .then(() => loadItems())
  }

  const startEdit = (item) => {
    setEditingId(item._id)
    setEditTitle(item.title)
    setEditDesc(item.description)
    setEditDue(item.dueDate || "")
  }

  const saveEdit = () => {
    fetch(`${API}/items/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDesc,
        dueDate: editDue
      })
    })
      .then(() => {
        setEditingId(null)
        loadItems()
      })
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  return (
    <div id='hub-container'>
      <div id='hub-container2'>

        <div id="hub-header">
          <h2>Welcome, {user.username}!</h2>
          <button id="logout-button" onClick={handleLogout}>Logout</button>
        </div>

        <div id="cards">
            <div className="card" id="assingments-card">
            <h3>Assignments</h3>
                {items.length === 0 && <p>No assignments yet.</p>}
                {items.map(item => (
                <div key={item._id} id="assingment">

                    {editingId === item._id ? (
                        <>
                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                        <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                        <input type="date" value={editDue} onChange={e => setEditDue(e.target.value)} />

                        <button onClick={saveEdit}>Save</button>
                        <button onClick={() => setEditingId(null)}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <strong>{item.title}</strong><br />
                            {item.description}<br />
                            {item.dueDate && <small>Due: {item.dueDate}</small>}<br />

                            <div className="buttons">
                                <button onClick={() => startEdit(item)}>Edit</button>
                                <button onClick={() => deleteItem(item._id)}>Delete</button>
                            </div>
                        </>
                    )}

                </div>
            ))}
            </div>

            <div className="card" id="add-assignment-card">
                <h3>Add Assignment</h3>

                <input
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Description"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />

                <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                />

                <button onClick={addItem} id="add-item-button">Add</button>
            </div>
        </div>

      </div>
    </div>
  )
}

export default Hub
