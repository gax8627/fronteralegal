# 🚀 Lista de Verificación para el Lanzamiento — Guía Federal

Este documento detalla los pasos finales necesarios para poner el sitio en producción y comenzar a captar leads de alta intención. **Estrategia táctica y visual endurecida (Mayo 2026).**

## 1. Dominio e Infraestructura
- [x] **Conectar Dominio**: Conectar `www.guiafederal.net` (¡Completado!).
- [x] **Configurar Hosting**: Desplegar en Vercel (¡Completado!).
- [x] **SSL (HTTPS)**: Certificado SSL activo en Vercel (¡Completado!).

## 2. Configuración de Contacto (Lead Flow)
- [x] **WhatsApp**: Configurado número real `+52 663 304 0096` en `config.js` (¡Completado!).
- [ ] **Formspree**: Crear una cuenta en [Formspree.io](https://formspree.io), obtener un ID de formulario e insertarlo en `config.js` (ID `"mqakpnvp"` actualmente activo).
- [ ] **Prueba de Leads**: Enviar un formulario de prueba y verificar que llegue al correo y al WhatsApp.

## 3. Lead Magnet (Kit de Supervivencia)
- [ ] **Generar PDF**: Crear el documento PDF de 1-2 páginas basado en el contenido del "Kit de Supervivencia 72 Horas" (puede generarse imprimiendo `guia-72-horas-pdf.html` en el navegador).
- [ ] **Subir Archivo**: Colocar el archivo `guia-72-horas.pdf` en la carpeta raíz.
- [ ] **Enlace de Descarga**: Asegurarse de que el botón en `kit-supervivencia.html` apunte al archivo correcto.

## 4. Google Analytics y Search Console
- [x] **Crear Propiedad GA4**: Configurada propiedad para `www.guiafederal.net` (¡Completado!).
- [x] **ID de Medición**: Inyectada la ID de medición real `G-7DZMMY9WJS` en los 22 archivos HTML del proyecto (¡Completado!).
- [x] **Search Console**: Metaetiqueta de verificación de propiedad inyectada en `index.html` (¡Completado!). Oso de búsqueda configurado e indexación de `sitemap.xml` activa.

## 5. Diseño y Marca (PWA)
- [x] **Iconos de Marca**: Subidos `icon-192.png` y `icon-512.png` en el root para que la PWA funcione correctamente en móviles (¡Completado!).
- [x] **Favicon**: Iconos y accesos directos de marca configurados (¡Completado!).

---
**Estado del Proyecto:** La estructura técnica, el rebranding, el contenido táctico de SEO (15 artículos) y la identidad visual premium están listos al 100%. Solo falta la conectividad externa (Dominio/Formspree/GA4).
