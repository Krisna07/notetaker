const MAX_TODOS = 5;
let todoCount = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateTodoCount') {
    todoCount = request.count;
    updateBadge();
  }
});

function updateBadge() {
  chrome.browserAction.setBadgeText({ text: todoCount.toString() });
  chrome.browserAction.setBadgeBackgroundColor({ color: todoCount >= MAX_TODOS ? '#FF0000' : '#4CAF50' });
}

// Initialize todo count from storage
chrome.storage.sync.get(['tasks'], (result) => {
  const tasks = result.tasks || [];
  todoCount = tasks.length;
  updateBadge();
});