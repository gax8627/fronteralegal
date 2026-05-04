# 🚀 Lista de Verificación para el Lanzamiento — Guía Federal

Este documento detalla los pasos finales necesarios para poner el sitio en producción y comenzar a captar leads de alta intención. **Estrategia táctica y visual endurecida (Mayo 2026).**

## 1. Dominio e Infraestructura
- [ ] **Comprar Dominio**: Adquirir `guia-federal.com` (Recomendado: Porkbun por precio fijo de renovación).
- [ ] **Configurar Hosting**: Desplegar en Vercel, Netlify o GitHub Pages.
- [ ] **SSL (HTTPS)**: Asegurar que el certificado SSL esté activo (automático en Vercel/Netlify).

## 2. Configuración de Contacto (Lead Flow)
- [ ] **WhatsApp**: Cambiar el número de marcador de posición (`1234567890`) por el número real en `config.js`.
- [ ] **Formspree**: Crear una cuenta en [Formspree.io](https://formspree.io), obtener un ID de formulario e insertarlo en `config.js`.
- [ ] **Prueba de Leads**: Enviar un formulario de prueba y verificar que llegue al correo y al WhatsApp.

## 3. Lead Magnet (Kit de Supervivencia)
- [ ] **Generar PDF**: Crear el documento PDF de 1-2 páginas basado en el contenido del "Kit de Supervivencia 72 Horas".
- [ ] **Subir Archivo**: Colocar el archivo `guia-72-horas.pdf` en la carpeta raíz.
- [ ] **Enlace de Descarga**: Asegurarse de que el botón en `kit-supervivencia.html` apunte al archivo correcto.

## 4. Google Analytics y Search Console
- [ ] **Crear Propiedad GA4**: Configurar una propiedad en Google Analytics para `guia-federal.com`.
- [ ] **ID de Medición**: Obtener el ID (ej. `G-V6Z5...`) y reemplazar el marcador `G-XXXXXXXXXX` en todos los archivos HTML.
- [ ] **Search Console**: Reclamar el dominio en Google Search Console y enviar el archivo `sitemap.xml` para acelerar la indexación de las páginas de instalaciones.

## 5. Diseño y Marca (PWA)
- [ ] **Iconos de Marca**: Crear y subir `icon-192.png` y `icon-512.png` para que la aplicación web progresiva (PWA) funcione correctamente en móviles.
- [ ] **Favicon**: Verificar que el icono de la pestaña del navegador sea el correcto.

---
**Estado del Proyecto:** La estructura técnica, el rebranding, el contenido táctico de SEO (15 artículos) y la identidad visual premium están listos al 100%. Solo falta la conectividad externa (Dominio/Formspree/GA4).
