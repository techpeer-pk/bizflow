/*
 * Biz Flow admin (/admino) — sign in with Email/Password, then browse contact-form enquiries in a table
 * (search, sort, pages) and open one in a dialog to see every detail, change its status or delete it.
 * Access is decided by firestore.rules: only users with a document in "admins" (ID = their UID) get in.
 */
import { app, db } from "./firebase.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-lite.js";

const auth = getAuth(app);
const D = window.BIZFLOW;
const $ = (id) => document.getElementById(id);
const dialog = $("enquiry-dialog");

let enquiries = []; // newest first, as loaded
const table = { search: "", sort: null, dir: 1, page: 1, size: 10 };
let current = null; // enquiry open in the dialog

const VIEWS = ["view-loading", "view-login", "view-reset", "view-denied", "view-enquiries"];
const show = (id) => VIEWS.forEach((v) => ($(v).hidden = v !== id));

// Must match the status list in firestore.rules.
const STATUSES = { new: "New", contacted: "Contacted", closed: "Closed" };
const statusOf = (q) => (STATUSES[q.status] ? q.status : "new");

const LOGIN_ERRORS = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/missing-password": "Please enter your password.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "No connection. Check your internet and try again.",
  "auth/user-disabled": "This account has been disabled."
};

// Enquiries are typed by the public, so everything shown is escaped.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const serviceName = (id) => (D.divisions.find((d) => d.id === id) || { name: id }).name;
const packageName = (id) => (D.packages.find((p) => p.id === id) || { name: id }).name;
const when = (ts) => (ts ? ts.toDate().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "");

const statusSetter = (el) => (text, isError) => {
  el.textContent = text;
  el.classList.toggle("is-error", Boolean(isError));
  el.classList.toggle("show", Boolean(text));
};
const setListStatus = statusSetter($("list-status"));
const setDialogStatus = statusSetter($("dlg-note"));
const setResetStatus = statusSetter($("reset-status"));

// A spinner in the button while its action runs; the button can't be pressed twice.
const busy = (button, text) => {
  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  button.innerHTML = `<span class="spinner" aria-hidden="true"></span> ${text}`;
};
const idle = (button, text) => {
  button.disabled = false;
  button.removeAttribute("aria-busy");
  button.textContent = text;
};

/* ---------- Sign in / out ---------- */
const loginForm = $("view-login");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = loginForm.querySelector('button[type="submit"]');
  const email = loginForm.elements.email.value.trim();
  const password = loginForm.elements.password.value;
  $("login-error").textContent = "";
  if (!email || !password) {
    $("login-error").textContent = "Please enter your email and password.";
    return;
  }
  busy(button, "Signing in…");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
    showPassword($("a-password"), false);
  } catch (err) {
    $("login-error").textContent = LOGIN_ERRORS[err.code] || "Couldn't sign in. Please try again.";
  } finally {
    idle(button, "Sign in");
  }
});

/* ---------- Show / hide password ---------- */
function showPassword(input, visible) {
  const toggle = document.querySelector(`[data-toggle="${input.id}"]`);
  input.type = visible ? "text" : "password";
  toggle.setAttribute("aria-pressed", String(visible));
  toggle.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  toggle.querySelector(".pw-show").hidden = visible;
  toggle.querySelector(".pw-hide").hidden = !visible;
}

document.querySelectorAll("[data-toggle]").forEach((toggle) =>
  toggle.addEventListener("click", () => {
    const input = $(toggle.dataset.toggle);
    showPassword(input, input.type === "password");
    input.focus();
  })
);

/* ---------- Forgot password ---------- */
const resetForm = $("view-reset");

const RESET_ERRORS = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/missing-email": "Please enter your email address.",
  "auth/too-many-requests": "Too many requests. Please wait a few minutes and try again.",
  "auth/network-request-failed": "No connection. Check your internet and try again."
};

$("forgot-link").addEventListener("click", () => {
  resetForm.elements.email.value = loginForm.elements.email.value.trim();
  $("reset-error").textContent = "";
  setResetStatus("");
  show("view-reset");
  resetForm.elements.email.focus();
});

$("back-to-login").addEventListener("click", () => {
  $("login-error").textContent = "";
  show("view-login");
  loginForm.elements.email.focus();
});

