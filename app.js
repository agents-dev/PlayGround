(() => {
  const STORAGE_KEY = 'daymark-tasks-v1';
  const list = document.querySelector('#task-list');
  const form = document.querySelector('#add-form');
  const input = document.querySelector('#new-task');
  const filterButtons = [...document.querySelectorAll('.filter')];
  let tasks = [];
  let filter = 'all';
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) tasks = saved.filter(task => task && typeof task.id === 'string' && typeof task.text === 'string').map(task => ({id: task.id, text: task.text, completed: Boolean(task.completed)}));
  } catch { tasks = []; }

  const today = new Date();
  document.querySelector('#today-label').textContent = new Intl.DateTimeFormat('en-US', {weekday:'short', month:'short', day:'numeric'}).format(today);
  const escapeHTML = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  function render() {
    const done = tasks.filter(task => task.completed).length;
    const active = tasks.length - done;
    const shown = tasks.filter(task => filter === 'all' || (filter === 'active' ? !task.completed : task.completed));
    document.querySelector('#progress-number').textContent = done;
    document.querySelector('#total-number').textContent = tasks.length;
    document.querySelector('#progress-percent').textContent = `${tasks.length ? Math.round(done / tasks.length * 100) : 0}%`;
    document.querySelector('#progress-fill').style.width = `${tasks.length ? done / tasks.length * 100 : 0}%`;
    document.querySelector('#progress-note').textContent = tasks.length && done === tasks.length ? 'Look at you, making it happen. ✨' : done ? 'You’re making lovely progress. Keep going.' : 'Every small step counts. Start with one.';
    document.querySelector('#task-total').textContent = tasks.length;
    document.querySelector('#count-all').textContent = tasks.length;
    document.querySelector('#count-active').textContent = active;
    document.querySelector('#count-completed').textContent = done;
    document.querySelector('#clear-completed').hidden = done === 0;
    document.querySelector('#list-subtitle').textContent = tasks.length ? `${active} ${active === 1 ? 'thing' : 'things'} left to do today.` : 'A fresh start, whenever you need it.';
    document.querySelector('#empty-title').textContent = tasks.length ? 'All clear in this view' : 'Nothing on your list yet';
    document.querySelector('#empty-copy').textContent = tasks.length ? 'Try another filter to see your tasks.' : 'Add a task above and give your day a little direction.';
    document.querySelector('#empty-state').classList.toggle('visible', shown.length === 0);
    list.innerHTML = shown.map(task => `<li class="task-item${task.completed ? ' is-complete' : ''}" data-id="${escapeHTML(task.id)}"><button class="task-check" aria-label="${task.completed ? 'Mark incomplete' : 'Mark complete'}">${task.completed ? '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2 6 2.5 2.5L10 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</button><span class="task-text">${escapeHTML(task.text)}</span><div class="task-actions"><button class="task-action edit" aria-label="Edit task" title="Edit">✎</button><button class="task-action delete" aria-label="Delete task" title="Delete">×</button></div></li>`).join('');
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    tasks.unshift({id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, text, completed:false});
    save(); render(); input.value = ''; input.focus();
  });
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    filterButtons.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    render();
  }));
  list.addEventListener('click', event => {
    const row = event.target.closest('.task-item');
    if (!row) return;
    const task = tasks.find(item => item.id === row.dataset.id);
    if (!task) return;
    if (event.target.closest('.task-check')) task.completed = !task.completed;
    else if (event.target.closest('.delete')) tasks = tasks.filter(item => item.id !== task.id);
    else if (event.target.closest('.edit')) {
      const label = row.querySelector('.task-text');
      const editor = document.createElement('input');
      editor.className = 'edit-input'; editor.value = task.text; editor.maxLength = 160; editor.setAttribute('aria-label', 'Edit task');
      label.replaceWith(editor); editor.focus(); editor.select();
      const commit = () => { const value = editor.value.trim(); if (value) task.text = value; save(); render(); };
      editor.addEventListener('keydown', key => { if (key.key === 'Enter') commit(); if (key.key === 'Escape') render(); });
      editor.addEventListener('blur', commit, {once:true}); return;
    } else return;
    save(); render();
  });
  document.querySelector('#clear-completed').addEventListener('click', () => { tasks = tasks.filter(task => !task.completed); save(); render(); });
  document.querySelector('#theme-toggle').addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('daymark-dark', document.body.classList.contains('dark') ? '1' : '0'); });
  if (localStorage.getItem('daymark-dark') === '1') document.body.classList.add('dark');
  render();
})();
