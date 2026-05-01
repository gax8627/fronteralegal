# NexBorder Website — Full Audit Report
**Date:** April 22, 2026  
**Scope:** All 11 HTML pages, JS/CSS/config files, sitemap, manifest, and service worker  
**Method:** Full file read + live federal law research (USSC, BOP, DOJ sources)

---

## 🔴 CRITICAL ISSUES — Legal / Factual Errors

These must be corrected immediately. They contain legally inaccurate statements that could mislead clients or expose NexBorder to liability.

---

### 1. RDAP: "Garantizada por ley" is Legally Wrong
**File:** `index.html` (bento grid), `rdap-guide.html`  
**Current text:** *"Hasta 12 meses de reducción de sentencia garantizada por ley"*

**What's wrong:** The word **"garantizada"** (guaranteed) is factually and legally incorrect. The RDAP sentence reduction is **not guaranteed** — it is a discretionary benefit subject to:
- Sentence length: up to 12 months only for inmates serving **37 months or more**. Inmates serving 31–36 months receive up to **9 months**; under 31 months, up to **6 months**.
- Offense exclusions: inmates with prior convictions for homicide, robbery, rape, arson, kidnapping, aggravated assault, or child sexual abuse **cannot receive the reduction**.
- BOP discretion: even eligible inmates can be denied the reduction.

**Fix:** Change to: *"Hasta 12 meses de reducción de sentencia para quienes califican bajo los criterios del BOP"* and remove "garantizada por ley" entirely.

---

### 2. FSA Earned Time Credits: Rate is Misrepresented
**File:** `fsa-guide.html`, `index.html`  
**Current text:** *"Hasta 15 días por cada 30 días de programación"*

**What's wrong:** The 15 days/30 days rate only applies to inmates with a **low or minimum PATTERN risk score**. Inmates assessed as **medium or high risk earn only 10 days per 30 days**. The site implies the 15-day rate is universal, which is incorrect.

Additionally, FSA Earned Time Credits (ETC) apply toward **prerelease custody** (halfway house / home confinement), not a direct sentence reduction — a legally important distinction.

**Fix:** Specify the two rates (10 days for medium/high risk; 15 days for low/minimum risk) and clarify that credits apply to prerelease custody placement.

---

### 3. MCC New York Listed as an Active Facility
**File:** `facilities.html`  
**Current text:** *"MCC New York — Logística crítica para familias en el Distrito Sur de NY"*

**What's wrong:** The Metropolitan Correctional Center (MCC) New York **has been closed since August 2021** and has no confirmed reopening date. The BOP confirmed in 2023 that its "future is unknown." Listing it as an operational facility where NexBorder provides services is factually incorrect and will mislead families.

**Fix:** Remove MCC New York from the directory, or add a closed status note. Families in SDNY should be directed to MDC Brooklyn (Metropolitan Detention Center) instead.

---

### 4. USP Coleman: "Complejo federal más grande de EE.UU." — Inaccurate
**File:** `coleman-usp.html`  
**Current text:** *"Asistencia técnica para el complejo federal más grande de EE.UU."*

**What's wrong:** **FCI Fort Dix** in New Jersey is the largest single federal prison in the United States by inmate count (~3,090 inmates). The Coleman complex is large, but this claim is not supported.

**Fix:** Remove the "más grande" claim, or replace with a factually accurate description like "uno de los complejos penales federales más importantes del Sureste."

---

## 🟡 IMPORTANT ISSUES — Broken Functionality & Factual Errors

### 5. WhatsApp Number is a Placeholder — All CTAs are Broken
**File:** `config.js`  
**Current value:** `whatsappNumber: "1234567890"`

Every single CTA button on the site (`.wa-link`) points to `https://wa.me/1234567890`, which is not a real number. All lead capture is broken until this is replaced with the actual business WhatsApp number.

---

### 6. Formspree ID Not Configured
**File:** `config.js`  
**Current value:** `formspreeId: "YOUR_ID_HERE"`

The contact form action is broken. Replace with your actual Formspree form ID.

---

