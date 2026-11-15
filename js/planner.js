// Academic Planner: add, complete, delete, filter and save tasks

var STORAGE_KEY = 'victor-planner-tasks';

var form = document.getElementById('task-form');
var titleInput = document.getElementById('task-title');
var categoryInput = document.getElementById('task-category');
var dueInput = document.getElementById('task-due');
var titleError = document.getElementById('task-error');
var listEl = document.getElementById('task-list');
var progressBar = document.getElementById('progress-bar');
var progressText = document.getElementById('progress-text');
var filterButtons = document.querySelectorAll('.filters button[data-filter]');
var clearBtn = document.getElementById('clear-done');

var tasks = loadTasks();
var currentFilter = 'all';

function loadTasks() {
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) {
      return saved;
    }
  } catch (e) {
    // storage not available, start empty
  }
  return [];
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    // ignore, the planner still works for this visit
  }
}

function formatDate(value) {
  if (!value) {
    return 'No due date';
  }
  var parts = value.split('-');
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return 'Due ' + parts[2] + ' ' + months[Number(parts[1]) - 1] + ' ' + parts[0];
}

function render() {
  listEl.innerHTML = '';

  var shown = tasks.filter(function (task) {
    if (currentFilter === 'open') { return !task.done; }
    if (currentFilter === 'done') { return task.done; }
    return true;
  });

  if (shown.length === 0) {
    var empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = tasks.length === 0 ? 'No tasks yet. Add your first one above.' : 'No tasks in this view.';
    listEl.appendChild(empty);
  }

  shown.forEach(function (task) {
    var li = document.createElement('li');
    li.className = 'task' + (task.done ? ' done' : '');
    li.setAttribute('data-id', task.id);

    var box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = task.done;
    box.setAttribute('aria-label', 'Mark "' + task.title + '" as complete');

    var text = document.createElement('div');
    text.className = 'task-text';
    var strong = document.createElement('strong');
    strong.textContent = task.title;
    var small = document.createElement('small');
    small.textContent = task.category + ' · ' + formatDate(task.due);
    text.appendChild(strong);
    text.appendChild(small);

    var del = document.createElement('button');
    del.type = 'button';
    del.textContent = 'Delete';
    del.setAttribute('aria-label', 'Delete "' + task.title + '"');

    li.appendChild(box);
    li.appendChild(text);
    li.appendChild(del);
    listEl.appendChild(li);
  });

  var doneCount = tasks.filter(function (t) { return t.done; }).length;
  var percent = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);
  progressBar.style.width = percent + '%';
  progressText.textContent = doneCount + ' of ' + tasks.length + ' tasks complete';
}

// Add a task
form.addEventListener('submit', function (event) {
  event.preventDefault();
  var title = titleInput.value.trim();

  if (title === '') {
    titleError.textContent = 'Please type a task first.';
    titleInput.focus();
    return;
  }
  titleError.textContent = '';

  tasks.push({
    id: Date.now(),
    title: title,
    category: categoryInput.value,
    due: dueInput.value,
    done: false
  });
  saveTasks();
  render();
  form.reset();
  titleInput.focus();
});

// Complete or delete (one listener for the whole list)
listEl.addEventListener('click', function (event) {
  var li = event.target.closest('.task');
  if (!li) { return; }
  var id = Number(li.getAttribute('data-id'));

  if (event.target.tagName === 'BUTTON') {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    render();
  }
});

listEl.addEventListener('change', function (event) {
  var li = event.target.closest('.task');
  if (!li || event.target.type !== 'checkbox') { return; }
  var id = Number(li.getAttribute('data-id'));

  tasks.forEach(function (t) {
    if (t.id === id) { t.done = event.target.checked; }
  });
  saveTasks();
  render();
});

// Filters
filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentFilter = btn.getAttribute('data-filter');
    filterButtons.forEach(function (b) {
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    render();
  });
});

// Clear completed
clearBtn.addEventListener('click', function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  saveTasks();
  render();
});

render();
