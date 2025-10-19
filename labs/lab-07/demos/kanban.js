import * as db from '../scripts/db.js';
import { LocalStorageAdapter } from '../scripts/adapters/localStorageAdapter.js';
import { JsonBinAdapter } from '../scripts/adapters/jsonBinAdapter.js';

// --- DOM References ---
// ... (all previous DOM references are the same)
const bootButton = document.getElementById('bootButton');
const bootStatus = document.getElementById('bootStatus');
const binIdInput = document.getElementById('binIdInput');
const appSection = document.getElementById('app');
const filterProject = document.getElementById('filterProject');
const filterUser = document.getElementById('filterUser');
const kanbanBoard = document.getElementById('kanbanBoard');
const addTaskForm = document.getElementById('addTaskForm');
const taskTitle = document.getElementById('taskTitle');
const taskProject = document.getElementById('taskProject');
const taskUser = document.getElementById('taskUser');
const addProjectForm = document.getElementById('addProjectForm');
const newProjectName = document.getElementById('newProjectName');
const addUserForm = document.getElementById('addUserForm');
const newUserName = document.getElementById('newUserName');

// --- State and Config ---
const KANBAN_TAGS = ['To Do', 'In Progress', 'Done'];
let usersMap = new Map(), projectsMap = new Map(), tagsMap = new Map(), tagsIdMap = new Map();

// --- Core App Logic (Boot, Setup, Populate, Render) ---
// ... (These functions are the same as the previous version)
async function bootApp() {
  bootStatus.textContent = 'Booting...';
  appSection.style.display = 'none';
  try {
    const selectedAdapter = document.querySelector('input[name="adapter"]:checked').value;
    let adapter;
    if (selectedAdapter === 'local') {
      adapter = new LocalStorageAdapter({ key: 'kanban-db' });
    } else {
      const binId = binIdInput.value.trim();
      if (!binId) throw new Error('Please provide a JSONBin ID.');
      adapter = new JsonBinAdapter({ binId });
    }
    db.useAdapter(adapter);
    await db.boot();
    await setupInitialData();
    
    bootStatus.textContent = `✅ Boot successful with ${selectedAdapter}.`;
    appSection.style.display = 'block';
    
    await populateFiltersAndMaps();
    await renderBoard();
  } catch (e) {
    bootStatus.textContent = `❌ Error: ${e.message}`;
  }
}
async function setupInitialData() {
  for (const tagName of KANBAN_TAGS) {
    await db.upsertOne('tags', { name: tagName }, { name: tagName });
  }
}
async function populateFiltersAndMaps() {
  const users = db.find('users');
  const projects = db.find('projects');
  const tags = db.find('tags');
  usersMap = new Map(users.map(u => [u.id, u.name]));
  projectsMap = new Map(projects.map(p => [p.id, p.name]));
  tagsMap = new Map(tags.map(t => [t.name, t.id]));
  tagsIdMap = new Map(tags.map(t => [t.id, t.name]));
  const userOptions = users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
  const projectOptions = projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  filterUser.innerHTML = '<option value="all">All Users</option>' + userOptions;
  filterProject.innerHTML = '<option value="all">All Projects</option>' + projectOptions;
  taskUser.innerHTML = userOptions;
  taskProject.innerHTML = projectOptions;
}
async function renderBoard() {
  kanbanBoard.innerHTML = '';
  const filterUserId = filterUser.value;
  const filterProjectId = filterProject.value;
  const filter = {};
  if (filterUserId !== 'all') filter.assignedTo = filterUserId;
  if (filterProjectId !== 'all') filter.projectId = filterProjectId;
  const todos = db.find('todos', { filter, sort: { createdAt: -1 } });
  
  for (const tagName of KANBAN_TAGS) {
    const tagId = tagsMap.get(tagName);
    const column = document.createElement('div');
    column.className = 'kanban-column';
    column.dataset.tagId = tagId;
    column.innerHTML = `<h4>${tagName}</h4><div class="task-cards"></div>`;
    const tasksForColumn = todos.filter(t => (t.tagIds || []).includes(tagId));
    const cardsContainer = column.querySelector('.task-cards');
    
    tasksForColumn.forEach(todo => {
      const card = document.createElement('div');
      card.className = 'task-card';
      card.dataset.todoId = todo.id;
      const subtasksHTML = (todo.subtasks || []).map(s => `<li class="${s.done ? 'completed' : ''}">${s.title}</li>`).join('');
      
      // ** UPDATED: Draggable handle is now the card itself, new data- attributes for editing **
      card.innerHTML = `
        <div class="card-header">
          <h5 class="task-title" data-id="${todo.id}" data-field="title">${todo.title}</h5>
          <button class="delete-btn" data-id="${todo.id}">×</button>
        </div>
        <div class="meta">
          👤 <span data-id="${todo.id}" data-field="assignedTo">${usersMap.get(todo.assignedTo) || 'N/A'}</span> | 
          📁 <span data-id="${todo.id}" data-field="projectId">${projectsMap.get(todo.projectId) || 'N/A'}</span>
        </div>
        ${subtasksHTML ? `<ul class="subtasks">${subtasksHTML}</ul>` : ''}
      `;
      // Make the whole card draggable
      card.draggable = true;
      cardsContainer.appendChild(card);
    });
    kanbanBoard.appendChild(column);
  }
}

