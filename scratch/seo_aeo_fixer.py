import os
import re

ROOT_DIR = "/Users/gax8627/Legal Guide"

# Define FAQ data for missing pages
FAQ_SCHEMAS = {
    "facilities/ny/mdc-brooklyn.html": """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Dónde está ubicado el MDC Brooklyn?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El Metropolitan Detention Center Brooklyn (MDC Brooklyn) se encuentra en 80 29th Street, Brooklyn, NY 11232, en la zona de Sunset Park."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es el teléfono principal de MDC Brooklyn?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El teléfono principal de la oficina administrativa es el (718) 840-4200."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo se envía dinero a un detenido en MDC Brooklyn?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Se debe utilizar el sistema TRUFACS del BOP a través de Western Union o MoneyGram, ingresando el número de registro de 8 dígitos y el apellido paterno del detenido."
      }
    }
  ]
}
</script>""",
    "facilities/pa/fdc-philadelphia.html": """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Dónde está ubicado el FDC Philadelphia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El Federal Detention Center Philadelphia se ubica en 700 Arch Street, Philadelphia, PA 19106."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es el teléfono principal de FDC Philadelphia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El teléfono administrativo principal de la instalación es el (215) 521-4000."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo enviar fondos a un familiar en FDC Philadelphia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los fondos deben enviarse centralmente al sistema TRUFACS del BOP usando Western Union o MoneyGram con el número de registro federal."
      }
    }
  ]
}
</script>""",
    "facilities/tx/fdc-houston.html": """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Dónde está ubicado el FDC Houston?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El Federal Detention Center Houston está ubicado en 1200 Texas Avenue, Houston, TX 77002."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es el número telefónico de FDC Houston?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El teléfono principal administrativo de la instalación es el (713) 221-5400."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo depositar dinero a un interno en FDC Houston?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El depósito se realiza por vía electrónica a través de Western Union (Quick Collect) o MoneyGram con la cuenta central del BOP (FBOP/DC)."
      }
    }
  ]
}
</script>""",
    "facilities/fl/fdc-miami.html": """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Dónde está ubicado el FDC Miami?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El Federal Detention Center Miami se localiza en 33 NE 4th Street, Miami, FL 33132."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es el teléfono principal del FDC Miami?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El número administrativo es el (305) 577-0010."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo localizo a alguien en FDC Miami?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Debe buscar en el sitio bop.gov/inmateloc ingresando el nombre completo o número de registro federal."
      }
    }
  ]
}
</script>""",
    "facilities/ca/mdc-los-angeles.html": """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Dónde está ubicado el MDC Los Ángeles?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El Metropolitan Detention Center Los Angeles se ubica en 535 N. Alameda Street, Los Angeles, CA 90012."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es el teléfono principal del MDC Los Ángeles?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El teléfono administrativo principal de la instalación es el (213) 485-0439."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo programar visitas en MDC Los Ángeles?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El interno debe solicitar previamente la aprobación del visitante enviando el formulario BP-A0629 a su consejero de unidad."
      }
    }
  ]
}
</script>""",
    "blog/index.html": """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿De qué temas trata el Blog de Guía Federal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El blog ofrece guías técnicas sobre la First Step Act (FSA), programas de reducción de sentencia como RDAP, protocolos de fianza pre-trial y defensa técnica."
      }
    },
    {
      "@type": "Question",
      "name": "¿La información del blog aplica a nivel nacional?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, las guías técnicas cubren el sistema del Bureau of Prisons (BOP) y leyes federales aplicables en todos los distritos de EE.UU."
      }
    }
  ]
}
</script>"""
}

GA_SCRIPT = """<!-- Global site tag (gtag.js) - Google Analytics Placeholder -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-7DZMMY9WJS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "G-7DZMMY9WJS");
</script>"""

SW_SCRIPT = """<script>if("serviceWorker"in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){});});}</script>"""