### 7. `toggleTheme()` Function Not Defined — JavaScript Error
**File:** `index.html` (nav SVG element), all pages that inherit the same nav  
**Issue:** The theme toggle SVG calls `onclick="toggleTheme()"` but this function is **not defined** in either `config.js` or `translations.js`. Clicking the moon/sun icon throws a `ReferenceError` in the browser console, breaking user experience in every browser.

**Fix:** Add a `toggleTheme()` function to `config.js`:
```javascript
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}
```

---

### 8. Copy-Paste Error: "RDAP Florida" on Seagoville (Texas) Page
**File:** `facilities/tx/seagoville-fci.html`  
**Issue:** A bento item in Module 3 is labeled **"RDAP Florida"** on a page about FCI Seagoville in Texas. This is clearly a copy-paste artifact from the Coleman page.

**Fix:** Change to "RDAP Texas" or simply "RDAP Seagoville."

---

### 9. Victorville Jurisdiction Label Incorrect
**File:** `facilities/ca/victorville-usp.html`  
**Current text:** `"Jurisdicción: CA-West"`

**What's wrong:** USP Victorville (San Bernardino County) falls within the **Central District of California (CACD)**, not the Western District. The Western District is in the Los Angeles/San Pedro area.

**Fix:** Change to `"Jurisdicción: CA-Central (CACD)"`

---

### 10. Missing `navHome` Translation Key
**File:** `index.html`, `translations.js`  
**Issue:** `index.html` references `data-t="navHome"` but the `translations` object in `translations.js` has no `navHome` key for either `es` or `en`. This means the nav link text is silently blank in some browsers when the language switches.

**Fix:** Add to translations:
```javascript
es: { navHome: "Inicio", ... }
en: { navHome: "Home", ... }
```

---

### 11. Facilities Page: Language Toggle Broken
**File:** `facilities.html`  
**Issue:** The language button uses `class="lang-toggle"` with no `onclick` handler. All other pages use `class="lang-btn" onclick="toggleLang()"`. The toggle does nothing on the facilities page.

**Fix:** Change to `<button class="lang-btn" onclick="toggleLang()">EN / ES</button>`

---

### 12. PWA Icons Missing
**File:** `manifest.json`  
**Issue:** The manifest references `icon-192.png` and `icon-512.png` but neither file exists in the project directory. The PWA install prompt will fail or show a broken icon.

**Fix:** Add the icon files or remove the manifest reference until they're created.

---

## 🟢 SEO & MINOR ISSUES

### 13. Inner Pages Have No `<meta name="description">` Tags
Only `index.html` has a meta description. All other pages (`fsa-guide.html`, `rdap-guide.html`, `facilities.html`, and all facility spoke pages) lack descriptions, which hurts SEO.

**Fix:** Add unique, keyword-rich meta descriptions to every page.

### 14. No Open Graph (OG) or Twitter Card Meta Tags
None of the pages have Open Graph tags (`og:title`, `og:description`, `og:image`). Social shares to WhatsApp, Facebook, and Twitter will show blank previews — critical for a service that drives leads via WhatsApp.

### 15. No `<link rel="canonical">` Tags
Without canonical tags, search engines may treat `.html` extensions and clean URLs (via vercel.json rewrites) as duplicate pages, splitting SEO authority.

### 16. No `hreflang` Tags for Bilingual Content
The site serves ES/EN content from the same URLs via JavaScript language switching. Without `hreflang` annotations, Google cannot properly index both language versions.

### 17. No Favicon `<link>` Tag in HTML
No page has `<link rel="icon">`. The manifest handles PWA icons, but the browser tab favicon requires a separate HTML link tag.

### 18. Sitemap Missing `<lastmod>` for Facility Spoke Pages
**File:** `sitemap.xml`  
The 5 facility spoke URLs have no `<lastmod>` tag. Add dates for proper crawl scheduling.

### 19. Service Worker Caches Only 4 Assets
**File:** `sw.js`  
The service worker only caches `/`, `/index.html`, `/index.css`, and `/manifest.json`. Offline users visiting `/fsa-guide.html`, `/rdap-guide.html`, or facility pages will get a network error. Expand the cache list or use a cache-then-network strategy.

