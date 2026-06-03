# NexBorder / Guía Federal — Full Blog Audit Report
**Date:** June 2, 2026 | **Articles Audited:** 21 | **Auditors:** 3 parallel agents

---

## CRITICAL ISSUES (Fix Before Any New Traffic)

### 1. 🚨 Contact Forms Have No `action` Attribute — ALL 21 Articles
Every article uses `<form method="POST" class="contact-form">` with no `action=""` attribute. **All lead capture is silently failing.** Add a backend endpoint, Formspree/Netlify Forms handler, or JavaScript submit handler to every form.

### 2. 🚨 No Legal Disclaimer — ALL 21 Articles
No article contains a disclaimer stating this is educational information, not legal advice, and that the service is not a law firm. Given the sensitive federal criminal subject matter and extradition advisory services offered, this creates serious professional liability exposure. Add a sitewide disclaimer footer element and/or per-article notice immediately.

### 3. 🚨 Burden of Proof Misstatement — `mula-ciega-federal.html`
The FAQ states: *"El fiscal asume que usted sabía. La carga de la prueba para demostrar la falta de conocimiento recae en la defensa."* **This is legally wrong.** The burden on the element of knowledge (mens rea) always remains with the prosecution under the Beyond a Reasonable Doubt standard. The defense never bears the burden of proving lack of knowledge. Correct immediately — this could actively harm readers.

### 4. 🚨 "Marsden Hearing" Is a State Court Doctrine — `abogado-no-responde-federal.html`
The article tells federal defendants to request a "Marsden Hearing" to replace counsel. *People v. Marsden* (Cal. 1970) applies only in California state court. In federal court, the correct procedure is a **Substitution of Counsel** motion/hearing. This is a specific legal error that must be corrected.

### 5. 🚨 "Tratado de 2026" — `estrategia-extradicion-san-diego-2026.html`
FAQ Q2 references a "treaty of 2026." No such treaty exists. The operative treaty is the U.S.-Mexico Extradition Treaty signed in 1978, in force 1980. Fix immediately.

### 6. 🚨 Unverified Government Program — `programa-deteccion-mula-ciega-tijuana.html`
The article presents a specific Tijuana municipal program (announced by "Pedro Montejo Peterson, Secretario de Desarrollo Económico de Tijuana") as an existing operational program with no verifiable source, press release, or link. If the program does not exist or was not officially confirmed, this is a serious credibility risk. Add a citation or reframe as "proposed/announced."

---

## HIGH PRIORITY ISSUES

### Legal Errors to Fix

