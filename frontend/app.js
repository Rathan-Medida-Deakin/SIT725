<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tasks CRUD</title>
</head>
<body>
  <h1>Tasks</h1>

  <!-- Create Task Form -->
  <form id="create-form">
    <input id="title" placeholder="Task title" required />
    <input id="description" placeholder="Description" />
    <button type="submit">Create</button>
  </form>

  <!-- Task List -->
  <ul id="tasks"></ul>

  <script>
    const API = 'http://localhost:5000/api/tasks';

    // Load all tasks from the server
    async function loadTasks() {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const tasks = await res.json();

        const list = document.getElementById('tasks');
        list.innerHTML = '';

        tasks.forEach(t => {
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>${t.title}</strong> (${t.status ?? 'pending'}) — ${t.description ?? ''}
            <button data-id="${t._id}" class="edit">Edit</button>
            <button data-id="${t._id}" class="delete">Delete</button>
          `;
          list.appendChild(li);
        });
      } catch (err) {
        console.error('Error loading tasks:', err);
      }
    }

    // Handle create form submission
    document.getElementById('create-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();

      if (!title) {
        alert('Title is required');
        return;
      }

      try {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description })
        });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        e.target.reset();
        await loadTasks();
      } catch (err) {
        console.error('Error creating task:', err);
      }
    });

    // Handle edit & delete actions
    document.getElementById('tasks').addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!id) return;

      // Delete Task
      if (e.target.classList.contains('delete')) {
        if (confirm('Are you sure you want to delete this task?')) {
          try {
            const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            await loadTasks();
          } catch (err) {
            console.error('Error deleting task:', err);
          }
        }
      }

      // Edit Task
      if (e.target.classList.contains('edit')) {
        const newTitle = prompt('Enter new title:');
        if (newTitle && newTitle.trim()) {
          try {
            const res = await fetch(`${API}/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: newTitle.trim() })
            });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            await loadTasks();
          } catch (err) {
            console.error('Error updating task:', err);
          }
        }
      }
    });

    // Initial load
    loadTasks();
  </script>
</body>
</html>