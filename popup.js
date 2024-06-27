// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const addNoteButton = document.getElementById("addNote");
  const noteInput = document.getElementById("noteInput");

  // Add note to localStorage
  const addNote = () => {
    const note = noteInput.value.trim();
    if (note) {
      const notes = JSON.parse(localStorage.getItem("notes")) || [];
      notes.push(note);
      localStorage.setItem("notes", JSON.stringify(notes));
      noteInput.value = "";
      // Notify content script to reload notes
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: () => {
            const notes = JSON.parse(localStorage.getItem("notes")) || [];
            const notesList = document.querySelector("#notes");
            notesList.innerHTML = "";
            notes.forEach((note) => {
              const noteItem = document.createElement("li");
              noteItem.textContent = note;
              notesList.appendChild(noteItem);
            });
          },
        });
      });
    }
  };

  addNoteButton.addEventListener("click", addNote);
});
