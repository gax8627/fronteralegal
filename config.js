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

const DEFAULT_WA_MSG = encodeURIComponent("Hola Guía Federal, necesito ayuda urgente con un arresto en San Diego");

// Auto-inject into all Lead Capture CTAs & attach form handlers
document.addEventListener('DOMContentLoaded', () => {
  // Target WhatsApp links and ensure context-aware pre-filled parameters
  document.querySelectorAll('.wa-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (!href.includes('wa.me') && !href.startsWith('#') && !href.includes('#contact') && !href.includes('#consulta')) {
      link.href = `https://wa.me/${nexConfig.whatsappNumber}?text=${DEFAULT_WA_MSG}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else if (href.includes('wa.me') && !href.includes('text=')) {
      link.href = href + (href.includes('?') ? '&' : '?') + `text=${DEFAULT_WA_MSG}`;
    }
  });

  // Auto-inject .mobile-emergency-bar on all pages if missing
  if (!document.querySelector('.mobile-emergency-bar')) {
    const bar = document.createElement('div');
    bar.className = 'mobile-emergency-bar';
    bar.setAttribute('aria-label', 'Contacto de urgencia');
    bar.innerHTML = `
      <a href="tel:+526633040096" class="btn-emerg-call">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        Llamar 24/7
      </a>
      <a href="https://wa.me/526633040096?text=${DEFAULT_WA_MSG}" class="btn-emerg-wa wa-link" target="_blank" rel="noopener">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp Urgencias
      </a>
    `;
    document.body.appendChild(bar);
  }

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
  form.innerHTML = `
    <div style="text-align:center; padding: 2rem 1rem; background: var(--bg-alt); border-radius: var(--radius-lg); border: 2px solid var(--accent-hi);">
      <div style="font-size:2.5rem; margin-bottom:0.5rem;">✅</div>
      <h3 style="font-family:'Space Grotesk',sans-serif; margin-bottom:0.5rem;">¡Consulta Recibida!</h3>
      <p style="color:var(--text-dim); font-size: 0.95rem; margin-bottom: 1.25rem;">Hemos registrado sus datos. Para asegurar su atención inmediata:</p>
      <div style="display:flex; flex-direction:column; gap:0.75rem; max-width:320px; margin:0 auto;">
        <button onclick="openBookingModal()" style="padding:0.85rem 1.25rem; background:var(--accent-hi); color:#fff; border:none; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.9rem;">📅 Seleccionar Día y Hora (Calendario) →</button>
        <a href="https://wa.me/${nexConfig.whatsappNumber}" target="_blank" rel="noopener" style="padding:0.85rem 1.25rem; background:#25D366; color:#fff; text-decoration:none; border-radius:8px; font-weight:700; font-size:0.9rem; display:inline-block;">💬 Hablar por WhatsApp Ahora →</a>
      </div>
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

// Premium Glassmorphic Cookie Consent Banner Injection
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('cookie-consent') === 'true' || localStorage.getItem('cookie-consent') === 'false') {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'cookie-consent-banner';
  banner.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    left: 24px;
    max-width: 480px;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 1.25rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
    z-index: 10000;
    font-family: 'Inter', sans-serif;
    color: #f8fafc;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    opacity: 0;
    transform: translateY(20px);
  `;
  
  const style = document.createElement('style');
  style.innerHTML = `
    @media (min-width: 640px) {
      #cookie-consent-banner {
        left: auto;
      }
    }
    #cookie-accept-btn:hover { background: #fbbf24 !important; }
    #cookie-decline-btn:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.3) !important; }
  `;
  document.head.appendChild(style);

  banner.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:0.75rem;">
      <div style="display:flex; align-items:flex-start; gap:0.5rem;">
        <span style="font-size:1.25rem; line-height:1.25rem;">🍪</span>
        <div>
          <h4 style="margin:0 0 0.25rem 0; font-family:'Space Grotesk',sans-serif; font-size:0.95rem; font-weight:600; color:#fff; letter-spacing: 0.02em;">Consentimiento de Cookies</h4>
          <p style="margin:0; font-size:0.8rem; line-height:1.4; color:#94a3b8;">
            Utilizamos cookies propias y de terceros para analizar la navegación y mejorar tu experiencia. Para más información, consulta nuestro <a href="/disclaimer" style="color:#fcd34d; text-decoration:none; font-weight:500;">Aviso Legal</a>.
          </p>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.25rem;">
        <button id="cookie-decline-btn" style="background:transparent; border:1px solid rgba(255,255,255,0.2); color:#cbd5e1; padding:0.4rem 0.75rem; border-radius:6px; font-size:0.8rem; font-weight:500; cursor:pointer; transition:all 0.2s;">Rechazar</button>
        <button id="cookie-accept-btn" style="background:#fcd34d; border:none; color:#0f172a; padding:0.4rem 1rem; border-radius:6px; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.2s;">Aceptar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);

  requestAnimationFrame(() => {
    banner.style.opacity = '1';
    banner.style.transform = 'translateY(0)';
  });

  const hideBanner = () => {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    setTimeout(() => banner.remove(), 400);
  };

  document.getElementById('cookie-accept-btn').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'true');
    hideBanner();
  });

  document.getElementById('cookie-decline-btn').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'false');
    hideBanner();
  });
});

// ═══════════════════════════════════════════════════════════
// NATIVE APPOINTMENT SCHEDULER ENGINE (CUSTOM CALENDLY)
// ═══════════════════════════════════════════════════════════

let selectedBookingDate = '';
let selectedBookingSlot = '';

function injectBookingModalHTML() {
  if (document.getElementById('booking-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'booking-overlay';
  overlay.className = 'booking-overlay';
  
  // Calculate next 3 days
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : d.toLocaleDateString('es-ES', { weekday: 'short' });
    const formatted = d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    dates.push({ full: d.toISOString().split('T')[0], label: `${dayName} ${formatted}` });
  }

  selectedBookingDate = dates[0].full;

  overlay.innerHTML = `
    <div class="booking-modal">
      <button class="booking-close" onclick="closeBookingModal()" aria-label="Cerrar">✕</button>
      <div class="booking-header">
        <h3>📅 Agendar Consulta Diagnóstica (15 Min)</h3>
        <p>Seleccione el día y la hora que mejor se adapte a su familia. Confirmación inmediata.</p>
      </div>

      <form id="native-booking-form" onsubmit="handleNativeBookingSubmit(event)">
        <!-- Step 1: Date & Time -->
        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.5rem; color:var(--text);">1. Seleccione el Día:</label>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;" id="booking-date-selector">
            ${dates.map((d, index) => `
              <button type="button" class="booking-slot-btn ${index === 0 ? 'selected' : ''}" onclick="selectBookingDate('${d.full}', this)">
                ${d.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.5rem; color:var(--text);">2. Seleccione el Horario (Hora Pacífico / San Diego):</label>
          <div class="booking-slots-grid" id="booking-time-selector">
            <button type="button" class="booking-slot-btn" onclick="selectBookingSlot('09:00 AM', this)">09:00 AM</button>
            <button type="button" class="booking-slot-btn" onclick="selectBookingSlot('11:00 AM', this)">11:00 AM</button>
            <button type="button" class="booking-slot-btn" onclick="selectBookingSlot('01:30 PM', this)">01:30 PM</button>
            <button type="button" class="booking-slot-btn" onclick="selectBookingSlot('04:00 PM', this)">04:00 PM</button>
            <button type="button" class="booking-slot-btn" onclick="selectBookingSlot('06:00 PM', this)">06:00 PM</button>
            <button type="button" class="booking-slot-btn" onclick="selectBookingSlot('07:30 PM', this)">07:30 PM</button>
          </div>
        </div>

        <!-- Step 2: Contact Info -->
        <div style="display:flex; flex-direction:column; gap:0.85rem;">
          <div>
            <label style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:0.3rem;">Nombre Completo:</label>
            <input type="text" name="nombre" required placeholder="Ej. Maria Gonzalez" style="width:100%; padding:0.65rem; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); font-size:0.9rem;">
          </div>
          <div>
            <label style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:0.3rem;">Teléfono / WhatsApp:</label>
            <input type="tel" name="telefono" required placeholder="Ej. +1 (619) 555-0199 o +52 664..." style="width:100%; padding:0.65rem; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); font-size:0.9rem;">
          </div>
          <div>
            <label style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:0.3rem;">Canal Preferido:</label>
            <select name="canal" style="width:100%; padding:0.65rem; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); font-size:0.9rem;">
              <option value="WhatsApp Call/Chat">WhatsApp (Llamada o Mensaje)</option>
              <option value="Llamada Telefónica Normal">Llamada Telefónica Directa</option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn-cta" style="width:100%; margin-top:1.5rem; padding:0.85rem; font-size:0.95rem; font-weight:700;">Confirmar Cita Gratuita →</button>
        <div class="cta-trust-badge" style="margin-top:0.75rem;">🛡️ +150 Familias Atendidas en San Diego · 100% Confidencial</div>
      </form>
      <div id="booking-success-view" style="display:none; text-align:center; padding:1.5rem 0;">
        <div style="font-size:3rem; margin-bottom:0.5rem;">🎉</div>
        <h3 style="font-family:'Space Grotesk',sans-serif; margin-bottom:0.5rem;">¡Cita Agendada con Éxito!</h3>
        <p style="color:var(--text-dim); font-size:0.9rem;" id="booking-confirmation-msg"></p>
        <a id="booking-wa-confirm-btn" href="#" target="_blank" rel="noopener" style="display:inline-block; margin-top:1.25rem; padding:0.85rem 1.75rem; background:#25D366; color:#fff; text-decoration:none; border-radius:8px; font-weight:700;">Confirmar por WhatsApp Ahora →</a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function openBookingModal(serviceTitle) {
  injectBookingModalHTML();
  const overlay = document.getElementById('booking-overlay');
  if (overlay) {
    overlay.classList.add('active');
  }
}

function closeBookingModal() {
  const overlay = document.getElementById('booking-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

function selectBookingDate(dateStr, btn) {
  selectedBookingDate = dateStr;
  document.querySelectorAll('#booking-date-selector .booking-slot-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function selectBookingSlot(slotStr, btn) {
  selectedBookingSlot = slotStr;
  document.querySelectorAll('#booking-time-selector .booking-slot-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function handleNativeBookingSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  if (!selectedBookingSlot) {
    selectedBookingSlot = '01:30 PM';
  }

  const bookingData = {
    nombre: data.get('nombre') || '',
    telefono: data.get('telefono') || '',
    canal: data.get('canal') || 'WhatsApp Call/Chat',
    fecha: selectedBookingDate,
    hora: selectedBookingSlot,
    tipo: 'Cita Agendada Native Scheduler',
    pagina: window.location.pathname
  };

  // Submit to Web3Forms & Firebase
  if (typeof sendEmailNotification === 'function') {
    sendEmailNotification(bookingData);
  }
  if (typeof saveToFirebaseCRM === 'function') {
    saveToFirebaseCRM(bookingData);
  }

  form.style.display = 'none';
  const successView = document.getElementById('booking-success-view');
  const msg = document.getElementById('booking-confirmation-msg');
  const waBtn = document.getElementById('booking-wa-confirm-btn');

  msg.textContent = `Su consulta para el ${bookingData.fecha} a las ${bookingData.hora} vía ${bookingData.canal} ha sido registrada.`;
  
  const waMsg = `Hola Guía Federal, acabo de agendar una consulta de 15 min para el ${bookingData.fecha} a las ${bookingData.hora}.\nNombre: ${bookingData.nombre}\nTeléfono: ${bookingData.telefono}`;
  waBtn.href = `https://wa.me/${nexConfig.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
  
  successView.style.display = 'block';
}

// Auto-wire buttons with class .btn-open-booking
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-open-booking').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });
});


