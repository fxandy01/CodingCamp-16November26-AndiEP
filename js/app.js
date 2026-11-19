(function () {
  'use strict';

  var TODO_KEY = 'dashboard.todos';
  var LINK_KEY = 'dashboard.links';
  var TIMER_SECONDS = 25 * 60;

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
  var remaining = TIMER_SECONDS;
  var timerId = null;

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
    remaining = TIMER_SECONDS;
    renderTimer();
  }

  document.getElementById('timer-start').addEventListener('click', startTimer);
  document.getElementById('timer-stop').addEventListener('click', stopTimer);
  document.getElementById('timer-reset').addEventListener('click', resetTimer);
  renderTimer();

  // ---------- To-do list ----------
  var todoForm = document.getElementById('todo-form');
  var todoInput = document.getElementById('todo-input');
  var todoList = document.getElementById('todo-list');
  var todoEmpty = document.getElementById('todo-empty');
  var todos = load(TODO_KEY, []);
  var editingId = null;

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
    if (todo && text) todo.text = text;
    editingId = null;
    save(TODO_KEY, todos);
    renderTodos();
  }

  function renderTodos() {
    todoList.innerHTML = '';
    todoEmpty.classList.toggle('hidden', todos.length > 0);

    todos.forEach(function (todo) {
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
    todos.push({ id: Date.now(), text: text, done: false });
    save(TODO_KEY, todos);
    todoInput.value = '';
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
