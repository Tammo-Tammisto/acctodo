
async function logTasks() {
  const response = await fetch('http://demo2.z-bit.ee/tasks', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer xHxlF-ZcLXrfCgQd7wvbkKPORHGELpga',
    },
  })
  const tasks = await response.json();

  for (let i = 0; i < tasks.length; i++) {
    console.log(tasks[i]);
  }
}

logTasks()
