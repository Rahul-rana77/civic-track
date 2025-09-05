import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {
      apiKey: "AIzaSyBOu0N08YATCslU033o0f8oJH6WsJsqdUA",
      authDomain: "civic-track-just-coders.firebaseapp.com",
      projectId: "civic-track-just-coders",
      storageBucket: "civic-track-just-coders.firebasestorage.app",
      messagingSenderId: "388460209383",
      appId: "1:388460209383:web:33fd4e50b5ac99c15cae42",
      measurementId: "G-X80TQQCSZ0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("✅ Logged in:", userCredential.user);
      window.location.href = "/home/home.html";
    })
    .catch((error) => {
      console.error("❌ Login failed:", error.message);
      alert("Invalid email or password.");
    });
});