| Article | Issue | Fix |
|---|---|---|
| `camino-al-juicio-federal.html` | Grand jury stated as "23 ciudadanos" — max is 23, range is 16–23 | Change to "entre 16 y 23 miembros" per Fed. R. Crim. P. 6(a) |
| `first-step-act-creditos-etc.html` | States FSA ETC credits retroactive from "January 2020" — **WRONG** | ETC program took effect **January 2022** (not 2020) |
| `first-step-act-creditos-etc.html` | ICE detainer / non-citizen FSA claim presented as settled | Add caveat: policy under litigation, varies by circuit as of 2026 |
| `auditoria-pattern-bop-2026.html` | Same ICE detainer issue | Same caveat needed |
| `estrategia-extradicion-san-diego-2026.html` | "98% of U.S. extradition requests granted" — unsourced | Remove or cite actual DOJ/State Dept. data |
| `estrategia-extradicion-san-diego-2026.html` | Time in Mexican custody "often does NOT count" toward U.S. sentence stated as fact | It is discretionary under 18 U.S.C. § 3585(b) — reframe as "you must request this through your attorney" |
| `mula-ciega-federal.html` | Minor Role reduction implying 10 years → 2-3 years without caveat | Add that mandatory minimums still apply without Safety Valve |
| `reducir-sentencia-federal-2026.html` | Safety Valve criminal history: single prior sentence >13 months bars eligibility regardless of point count | Add this caveat to the point-count simplification |
| `presuncion-de-inocencia-explicada.html` | "97% se rinden" conflates all defendants with convicted defendants | Clarify: ~97% of *convictions* are via plea; overall ~90% of charged defendants are convicted |
| `presuncion-de-inocencia-explicada.html` | "Directed Verdict" used for federal criminal proceedings | Correct term is "Judgment of Acquittal" under Fed. R. Crim. P. 29 |
| `abogado-no-responde-federal.html` | Writ of Mandamus described as tool to compel attorney conduct | Mandamus is directed at courts/federal officers, not private attorneys. Revise or remove |
| `extradicion-narcopolitica-2026.html` | Mexican judges "illegally" extend deadlines stated as fact | Reframe as documented pattern, not a legal rule |
| `extradicion-narcopolitica-2026.html` | No Unauthorized Practice of Law disclaimer for extradition advisory services | Add UPL disclaimer |
| `saltar-halfway-house-2026.html` | FSA "obligación de mover internos de bajo riesgo" overstated | BOP retains discretion; not a mandatory obligation |
| `saltar-halfway-house-2026.html` | Title "Saltar la Halfway House" needs disclaimer | Clarify this means requesting BOP pre-release placement, not bypassing a court order |
| `auditoria-pattern-bop-2026.html` | Second Chance Act "garantiza" 12 months of Halfway House | Change to "autoriza hasta" — BOP has discretion, it's not guaranteed |
| `casos-mula-ciega-ejemplos.html` | "La ley ordena declarar al acusado no culpable" overstated | Correct to reflect jury standard: "el jurado debe declararlo no culpable si no hay prueba de conocimiento" |
| `arresto-federal-san-diego-72-horas.html` | MCC San Diego described as near-certain destination | Add Otay Mesa Detention Center and other alternatives |
| `arresto-federal-san-diego-72-horas.html` | Meth quantity: "50g" triggers 10-year minimum | Must specify **pure** meth (50g) vs. mixture (500g) — 21 U.S.C. § 841(b)(1)(A) |
| `extradicion-narcopolitica-2026.html` | Rule of Specialty cited as "Artículo 17 del Tratado" | Verify treaty article number against the 1978 treaty text |

### HTML / Technical Issues (Sitewide)

- **`<main>` and `<article>` wrapper missing** from Articles 2–7 in Group 1, and most others. Only `casos-mula-ciega-ejemplos.html` has the correct semantic structure. Fix across all articles for accessibility and SEO.
- **`config.js` dependency** — all articles defer-load this script. Verify it is deployed and working (form endpoints, WhatsApp routing).
- **`/facilities/ca/mcc-san-diego`** internal link in `arresto-federal-san-diego-72-horas.html` — verify this page exists.

---

## MEDIUM PRIORITY ISSUES

### Broken / Unverified Internal Links (Audit All)

Multiple articles link to slugs that may not exist. Run a full crawl or check each manually:

- `/blog/plea-bargaining-federal`
- `/blog/first-step-act-creditos-etc`
- `/blog/extradicion-narcopolitica-2026`
- `/blog/programa-deteccion-mula-ciega-tijuana`
- `/blog/informantes-y-brady-evidencia`
- `/blog/camino-al-juicio-federal`
- `/blog/saltar-halfway-house-2026`
- `/blog/arresto-federal-san-diego-72-horas`
- `/blog/derecho-a-guardar-silencio`
- `/blog/investigacion-federal-que-hacer`
- `/blog/ser-jefe-de-tu-libertad`
- `/blog/rdap-explicado`
- `/blog/reducir-sentencia-federal-2026`
- `/blog/mula-ciega-federal`
- `/blog/vencer-al-fiscal-federal`
- `/blog/auditoria-pattern-bop-2026`
- `/blog/abogado-no-responde-federal`
- `/blog/presuncion-de-inocencia-explicada`

### Missing Content (Per Article)

