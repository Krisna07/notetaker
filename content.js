// content.js

// Function to create the focused notes container
function createFocusedNotesContainer() {
  const focusedNotesContainer = document.createElement("div");
  focusedNotesContainer.id = "focusedNotesContainer";
  focusedNotesContainer.className = "focusedNotesContainer";
  focusedNotesContainer.innerHTML = `
    <h3>Focused Notes</h3>
    <ul id="notes"></ul>
  `;

  document.body.appendChild(focusedNotesContainer);

  // Load notes from localStorage
  const loadNotes = () => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const notesList = focusedNotesContainer.querySelector("#notes");
    notesList.innerHTML = "";
    notes.forEach((note) => {
      const noteItem = document.createElement("li");
      noteItem.textContent = note;
      notesList.appendChild(noteItem);
    });
  };

  // Make the focused notes container draggable
  focusedNotesContainer.onmousedown = function (event) {
    let shiftX =
      event.clientX - focusedNotesContainer.getBoundingClientRect().left;
    let shiftY =
      event.clientY - focusedNotesContainer.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      focusedNotesContainer.style.left = pageX - shiftX + "px";
      focusedNotesContainer.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    focusedNotesContainer.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      focusedNotesContainer.onmouseup = null;
    };
  };

  focusedNotesContainer.ondragstart = function () {
    return false;
  };

  // Load notes on page load
  loadNotes();
}

// Add the focused notes container to the page
createFocusedNotesContainer();
