const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes go here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// GET /api/notes - Read and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(notes);
  });
  
  // POST /api/notes - Receive a new note, add it to db.json, and return the new note
  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    
    // Generate a unique ID using uuidv4()
    newNote.id = uuidv4(); // Use uuidv4() to generate a unique ID
    
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
  });
  

  // GET /notes - Return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });
  
  // GET * - Return the index.html file for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
   
  // DELETE /api/notes/:id - Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteIdToDelete = req.params.id;
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  
    // Find the index of the note with the specified ID
    const noteIndex = notes.findIndex((note) => note.id === noteIdToDelete);
  
    if (noteIndex !== -1) {
      // Remove the note from the array
      notes.splice(noteIndex, 1);
  
      // Write the updated notes array back to db.json
      fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  
      res.json({ message: 'Note deleted successfully' });
    } else {
      // Note with the given ID not found
      res.status(404).json({ error: 'Note not found' });
    }
  });
  