/**
 * Clase PeriodicTable - Renderiza y gestiona la tabla periódica de elementos
 * @version 2.0
 * @author Refactorizado 2026
 */
class PeriodicTable {
  constructor(options = {}) {
    this.container = options.container || '#tabla-container';
    this.mode = options.mode || 'complete'; // 'complete' o 'byGroup'
    this.data = null;
    this.selectedGroup = null;
    this.onElementClick = options.onElementClick || this.defaultElementClick.bind(this);
  }

  /**
   * Inicializa la tabla periódica cargando los datos
   */
  async init() {
    try {
      await this.loadData();
      if (this.mode === 'complete') {
        this.renderCompleteTable();
      } else {
        this.renderGroupSelector();
      }
      this.attachEventListeners();
    } catch (error) {
      console.error('Error inicializando tabla periódica:', error);
    }
  }

  /**
   * Carga los datos desde el archivo JSON
   */
  async loadData() {
    try {
      const response = await fetch('data/elementos.json');
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error cargando datos:', error);
      throw error;
    }
  }

  /**
   * Renderiza la tabla periódica completa con formato tradicional
   */
  renderCompleteTable() {
    const container = document.querySelector(this.container);
    if (!container) {
      console.error('Contenedor no encontrado:', this.container);
      return;
    }

    container.innerHTML = `
      <div class="periodic-table-grid">
        ${this.generateMainTable()}
        <div class="lanthanides-actinides">
          ${this.generateLanthanidesActinides()}
        </div>
      </div>
    `;
  }

  /**
   * Genera la tabla principal (7 periodos × 18 grupos)
   */
  generateMainTable() {
    let html = '';

    for (let periodo = 1; periodo <= 7; periodo++) {
      html += `<div class="periodo periodo-${periodo}">`;

      for (let grupo = 1; grupo <= 18; grupo++) {
        const elemento = this.findElement(periodo, grupo);

        if (elemento) {
          // Caso especial: Lantánidos y Actínidos (mostrar placeholder)
          if ((periodo === 6 && grupo === 3) || (periodo === 7 && grupo === 3)) {
            html += this.generatePlaceholder(periodo === 6 ? 'Lantánidos' : 'Actínidos', periodo);
          } else if (elemento.isLanthanide || elemento.isActinide) {
            // Saltar lantánidos y actínidos en la tabla principal
            continue;
          } else {
            html += this.generateElementCell(elemento);
          }
        } else {
          html += this.generateEmptyCell(periodo, grupo);
        }
      }

      html += '</div>';
    }

    return html;
  }

  /**
   * Genera las filas de Lantánidos y Actínidos
   */
  generateLanthanidesActinides() {
    const lanthanides = this.data.elementos.filter(e => e.isLanthanide);
    const actinides = this.data.elementos.filter(e => e.isActinide);

    let html = '<div class="special-series">';

    // Lantánidos
    html += '<div class="serie lanthanides-row">';
    lanthanides.forEach(el => {
      html += this.generateElementCell(el);
    });
    html += '</div>';

    // Actínidos
    html += '<div class="serie actinides-row">';
    actinides.forEach(el => {
      html += this.generateElementCell(el);
    });
    html += '</div>';

    html += '</div>';
    return html;
  }

  /**
   * Genera el HTML de una celda de elemento
   */
  generateElementCell(elemento) {
    const tipoMetal = this.getMetalType(elemento.categoria);
    return `
      <div class="element-cell ${tipoMetal} ${elemento.categoriaClass}"
           data-atomic="${elemento.noAtomico}"
           data-category="${elemento.categoria}">
        <span class="atomic-number">${elemento.noAtomico}</span>
        <span class="symbol">${elemento.simbolo}</span>
        <span class="name">${elemento.nombre}</span>
        <span class="mass">${elemento.masa}</span>
      </div>
    `;
  }

  /**
   * Genera una celda vacía
   */
  generateEmptyCell(periodo, grupo) {
    // Celdas vacías específicas según la estructura de la tabla periódica
    if (periodo === 1 && grupo >= 2 && grupo <= 17) {
      return '<div class="element-cell empty"></div>';
    }
    if ((periodo === 2 || periodo === 3) && grupo >= 3 && grupo <= 12) {
      return '<div class="element-cell empty"></div>';
    }
    return '';
  }

  /**
   * Genera placeholder para lantánidos/actínidos
   */
  generatePlaceholder(text, periodo) {
    return `
      <div class="element-cell placeholder" data-series="${text.toLowerCase()}">
        <span class="placeholder-text">${text}</span>
        <span class="atomic-number">${periodo === 6 ? '57-71' : '89-103'}</span>
      </div>
    `;
  }

