/**
 * Main Application - Tabla Periódica Interactiva
 * Versión Refactorizada 2.0 - Sin jQuery
 * @author 2026
 */

// Estado de la aplicación
const app = {
  periodicTable: null,
  firstVisit: !sessionStorage.getItem('visited'),

  init() {
    this.setupIntro();
    this.initPeriodicTable();
    this.attachEventListeners();
  },

  setupIntro() {
    const intro = document.querySelector('.inicio');
    const contenedor = document.querySelector('.contenedor');
    const boton = document.querySelector('.boton');

    // Ocultar contenedor inicialmente
    if (contenedor) contenedor.style.display = 'none';
    if (boton) boton.style.display = 'none';

    if (this.firstVisit) {
      // Primera visita - mostrar intro con animación
      sessionStorage.setItem('visited', 'true');

      if (intro) {
        intro.style.width = '100%';
        intro.style.opacity = '1';

        document.body.classList.add('bgtrans');

        setTimeout(() => {
          intro.addEventListener('click', () => {
            this.hideIntro();
          });
        }, 1000);
      }
    } else {
      // Ya visitado - ir directo al contenido
      if (intro) intro.style.display = 'none';
      this.showContent();
    }
  },

  hideIntro() {
    const intro = document.querySelector('.inicio');

    if (intro) {
      intro.style.transition = 'opacity 1.2s ease';
      intro.style.opacity = '0';

      setTimeout(() => {
        intro.style.display = 'none';
        document.body.classList.remove('bgtrans');
        this.showContent();
      }, 1200);
    }
  },

  showContent() {
    const contenedor = document.querySelector('.contenedor');
    const boton = document.querySelector('.boton');

    if (contenedor) {
      contenedor.style.display = 'block';
      contenedor.style.opacity = '0';
      contenedor.style.transition = 'opacity 1.5s ease';

      setTimeout(() => {
        contenedor.style.opacity = '1';
      }, 50);
    }

    if (boton) {
      setTimeout(() => {
        boton.style.display = 'block';
        boton.style.opacity = '0';
        boton.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          boton.style.opacity = '1';
        }, 50);
      }, 1500);
    }
  },

  async initPeriodicTable() {
    try {
      // Crear instancia de la tabla periódica
      this.periodicTable = new PeriodicTable({
        container: '#tabla-container',
        mode: 'byGroup', // 'byGroup' para index.html, 'complete' para tablacom.html
        onElementClick: this.handleElementClick.bind(this)
      });

      // Inicializar la tabla
      await this.periodicTable.init();

      // Ocultar todos los grupos inicialmente (vista por familias)
      this.hideAllGroups();

    } catch (error) {
      console.error('Error inicializando tabla periódica:', error);
      this.showError('Error cargando los datos de la tabla periódica');
    }
  },

  hideAllGroups() {
    const elementsTitle = document.querySelector('.elements-title');
    if (elementsTitle) {
      elementsTitle.style.display = 'none';
    }
  },

  handleElementClick(elemento) {
    // Determinar si es metal o no metal
    const noMetales = ['Otros no metales', 'Halógenos', 'Gases nobles', 'Metaloides'];
    const esMetal = !noMetales.includes(elemento.categoria);
    const tipoElemento = esMetal ? 'Metal' : 'No metal';

    // Obtener el color de fondo del elemento
    const elementCell = document.querySelector(`[data-atomic="${elemento.noAtomico}"]`);
    const bgColor = elementCell ? window.getComputedStyle(elementCell).backgroundColor : '#fff';

    // Cerrar cualquier alerta anterior
    if (typeof swal !== 'undefined') {
      swal.close();

      // Mostrar nueva alerta
      swal({
        title: elemento.nombre,
        text: `
          <h1 style="font-size: 3rem; margin: 15px 0; font-weight: bold; color: #333;">
            ${elemento.simbolo}
          </h1>
          <div style="text-align: left; margin: 20px auto; max-width: 400px;">
            <div style="margin: 10px 0; padding: 8px; background: rgba(0,0,0,0.05); border-radius: 5px;">
              <span style="color: #666;">Número atómico:</span>
              <strong style="float: right; color: #2c3e50;">${elemento.noAtomico}</strong>
            </div>
            <div style="margin: 10px 0; padding: 8px; background: rgba(0,0,0,0.05); border-radius: 5px;">
              <span style="color: #666;">Masa Atómica:</span>
              <strong style="float: right; color: #2c3e50;">${elemento.masa}</strong>
            </div>
            <div style="margin: 10px 0; padding: 8px; background: rgba(0,0,0,0.05); border-radius: 5px;">
              <span style="color: #666;">${tipoElemento}:</span>
              <strong style="float: right; color: #2c3e50;">${elemento.categoria}</strong>
            </div>
            <div style="margin: 10px 0; padding: 8px; background: rgba(0,0,0,0.05); border-radius: 5px;">
              <span style="color: #666;">Grupo:</span>
              <strong style="float: right; color: #2c3e50;">${elemento.grupo}</strong>
            </div>
            <div style="margin: 10px 0; padding: 8px; background: rgba(0,0,0,0.05); border-radius: 5px;">
              <span style="color: #666;">Periodo:</span>
              <strong style="float: right; color: #2c3e50;">${elemento.periodo}</strong>
            </div>
          </div>
        `,
        html: true,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
        customClass: 'sweet-alert-custom'
      });

      // Aplicar color de fondo
      setTimeout(() => {
        const sweetAlert = document.querySelector('.sweet-alert');
        if (sweetAlert && bgColor) {
          sweetAlert.style.backgroundColor = bgColor;
          sweetAlert.style.borderColor = bgColor;
        }
      }, 100);
    } else {
      // Fallback si SweetAlert no está disponible
      alert(`${elemento.nombre} (${elemento.simbolo})\n\nNúmero atómico: ${elemento.noAtomico}\nMasa atómica: ${elemento.masa}\n${tipoElemento}: ${elemento.categoria}`);
    }
  },

  attachEventListeners() {
    // Listener para cambios de tamaño de ventana
    window.addEventListener('resize', this.handleResize.bind(this));
  },

  handleResize() {
    // Ajustes responsive si es necesario
    console.log('Ventana redimensionada:', window.innerWidth, 'x', window.innerHeight);
  },

  showError(message) {
    if (typeof swal !== 'undefined') {
      swal({
        title: 'Error',
        text: message,
        type: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      alert('Error: ' + message);
    }
  }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Exportar para uso global
window.TablaPeriodicaApp = app;