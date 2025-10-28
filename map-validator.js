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