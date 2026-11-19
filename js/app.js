(function () {
  'use strict';

  var TODO_KEY = 'dashboard.todos';
  var LINK_KEY = 'dashboard.links';
  var TIMER_KEY = 'dashboard.timerMinutes';
  var SORT_KEY = 'dashboard.todoSort';
  var DEFAULT_MINUTES = 25;
  var MIN_MINUTES = 1;
  var MAX_MINUTES = 180;

  // ---------- Storage helpers ----------
  function load(key, fallback) {
    try {
      var data = JSON.parse(localStorage.getItem(key));
      return Array.isArray(data) ? data : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  // ---------- Greeting, time and date ----------
  var timeEl = document.getElementById('time');
  var dateEl = document.getElementById('date');
  var greetingEl = document.getElementById('greeting');

  function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  }

  function updateClock() {
    var now = new Date();
    timeEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    dateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    greetingEl.textContent = getGreeting(now.getHours());
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ---------- Focus timer ----------
  var timerDisplay = document.getElementById('timer-display');
  var timerForm = document.getElementById('timer-form');
  var timerMinutesInput = document.getElementById('timer-minutes');
  var timerMinutes = loadMinutes();
  var remaining = timerMinutes * 60;
  var timerId = null;

  function loadMinutes() {
    var saved = parseInt(localStorage.getItem(TIMER_KEY), 10);
    return saved >= MIN_MINUTES && saved <= MAX_MINUTES ? saved : DEFAULT_MINUTES;
  }

  function renderTimer() {
    timerDisplay.textContent = pad(Math.floor(remaining / 60)) + ':' + pad(remaining % 60);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function startTimer() {
    if (timerId !== null || remaining <= 0) return;
    timerId = setInterval(function () {
      remaining -= 1;
      renderTimer();
      if (remaining <= 0) {
        stopTimer();
        alert('Time is up! Take a break.');
      }
    }, 1000);
  }

  function resetTimer() {
    stopTimer();
    remaining = timerMinutes * 60;
    renderTimer();
  }

  function setTimerMinutes(e) {
    e.preventDefault();
    var value = parseInt(timerMinutesInput.value, 10);
    if (!(value >= MIN_MINUTES && value <= MAX_MINUTES)) {
      alert('Enter a number of minutes from ' + MIN_MINUTES + ' to ' + MAX_MINUTES + '.');
      return;
    }
    timerMinutes = value;
    localStorage.setItem(TIMER_KEY, String(value));
    resetTimer();
  }

  timerForm.addEventListener('submit', setTimerMinutes);
  timerMinutesInput.value = timerMinutes;

  document.getElementById('timer-start').addEventListener('click', startTimer);
  document.getElementById('timer-stop').addEventListener('click', stopTimer);
  document.getElementById('timer-reset').addEventListener('click', resetTimer);
  renderTimer();

  // ---------- To-do list ----------
  var todoForm = document.getElementById('todo-form');
  var todoInput = document.getElementById('todo-input');
  var todoList = document.getElementById('todo-list');
  var todoEmpty = document.getElementById('todo-empty');
  var todoMessage = document.getElementById('todo-message');
  var todoSort = document.getElementById('todo-sort');
  var todos = load(TODO_KEY, []);
  var editingId = null;
  var sortMode = localStorage.getItem(SORT_KEY) || 'added';
  todoSort.value = sortMode;
  if (todoSort.value !== sortMode) { sortMode = 'added'; todoSort.value = sortMode; }

  function isDuplicate(text, ignoreId) {
    var key = text.trim().toLowerCase();
    return todos.some(function (t) {
      return t.id !== ignoreId && t.text.trim().toLowerCase() === key;
    });
  }

  function showMessage(text) {
    todoMessage.textContent = text;
  }

  function getSortedTodos() {
    var list = todos.slice();
    var byText = function (a, b) { return a.text.localeCompare(b.text, undefined, { sensitivity: 'base' }); };
    if (sortMode === 'az') list.sort(byText);
    if (sortMode === 'za') list.sort(function (a, b) { return byText(b, a); });
    if (sortMode === 'active') list.sort(function (a, b) { return a.done - b.done; });
    if (sortMode === 'done') list.sort(function (a, b) { return b.done - a.done; });
    return list;
  }

  function makeButton(label, className, handler) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = label;
    btn.addEventListener('click', handler);
    return btn;
  }

  function commitEdit(id, value) {
    var text = value.trim();
    var todo = todos.find(function (t) { return t.id === id; });
    if (todo && text) {
      if (isDuplicate(text, id)) {
        showMessage('That task already exists.');
        return;
      }
      todo.text = text;
      showMessage('');
    }
    editingId = null;
    save(TODO_KEY, todos);
    renderTodos();
  }

  function renderTodos() {
    todoList.innerHTML = '';
    todoEmpty.classList.toggle('hidden', todos.length > 0);

    getSortedTodos().forEach(function (todo) {
      var li = document.createElement('li');
      li.className = 'todo-item' + (todo.done ? ' done' : '');

      var check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = todo.done;
      check.setAttribute('aria-label', 'Mark task as done');
      check.addEventListener('change', function () {
        todo.done = check.checked;
        save(TODO_KEY, todos);
        renderTodos();
      });
      li.appendChild(check);

      if (editingId === todo.id) {
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = todo.text;
        input.maxLength = 120;
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') commitEdit(todo.id, input.value);
          if (e.key === 'Escape') { editingId = null; renderTodos(); }
        });
        li.appendChild(input);
        li.appendChild(makeButton('Save', 'btn small primary', function () {
          commitEdit(todo.id, input.value);
        }));
        setTimeout(function () { input.focus(); }, 0);
      } else {
        var span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = todo.text;
        li.appendChild(span);
        li.appendChild(makeButton('Edit', 'btn small', function () {
          editingId = todo.id;
          renderTodos();
        }));
        li.appendChild(makeButton('Delete', 'btn small danger', function () {
          todos = todos.filter(function (t) { return t.id !== todo.id; });
          save(TODO_KEY, todos);
          renderTodos();
        }));
      }

      todoList.appendChild(li);
    });
  }

  todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = todoInput.value.trim();
    if (!text) return;
    if (isDuplicate(text, null)) {
      showMessage('That task already exists.');
      return;
    }
    showMessage('');
    todos.push({ id: Date.now(), text: text, done: false });
    save(TODO_KEY, todos);
    todoInput.value = '';
    renderTodos();
  });

  todoSort.addEventListener('change', function () {
    sortMode = todoSort.value;
    localStorage.setItem(SORT_KEY, sortMode);
    renderTodos();
  });

  renderTodos();

  // ---------- Quick links ----------
  var linkForm = document.getElementById('link-form');
  var linkName = document.getElementById('link-name');
  var linkUrl = document.getElementById('link-url');
  var linkList = document.getElementById('link-list');
  var defaultLinks = [
    { id: 1, name: 'Google', url: 'https://www.google.com' },
    { id: 2, name: 'GitHub', url: 'https://github.com' },
    { id: 3, name: 'YouTube', url: 'https://www.youtube.com' }
  ];
  var links = localStorage.getItem(LINK_KEY) === null ? defaultLinks : load(LINK_KEY, []);

  function normalizeUrl(value) {
    var url = value.trim();
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    try {
      var parsed = new URL(url);
      return /^https?:$/.test(parsed.protocol) ? parsed.href : null;
    } catch (e) {
      return null;
    }
  }

  function renderLinks() {
    linkList.innerHTML = '';
    links.forEach(function (link) {
      var chip = document.createElement('div');
      chip.className = 'link-chip';

      var a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = link.name;
      chip.appendChild(a);

      var del = makeButton('\u00d7', '', function () {
        links = links.filter(function (l) { return l.id !== link.id; });
        save(LINK_KEY, links);
        renderLinks();
      });
      del.setAttribute('aria-label', 'Remove ' + link.name);
      chip.appendChild(del);

      linkList.appendChild(chip);
    });
  }

  linkForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = linkName.value.trim();
    var url = normalizeUrl(linkUrl.value);
    if (!name) return;
    if (!url) {
      alert('Please enter a valid website address.');
      return;
    }
    links.push({ id: Date.now(), name: name, url: url });
    save(LINK_KEY, links);
    linkName.value = '';
    linkUrl.value = '';
    renderLinks();
  });

  save(LINK_KEY, links);
  renderLinks();
})();
