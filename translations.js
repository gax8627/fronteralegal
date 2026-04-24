const translations = {
  es: {
    navHome: "Inicio",
    heroTitle: "Justicia Federal. Presencia Nacional.",
    heroSub: "De California a Florida, NexBorder es la autoridad técnica bilingüe para familias que navegan el sistema federal de EE.UU. Somos su aliado en los 94 distritos judiciales.",
    navSteps: "Primeros Pasos",
    navDir: "Directorio Nacional",
    navFSA: "Guía FSA",
    btnConsult: "Consulta Nacional Directa",
    wizardTitle: "Inicie su consulta federal:",
    wizardStep1: "Arresto Reciente (BOP / ICE)",
    wizardStep2: "Sentencia Existente (Reducción de Tiempo)",
    logisticTitle: "Logística Nacional Total",
    logisticSub: "NexBorder elimina la distancia entre la familia y el centro de detención. Nuestra red nacional garantiza que la comunicación y los trámites legales fluyan sin importar el estado.",
    footText: "© 2026 NexBorder — National Federal Authority. Atendiendo los 94 distritos judiciales federales."
  },
  en: {
    navHome: "Home",
    heroTitle: "Federal Justice. National Presence.",
    heroSub: "From California to Florida, NexBorder is the bilingual technical authority for families navigating the U.S. federal system. We are your ally across all 94 judicial districts.",
    navSteps: "First Steps",
    navDir: "National Directory",
    navFSA: "FSA Guide",
    btnConsult: "Direct National Consultation",
    wizardTitle: "Start your federal consultation:",
    wizardStep1: "Recent Arrest (BOP / ICE)",
    wizardStep2: "Existing Sentence (Time Reduction)",
    logisticTitle: "Total National Logistics",
    logisticSub: "NexBorder eliminates the distance between the family and the detention center. Our national network ensures that communication and legal procedures flow regardless of the state.",
    footText: "© 2026 NexBorder — National Federal Authority. Serving all 94 federal judicial districts."
  }
};

let currentLang = 'es';

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  document.documentElement.lang = lang;
}

function toggleLang() {
  setLanguage(currentLang === 'es' ? 'en' : 'es');
}
