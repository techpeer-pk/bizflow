/*
 * Biz Flow admin profile (/admino/profile/) — account details and changing the password.
 * Signed-out visitors and non-admins are sent back to /admino/, which handles sign-in and access.
 */
import { app, db } from "./firebase.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-lite.js";

const auth = getAuth(app);
const $ = (id) => document.getElementById(id);
const ADMIN_HOME = "../";
const MIN_PASSWORD = 8;

const PASSWORD_ERRORS = {
  "auth/invalid-credential": "Your current password is wrong.",
  "auth/wrong-password": "Your current password is wrong.",
  "auth/weak-password": `Choose a stronger password — at least ${MIN_PASSWORD} characters.`,
  "auth/password-does-not-meet-requirements":
    "That password doesn't meet the password rules. Try a longer one with letters, numbers and symbols.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "No connection. Check your internet and try again.",
  "auth/requires-recent-login": "Please sign out, sign in again, then change your password."
};

const when = (iso) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—");

$("sign-out").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace(ADMIN_HOME);
    return;
  }
  let isAdmin = false;
  try {
    isAdmin = (await getDoc(doc(db, "admins", user.uid))).exists();
  } catch {
    // Treated as "no access": /admino/ explains it and shows the UID.
  }
  if (!isAdmin) {
    window.location.replace(ADMIN_HOME);
    return;
  }

  $("admin-email").textContent = user.email;
  $("admin-user").hidden = false;
  $("admin-tabs").hidden = false;
  $("p-email").textContent = user.email;
  $("p-username").value = user.email;
  $("p-last").textContent = when(user.metadata.lastSignInTime);
  $("p-created").textContent = when(user.metadata.creationTime);
  $("view-loading").hidden = true;
  $("view-profile").hidden = false;
});

/* ---------- Change password ---------- */
const form = $("password-form");
const button = form.querySelector('button[type="submit"]');
const status = $("pw-status");

const fail = (message, field) => {
  $("pw-error").textContent = message;
  if (field) form.elements[field].focus();
};
const setBusy = (busy) => {
  button.disabled = busy;
  if (busy) {
    button.setAttribute("aria-busy", "true");
    button.innerHTML = '<span class="spinner" aria-hidden="true"></span> Updating…';
  } else {
    button.removeAttribute("aria-busy");
    button.textContent = "Update password";
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const current = form.elements.current.value;
  const next = form.elements.next.value;
  const confirm = form.elements.confirm.value;
  $("pw-error").textContent = "";
  status.classList.remove("show");

  if (!current) return fail("Please enter your current password.", "current");
  if (next.length < MIN_PASSWORD) return fail(`Your new password needs at least ${MIN_PASSWORD} characters.`, "next");
  if (next !== confirm) return fail("The new passwords don't match.", "confirm");
  if (next === current) return fail("Your new password must be different from the current one.", "next");

  setBusy(true);
  try {
    // Firebase only lets a user change their password right after signing in, so confirm the current one first.
    const user = auth.currentUser;
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, current));
    await updatePassword(user, next);
    form.reset();
    $("p-username").value = user.email;
    status.textContent = "Your password has been changed.";
    status.classList.add("show");
  } catch (err) {
    fail(PASSWORD_ERRORS[err.code] || "Couldn't change your password. Please try again.");
  } finally {
    setBusy(false);
  }
});
