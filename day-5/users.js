// ---------------------------------------------------------------------------// DOM references
// ---------------------------------------------------------------------------
const loadBtn = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusEl = document.getElementById('status');
const usersList = document.getElementById('users-list');

// ---------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------
let allUsers = [];        // the full array of users fetched from the API
let hasLoaded = false;    // guard so we don't refetch unnecessarily

// ---------------------------------------------------------------------------
// renderUsers(list)
// Draws any array of users into #users-list using createElement + textContent.
// ---------------------------------------------------------------------------
function renderUsers(list) {
  // Clear out the previous list.
  usersList.innerHTML = '';

  // Empty state – either nothing matched the filter, or no users loaded yet.
  if (list.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty-message';

    if (hasLoaded && allUsers.length > 0) {
      emptyItem.textContent = 'No users match your filter.';
    } else if (hasLoaded) {
      emptyItem.textContent = 'No users available.';
    } else {
      emptyItem.textContent = 'No users loaded yet. Click "Load users".';
    }

    usersList.appendChild(emptyItem);
    return;
  }

  // Build one card per user.
  list.forEach((user) => {
    const li = document.createElement('li');
    li.className = 'user-card';

    // --- Name -------------------------------------------------------------
    const nameEl = document.createElement('h3');
    nameEl.className = 'user-name';
    nameEl.textContent = user.name;
    li.appendChild(nameEl);

    // --- Email ------------------------------------------------------------
    const emailEl = document.createElement('p');
    emailEl.className = 'user-detail';

    const emailLabel = document.createElement('span');
    emailLabel.className = 'label';
    emailLabel.textContent = 'Email';

    const emailValue = document.createElement('span');
    emailValue.textContent = user.email;

    emailEl.appendChild(emailLabel);
    emailEl.appendChild(emailValue);
    li.appendChild(emailEl);

    // --- City -------------------------------------------------------------
    const cityEl = document.createElement('p');
    cityEl.className = 'user-detail';

    const cityLabel = document.createElement('span');
    cityLabel.className = 'label';
    cityLabel.textContent = 'City';

    const cityValue = document.createElement('span');
    cityValue.textContent = user.address && user.address.city
      ? user.address.city
      : '—';

    cityEl.appendChild(cityLabel);
    cityEl.appendChild(cityValue);
    li.appendChild(cityEl);

    // --- Company ----------------------------------------------------------
    const companyEl = document.createElement('p');
    companyEl.className = 'user-detail';

    const companyLabel = document.createElement('span');
    companyLabel.className = 'label';
    companyLabel.textContent = 'Company';

    const companyValue = document.createElement('span');
    companyValue.textContent = user.company && user.company.name
      ? user.company.name
      : '—';

    companyEl.appendChild(companyLabel);
    companyEl.appendChild(companyValue);
    li.appendChild(companyEl);

    usersList.appendChild(li);
  });
}

// ---------------------------------------------------------------------------
// applyFilter()
// Filters the stored array by name (case-insensitive) and re-renders.
// Never makes a new network request.
// ---------------------------------------------------------------------------
function applyFilter() {
  const term = filterInput.value.trim().toLowerCase();

  if (term === '') {
    renderUsers(allUsers);
    return;
  }

  const filtered = allUsers.filter((user) =>
    user.name.toLowerCase().includes(term)
  );

  renderUsers(filtered);
}

// ---------------------------------------------------------------------------
// loadUsers()
// Async fetch with try / catch / finally. Disables the button while loading.
// ---------------------------------------------------------------------------
async function loadUsers() {
  // Reset UI for the loading state.
  loadBtn.disabled = true;
  statusEl.textContent = 'Loading users…';
  statusEl.className = '';
  usersList.innerHTML = '';

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Store the fetched users so the filter can work offline.
    allUsers = data;
    hasLoaded = true;

    // Success message.
    statusEl.textContent = `Loaded ${allUsers.length} users.`;
    statusEl.className = 'success';

    // Clear any stale filter value and render everyone.
    filterInput.value = '';
    renderUsers(allUsers);
  } catch (error) {
    // Reset stored state so the filter can't show stale data.
    allUsers = [];
    hasLoaded = false;

    statusEl.textContent = `Something went wrong: ${error.message}`;
    statusEl.className = 'error';

    renderUsers(allUsers);
  } finally {
    // Always re-enable the button.
    loadBtn.disabled = false;
  }
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------
loadBtn.addEventListener('click', loadUsers);

filterInput.addEventListener('input', () => {
  // Only filter if we actually have data; otherwise just keep the empty state.
  if (!hasLoaded) {
    return;
  }
  applyFilter();
});

// Initial paint: show the "not loaded yet" empty state.
renderUsers(allUsers);