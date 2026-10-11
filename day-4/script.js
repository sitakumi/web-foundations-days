// ---------- element references ----------
const textarea = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

// ---------- constants ----------
const MAX_CHARS = 200;
const WARN_CHARS = 180;
const DRAFT_KEY = 'note-draft';
const THEME_KEY = 'note-theme';

// ---------- updateCounts ----------
function updateCounts() {
  const text = textarea.value;
  const chars = text.length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  charCount.textContent = `${chars} / ${MAX_CHARS} characters`;
  wordCount.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;

  // character-counter colour states
  charCount.classList.toggle('warning', chars > WARN_CHARS && chars <= MAX_CHARS);
  charCount.classList.toggle('over', chars > MAX_CHARS);
}

// ---------- save draft ----------
function saveDraft() {
  try {
    localStorage.setItem(DRAFT_KEY, textarea.value);
  } catch (e) {
    // storage may be unavailable (private mode, etc.) — ignore
  }
}

// ---------- clear everything ----------
function clearAll() {
  textarea.value = '';
  updateCounts();
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {}
}

// ---------- theme ----------
function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
}

function toggleTheme() {
  const isDark = !document.body.classList.contains('dark');
  applyTheme(isDark);
  try {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  } catch (e) {}
}

// ---------- restore on load ----------
function restoreDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved !== null) {
      textarea.value = saved;
    }
  } catch (e) {}
}

function restoreTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch (e) {}
  // fall back to the OS preference if nothing saved
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved === 'dark' || (saved === null && prefersDark);
  applyTheme(isDark);
}

// ---------- event listeners ----------
textarea.addEventListener('input', () => {
  updateCounts();
  saveDraft();
});

textarea.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    clearAll();
  }
});

clearBtn.addEventListener('click', clearAll);

themeToggle.addEventListener('click', toggleTheme);

restoreDraft();
restoreTheme();
updateCounts();