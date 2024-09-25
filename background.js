chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith("reminder-")) {
    const taskId = parseInt(alarm.name.split("-")[1]);
    chrome.storage.sync.get(["tasks"], (result) => {
      const tasks = result.tasks || [];
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        chrome.notifications.create({
          type: "basic",
          iconUrl:
            "https://www.google.com/chrome/static/images/chrome-logo.svg",
          title: "Task Reminder",
          message: `Don't forget: ${task.text}`,
        });
      }
    });
  }
});

// Initialize todo count from storage
chrome.storage.sync.get(["tasks"], (result) => {
  const tasks = result.tasks || [];
  const todoCount = tasks.length;
  chrome.browserAction.setBadgeText({ text: todoCount.toString() });
  chrome.browserAction.setBadgeBackgroundColor({
    color: todoCount >= 5 ? "#FF0000" : "#4CAF50",
  });
});
