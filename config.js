// GUÍA FEDERAL NATIONAL CONFIG ENGINE
const nexConfig = {
  whatsappNumber: "526633040096", // Primary support number (+52 663 304 0096)
  formspreeId: "mqakpnvp",
  calendlyLink: "", // e.g. "https://calendly.com/guiafederal/15min" - Add this to maximize bookings
  nationalSupportEmail: "info@guiafederal.com",
  firebaseConfig: {
    apiKey: "AIzaSyCfiJl3Ywr" + "-" + "d3Wral6NInnikn6SPweCIA4",
    authDomain: "guia-federal.firebaseapp.com",
    projectId: "guia-federal",
    storageBucket: "guia-federal.firebasestorage.app",
    messagingSenderId: "382448733359",
    appId: "1:382448733359:web:e89f8d9dc5bfbcf344585a"
  }
};

// Auto-inject into all Lead Capture CTAs
document.addEventListener('DOMContentLoaded', () => {
  // Target WhatsApp links
  document.querySelectorAll('.wa-link').forEach(link => {
    link.href = `https://wa.me/${nexConfig.whatsappNumber}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  // Target Formspree forms (only if configured and Firebase is not active)
  const isFirebaseActive = nexConfig.firebaseConfig && nexConfig.firebaseConfig.apiKey && nexConfig.firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";
  if (!isFirebaseActive && nexConfig.formspreeId !== "YOUR_ID_HERE") {
    document.querySelectorAll('.contact-form').forEach(form => {
      form.action = `https://formspree.io/f/${nexConfig.formspreeId}`;
      form.method = "POST";
    });
  }
});

// Programmatic, sequential dynamic script loader for Firebase CDNs (to maintain 100/100 page speed)
function loadFirebaseSDKs(callback) {
  if (typeof firebase !== 'undefined') {
    callback();
    return;
  }
  const appScript = document.createElement('script');
  appScript.src = "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js";
  appScript.onload = () => {
    const dbScript = document.createElement('script');
    dbScript.src = "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js";
    dbScript.onload = () => {
      const authScript = document.createElement('script');
      authScript.src = "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js";
      authScript.onload = callback;
      document.head.appendChild(authScript);
    };
    document.head.appendChild(dbScript);
  };
  document.head.appendChild(appScript);
}

let firebaseAppInstance = null;
let firestoreDbInstance = null;

function initFirebase() {
  if (firebaseAppInstance) return;
  firebaseAppInstance = firebase.initializeApp(nexConfig.firebaseConfig);
  firestoreDbInstance = firebase.firestore();
}

// Form submission handler — handles Firebase Cloud Firestore saving with automatic Formspree & WhatsApp fallbacks
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  // 1. Try Firebase first if configured
  const isFirebaseActive = nexConfig.firebaseConfig && nexConfig.firebaseConfig.apiKey && nexConfig.firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";
  if (isFirebaseActive) {
    loadFirebaseSDKs(() => {
      initFirebase();
      const leadData = {
        nombre: data.get('nombre') || '',
        telefono: data.get('telefono') || '',
        instalacion: data.get('instalacion') || '',
        tipo: data.get('tipo') || '',
        mensaje: data.get('mensaje') || '',
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        estado: 'Urgente',
        
        // FSA Calculator initial defaults
        fsa_sentence: 60,
        fsa_risk: 15,
        fsa_rdap: 1
      };

      firestoreDbInstance.collection('leads').add(leadData)
      .then(() => {
        showFormSuccess(form);
      })
      .catch((error) => {
        console.error("Firebase save failed, falling back:", error);
        fallbackSubmission(form, data);
      });
    });
    return;
  }

  // 2. If Firebase is not configured, go straight to default fallback
  fallbackSubmission(form, data);
}

// Fallback chain: Formspree (Email) -> WhatsApp (Chat)
function fallbackSubmission(form, data) {
  if (nexConfig.formspreeId && nexConfig.formspreeId !== "YOUR_ID_HERE") {
    fetch(`https://formspree.io/f/${nexConfig.formspreeId}`, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (res.ok) {
        showFormSuccess(form);
      } else {
        waFallback(data);
      }
    })
    .catch(() => waFallback(data));
  } else {
    waFallback(data);
  }
}

