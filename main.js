import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔑 Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJR1wOyDvKbyEnc3UvYh4VQ-kwHqBrRwo",
  authDomain: "invitacion-84d9c.firebaseapp.com",
  projectId: "invitacion-84d9c",
  storageBucket: "invitacion-84d9c.firebasestorage.app",
  messagingSenderId: "742743345142",
  appId: "1:742743345142:web:b4dee8943965300779a9d7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Leer código de la URL
function getCodigoFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("codigo") || "";
}

async function cargarInvitado(codigo) {
  if (!codigo) {
    document.getElementById("pasesText").textContent = "Usa tu link con código.";
    return;
  }
  const ref = doc(db, "invitados", codigo);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    document.getElementById("pasesText").textContent =
      `${data.nombre}, tienes ${data.pases} pases asignados.`;
    document.getElementById("codigo").value = codigo;
    document.getElementById("nombre").value = data.nombre || "";
    if (data.asistencia) {
      document.getElementById("asistencia").value = data.asistencia;
    }
  } else {
    document.getElementById("pasesText").textContent = "Código no válido.";
  }
}

async function confirmarAsistencia(codigo, nombre, asistencia) {
  await setDoc(doc(db, "invitados", codigo), {
    nombre,
    asistencia
  }, { merge: true });
  document.getElementById("rsvpStatus").textContent = "¡Confirmación registrada!";
}

// Inicializar
const codigo = getCodigoFromURL();
cargarInvitado(codigo);

document.getElementById("rsvpForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const asistencia = document.getElementById("asistencia").value;
  if (!codigo) {
    document.getElementById("rsvpStatus").textContent = "Falta el código en el link.";
    return;
  }
  await confirmarAsistencia(codigo, nombre, asistencia);
});
