# KAM DESIGN® — Architectural Visions & Luxury Edition

Sitio web editorial de alto nivel para estudio de arquitectura y visualización arquitectónica 3D fotorrealista.

---

## 🌟 Características

- **Diseño Editorial de Lujo**: Tipografía cuidada (Cormorant Garamond & Manrope), paleta de colores carbón, oliva y acentos dorados champán.
- **Micro-interacciones Fluidas**: Preloader sutil, galería de proyectos con transición continua, efectos de revelado al hacer scroll y navegación interactiva.
- **Rendimiento Inmediato**: Construido sobre HTML5 semántico, CSS puro moderno y JavaScript Vanilla nativo. Cero sobrecarga de frameworks, carga en milisegundos.
- **Listo para Vercel**: Configurado con `vercel.json` para almacenamiento en caché optimizado en el CDN Edge de Vercel y cabeceras de seguridad.

---

## 💻 Vista previa local

Para ver la web en tu navegador:

```bash
# Opción 1: Abrir directamente
# Haz doble clic sobre index.html en tu explorador de archivos.

# Opción 2: Usar un servidor local ligero
npx serve .
# o
npm run dev
```

---

## 🚀 Publicación en GitHub y Vercel

### Paso 1: Subir a GitHub

1. Entra a [github.com/new](https://github.com/new) e inicia sesión.
2. Nombra tu repositorio (por ejemplo: `kam-design` o `kam-luxury-website`).
3. Elige si prefieres que sea **Público** o **Privado**.
4. **No marques** "Add a README file" ni "Add .gitignore" (ya los tenemos listos aquí).
5. Haz clic en **Create repository**.
6. En tu terminal (dentro de esta carpeta), ejecuta:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```
*(Sustituye `TU_USUARIO` y `TU_REPOSITORIO` con los de tu cuenta).*

---

### Paso 2: Desplegar en Vercel (Online en 1 minuto)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en el botón **"Add New..."** → **"Project"**.
3. Verás tu repositorio de GitHub recién subido; haz clic en **"Import"**.
4. En la pantalla de configuración:
   - **Framework Preset**: Puedes dejarlo en *Other* (es estático nativo).
   - **Root Directory**: `./` (la raíz actual).
5. Haz clic en **"Deploy"**.

¡Listo! Vercel te entregará una URL pública gratuita (por ejemplo: `https://kam-design.vercel.app`) con certificado SSL automático (HTTPS), CDN global ultrarrápido y despliegue automático cada vez que hagas un cambio con `git push`.

---

## 📁 Estructura del Proyecto

```text
kam_luxury_prototype/
├── index.html         # Documento principal semántico y accesible
├── styles.css         # Sistema visual y diseño responsive
├── script.js          # Control de interactividad, slider y scroll reveal
├── vercel.json        # Configuración de headers de seguridad y caché en Vercel
├── package.json       # Configuración y comandos de ejecución local
├── .gitignore         # Exclusión de archivos innecesarios
└── assets/            # Logotipos y fondos de alta resolución (.png, .webp)
```

---

## 📞 Contacto y Créditos
- **Estudio**: KAM DESIGN® — Cancún, Quintana Roo, México.