def fix_html_file(filepath):
    rel_path = os.path.relpath(filepath, ROOT_DIR)
    
    # Skip non-html files
    if not filepath.endswith(".html"):
        return
        
    # Skip specific admin pages
    if "admin.html" in filepath or "google43f4f4042f29eeba.html" in filepath:
        return

    print(f"Auditing & Hardening: {rel_path}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Clean canonical URL
    # Find existing canonical
    canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', content)
    if canonical_match:
        orig_url = canonical_match.group(1)
        clean_url = orig_url
        # Strip .html extension
        if clean_url.endswith(".html"):
            clean_url = clean_url[:-5]
        # Strip trailing slash from blog index (e.g. /blog/ -> /blog)
        if clean_url == "https://www.guiafederal.net/blog/":
            clean_url = "https://www.guiafederal.net/blog"
        elif clean_url.endswith("/") and clean_url != "https://www.guiafederal.net/":
            clean_url = clean_url[:-1]
            
        if clean_url != orig_url:
            print(f"  -> Cleaning Canonical: {orig_url} => {clean_url}")
            content = content.replace(f'href="{orig_url}"', f'href="{clean_url}"')
    else:
        # Build canonical link based on rel_path
        clean_name = rel_path[:-5]
        if clean_name == "index":
            clean_url = "https://www.guiafederal.net/"
        elif clean_name == "blog/index":
            clean_url = "https://www.guiafederal.net/blog"
        else:
            clean_url = f"https://www.guiafederal.net/{clean_name}"
            
        print(f"  -> Adding Canonical: {clean_url}")
        # Insert canonical right before first </head>
        canonical_tag = f'<link rel="canonical" href="{clean_url}">'
        content = re.sub(r'</head>', f'{canonical_tag}\n</head>', content, count=1, flags=re.IGNORECASE)

    # Re-retrieve clean_url for hreflang usage
    canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', content)
    clean_url = canonical_match.group(1) if canonical_match else f"https://www.guiafederal.net/{rel_path[:-5]}"

    # 2. Check and fix alternate hreflang links
    # Remove existing alternates to rebuild them cleanly
    content = re.sub(r'<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]+">', '', content)
    # Build clean alternate tags
    hreflang_tags = f'<link rel="alternate" hreflang="es" href="{clean_url}">\n<link rel="alternate" hreflang="es-US" href="{clean_url}">'
    print(f"  -> Rebuilding hreflang links for {clean_url}")
    content = re.sub(r'</head>', f'{hreflang_tags}\n</head>', content, count=1, flags=re.IGNORECASE)

    # 3. Add Google Analytics script if missing
    if "G-7DZMMY9WJS" not in content:
        print("  -> Adding Google Analytics script")
        content = re.sub(r'</head>', f'{GA_SCRIPT}\n</head>', content, count=1, flags=re.IGNORECASE)

    # 4. Add Service Worker script if missing
    if "serviceWorker" not in content:
        print("  -> Adding Service Worker script")
        content = re.sub(r'</head>', f'{SW_SCRIPT}\n</head>', content, count=1, flags=re.IGNORECASE)

    # 5. Add custom FAQPage schema if designated and missing
    if rel_path in FAQ_SCHEMAS:
        if "FAQPage" not in content:
            print(f"  -> Injecting missing FAQ schema for {rel_path}")
            content = re.sub(r'</head>', f'{FAQ_SCHEMAS[rel_path]}\n</head>', content, count=1, flags=re.IGNORECASE)

    # 6. Replace href="/blog/" and href="/blog/index.html" with href="/blog"
    content = re.sub(r'href="/blog/"', 'href="/blog"', content)
    content = re.sub(r'href="/blog/index.html"', 'href="/blog"', content)
    
    # 7. Index.html Specific enhancements
    if rel_path == "index.html":
        # Add LocalBusiness to schemas
        if '"@type": ["ProfessionalService", "LegalService"]' in content:
            print("  -> Enhancing homepage schemas with LocalBusiness")
            content = content.replace(
                '"@type": ["ProfessionalService", "LegalService"]',
                '"@type": ["ProfessionalService", "LegalService", "LocalBusiness"]'
            )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def walk_and_fix():
    for root, dirs, files in os.walk(ROOT_DIR):
        # Exclude git/node_modules/assets/skills if they exist
        dirs[:] = [d for d in dirs if d not in (".git", "assets", "skills")]
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                fix_html_file(filepath)

if __name__ == "__main__":
    walk_and_fix()
    print("Optimization and validation complete!")
