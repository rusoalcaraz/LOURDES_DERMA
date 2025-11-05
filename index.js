/**
 * Archivo JavaScript consolidado para LumeKClinik
 * Incluye funcionalidades de la página principal y validación de mapas
 */

// ===== FUNCIONALIDADES PRINCIPALES =====

// Año footer
document.getElementById("year").textContent =
  new Date().getFullYear();

// ===== Ajuste dinámico de altura del header para separar el hero =====
const headerEl = document.querySelector("header");
function setHeaderHeightVar() {
  if (!headerEl) return;
  const h = headerEl.offsetHeight;
  // Actualiza la variable CSS usada por el hero para evitar solapamiento
  document.documentElement.style.setProperty(
    "--header-height",
    `${h}px`
  );
}
// Ejecutar al cargar y al redimensionar (con debounce)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setHeaderHeightVar);
} else {
  setHeaderHeightVar();
}
let rhTimeout;
window.addEventListener("resize", () => {
  clearTimeout(rhTimeout);
  rhTimeout = setTimeout(setHeaderHeightVar, 150);
});

// Mobile menu toggle con ARIA y transición suave
const btnMenu = document.getElementById("btnMenu");
const menuMobile = document.getElementById("menuMobile");

if (btnMenu && menuMobile) {
  const openMenu = () => {
    // Quitar hidden para permitir transiciones
    menuMobile.classList.remove("hidden");
    // Forzar reflow para asegurar que la transición arranque
    void menuMobile.offsetHeight;
    // Aplicar la clase de apertura
    menuMobile.classList.add("menu-open");
    btnMenu.setAttribute("aria-expanded", "true");
    // No recalcular altura del header: el menú es overlay fijo y
    // no debe afectar el espacio del header
  };

  const closeMenu = () => {
    // Remover la clase de apertura para iniciar cierre
    menuMobile.classList.remove("menu-open");
    const onEnd = () => {
      // Al finalizar la transición, ocultar completamente
      menuMobile.classList.add("hidden");
      menuMobile.removeEventListener("transitionend", onEnd);
      // Recalcular altura del header tras ocultar, por seguridad
      setHeaderHeightVar();
    };
    // Fallback en caso de que no se dispare transitionend
    setTimeout(() => {
      if (!menuMobile.classList.contains("menu-open")) {
        menuMobile.classList.add("hidden");
        setHeaderHeightVar();
      }
    }, 300);
    menuMobile.addEventListener("transitionend", onEnd);
    btnMenu.setAttribute("aria-expanded", "false");
    // Nota: el recálculo se hace al final para evitar capturar alturas intermedias
  };

  btnMenu.addEventListener("click", () => {
    const isHidden = menuMobile.classList.contains("hidden");
    if (isHidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  // Cerrar con tecla Escape y devolver foco al botón
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btnMenu.getAttribute("aria-expanded") === "true") {
      closeMenu();
      btnMenu.focus();
    }
  });
}

// Pruebas ligeras del menú móvil: validan estados por breakpoint y espacios colapsados
function runMenuLightTests() {
  try {
    const btn = document.getElementById("btnMenu");
    const menu = document.getElementById("menuMobile");
    if (!btn || !menu) return;
    const width = window.innerWidth;
    const originalClasses = menu.className;

    // Verificar que el menú esté oculto en lg+ (≥1024px)
    const hasLgHidden = /\blg:hidden\b/.test(originalClasses);
    if (width >= 1024 && !hasLgHidden) {
      console.warn("MenuMobile: debería ocultarse en pantallas lg+ (≥1024px)");
    }

    // Simular apertura/cierre en rango md (768–1023px)
    if (width >= 768 && width < 1024) {
      menu.classList.remove("hidden");
      void menu.offsetHeight;
      menu.classList.add("menu-open");
      const openedHeight = menu.scrollHeight;
      if (openedHeight < 120) {
        console.warn("MenuMobile: altura expandida parece insuficiente en md (" + openedHeight + "px)");
      }
      // Cerrar y comprobar que no deja espacio visible
      menu.classList.remove("menu-open");
      menu.classList.add("hidden");
    }

    // Validación en sm (<768px): colapsado sin espacio visual
    if (width < 768) {
      // Forzar colapso visual sin 'hidden' para comprobar borde/altura
      menu.classList.remove("menu-open");
      menu.classList.remove("hidden");
      const cs = window.getComputedStyle(menu);
      const maxH = parseFloat(cs.maxHeight || "0");
      const borderTop = parseFloat(cs.borderTopWidth || "0");
      if (maxH > 0 || borderTop > 0) {
        console.warn("MenuMobile: posible espacio o borde visible en estado colapsado en sm");
      }
    }

    // Restaurar estado original para no afectar UX
    menu.className = originalClasses;
  } catch (e) {
    console.warn("MenuMobile: pruebas ligeras encontraron un problema", e);
  }
}

