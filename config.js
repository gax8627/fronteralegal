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

  // Target Formspree forms
  document.querySelectorAll('.contact-form').forEach(form => {
    form.action = `https://formspree.io/f/${nexConfig.formspreeId}`;
  });
});

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
