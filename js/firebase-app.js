// js/firebase-app.js
import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// === FUNZIONI PROFILI ===

// ritorna il documento del profilo dell’utente corrente
async function getCurrentProfile(user) {
  const refDoc = doc(db, "profiles", user.uid);
  const snap = await getDoc(refDoc);
  return snap.exists() ? snap.data() : null;
}

// salva profilo nel DB + foto (se presente)
async function saveProfile(user, profileData, maybeFile) {
  let photoUrl = profileData.photoUrl || null;

  if (maybeFile) {
    const storageRef = ref(storage, `profilePhotos/${user.uid}`);
    await uploadBytes(storageRef, maybeFile);
    photoUrl = await getDownloadURL(storageRef);
  }

  const refDoc = doc(db, "profiles", user.uid);
  await setDoc(
    refDoc,
    {
      ...profileData,
      photoUrl,
      updatedAt: new Date(),
    },
    { merge: true }
  );
}

// ritorna tutti i profili per la dashboard
async function getAllProfiles() {
  const snap = await getDocs(collection(db, "profiles"));
  const arr = [];
  snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
  return arr;
}

// ritorna un singolo profilo
async function getProfileById(id) {
  const refDoc = doc(db, "profiles", id);
  const snap = await getDoc(refDoc);
  return snap.exists() ? { id, ...snap.data() } : null;
}

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  // DB helpers
  getCurrentProfile,
  saveProfile,
  getAllProfiles,
  getProfileById,
};
