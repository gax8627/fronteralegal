const translations = {
  es: {
    navHome:     "Inicio",
    navFSA:      "Guía FSA",
    navDir:      "Directorio Nacional",
    btnConsult:  "Consulta Gratis",
    heroTitle:   "Justicia Federal. Presencia Nacional.",
    heroSub:     "De California a Florida, NexBorder es la autoridad técnica para familias que navegan el sistema federal de EE.UU. en los 94 distritos judiciales.",
    // Wizard
    wizardTitle:  "¿Cuál es la situación de su familiar?",
    wizardStep1:  "Recién arrestado (BOP / ICE)",
    wizardStep2:  "Sentencia activa — reducción de tiempo",
    wizardStep3:  "Créditos FSA / ETC no aplicados",
    wizardStep4:  "Quiero acceder al programa RDAP",
    wizardStep5:  "Necesito solicitar un traslado",
    wizardRegion: "¿En qué región está la instalación?",
    wizardUrgency:"¿Qué tan urgente es su caso?",
    wizardCta:    "Iniciar Consulta por WhatsApp →"
  },
  en: {
    navHome:     "Home",
    navFSA:      "FSA Guide",
    navDir:      "National Directory",
    btnConsult:  "Free Consultation",
    heroTitle:   "Federal Justice. National Presence.",
    heroSub:     "From California to Florida, NexBorder is the technical authority for families navigating the U.S. federal system across all 94 judicial districts.",
    // Wizard
    wizardTitle:  "What is your family member's situation?",
    wizardStep1:  "Recently arrested (BOP / ICE)",
    wizardStep2:  "Active sentence — time reduction",
    wizardStep3:  "FSA / ETC credits not applied",
    wizardStep4:  "I want to access the RDAP program",
    wizardStep5:  "I need to request a transfer",
    wizardRegion: "Which region is the facility in?",
    wizardUrgency:"How urgent is your case?",
    wizardCta:    "Start WhatsApp Consultation →"
  }
};

let currentLang = 'es';

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    } else {
      console.warn(`[NexBorder i18n] Missing translation: ${lang}.${key}`);
    }
  });
  document.documentElement.lang = lang;
}

function toggleLang() {
  setLanguage(currentLang === 'es' ? 'en' : 'es');
}
