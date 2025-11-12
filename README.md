# Dra. Lourdes Estrada Alpízar  
**Especialista en Dermatología – Ciudad de México**

Landing page profesional desarrollada para la **Dra. Lourdes Estrada Alpízar**, dermatóloga certificada con amplia experiencia en el diagnóstico, tratamiento y cuidado integral de la piel.  
Reconocida por su atención personalizada y su enfoque en resolver desde enfermedades dermatológicas hasta procedimientos estéticos avanzados.

---

## Objetivo de la página
Brindar a los pacientes una plataforma clara y estética para conocer los servicios dermatológicos de la Dra. Lourdes Estrada Alpízar, agendar citas fácilmente y mejorar su presencia digital mediante estrategias SEO y un diseño moderno adaptado a todos los dispositivos.

---

## Tecnologías utilizadas
- **HTML5 + TailwindCSS 3**
- **JavaScript Vanilla**
- **Optimización SEO avanzada**
- **Diseño responsive (móvil, tablet y escritorio)**
- **Despliegue optimizado para carga rápida y usabilidad**

---

## Colores del branding
| Rol | Color | Hex |
|------|--------|------|
| Primario | Púrpura profundo | `#3B3355` |
| Secundario | Lavanda suave | `#6F6FBB` |
| Fondo claro | Beige claro | `#ECE2D0` |
| Acento rosado | Rosa natural | `#EBB4A6` |
| Contraste | Café intenso | `#692A00` |

---

## Ubicación
**Consultorio:**  
Calle Querétaro 27, Col. Roma Norte, Alcaldía Cuauhtémoc,  
Ciudad de México, C.P. 06700.

 **Agenda tu cita aquí:**  
[Doctoralia – Dra. Lourdes Estrada Alpízar](https://www.doctoralia.com.mx/lourdes-estrada-alpizar/dermatologo/cuauhtemoc2)

---

Estructura del proyecto
```
landing-derma/
├── index.html
├── /assets
│   ├── /img
│   ├── /icons
│   └── /css
│       └── tailwind.css
├── /js
│   └── main.js
├── /dist (versión optimizada para producción)
└── README.md
```

---

## Ejecución local
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/landing-derma.git
   ```
2. Abre el proyecto en tu editor (VS Code recomendado).  
3. Si utilizas **Vite**:
   ```bash
   npm install
   npm run dev
   ```
   Luego visita: **http://localhost:5173**

4. O simplemente abre `index.html` en tu navegador.

---

## SEO y optimización
- Meta etiquetas configuradas: `description`, `canonical`, `robots`.
- Imágenes optimizadas (formato WebP y carga diferida).
- Etiquetas `alt` en todas las imágenes.
- Scroll suave con compensación del header fijo.
- Preparado para integrar Google Analytics o Meta Pixel.

---

## Mejoras futuras
- Agregar sección de **testimonios** con slider.
- Integración de **Google Maps** y botón directo a WhatsApp.
- Añadir sección **FAQ interactiva**.
- Inclusión de redes sociales en el navbar.

---

## Desarrollado por
**Manuel Alejandro Sánchez Alcaraz**  
Desarrollador Front-End  
*(Proyecto sin licencia pública por solicitud del autor)*

---

© 2025 Dra. Lourdes Estrada Alpízar. Todos los derechos reservados.
## Módulo de gestión de cookies (CookieConsent)

Este sitio incluye un módulo de consentimiento y gestión de cookies que cumple buenas prácticas de privacidad (GDPR/CCPA) y proporciona una interfaz amigable.

### Características
- CRUD de cookies (crear, leer, actualizar, eliminar) con validación de nombre/tamaño.
- Codificación base64 para valores y opciones de seguridad (`Secure` si HTTPS, `SameSite=Lax`).
- Banner de consentimiento y modal de preferencias responsive, con animaciones suaves.
- Categorías: necesarias (siempre activas), preferencias, analíticas y marketing.
- Notificador de expiración (toast) para cookies cercanas a caducar.

### Uso para desarrolladores
```js
// Crear cookie persistente por 7 días
CookieConsent.CookieManager.create('prefs', { theme: 'light' }, { days: 7 });

// Leer
const prefs = CookieConsent.CookieManager.read('prefs');

// Actualizar
CookieConsent.CookieManager.update('prefs', { theme: 'dark' }, { days: 7 });

// Eliminar
CookieConsent.CookieManager.delete('prefs');

// Consentimiento
CookieConsent.ConsentManager.setConsent({ preferences: true, analytics: false, marketing: false });
```

### Integración
- El módulo se carga desde `cookie-consent.js` y los estilos en `cookie-consent.css`.
- El banner y el modal están insertados al inicio del `<body>` en `index.html`.
- Los botones permiten aceptar todas, rechazar no esenciales o configurar categorías.

### Pruebas
- Ejecuta las pruebas abriendo `tests/cookie-consent.test.html` en el navegador.
- Verás resultados de CRUD, consentimiento y notificador en la página.

### Consideraciones de seguridad
- El atributo `HttpOnly` no se puede establecer desde JavaScript del cliente.
- No guardes datos sensibles en cookies; prefiere tokens opacos o identificadores.
- Usa HTTPS para habilitar `Secure` y mitigar riesgos.
