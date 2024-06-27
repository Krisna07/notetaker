document.getElementById("addNote").addEventListener("click", () => {
  const noteText = document.getElementById("note").value;
  if (noteText) {
    chrome.storage.local.get({ notes: [] }, (result) => {
      const notes = result.notes;
      notes.push(noteText);
      chrome.storage.local.set({ notes: notes }, () => {
        document.getElementById("note").value = "";
        alert("Note added!");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: displayNotes,
          });
        });
      });
    });
  }
});

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