async function sendReset(email) {
  // The link in the email opens Firebase's reset page; its "Continue" button brings the admin back here.
  // That only works on domains listed in Firebase Auth → Settings → Authorized domains, so fall back without it.
  try {
    await sendPasswordResetEmail(auth, email, { url: window.location.origin + window.location.pathname });
  } catch (err) {
    if (err.code === "auth/unauthorized-continue-uri" || err.code === "auth/invalid-continue-uri") {
      await sendPasswordResetEmail(auth, email);
    } else {
      throw err;
    }
  }
}

resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = resetForm.querySelector('button[type="submit"]');
  const input = resetForm.elements.email;
  const email = input.value.trim();
  $("reset-error").textContent = "";
  setResetStatus("");
  if (!email || !input.checkValidity()) {
    $("reset-error").textContent = "Please enter a valid email address.";
    input.focus();
    return;
  }
  busy(button, "Sending…");
  try {
    await sendReset(email);
    setResetStatus(`If ${email} has an account, a reset link is on its way. Check your inbox and spam folder.`);
  } catch (err) {
    // Same message whether or not the account exists, so the form can't be used to discover admin emails.
    if (err.code === "auth/user-not-found") {
      setResetStatus(`If ${email} has an account, a reset link is on its way. Check your inbox and spam folder.`);
    } else {
      $("reset-error").textContent = RESET_ERRORS[err.code] || "Couldn't send the reset link. Please try again.";
    }
  } finally {
    idle(button, "Send reset link");
  }
});

$("sign-out").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async (user) => {
  $("admin-user").hidden = !user;
  $("admin-email").textContent = user ? user.email : "";
  $("admin-tabs").hidden = true; // shown once the user is confirmed as an admin
  if (!user) {
    enquiries = [];
    if (dialog.open) dialog.close();
    renderTable();
    show("view-login");
    return;
  }

  show("view-loading");
  let isAdmin = false;
  try {
    isAdmin = (await getDoc(doc(db, "admins", user.uid))).exists();
  } catch {
    // Treated as "no access" below; the page shows the UID so an owner can add it.
  }
  if (auth.currentUser !== user) return; // signed out while checking
  if (!isAdmin) {
    $("denied-uid").textContent = user.uid;
    show("view-denied");
    return;
  }
  $("admin-tabs").hidden = false;
  show("view-enquiries");
  loadEnquiries();
});

/* ---------- Data table ---------- */
async function loadEnquiries() {
  setListStatus("Loading enquiries…");
  try {
    const snap = await getDocs(query(collection(db, "enquiries"), orderBy("createdAt", "desc")));
    enquiries = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderTable();
    setListStatus("");
  } catch (err) {
    setListStatus(
      err.code === "permission-denied"
        ? "This account doesn't have access to enquiries."
        : "Couldn't load enquiries. Check your connection and press Refresh.",
      true
    );
  }
}

const SEARCH_FIELDS = ["name", "email", "phone", "institute", "city"];

function visibleRows() {
  const term = table.search.toLowerCase();
  const rows = term
    ? enquiries.filter((q) => SEARCH_FIELDS.some((f) => String(q[f] || "").toLowerCase().includes(term)))
    : enquiries.slice();
  if (table.sort) {
    const key = table.sort;
    rows.sort((a, b) => {
      const x = String(a[key] || "");
      const y = String(b[key] || "");
      if (!x || !y) return x ? -1 : y ? 1 : 0; // blanks always last
      return table.dir * x.localeCompare(y, undefined, { sensitivity: "base", numeric: true });
    });
  }
  return rows;
}

const cell = (v) => (v ? esc(v) : '<span class="muted">—</span>');

