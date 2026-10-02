let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// ---------- searchNotes(word) ----------
function searchNotes(word) {
  const w = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(w));
}

// ---------- longestNote() ----------
function longestNote() {
  if (notes.length === 0) return null;
  let longest = notes[0];
  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }
  return longest;
}

// ---------- countByCategory() ----------
function countByCategory() {
  const counts = {};
  for (let i = 0; i < notes.length; i++) {
    const cat = notes[i].category;
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return counts;
}

// ---------- getSummary() ----------
function getSummary() {
  const total = notes.length;
  const word = total === 1 ? "note" : "notes";
  const counts = countByCategory();
  const parts = Object.keys(counts).map((cat) => `${counts[cat]} ${cat}`);
  return `${total} ${word}: ${parts.join(", ")}.`;
}

// ---------- isDuplicate(text) ----------
function isDuplicate(text) {
  const normalized = text.trim().toLowerCase();
  return notes.some((note) => note.text.trim().toLowerCase() === normalized);
}

// ---------- addNote(text, category) ----------
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];
  const trimmed = typeof text === "string" ? text.trim() : "";

  if (trimmed.length < 1 || trimmed.length > 200) {
    console.log(`Cannot add note: text must be 1–200 characters (got ${trimmed.length}).`);
    return false;
  }
  if (!validCategories.includes(category)) {
    console.log(`Cannot add note: category must be one of ${validCategories.join(", ")}.`);
    return false;
  }
  if (isDuplicate(trimmed)) {
    console.log(`Cannot add note: "${trimmed}" is a duplicate.`);
    return false;
  }

  const newId = notes.length === 0 ? 1 : Math.max(...notes.map((n) => n.id)) + 1;
  notes.push({ id: newId, text: trimmed, category });
  console.log(`Added note #${newId}: "${trimmed}" [${category}]`);
  return true;
}

// ================= TESTS =================

// ---------- searchNotes ----------
console.log("--- searchNotes ---");
console.log(searchNotes("milk"));
// Normal: [{ id: 1, text: "Buy milk and bread", category: "personal" }]

console.log(searchNotes("JAVASCRIPT"));
// Normal (case-insensitive): [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("zzz"));
// Edge (no results): []

// ---------- longestNote ----------
console.log("--- longestNote ---");
console.log(longestNote());
// Normal: { id: 3, text: "Email the project report to Grace", category: "work" }

const backupLongest = notes.splice(0);
console.log(longestNote());
// Edge (empty array): null
notes.push(...backupLongest);

// ---------- countByCategory ----------
console.log("--- countByCategory ---");
console.log(countByCategory());
// Normal: { personal: 2, study: 2, work: 1 }

const backupCount = notes.splice(0);
console.log(countByCategory());
// Edge (empty array): {}
notes.push(...backupCount);

// ---------- getSummary ----------
console.log("--- getSummary ---");
console.log(getSummary());
// Normal: "5 notes: 2 personal, 2 study, 1 work."

const backupSummary = notes.splice(0);
notes.push({ id: 99, text: "Only note", category: "personal" });
console.log(getSummary());
// Edge (one note): "1 note: 1 personal."
notes.splice(0);
notes.push(...backupSummary);

// ---------- isDuplicate ----------
console.log("--- isDuplicate ---");
console.log(isDuplicate("  buy MILK and bread "));
// Normal (case + spaces ignored): true

console.log(isDuplicate("Something new"));
// Edge (no duplicate): false

// ---------- addNote ----------
console.log("--- addNote ---");
console.log(addNote("Read a book", "personal"));
// Normal: logs Added note #6: "Read a book" [personal] → returns true

console.log(addNote("Buy milk and bread", "personal"));
// Edge (duplicate): logs Cannot add note: "Buy milk and bread" is a duplicate. → returns false

console.log(addNote("", "work"));
// Edge (too short): logs Cannot add note: text must be 1–200 characters (got 0). → returns false

console.log(addNote("Hi", "banana"));
// Edge (bad category): logs Cannot add note: category must be one of personal, work, study. → returns false