  /**
   * Encuentra un elemento por periodo y grupo
   */
  findElement(periodo, grupo) {
    return this.data.elementos.find(el =>
      el.periodo === periodo && el.grupo === grupo
    );
  }

  /**
   * Determina el tipo de metal para la clase CSS
   */
  getMetalType(categoria) {
    const noMetales = ['Otros no metales', 'Halógenos', 'Gases nobles', 'Metaloides'];
    return noMetales.includes(categoria) ? 'no-metal' : 'metal';
  }

  /**
   * Renderiza el selector de grupos (vista por familias)
   */
  renderGroupSelector() {
    const container = document.querySelector(this.container);
    if (!container) return;

    container.innerHTML = `
      <div class="group-view">
        <div class="groups-panel">
          <h3>FAMILIA</h3>
          <ul class="groups-list">
            ${this.generateGroupsList()}
          </ul>
        </div>
        <div class="elements-panel">
          <h3 class="elements-title">ELEMENTO</h3>
          <div class="elements-container"></div>
        </div>
      </div>
    `;
  }

  /**
   * Genera la lista de grupos/familias
   */
  generateGroupsList() {
    return this.data.grupos.map((grupo, index) => `
      <li data-group-id="${grupo.id}" class="group-item">
        F-${index + 1}
      </li>
    `).join('');
  }

  /**
   * Muestra elementos de un grupo específico
   */
  showGroupElements(groupId) {
    const grupo = this.data.grupos.find(g => g.id === groupId);
    if (!grupo) return;

    const elementos = grupo.elementos.map(atomicNum =>
      this.data.elementos.find(e => e.noAtomico === atomicNum)
    ).filter(Boolean);

    const container = document.querySelector('.elements-container');
    container.innerHTML = `
      <div class="group-elements">
        ${elementos.map(el => this.generateElementCell(el)).join('')}
      </div>
    `;

    // Mostrar título
    document.querySelector('.elements-title').style.display = 'block';
  }

  /**
   * Adjunta event listeners
   */
  attachEventListeners() {
    const container = document.querySelector(this.container);

    // Click en elementos
    container.addEventListener('click', (e) => {
      const elementCell = e.target.closest('.element-cell');
      if (elementCell && !elementCell.classList.contains('empty') && !elementCell.classList.contains('placeholder')) {
        const atomicNum = parseInt(elementCell.dataset.atomic);
        const elemento = this.data.elementos.find(el => el.noAtomico === atomicNum);
        if (elemento) {
          this.onElementClick(elemento);
        }
      }

      // Click en grupos (vista por familias)
      const groupItem = e.target.closest('.group-item');
      if (groupItem) {
        // Remover selección anterior
        document.querySelectorAll('.group-item').forEach(item => {
          item.classList.remove('selected');
        });
        groupItem.classList.add('selected');

        const groupId = parseInt(groupItem.dataset.groupId);
        this.showGroupElements(groupId);
      }
    });
  }

  /**
   * Handler por defecto para click en elemento
   */
  defaultElementClick(elemento) {
    const esMetal = !['Otros no metales', 'Halógenos', 'Gases nobles', 'Metaloides'].includes(elemento.categoria);

    if (typeof swal !== 'undefined') {
      swal({
        title: elemento.nombre,
        text: `
          <h1>${elemento.simbolo}</h1>
          <div>
            <span>Número atómico: </span><strong>${elemento.noAtomico}</strong><br/>
            <span>Masa Atómica: </span><strong>${elemento.masa}</strong><br/>
            <span>${esMetal ? 'Metal' : 'No metal'}: </span><strong>(${elemento.categoria})</strong>
          </div>
        `,
        html: true,
        showConfirmButton: true
      });
    } else {
      console.log('Elemento seleccionado:', elemento);
    }
  }

  /**
   * Cambia entre modo completo y por grupos
   */
  switchMode(mode) {
    this.mode = mode;
    const container = document.querySelector(this.container);
    container.innerHTML = '';
    this.init();
  }

  /**
   * Busca elementos por nombre, símbolo o número atómico
   */
  searchElement(query) {
    const searchTerm = query.toString().toLowerCase();
    return this.data.elementos.filter(el =>
      el.nombre.toLowerCase().includes(searchTerm) ||
      el.simbolo.toLowerCase().includes(searchTerm) ||
      el.noAtomico.toString() === searchTerm
    );
  }

  /**
   * Filtra elementos por categoría
   */
  filterByCategory(categoria) {
    return this.data.elementos.filter(el => el.categoria === categoria);
  }

  /**
   * Obtiene todos los elementos
   */
  getAllElements() {
    return this.data ? this.data.elementos : [];
  }

  /**
   * Obtiene un elemento por número atómico
   */
  getElementById(atomicNumber) {
    return this.data.elementos.find(el => el.noAtomico === atomicNumber);
  }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PeriodicTable;
}