| Article | Gap |
|---|---|
| `camino-al-juicio-federal.html` | No section on Supervised Release (libertad supervisada) — critical for this audience |
| `investigacion-federal-que-hacer.html` | No section on digital evidence / phones / cloud storage |
| `arresto-federal-san-diego-72-horas.html` | No mention of CJA appointed counsel for indigent defendants |
| `derecho-a-guardar-silencio.html` | Missing *Berghuis v. Thompkins* (2010): silence alone ≠ invoking the right; must say the words explicitly |
| `derecho-a-guardar-silencio.html` | No distinction between 5th Amendment (pre-charge) vs. 6th Amendment (post-indictment) right to counsel |
| `informantes-y-brady-evidencia.html` | Missing Brady materiality standard — not all withheld evidence requires reversal |
| `informantes-y-brady-evidencia.html` | "90% of federal convictions depend on witnesses" — unsourced, remove or cite |
| `entrevista-pso.html` | Missing Sentencing Memorandum section — the key companion to PSR objections |
| `plea-bargaining-federal.html` | "Automatic deportation" language — deportability depends on offense category; must say "creates grounds for removal" |
| `plea-bargaining-federal.html` | Missing *Lafler v. Cooper* / *Missouri v. Frye* (2012) — Sixth Amendment ineffective assistance in plea negotiations |
| `ser-jefe-de-tu-libertad.html` | Generic advice — add specific BOP program names (RDAP, GED, UNICOR, vocational) with eligibility criteria |
| `rdap-explicado.html` | FSA + RDAP = "under 3 years" for a 5-year sentence presented as typical; it's a best-case scenario |
| `mula-ciega-federal.html` | No reference to applicable statutes (21 U.S.C. §§ 841, 952) |
| `abogado-no-responde-federal.html` | No mention of escalating to the Chief Federal Public Defender |

---

## LOW PRIORITY / NEXT SPRINT

### SEO Improvements

- **OG Images:** 18+ articles use the generic `/assets/brand-og.png`. Add dedicated per-article OG images.
- **BreadcrumbList Schema:** Only `auditoria-pattern-bop-2026.html` has BreadcrumbList JSON-LD. Add to all articles for rich-result eligibility.
- **Author Schema:** All articles use `"@type": "Organization"`. For legal content, E-E-A-T signals favor a named human author. Add `"@type": "Person"` with credentials.
- **dateModified:** All articles have identical `datePublished: 2026-05-15` and no `dateModified`. Add `dateModified` going forward.
- **Title tag length:** `reducir-sentencia-federal-2026.html` (141 chars) and others exceed 60-char display limit. Trim.
- **Meta description:** Several articles are at 160–161 chars (borderline). Keep under 155 for safe display.

### Citation Additions Recommended

| Article | Citation to Add |
|---|---|
| `casos-mula-ciega-ejemplos.html` | 21 U.S.C. § 952 (importation statute) for CASD cases |
| `derecho-a-guardar-silencio.html` | 28 U.S.C. § 1827 (court interpreter statute) |
| `informantes-y-brady-evidencia.html` | 18 U.S.C. § 3500 (Jencks Act) by name |
| `vencer-al-fiscal-federal.html` | 18 U.S.C. § 3161 (Speedy Trial Act) in body text |
| `camino-al-juicio-federal.html` | U.S.S.G. reference for Sentencing Guidelines |

---

## ARTICLE-BY-ARTICLE SUMMARY

