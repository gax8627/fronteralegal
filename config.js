// GUÍA FEDERAL NATIONAL CONFIG ENGINE
const nexConfig = {
  whatsappNumber: "1234567890", // TODO: Replace with your actual WhatsApp number
  formspreeId: "YOUR_ID_HERE",  // TODO: Replace with your Formspree ID
  nationalSupportEmail: "info@guia-federal.com"
};

// Auto-inject into all Lead Capture CTAs
document.addEventListener('DOMContentLoaded', () => {
  // Target WhatsApp links
  document.querySelectorAll('.wa-link').forEach(link => {
    link.href = `https://wa.me/${nexConfig.whatsappNumber}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  // Target Formspree forms (only if configured)
  if (nexConfig.formspreeId !== "YOUR_ID_HERE") {
    document.querySelectorAll('.contact-form').forEach(form => {
      form.action = `https://formspree.io/f/${nexConfig.formspreeId}`;
      form.method = "POST";
    });
  }
});

// Form submission handler — falls back to WhatsApp if Formspree not configured
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  // If Formspree is configured, submit normally
  if (nexConfig.formspreeId !== "YOUR_ID_HERE") {
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
    return;
  }

  // WhatsApp fallback: pre-fill message with form data
  waFallback(data);
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
  form.innerHTML = `
    <div style="text-align:center; padding: 3rem 1rem;">
      <div style="font-size:3rem; margin-bottom:1rem;">✅</div>
      <h3 style="font-family:'Space Grotesk',sans-serif; margin-bottom:0.5rem;">¡Consulta Enviada!</h3>
      <p style="color:var(--text-dim);">Le responderemos en menos de 24 horas. También puede contactarnos directamente por WhatsApp.</p>
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
