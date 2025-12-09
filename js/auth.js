// js/auth.js

// 1. Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDWisOm9z0LrSV0BczsKD5qYuVfswwT7jw",
  authDomain: "progetto-cooperativa-passioni.firebaseapp.com",
  databaseURL: "https://progetto-cooperativa-passioni-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "progetto-cooperativa-passioni",
  storageBucket: "progetto-cooperativa-passioni.firebasestorage.app",
  messagingSenderId: "578783174328",
  appId: "1:578783174328:web:9770c86aa93d7fa3055e4d"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

// CAMBIA QUESTO con il vostro codice reale
const COMPANY_CODE = "ABC123";

// Se già loggato, vai alla dashboard
auth.onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "home.html";
  }
});

// ------ LOGIN FORM ------
const loginForm = document.getElementById("login-form");
const loginMsg  = document.getElementById("login-message");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loginMsg.textContent = "";

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      loginMsg.textContent = "Compila tutti i campi.";
      return;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        loginMsg.textContent = "Accesso effettuato, ti reindirizzo...";
        window.location.href = "home.html";
      })
      .catch((err) => {
        console.error(err);
        loginMsg.textContent = "Errore login: " + err.message;
      });
  });
}

// ------ REGISTER FORM ------
const regForm = document.getElementById("register-form");
const regMsg  = document.getElementById("register-message");

if (regForm) {
  regForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    regMsg.textContent = "";

    const email     = document.getElementById("reg-email").value.trim();
    const pass1     = document.getElementById("reg-password").value;
    const pass2     = document.getElementById("reg-password2").value;
    const codeInput = document.getElementById("reg-company-code").value.trim();

    if (!email || !pass1 || !pass2 || !codeInput) {
      regMsg.textContent = "Compila tutti i campi.";
      return;
    }

    if (pass1 !== pass2) {
      regMsg.textContent = "Le password non coincidono.";
      return;
    }

    if (codeInput !== COMPANY_CODE) {
      regMsg.textContent = "Codice aziendale non valido.";
      return;
    }

    try {
      const cred = await auth.createUserWithEmailAndPassword(email, pass1);
      const user = cred.user;

      // profilo base su Firestore
      await db.collection("profiles").doc(user.uid).set({
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      regMsg.textContent = "Registrazione completata. Reindirizzamento...";
      window.location.href = "home.html";
    } catch (err) {
      console.error(err);
      regMsg.textContent = "Errore registrazione: " + err.message;
    }
  });
}