| # | Article | Legal Rating | Content | SEO | HTML | Critical Issues |
|---|---|---|---|---|---|---|
| 1 | casos-mula-ciega-ejemplos | ✅ Good | Good | Excellent | Excellent | Reword jury acquittal language |
| 2 | saltar-halfway-house-2026 | ⚠️ Fair | Fair | Good | ⚠️ Fair | Fix FSA overclaim; add disclaimer on "saltar" framing |
| 3 | investigacion-federal-que-hacer | ✅ Good | Good | Good | ⚠️ Fair | Add `<main>` wrapper; add digital evidence section |
| 4 | camino-al-juicio-federal | ⚠️ Fair | Good | Good | ⚠️ Fair | Fix grand jury size; add supervised release section |
| 5 | programa-deteccion-mula-ciega-tijuana | 🚨 Critical | Fair | Good | ⚠️ Fair | Source or reframe unverified government program |
| 6 | extradicion-narcopolitica-2026 | ⚠️ Fair | Fair | Good | ⚠️ Fair | Fix treaty article #; add UPL disclaimer; fix "illegal" framing |
| 7 | ser-jefe-de-tu-libertad | ✅ Good | Good | Good | ⚠️ Fair | Add specific BOP program names |
| 8 | entrevista-pso | ✅ Good | Good | Good | Good | Add Sentencing Memorandum section |
| 9 | arresto-federal-san-diego-72-horas | ⚠️ Fair | Good | Excellent | Good | Fix meth quantity distinction; add alternative detention facilities |
| 10 | derecho-a-guardar-silencio | ✅ Good | Good | Good | Good | Add *Berghuis v. Thompkins* warning |
| 11 | first-step-act-creditos-etc | 🚨 Critical | Good | Good | Good | Fix retroactivity date (2020 → 2022); verify ICE policy |
| 12 | informantes-y-brady-evidencia | ✅ Good | Good | Good | Good | Remove unsourced "90%" stat; add materiality standard |
| 13 | estrategia-extradicion-san-diego-2026 | 🚨 Critical | Good | Excellent | Good | Remove "98%" stat; fix "treaty of 2026" language |
| 14 | plea-bargaining-federal | ✅ Good | Excellent | Good | Good | Fix "automatic deportation" language |
| 15 | reducir-sentencia-federal-2026 | ⚠️ Fair | Good | Good | Good | Clarify Safety Valve eligibility |
| 16 | mula-ciega-federal | 🚨 Critical | Good | Good | Good | Fix burden of proof misstatement |
| 17 | vencer-al-fiscal-federal | ✅ Good | Good | Good | Good | Clarify dismissal with/without prejudice distinction |
| 18 | auditoria-pattern-bop-2026 | ✅ Good | Excellent | Excellent | Excellent | Add ICE caveat; fix "garantiza" → "autoriza hasta" |
| 19 | abogado-no-responde-federal | 🚨 Critical | Good | Good | Good | Fix Marsden Hearing; fix Mandamus description |
| 20 | presuncion-de-inocencia-explicada | ⚠️ Fair | Good | Good | Good | Fix 97% stat framing; fix "Directed Verdict" terminology |
| 21 | rdap-explicado | ⚠️ Fair | Good | Good | Good | Add caveats to FSA+RDAP combination claim |

---

## IMMEDIATE ACTION CHECKLIST

- [ ] Fix contact form `action` attributes sitewide (ALL 21 articles)
- [ ] Add legal disclaimer sitewide (ALL 21 articles)
- [ ] Correct burden of proof in `mula-ciega-federal.html` FAQ
- [ ] Remove "Marsden Hearing" from `abogado-no-responde-federal.html`
- [ ] Remove "treaty of 2026" from `estrategia-extradicion-san-diego-2026.html`
- [ ] Source or reframe the Tijuana K-9 program in `programa-deteccion-mula-ciega-tijuana.html`
- [ ] Correct FSA ETC retroactivity date: 2020 → **2022** in `first-step-act-creditos-etc.html`
- [ ] Remove unsourced "98%" extradition stat from `estrategia-extradicion-san-diego-2026.html`
- [ ] Fix grand jury size "23" → "entre 16 y 23" in `camino-al-juicio-federal.html`
- [ ] Add meth purity distinction in `arresto-federal-san-diego-72-horas.html`
- [ ] Add *Berghuis v. Thompkins* warning to `derecho-a-guardar-silencio.html`
- [ ] Audit all 18+ internal blog links for 404s
- [ ] Correct "automatic deportation" language in `plea-bargaining-federal.html`
- [ ] Add `<main>`/`<article>` wrappers to articles missing them
- [ ] Add BreadcrumbList schema to all articles (use `auditoria-pattern-bop-2026.html` as template)