### 20. `llms.txt` References a Non-Existent Tool
**File:** `llms.txt`  
Lists "Interactive FSA Calculator: /index.html#tools" but there is no FSA calculator on the site and no `#tools` anchor in `index.html`.

### 21. `btn-cta-secondary` and `hero-actions` Classes Not Fully Defined in CSS
**File:** `index.html`, `index.css`  
`index.html` uses `.btn-cta-secondary` and `.hero-actions` but `index.css` has no defined styles for these. Buttons render unstyled, which may look broken in some environments.

---

## ✅ WHAT IS CORRECT (Verified by Research)

| Claim | Status | Source |
|---|---|---|
| 94 federal judicial districts | ✅ Correct | USSC data |
| 122 BOP institutions | ✅ Correct | BOP / BJS Dec 2024 |
| USP Victorville is high-security | ✅ Correct | Wikipedia / BOP |
| FCI Fort Dix is low-security | ✅ Correct | BOP |
| FCI Seagoville is program-rich (RDAP, SOTP) | ✅ Correct | BOP / PrisonProfessors |
| FCI Terminal Island has Care Level 3 / RDAP | ✅ Correct | BOP / OIG |
| RDAP residential phase is 9 months | ✅ Correct | FAMM FAQ / USSC |
| BP-A0629 is the visitor approval form | ✅ Correct | BOP standard form |
| BP-8, BP-9, BP-10 are the admin remedy chain | ✅ Correct | 28 CFR § 542 |
| Western Union / MoneyGram for commissary | ✅ Correct | BOP policy |
| FSA ETC credits applied via SENTRY system | ✅ Correct | BOP / USSC |

---

## PRIORITY ACTION LIST

| # | Priority | Action | File |
|---|---|---|---|
| 1 | 🔴 Critical | Remove "garantizada por ley" from RDAP | `index.html`, `rdap-guide.html` |
| 2 | 🔴 Critical | Correct FSA ETC rate to show 10/15 days by risk level | `fsa-guide.html`, `index.html` |
| 3 | 🔴 Critical | Remove / mark MCC New York as closed | `facilities.html` |
| 4 | 🔴 Critical | Remove "más grande de EE.UU." claim from Coleman | `coleman-usp.html` |
| 5 | 🟡 Important | Set real WhatsApp number in config.js | `config.js` |
| 6 | 🟡 Important | Set real Formspree ID in config.js | `config.js` |
| 7 | 🟡 Important | Add `toggleTheme()` function | `config.js` |
| 8 | 🟡 Important | Fix "RDAP Florida" copy-paste error | `seagoville-fci.html` |
| 9 | 🟡 Important | Fix Victorville jurisdiction to "CA-Central" | `victorville-usp.html` |
| 10 | 🟡 Important | Fix lang toggle on facilities page | `facilities.html` |
| 11 | 🟡 Important | Add `navHome` to translations | `translations.js` |
| 12 | 🟡 Important | Add PWA icons or remove manifest references | `manifest.json` |
| 13 | 🟢 SEO | Add meta descriptions to all inner pages | All HTML files |
| 14 | 🟢 SEO | Add OG tags for WhatsApp/social sharing | All HTML files |
| 15 | 🟢 SEO | Add canonical tags and hreflang | All HTML files |
| 16 | 🟢 Minor | Define `btn-cta-secondary` and `hero-actions` in CSS | `index.css` |
| 17 | 🟢 Minor | Expand service worker cache list | `sw.js` |
| 18 | 🟢 Minor | Fix or remove FSA Calculator link in llms.txt | `llms.txt` |

---

*Audit conducted April 22, 2026. Research sources: USSC First Step Act ETC Data (Dec 2024), BJS Federal Prisoner Statistics (2025), BOP.gov facility data, FAMM RDAP FAQ, Wikipedia (USP Victorville, MCC New York, FCI Fort Dix, USP Coleman).*
