function displayNotes() {
  chrome.storage.local.get({ notes: [] }, (result) => {
    const notes = result.notes;
    const existingNotes = document.querySelectorAll(".focus-note");
    existingNotes.forEach((note) => note.remove());

    notes.forEach((note, index) => {
      const noteElement = document.createElement("div");
      noteElement.innerText = note;
      noteElement.className = "focus-note";
      noteElement.draggable = true;
      noteElement.style.position = "fixed";
      noteElement.style.top = `${index * 60}px`;
      noteElement.style.right = "10px";
      noteElement.style.backgroundColor = "#FFEB3B";
      noteElement.style.padding = "10px";
      noteElement.style.border = "1px solid #ccc";
      noteElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
      noteElement.style.zIndex = 1000;

      document.body.appendChild(noteElement);
    });
  });
}

displayNotes();

document.addEventListener("dragstart", (event) => {
  if (event.target.classList.contains("focus-note")) {
    event.dataTransfer.setData("text/plain", null); // For Firefox compatibility
    event.dataTransfer.effectAllowed = "move";
  }
});

document.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
});

document.addEventListener("drop", (event) => {
  const note = document.querySelector(".focus-note.dragging");
  if (note) {
    note.style.top = `${event.clientY}px`;
    note.style.left = `${event.clientX}px`;
  }
});

document.addEventListener("dragend", (event) => {
  if (event.target.classList.contains("focus-note")) {
    event.target.classList.remove("dragging");
  }
});

document.querySelectorAll(".focus-note").forEach((note) => {
  note.addEventListener("dragstart", () => {
    note.classList.add("dragging");
  });
});
