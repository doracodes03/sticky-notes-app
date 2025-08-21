import { useState, useEffect } from "react";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const colors = [
    "#FFD700",
    "#FFB6C1",
    "#98FB98",
    "#87CEFA",
    "#FF69B4",
    "#FFA07A",
    "#E6E6FA",
  ];

  // Fetch notes from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  // Add new note
  function handleAdd() {
    if (!text.trim()) return;
    const newNote = {
      text,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    })
      .then((res) => res.json())
      .then((data) => setNotes((prev) => [...prev, data]));

    setText("");
  }

  // Delete note
  function handleDelete(id) {
    fetch(`http://localhost:5000/api/notes/${id}`, { method: "DELETE" })
      .then(() => setNotes((prev) => prev.filter((n) => n.id !== id)));
  }

  // Edit note
  function handleEdit(id, currentText) {
    setEditingId(id);
    setEditText(currentText);
  }

  // Save edited note (just local for now)
  function handleSave(id) {
    if (!editText.trim()) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text: editText } : n))
    );
    setEditingId(null);
    setEditText("");
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#d3f39bff",
        overflowY: "auto",
        padding: "2rem",
      }}
    >
      {/* Input Section */}
      <main
        style={{
          backgroundColor: "#7b4fbb",
          padding: "1rem",
          borderRadius: "12px",
          minWidth: "320px",
          textAlign: "center",
          color: "white",
          marginBottom: "2rem",
        }}
      >
        <h1>Sticky Notes</h1>
        <h2
          style={{
            fontWeight: "normal",
            fontSize: "1.2rem",
            marginTop: "0.5rem",
          }}
        >
          Girly Pops ✨ Save your thoughts here!
        </h2>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note"
          style={{ marginRight: "0.5rem", padding: "0.4rem" }}
        />
        <button
          onClick={handleAdd}
          style={{
            backgroundColor: "hotpink",
            border: "none",
            borderRadius: "6px",
            padding: "0.4rem 1rem",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </main>

      {/* Notes Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "1rem",
        }}
      >
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              background: note.color,
              color: "#333",
              padding: "1rem",
              borderRadius: "8px",
              minHeight: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {editingId === note.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave(note.id)}
                  style={{
                    padding: "0.4rem",
                    marginBottom: "0.5rem",
                  }}
                  autoFocus
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    onClick={() => handleSave(note.id)}
                    style={{
                      backgroundColor: "lightgreen",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.2rem 0.6rem",
                      cursor: "pointer",
                    }}
                  >
                    ✅ Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      backgroundColor: "lightcoral",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.2rem 0.6rem",
                      cursor: "pointer",
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ wordWrap: "break-word", fontSize: "0.9rem" }}>
                  {note.text}
                </p>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    onClick={() => handleEdit(note.id, note.text)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