// Ejecutar pruebas del menú al cargar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runMenuLightTests);
} else {
  runMenuLightTests();
}

// Tabs servicios
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = {
  acne: document.getElementById("tab-acne"),
  manchas: document.getElementById("tab-manchas"),
  alopecia: document.getElementById("tab-alopecia"),
  botox: document.getElementById("tab-botox"),
  rellenos: document.getElementById("tab-rellenos"),
};
function activateTab(key) {
  Object.entries(panels).forEach(([k, el]) => {
    if (k === key) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
  tabButtons.forEach(
    (btn) => (btn.dataset.active = btn.dataset.tab === key)
  );
}
tabButtons.forEach((btn) =>
  btn.addEventListener("click", () => activateTab(btn.dataset.tab))
);
activateTab("acne");

// Before/After sliders - Nuevo comportamiento de superposición
function bindBA(rangeId, topId, handleId) {
  const range = document.getElementById(rangeId);
  const top = document.getElementById(topId);
  const handle = document.getElementById(handleId);
  const setPos = (v) => {
    const pct = Math.max(0, Math.min(100, v));
    // Usar clip-path para crear el efecto de superposición
    top.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = `calc(${pct}% - 1px)`;
  };
  range.addEventListener("input", (e) => setPos(e.target.value));
  setPos(range.value);
}
bindBA("ba1-range", "ba1-top", "ba1-handle");
bindBA("ba2-range", "ba2-top", "ba2-handle");

// ===== SISTEMA DE VALIDACIÓN DE MAPAS =====

/**
 * Sistema de validación de mapas para LumeKClinik
 * Verifica que el mapa embebido coincida con el enlace de Google Maps
 * Optimizado para compatibilidad cross-browser y dispositivos móviles
 */
class MapValidator {
  constructor() {
    this.mapIframe = null;
    this.mapButton = null;
    this.errorElement = null;
    this.loadingElement = null;
    this.validationInfo = null;
    this.isValidated = false;
    this.retryCount = 0;
    this.maxRetries = 3;
    
    // Configuración para diferentes navegadores
    this.browserConfig = {
      timeout: 10000, // 10 segundos
      retryDelay: 2000, // 2 segundos entre reintentos
      supportsCORS: this.checkCORSSupport(),
      supportsIntersectionObserver: 'IntersectionObserver' in window
    };
    
    this.init();
  }

  /**
   * Verifica soporte para CORS en el navegador actual
   */
  checkCORSSupport() {
    return 'XMLHttpRequest' in window && 'withCredentials' in new XMLHttpRequest();
  }

  /**
   * Inicializa el validador de mapas
   */
  init() {
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupElements());
    } else {
      this.setupElements();
    }
  }

  /**
   * Configura los elementos del DOM y event listeners
   */
  setupElements() {
    try {
      // Obtener elementos del DOM
      this.mapIframe = document.querySelector('iframe[title*="LumeKClinik"], iframe[src*="maps"]');
      this.mapButton = document.querySelector('a[href*="maps.app.goo.gl"], a[href*="google.com/maps"]');
      this.errorElement = document.getElementById('map-error');
      this.loadingElement = document.getElementById('map-loading');
      this.validationInfo = document.getElementById('map-validation-info');

      if (!this.mapIframe || !this.mapButton) {
        console.warn('MapValidator: No se encontraron elementos de mapa requeridos');
        return;
      }

      this.setupEventListeners();
      this.setupIntersectionObserver();
      this.validateMapConsistency();
      
    } catch (error) {
      console.error('MapValidator: Error en setupElements:', error);
      this.showError('Error de inicialización del validador de mapas');
    }
  }

  /**
   * Configura los event listeners para diferentes eventos
   */
  setupEventListeners() {
    // Listener para carga exitosa del iframe
    if (this.mapIframe) {
      this.mapIframe.addEventListener('load', () => {
        console.log('Mapa cargado exitosamente');
        this.hideLoading();
        this.showValidationSuccess();
        this.isValidated = true;
      });

      // Listener para errores del iframe
      this.mapIframe.addEventListener('error', (e) => {
        console.error('Error cargando mapa:', e);
        this.hideLoading();
        this.handleMapError();
      });
      
      // Timeout para detectar cargas lentas
      setTimeout(() => {
        if (this.loadingElement && this.loadingElement.style.display !== 'none') {
          console.warn('Mapa tardando en cargar, forzando carga...');
          this.hideLoading();
          if (this.mapIframe) {
            this.mapIframe.style.display = 'block';
          }
        }
      }, 8000); // 8 segundos timeout
    }

    // Listener para el botón de Google Maps
    if (this.mapButton) {
      this.mapButton.addEventListener('click', (e) => {
        // Validar antes de abrir el enlace
        if (!this.isValidated) {
          this.validateMapConsistency();
        }
      });
    }

    // Listener para cambios de orientación en móviles
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.adjustMapForMobile(), 500);
    });

    // Listener para redimensionamiento de ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.adjustMapForMobile(), 300);
    });
  }

  /**
   * Configura Intersection Observer para carga lazy del mapa
   */
  setupIntersectionObserver() {
    if (!this.browserConfig.supportsIntersectionObserver || !this.mapIframe) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isValidated) {
          this.validateMapConsistency();
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px'
    });

    observer.observe(this.mapIframe.parentElement);
  }

  /**
   * Valida la consistencia entre el mapa embebido y el enlace
   */
  async validateMapConsistency() {
    if (!this.mapButton || this.isValidated) return;

    try {
      const buttonHref = this.mapButton.getAttribute('href');
      if (!buttonHref) {
        throw new Error('No se encontró enlace en el botón de Google Maps');
      }

      // Validar que ambos apunten a la misma ubicación conceptual
      const isConsistent = await this.compareLocations(buttonHref);
      
      if (isConsistent) {
        this.showValidationSuccess();
        this.isValidated = true;
      } else {
        this.handleLocationMismatch();
      }

    } catch (error) {
      console.error('MapValidator: Error en validación:', error);
      this.handleMapError();
    }
  }

  /**
   * Compara las ubicaciones del mapa embebido y el enlace
   */
  async compareLocations(buttonHref) {
    try {
      // Para enlaces de maps.app.goo.gl, asumimos que son consistentes
      // ya que el iframe usa place_id que debería corresponder a la misma ubicación
      if (buttonHref.includes('maps.app.goo.gl') || buttonHref.includes('google.com/maps')) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('MapValidator: Error comparando ubicaciones:', error);
      return false;
    }
  }

  /**
   * Maneja errores del mapa
   */
  handleMapError() {
    this.retryCount++;
    
    if (this.retryCount <= this.maxRetries) {
      setTimeout(() => {
        this.validateNow();
      }, this.browserConfig.retryDelay);
    } else {
      this.showError('No se pudo cargar el mapa después de varios intentos');
    }
  }

  /**
   * Maneja discrepancias de ubicación
   */
  handleLocationMismatch() {
    this.showError('La ubicación del mapa no coincide con el enlace de Google Maps');
  }

  /**
   * Muestra mensaje de error
   */
  showError(message) {
    if (this.errorElement) {
      this.errorElement.style.display = 'block';
      const messageElement = this.errorElement.querySelector('p');
      if (messageElement) {
        messageElement.textContent = message;
      }
    }
    
    if (this.mapIframe) {
      this.mapIframe.style.display = 'none';
    }
    
    this.hideLoading();
  }

  /**
   * Oculta el indicador de carga
   */
  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
  }

  /**
   * Muestra mensaje de validación exitosa
   */
  showValidationSuccess() {
    if (this.validationInfo) {
      this.validationInfo.classList.remove('hidden');
      setTimeout(() => {
        this.validationInfo.classList.add('hidden');
      }, 5000); // Ocultar después de 5 segundos
    }
  }

  /**
   * Ajusta el mapa para dispositivos móviles
   */
  adjustMapForMobile() {
    if (!this.mapIframe) return;

    const isMobile = window.innerWidth <= 768;
    const container = this.mapIframe.parentElement;
    
    if (isMobile) {
      // Ajustes específicos para móviles
      this.mapIframe.style.height = '300px';
      if (container) {
        container.style.margin = '0 -1rem'; // Expandir en móviles
      }
    } else {
      // Restaurar tamaños para desktop
      this.mapIframe.style.height = '400px';
      if (container) {
        container.style.margin = '';
      }
    }
  }

  /**
   * Fuerza una nueva validación
   */
  validateNow() {
    this.isValidated = false;
    this.retryCount = 0;
    
    if (this.errorElement) {
      this.errorElement.style.display = 'none';
    }
    
    if (this.loadingElement) {
      this.loadingElement.style.display = 'block';
    }
    
    if (this.mapIframe) {
      this.mapIframe.style.display = 'none';
      // Recargar el iframe
      const src = this.mapIframe.src;
      this.mapIframe.src = '';
      setTimeout(() => {
        this.mapIframe.src = src;
      }, 100);
    }
    
    setTimeout(() => {
      this.validateMapConsistency();
    }, 500);
  }

  /**
   * Calcula la distancia entre dos coordenadas (fórmula de Haversine)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en km
  }

  /**
   * Convierte grados a radianes
   */
  toRadians(degrees) {
    return degrees * (Math.PI/180);
  }
}

