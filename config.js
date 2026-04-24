// NEXBORDER NATIONAL CONFIG ENGINE
const nexConfig = {
  whatsappNumber: "1234567890", // TODO: Replace with your actual WhatsApp number
  formspreeId: "YOUR_ID_HERE",  // TODO: Replace with your Formspree ID
  nationalSupportEmail: "contact@nexborder.com"
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
    '👋 Hola NexBorder, me comunico desde su sitio web.',
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

// Theme toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch(e) {}
}

// Restore saved theme on load
(function() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch(e) {}
})();