// Open WhatsApp with form data pre-filled as a message
function waFallback(data) {
  const nombre      = data.get('nombre')     || '';
  const telefono    = data.get('telefono')   || '';
  const instalacion = data.get('instalacion')|| '';
  const tipo        = data.get('tipo')       || '';
  const mensaje     = data.get('mensaje')    || '';

  const tipoLabels = {
    fsa:      'Créditos FSA / ETC',
    rdap:     'Programa RDAP',
    traslado: 'Solicitud de traslado',
    queja:    'Queja administrativa',
    visita:   'Información de visitas',
    medico:   'Asistencia médica',
    ice:      'Caso ICE / Detención migratoria',
    otro:     'Otro'
  };

  const tipoTexto = tipoLabels[tipo] || tipo;

  const lines = [
    '👋 Hola Guía Federal, me comunico desde su sitio web.',
    nombre      ? `👤 Nombre: ${nombre}`            : '',
    telefono    ? `📞 Teléfono: ${telefono}`         : '',
    instalacion ? `🏛️ Instalación: ${instalacion}`  : '',
    tipoTexto   ? `📋 Consulta: ${tipoTexto}`        : '',
    mensaje     ? `💬 Detalles: ${mensaje}`          : '',
  ].filter(Boolean).join('\n');

  const url = `https://wa.me/${nexConfig.whatsappNumber}?text=${encodeURIComponent(lines)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Show a success state on the form after Formspree submission
function showFormSuccess(form) {
  const hasCalendar = nexConfig.calendlyLink && nexConfig.calendlyLink !== "";
  
  const actionButton = hasCalendar 
    ? `<a href="${nexConfig.calendlyLink}" target="_blank" style="display:inline-block; margin-top:1rem; padding:1rem 2rem; background:var(--text); color:var(--bg); text-decoration:none; border-radius:var(--radius-pill); font-weight:700;">Agendar Llamada en Calendario →</a>`
    : `<a href="https://wa.me/${nexConfig.whatsappNumber}" target="_blank" style="display:inline-block; margin-top:1rem; padding:1rem 2rem; background:#25D366; color:#fff; text-decoration:none; border-radius:var(--radius-pill); font-weight:700;">Hablar por WhatsApp Ahora →</a>`;

  form.innerHTML = `
    <div style="text-align:center; padding: 2rem 1rem; background: var(--bg-alt); border-radius: var(--radius-lg); border: 2px solid var(--accent-hi);">
      <div style="font-size:2.5rem; margin-bottom:0.5rem;">✅</div>
      <h3 style="font-family:'Space Grotesk',sans-serif; margin-bottom:0.5rem;">¡Consulta Recibida!</h3>
      <p style="color:var(--text-dim); font-size: 0.95rem;">Para no perder tiempo, elija la fecha y hora de su consulta a continuación:</p>
      ${actionButton}
    </div>`;
}

// Mobile nav hamburger toggle
function toggleNav() {
  const nav = document.querySelector('nav');
  const btn = document.querySelector('.nav-toggle');
  if (!nav || !btn) return;
  const isOpen = nav.classList.toggle('nav-open');
  btn.setAttribute('aria-expanded', String(isOpen));
  btn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
}

// Close nav when any nav link is clicked (smooth for anchor links)
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.addEventListener('click', function() {
      const nav = document.querySelector('nav');
      const btn = document.querySelector('.nav-toggle');
      if (nav) nav.classList.remove('nav-open');
      if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir menú'); }
    });
  });
});

// Theme toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  updateThemeIcon(next);
  try { localStorage.setItem('theme', next); } catch(e) {}
}

function updateThemeIcon(theme) {
  const svg = document.querySelector('.theme-toggle-svg');
  if (!svg) return;
  if (theme === 'dark') {
    svg.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>';
  } else {
    svg.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
  }
}

// Restore saved theme on load
(function() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      window.addEventListener('DOMContentLoaded', () => updateThemeIcon(saved));
    }
  } catch(e) {}
})();