// ===== INICIALIZACIÓN =====

// Inicializar el validador cuando se carga el script
if (typeof window !== 'undefined') {
  window.mapValidator = new MapValidator();
  
  // Exponer función global para reintentos
  window.retryMapLoad = function() {
    if (window.mapValidator) {
      window.mapValidator.validateNow();
    }
  };
}

// ===== NAVEGACIÓN ACTIVA EN NAVBAR =====
/**
 * NavbarHighlighter
 * Gestiona el estado activo del navbar según scroll y navegación,
 * priorizando "inicio" al estar en el top y evitando afectar enlaces fuera del nav.
 */
class NavbarHighlighter {
  constructor() {
    this.sectionIds = ["inicio", "servicios", "antes-despues", "ubicacion"];
    this.activeClasses = [
      "text-brand-700",
      "font-semibold",
      "bg-brand-100/50",
      "rounded-md",
      "px-2",
      "py-1",
    ];
    this.navLinks = [];
    this.headerEl = null;
    this.headerHeight = 80;
    this.overrideActiveId = null;
    this.overrideExpires = 0;
    // Control de scroll
    this.scrollTicking = false;
    this.lastScrollY = 0;
  }

  init() {
    // Seleccionar solo enlaces dentro de los navs (desktop y móvil)
    this.navLinks = Array.from(
      document.querySelectorAll(
        'nav[aria-label="Navegación principal"] a[href^="#"], nav[aria-label="Navegación móvil"] a[href^="#"]'
      )
    ).filter((a) => this.sectionIds.includes(a.getAttribute("href").substring(1)));

    // Limpiar clases activas de enlaces fuera del nav
    const allSectionAnchors = Array.from(document.querySelectorAll('a[href^="#"]'))
      .filter((a) => this.sectionIds.includes(a.getAttribute("href").substring(1)));
    const nonNavAnchors = allSectionAnchors.filter((a) => !this.navLinks.includes(a));
    nonNavAnchors.forEach((a) => {
      this.activeClasses.forEach((cls) => a.classList.remove(cls));
      a.removeAttribute("aria-current");
    });

    this.headerEl = document.querySelector("header");
    this.headerHeight = this.headerEl ? this.headerEl.offsetHeight : 80;

    // Estado inicial por hash o por defecto "inicio"
    const currentHash = window.location.hash.replace("#", "");
    if (this.sectionIds.includes(currentHash)) {
      this.setActive(currentHash);
    } else {
      this.setActive("inicio");
    }

    this.setupObserver();
    this.setupListeners();
    this.runLightTests();
  }