function renderTable() {
  const rows = visibleRows();
  const pages = Math.max(1, Math.ceil(rows.length / table.size));
  table.page = Math.min(Math.max(1, table.page), pages);
  const start = (table.page - 1) * table.size;
  const pageRows = rows.slice(start, start + table.size);

  $("enquiry-count").textContent = `(${enquiries.length})`;
  $("dt-body").innerHTML = pageRows.length
    ? pageRows
        .map(
          (q) => `
      <tr>
        <td>${cell(q.name)}</td>
        <td>${cell(q.email)}</td>
        <td>${cell(q.phone)}</td>
        <td class="dt-action">
          <button class="btn btn-sm btn-line" type="button" data-view="${esc(q.id)}">View</button>
        </td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="4" class="dt-empty">${enquiries.length ? "No enquiries match your search." : "No enquiries yet."}</td></tr>`;

  $("dt-info").textContent = rows.length
    ? `Showing ${start + 1}–${start + pageRows.length} of ${rows.length}` +
      (rows.length < enquiries.length ? ` (filtered from ${enquiries.length})` : "")
    : "";
  $("dt-page").textContent = `Page ${table.page} of ${pages}`;
  $("dt-prev").disabled = table.page <= 1;
  $("dt-next").disabled = table.page >= pages;

  document.querySelectorAll(".dt th[data-sort]").forEach((th) => {
    const state = th.dataset.sort !== table.sort ? "none" : table.dir === 1 ? "ascending" : "descending";
    th.setAttribute("aria-sort", state);
  });
}

$("refresh").addEventListener("click", loadEnquiries);

$("dt-search").addEventListener("input", (e) => {
  table.search = e.target.value.trim();
  table.page = 1;
  renderTable();
});

$("dt-size").addEventListener("change", (e) => {
  table.size = Number(e.target.value);
  table.page = 1;
  renderTable();
});

document.querySelectorAll(".dt th[data-sort] button").forEach((button) =>
  button.addEventListener("click", () => {
    const key = button.parentElement.dataset.sort;
    table.dir = table.sort === key ? -table.dir : 1;
    table.sort = key;
    renderTable();
  })
);

$("dt-prev").addEventListener("click", () => {
  table.page--;
  renderTable();
});
$("dt-next").addEventListener("click", () => {
  table.page++;
  renderTable();
});

$("dt-body").addEventListener("click", (e) => {
  const button = e.target.closest("[data-view]");
  if (!button) return;
  const q = enquiries.find((x) => x.id === button.dataset.view);
  if (q) openEnquiry(q);
});

/* ---------- Detail dialog ---------- */
$("dlg-status").innerHTML = Object.entries(STATUSES)
  .map(([v, label]) => `<option value="${v}">${label}</option>`)
  .join("");

function openEnquiry(q) {
  current = q;
  // [label, html, wide] — wide items take a full row on small screens.
  const details = [
    ["Name", esc(q.name)],
    ["Institute", esc(q.institute), true],
    ["Email", q.email && `<a href="mailto:${esc(q.email)}">${esc(q.email)}</a>`, true],
    ["Phone", q.phone && `<a href="tel:${esc(q.phone)}">${esc(q.phone)}</a>`],
    ["Institute type", esc(q.type)],
    ["Campuses", esc(q.campuses)],
    ["City", esc(q.city)],
    ["Package", esc(q.package ? packageName(q.package) : "Not sure yet")],
    ["Interested in", esc((q.services || []).map(serviceName).join(", ")), true],
    ["Sent via", q.via === "whatsapp" ? "WhatsApp" : "Website form"],
    ["Received", esc(when(q.createdAt))]
  ];

  $("dlg-title").textContent = q.institute || "Enquiry";
  $("dlg-sub").textContent = [q.name, when(q.createdAt)].filter(Boolean).join(" · ");
  $("dlg-meta").innerHTML = details
    .map(([k, v, wide]) => `<div${wide ? ' class="wide"' : ""}><dt>${k}</dt><dd>${v || '<span class="muted">—</span>'}</dd></div>`)
    .join("");
  $("dlg-message").innerHTML = q.message ? esc(q.message) : '<span class="muted">No message.</span>';
  $("dlg-status").value = statusOf(q);
  $("dlg-delete").disabled = false;
  setDialogStatus("");
  dialog.showModal();
}

dialog.addEventListener("click", (e) => {
  // A click on the backdrop lands on the <dialog> itself; clicks inside land on its content.
  if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
});

$("dlg-status").addEventListener("change", async (e) => {
  const select = e.target;
  const q = current;
  const previous = statusOf(q);
  select.disabled = true;
  try {
    await updateDoc(doc(db, "enquiries", q.id), { status: select.value });
    q.status = select.value;
    setDialogStatus(`Status set to ${STATUSES[q.status]}.`);
  } catch {
    select.value = previous;
    setDialogStatus("Couldn't update the status. Please try again.", true);
  } finally {
    select.disabled = false;
  }
});

$("dlg-delete").addEventListener("click", async (e) => {
  const button = e.currentTarget;
  const q = current;
  if (!window.confirm(`Delete the enquiry from ${q.institute}? This can't be undone.`)) return;
  button.disabled = true;
  try {
    await deleteDoc(doc(db, "enquiries", q.id));
    enquiries = enquiries.filter((x) => x !== q);
    dialog.close();
    renderTable();
    setListStatus(`Enquiry from ${q.institute} deleted.`);
  } catch {
    button.disabled = false;
    setDialogStatus("Couldn't delete the enquiry. Please try again.", true);
  }
});
