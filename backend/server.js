const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Fake in-memory notes
let notes = [
  { id: "1", text: "Shine bright, darling 🌟 even the stars are jealous of your sparkle💖", color: "#FFB6C1" },
  { id: "2", text: "Coffee fuels code ☕", color: "#FFD700" },
  { id: "3", text: "Bloom like a flower 🌸 — even in the darkest seasons.", color: "#98FB98" },
  { id: "4", text: "Stay classy, sassy, and a bit bad-assy 💋🔥.", color: "#87CEFA" },
];

// GET all notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// ADD note
app.post("/api/notes", (req, res) => {
  const { text, color } = req.body;
  const newNote = { id: Date.now().toString(), text, color };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// DELETE note
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  notes = notes.filter((n) => n.id !== id);
  res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
