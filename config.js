// GUÍA FEDERAL NATIONAL CONFIG ENGINE
const nexConfig = {
  whatsappNumber: "526633040096", // Primary support number (+52 663 304 0096)
  web3formsKey: "67eff60b-8ac3-4cde-ab5a-5b13ffff5520",
  calendlyLink: "", // e.g. "https://calendly.com/guiafederal/15min"
  nationalSupportEmail: "info@guiafederal.net",
  firebaseConfig: {
    apiKey: "AIzaSyCfiJl3Ywr" + "-" + "d3Wral6NInnikn6SPweCIA4",
    authDomain: "guia-federal.firebaseapp.com",
    projectId: "guia-federal",
    storageBucket: "guia-federal.firebasestorage.app",
    messagingSenderId: "382448733359",
    appId: "1:382448733359:web:e89f8d9dc5bfbcf344585a"
  }
};

// Auto-inject into all Lead Capture CTAs & attach form handlers
document.addEventListener('DOMContentLoaded', () => {
  // Target WhatsApp links
  document.querySelectorAll('.wa-link').forEach(link => {
    link.href = `https://wa.me/${nexConfig.whatsappNumber}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  // Attach form handler to ALL .contact-form forms that don't already have onsubmit
  // This covers blog forms that previously used direct Formspree POST
  document.querySelectorAll('.contact-form').forEach(form => {
    if (!form.hasAttribute('onsubmit')) {
      form.addEventListener('submit', handleFormSubmit);
    }
  });
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

// ═══════════════════════════════════════════════════════════
// FORM SUBMISSION — Web3Forms email + Firebase CRM (parallel)
// ═══════════════════════════════════════════════════════════

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  const leadData = {
    nombre:      data.get('nombre')      || '',
    telefono:    data.get('telefono')     || '',
    instalacion: data.get('instalacion')  || '',
    tipo:        data.get('tipo')         || '',
    mensaje:     data.get('mensaje')      || '',
    cargos:      data.get('cargos')       || '',
    pagina:      window.location.pathname
  };

  // 1. Send email to info@guiafederal.net via Web3Forms
  sendEmailNotification(leadData);

  // 2. Save to Firebase CRM (parallel, non-blocking)
  saveToFirebaseCRM(leadData);

  // 3. Show success state immediately
  showFormSuccess(form);
}

// Email delivery via Web3Forms → info@guiafederal.net
function sendEmailNotification(leadData) {
  const payload = {
    access_key: nexConfig.web3formsKey,
    subject: `🚨 Nueva Consulta — ${leadData.tipo || 'General'} | Guía Federal`,
    from_name: leadData.nombre || 'Visitante Web',
    // Fields with readable labels for the email body
    'Nombre': leadData.nombre,
    'Teléfono / WhatsApp': leadData.telefono,
    'Instalación': leadData.instalacion,
    'Tipo de Caso': leadData.tipo,
    'Mensaje': leadData.mensaje,
    'Cargos': leadData.cargos,
    'Página de Origen': window.location.href
  };

  // Remove empty optional fields for cleaner email
  ['Instalación', 'Cargos'].forEach(key => {
    if (!payload[key]) delete payload[key];
  });

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(result => {
    if (!result.success) {
      console.warn('Web3Forms delivery warning:', result.message);
      // If email fails, open WhatsApp as backup
      waFallback(leadData);
    }
  })
  .catch(err => {
    console.error('Email delivery error:', err);
    waFallback(leadData);
  });
}

// Firebase CRM persistence (parallel to email)
function saveToFirebaseCRM(leadData) {
  const isFirebaseActive = nexConfig.firebaseConfig && nexConfig.firebaseConfig.apiKey && nexConfig.firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";
  if (!isFirebaseActive) return;

  loadFirebaseSDKs(() => {
    initFirebase();
    firestoreDbInstance.collection('leads').add({
      nombre:      leadData.nombre,
      telefono:    leadData.telefono,
      instalacion: leadData.instalacion,
      tipo:        leadData.tipo,
      mensaje:     leadData.mensaje,
      cargos:      leadData.cargos,
      pagina:      leadData.pagina,
      created_at:  firebase.firestore.FieldValue.serverTimestamp(),
      estado:      'Urgente',
      // FSA Calculator defaults
      fsa_sentence: 60,
      fsa_risk: 15,
      fsa_rdap: 1
    }).catch(err => console.error('Firebase CRM save error:', err));
  });
}

// WhatsApp fallback — opens chat with pre-filled message
function waFallback(leadData) {
  // Accept both FormData and plain objects
  const get = (key) => {
    if (leadData instanceof FormData) return leadData.get(key) || '';
    return leadData[key] || '';
  };

  const nombre      = get('nombre');
  const telefono    = get('telefono');
  const instalacion = get('instalacion');
  const tipo        = get('tipo');
  const mensaje     = get('mensaje');

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

// Show a success state on the form
function showFormSuccess(form) {
  const hasCalendar = nexConfig.calendlyLink && nexConfig.calendlyLink !== "";
  
  const actionButton = hasCalendar 
    ? `<a href="${nexConfig.calendlyLink}" target="_blank" style="display:inline-block; margin-top:1rem; padding:1rem 2rem; background:var(--text); color:var(--bg); text-decoration:none; border-radius:var(--radius-pill); font-weight:700;">Agendar Llamada en Calendario →</a>`
    : `<a href="https://wa.me/${nexConfig.whatsappNumber}" target="_blank" style="display:inline-block; margin-top:1rem; padding:1rem 2rem; background:#25D366; color:#fff; text-decoration:none; border-radius:var(--radius-pill); font-weight:700;">Hablar por WhatsApp Ahora →</a>`;

  form.innerHTML = `
    <div style="text-align:center; padding: 2rem 1rem; background: var(--bg-alt); border-radius: var(--radius-lg); border: 2px solid var(--accent-hi);">
      <div style="font-size:2.5rem; margin-bottom:0.5rem;">✅</div>
      <h3 style="font-family:'Space Grotesk',sans-serif; margin-bottom:0.5rem;">¡Consulta Recibida!</h3>
      <p style="color:var(--text-dim); font-size: 0.95rem;">Le responderemos a la brevedad. Para no perder tiempo:</p>
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