// --- Handler Functions ---

async function addTask(event) {
    // ... (same as before)
    event.preventDefault();
    const title = taskTitle.value.trim();
    if (!title || !taskProject.value || !taskUser.value) { alert("Please ensure a title, project, and user are selected."); return; }
    const todoTagId = tagsMap.get('To Do');
    await db.insertOne('todos', { title, done: false, projectId: taskProject.value, assignedTo: taskUser.value, tagIds: [todoTagId], subtasks: [], createdAt: new Date().toISOString() });
    taskTitle.value = '';
    await renderBoard();
}
async function addProject(event) {
    // ... (same as before)
    event.preventDefault(); 
    const name = newProjectName.value.trim();
    if (!name) return;
    await db.insertOne('projects', { name });
    newProjectName.value = '';
    await populateFiltersAndMaps();
}
async function addUser(event) {
    // ... (same as before)
    event.preventDefault(); 
    const name = newUserName.value.trim();
    if (!name) return;
    await db.insertOne('users', { name });
    newUserName.value = '';
    await populateFiltersAndMaps();
}

// --- Event Delegation for Clicks on the Board (Edit & Delete) ---
kanbanBoard.addEventListener('click', async (e) => {
    const target = e.target;
    const todoId = target.dataset.id;
    if (!todoId) return;

    // Handle Delete Button
    if (target.matches('.delete-btn')) {
        if (confirm('Are you sure you want to delete this task?')) {
            await db.deleteOne('todos', todoId);
            await renderBoard();
        }
    }

    // Handle In-Place Editing for Title, User, and Project
    if (target.matches('.task-title, .meta span')) {
        const field = target.dataset.field; // 'title', 'assignedTo', or 'projectId'
        const todo = db.findOne('todos', t => t.id === todoId);
        
        let editor;

        if (field === 'title') {
            editor = document.createElement('input');
            editor.type = 'text';
            editor.value = todo.title;
        } else { // It's a select dropdown for user or project
            editor = document.createElement('select');
            const map = field === 'assignedTo' ? usersMap : projectsMap;
            map.forEach((name, id) => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = name;
                if (id === todo[field]) {
                    option.selected = true;
                }
                editor.appendChild(option);
            });
        }

        // Replace the static text with the editor
        target.replaceWith(editor);
        editor.focus();

        // Save on blur (clicking away)
        editor.addEventListener('blur', async () => {
            await db.updateOne('todos', todoId, { [field]: editor.value });
            await renderBoard(); // Re-render to show the final state
        });
        
        // Also save on "Enter" for inputs, or on "change" for selects
        if (editor.tagName === 'INPUT') {
            editor.addEventListener('keydown', e => { if (e.key === 'Enter') editor.blur(); });
        } else {
            editor.addEventListener('change', () => editor.blur());
        }
    }
});


// --- Drag-and-Drop Logic (remains the same) ---
kanbanBoard.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('task-card')) { e.target.classList.add('dragging'); e.dataTransfer.setData('text/plain', e.target.dataset.todoId); }
});
kanbanBoard.addEventListener('dragend', (e) => {
  if (e.target.classList.contains('task-card')) { e.target.classList.remove('dragging'); }
});
kanbanBoard.addEventListener('dragover', (e) => {
  e.preventDefault(); const column = e.target.closest('.kanban-column'); if (column) column.classList.add('drag-over');
});
kanbanBoard.addEventListener('dragleave', (e) => {
  const column = e.target.closest('.kanban-column'); if (column) column.classList.remove('drag-over');
});
kanbanBoard.addEventListener('drop', async (e) => {
  e.preventDefault(); const column = e.target.closest('.kanban-column');
  if (column) {
    column.classList.remove('drag-over');
    const todoId = e.dataTransfer.getData('text/plain'); const newTagId = column.dataset.tagId;
    const todo = db.findOne('todos', t => t.id === todoId);
    if (todo) {
      const newTagIds = (todo.tagIds || []).filter(id => !KANBAN_TAGS.includes(tagsIdMap.get(id)));
      newTagIds.push(newTagId);
      await db.updateOne("todos", todoId, { tagIds: newTagIds });
      await renderBoard();
    }
  }
});


// --- Initial Setup ---
bootButton.addEventListener('click', bootApp);
filterProject.addEventListener('change', renderBoard);
filterUser.addEventListener('change', renderBoard);
addTaskForm.addEventListener('submit', addTask);
addProjectForm.addEventListener('submit', addProject);
addUserForm.addEventListener('submit', addUser);

document.querySelectorAll('input[name="adapter"]').forEach(radio => {
  radio.addEventListener('change', (e) => { binIdInput.style.display = e.target.value === 'jsonbin' ? 'block' : 'none'; });
});