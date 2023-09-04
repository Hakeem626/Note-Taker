// DOM Elements
const noteTitleInput = document.querySelector('#note-title');
const noteTextInput = document.querySelector('#note-text');
const saveNoteBtn = document.querySelector('#save-note');
const noteList = document.querySelector('#note-list');

// Function to fetch and display notes
function getNotes() {
  fetch('/api/notes')
    .then((response) => response.json())
    .then((data) => {
      // Clear the existing note list
      noteList.innerHTML = '';

      // Loop through the notes and create HTML elements for each
      data.forEach((note) => {
        const noteItem = document.createElement('li');
        noteItem.innerHTML = `
          <div class="note">
            <span class="note-title">${note.title}</span>
            <span class="delete-note" data-id="${note.id}">X</span>
          </div>
          <div class="note-text">${note.text}</div>
        `;
        noteList.appendChild(noteItem);
      });
    });
}

// Function to save a new note
function saveNote() {
  const newNote = {
    title: noteTitleInput.value.trim(),
    text: noteTextInput.value.trim(),
  };

  // Send a POST request to add the new note
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newNote),
  })
    .then((response) => response.json())
    .then((data) => {
      // Clear the input fields
      noteTitleInput.value = '';
      noteTextInput.value = '';

      // Refresh the note list
      getNotes();
    });
}

// Function to delete a note
function deleteNote(id) {
  // Send a DELETE request to remove the note
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      // Refresh the note list
      getNotes();
    });
}

// Event listeners
saveNoteBtn.addEventListener('click', saveNote);
noteList.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-note')) {
    const id = event.target.getAttribute('data-id');
    deleteNote(id);
  }
});

// Initialize the note list
getNotes();

// Event listener for deleting a note
noteList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-note')) {
      const id = event.target.getAttribute('data-id');
      
      // Send a DELETE request to delete the note by its ID
      fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            // The note was deleted successfully
            // Refresh the note list
            getNotes();
          } else {
            // Handle the error if the note could not be deleted
            console.error('Failed to delete note:', response.status);
          }
        })
        .catch((error) => {
          console.error('Error while deleting note:', error);
        });
    }
  });
  