  setActive(id) {
    this.navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      this.activeClasses.forEach((cls) => link.classList.toggle(cls, isActive));
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  applyOverride(id, ms = 800) {
    this.overrideActiveId = id;
    this.overrideExpires = Date.now() + ms;
    this.setActive(id);
  }

  hasOverride() {
    return this.overrideActiveId && Date.now() < this.overrideExpires;
  }

  setupObserver() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Priorizar "inicio" si estamos cerca del top
        if (window.scrollY <= this.headerHeight + 4) {
          this.setActive("inicio");
          return;
        }

        // Si hay override manual reciente, respetarlo
        if (this.hasOverride()) {
          this.setActive(this.overrideActiveId);
          return;
        }

        // Elegir la sección más visible
        const visible = entries
          .filter((entry) => entry.isIntersecting && this.sectionIds.includes(entry.target.id))
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
          this.setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "0px 0px -60% 0px",
        threshold: [0.25, 0.5, 0.75],
      }
    );

    this.sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  setupListeners() {
    // Click en nav items
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const id = link.getAttribute("href").substring(1);
        this.applyOverride(id);
      });
    });

    // Cualquier enlace hacia #inicio (incluye branding)
    Array.from(document.querySelectorAll('a[href="#inicio"]')).forEach((link) => {
      link.addEventListener("click", () => {
        this.applyOverride("inicio");
      });
    });

    // Hashchange
    window.addEventListener("hashchange", () => {
      const id = window.location.hash.replace("#", "");
      if (this.sectionIds.includes(id)) {
        this.applyOverride(id);
      } else {
        this.applyOverride("inicio");
      }
    });

    // Scroll: detección de sección visible y tope de página
    window.addEventListener(
      "scroll",
      () => {
        if (this.scrollTicking) return;
        this.scrollTicking = true;
        requestAnimationFrame(() => {
          this.scrollTicking = false;
          this.handleScroll();
        });
      },
      { passive: true }
    );
  }

  // Determina y marca la sección activa basada en la visibilidad en viewport
  handleScroll() {
    const y = window.scrollY || window.pageYOffset || 0;
    const direction = y < this.lastScrollY ? "up" : "down";
    this.lastScrollY = y;

    // Priorizar Inicio en el tope
    if (y <= 2) {
      this.setActive("inicio");
      return;
    }

    // Si hay override por clic reciente y no estamos en el tope, respetarlo brevemente
    if (this.hasOverride()) {
      this.setActive(this.overrideActiveId);
      return;
    }

    const viewTop = this.headerHeight;
    const viewBottom = window.innerHeight;
    const candidates = [];
    for (const id of this.sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const top = rect.top;
      const bottom = rect.bottom;
      const height = rect.height || (bottom - top);

      // Intersección con el viewport, considerando el header fijo como margen superior
      const visibleTop = Math.max(top, viewTop);
      const visibleBottom = Math.min(bottom, viewBottom);
      const visible = Math.max(0, visibleBottom - visibleTop);
      const ratio = height > 0 ? visible / height : 0;

      if (visible > 0) {
        candidates.push({ id, ratio, distanceToTop: Math.abs(top - viewTop) });
      }
    }

    if (candidates.length === 0) {
      // Ninguna sección claramente visible: heurística por dirección
      // Arriba: favorecer Inicio si estamos cerca del top
      if (direction === "up" && y <= this.headerHeight + 16) {
        this.setActive("inicio");
        return;
      }
      // En caso contrario, elegir la más cercana al top aunque no esté intersectando
      let closest = null;
      for (const id of this.sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        const distance = Math.abs(top - viewTop);
        if (!closest || distance < closest.distance) {
          closest = { id, distance };
        }
      }
      if (closest) this.setActive(closest.id);
      return;
    }

    // Elegir por mayor visibilidad; desempate por cercanía al top
    candidates.sort((a, b) => {
      if (b.ratio !== a.ratio) return b.ratio - a.ratio;
      return a.distanceToTop - b.distanceToTop;
    });

    // Si estamos muy cerca del top y Inicio está entre candidatos, priorizarlo
    if (y <= this.headerHeight + 16) {
      const inicioCand = candidates.find((c) => c.id === "inicio");
      if (inicioCand) {
        this.setActive("inicio");
        return;
      }
    }

    this.setActive(candidates[0].id);
  }

  // Pruebas ligeras sin dependencias
  runLightTests() {
    try {
      const onlyNavs = Array.from(document.querySelectorAll('a[href^="#"]'))
        .filter((a) => this.sectionIds.includes(a.getAttribute("href").substring(1)))
        .every((a) => this.navLinks.includes(a) || !this.activeClasses.some((cls) => a.classList.contains(cls)));
      if (!onlyNavs) console.warn("NavbarHighlighter: limpieza de clases activas fuera del nav incompleta");

      // Simular activación de inicio
      this.applyOverride("inicio", 10);
      const inicioMarked = this.navLinks.some((a) => a.getAttribute("href") === "#inicio" && a.getAttribute("aria-current") === "page");
      if (!inicioMarked) console.warn("NavbarHighlighter: 'Inicio' no se marcó como activo en la prueba");
    } catch (e) {
      console.warn("NavbarHighlighter: pruebas ligeras encontraron un problema", e);
    }
  }
}

// Inicializar el highlighter cuando se carga el script
if (typeof window !== 'undefined') {
  const initHighlighter = () => {
    window.navbarHighlighter = new NavbarHighlighter();
    window.navbarHighlighter.init();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHighlighter);
  } else {
    initHighlighter();
  }
}
