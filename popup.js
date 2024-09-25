document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const deadlineInput = document.getElementById("default-datepicker");
  const todoList = document.getElementById("todo-list");
  const alertContainer = document.getElementById("alert-container");
  const cancelAlert = document.getElementById("cancel-alert");

  const MAX_TODOS = 5;

  // Load tasks from storage
  chrome.storage.sync.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    tasks.forEach((task) => addTaskToDOM(task));
    updateTodoCount(tasks.length);
  });

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    chrome.storage.sync.get(["tasks"], (result) => {
      const tasks = result.tasks || [];
      if (tasks.length >= MAX_TODOS) {
        showAlert();
        return;
      }
      const taskText = todoInput.value.trim();
      const deadline = deadlineInput.value;
      if (taskText) {
        const task = {
          id: Date.now(),
          text: taskText,
          completed: false,
          deadline,
        };
        addTaskToDOM(task);
        tasks.push(task);
        chrome.storage.sync.set({ tasks });
        todoInput.value = "";
        deadlineInput.value = "";
        updateTodoCount(tasks.length);
      }
    });
  });

  cancelAlert.addEventListener("click", () => {
    alertContainer.classList.add("hidden");
  });

  function addTaskToDOM(task) {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded-lg shadow";
    div.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <span class="${task.completed ? "line-through text-gray-500" : ""}">${
      task.text
    }</span>
        <button class="edit text-blue-500 hover:text-blue-600">
          Edit
        </button>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">${
          task.deadline ? `Deadline: ${task.deadline}` : ""
        }</span>
        <div>
          <button class="delete text-red-500 hover:text-red-600 mr-2">
            Delete
          </button>
          <button class="complete text-green-500 hover:text-green-600">
            Done
          </button>
        </div>
      </div>
    `;
    div.dataset.id = task.id;

    div
      .querySelector(".edit")
      .addEventListener("click", () => editTask(div, task));
    div
      .querySelector(".delete")
      .addEventListener("click", () => deleteTask(div, task.id));
    div
      .querySelector(".complete")
      .addEventListener("click", () => toggleComplete(div, task));

    todoList.appendChild(div);
  }

  function editTask(div, task) {
    const span = div.querySelector("span");
    const text = span.textContent;
    div.innerHTML = `
      <input type="text" value="${text}" class="w-full p-2 border rounded mb-2">
      <button class="save bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
    `;
    const input = div.querySelector("input");
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    div.querySelector(".save").addEventListener("click", () => {
      const newText = input.value.trim();
      if (newText) {
        task.text = newText;
        updateTask(task);
        addTaskToDOM(task);
      }
    });
  }

  function deleteTask(div, taskId) {
    div.remove();
    chrome.storage.sync.get(["tasks"], (result) => {
      const tasks = result.tasks || [];
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      chrome.storage.sync.set({ tasks: updatedTasks });
      updateTodoCount(updatedTasks.length);
    });
  }

  function toggleComplete(div, task) {
    task.completed = !task.completed;
    updateTask(task);
    div.querySelector("span").classList.toggle("line-through");
    div.querySelector("span").classList.toggle("text-gray-500");
  }

  function updateTask(updatedTask) {
    chrome.storage.sync.get(["tasks"], (result) => {
      const tasks = result.tasks || [];
      const index = tasks.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        tasks[index] = updatedTask;
        chrome.storage.sync.set({ tasks });
      }
    });
  }

  function showAlert() {
    alertContainer.classList.remove("hidden");
  }

  function updateTodoCount(count) {
    chrome.runtime.sendMessage({ action: "updateTodoCount", count });
  }
});
