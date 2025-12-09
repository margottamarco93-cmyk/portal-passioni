// js/auth.js

// 1. Config Firebase (quella che mi hai passato)
const firebaseConfig = {
  apiKey: "AIzaSyDWisOm9z0LrSV0BczsKD5qYuVfswwT7jw",
  authDomain: "progetto-cooperativa-passioni.firebaseapp.com",
  databaseURL: "https://progetto-cooperativa-passioni-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "progetto-cooperativa-passioni",
  storageBucket: "progetto-cooperativa-passioni.firebasestorage.app",
  messagingSenderId: "578783174328",
  appId: "1:578783174328:web:9770c86aa93d7fa3055e4d"
};

// 2. Inizializza Firebase (compat)
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db   = firebase.firestore();

// Codice aziendale richiesto per registrarsi
const COMPANY_CODE = "ABC123"; // <-- CAMBIALO TU

// 3. Se l'utente è già loggato, lo mando direttamente su home.html
auth.onAuthStateChanged((user) => {
  if (user) {
    // Già autenticato → vai in dashboard
    window.location.href = "home.html";
  }
});

// 4. Funzione chiamata dal bottone "Login"
function openLoginModal() {
  const email = prompt("Email aziendale:");
  if (!email) return;

  const password = prompt("Password:");
  if (!password) return;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      // Se ok, onAuthStateChanged farà il redirect
    })
    .catch((error) => {
      console.error(error);
      alert("Errore nel login: " + error.message);
    });
}

// 5. Funzione chiamata dal bottone "Registrati"
function openRegistrationModal() {
  const email = prompt("Email aziendale:");
  if (!email) return;

  const password = prompt("Crea una password (min 6 caratteri):");
  if (!password) return;

  const code = prompt("Inserisci il codice aziendale:");
  if (!code) return;

  if (code !== COMPANY_CODE) {
    alert("Codice aziendale non valido.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(async (cred) => {
      const user = cred.user;

      // Qui puoi salvare info base sul profilo (anche vuote)
      await db.collection("profiles").doc(user.uid).set({
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert("Registrazione completata. Ora verrai reindirizzato alla dashboard.");
      // onAuthStateChanged farà il redirect
    })
    .catch((error) => {
      console.error(error);
      alert("Errore nella registrazione: " + error.message);
    });
}

// 6. Espongo le funzioni globalmente per gli onclick in index.html
window.openLoginModal = openLoginModal;
window.openRegistrationModal = openRegistrationModal;
