import { Component, OnInit, OnDestroy } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service';
import { Router } from '@angular/router';
import { Observable, Subject, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { UsuarioPerfil } from 'src/app/models/cuenta';
import Swal from 'sweetalert2';

interface SelectionEvent {
  item: string;
}

interface DropdownItem {
  id: string;
  label: string;
  icon: string;
  action: 'navigate' | 'method';
  target: string;
  isDivider?: boolean;
  cssClass?: string;
}

// Constantes
const DROPDOWN_STYLES = {
  POSITION: 'fixed',
  TOP: '60px',
  RIGHT: '10%',
  Z_INDEX: '2147483647',
  BACKGROUND: 'rgb(44, 44, 44)',
  BORDER: '1px solid #555',
  BORDER_RADIUS: '8px',
  MIN_WIDTH: '200px',
  BOX_SHADOW: '0 10px 30px rgba(0,0,0,0.5)'
};

const DROPDOWN_ID = 'external-dropdown';
const CLICK_OUTSIDE_DELAY = 100;

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent implements OnInit, OnDestroy
{
  correoUsuario: string | null = localStorage.getItem('PerfilUsuario');
  dropdownOpen: boolean = false;

  // Configuración de elementos del dropdown
  dropdownItems: DropdownItem[] = [
    {
      id: 'perfil',
      label: 'Mi perfil',
      icon: '👤',
      action: 'method',
      target: 'perfilusuario'
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: '⚙️',
      action: 'navigate',
      target: '/moduloconfiguracion'
    },
    {
      id: 'amigos',
      label: 'Amigos',
      icon: '👥',
      action: 'navigate',
      target: '/amigos'
    },
    {
      id: 'foro-problemas',
      label: 'Foro de problemas',
      icon: '❓',
      action: 'navigate',
      target: '/moduloforoproblemas'
    },
    {
      id: 'foro-proyectos',
      label: 'Foro de proyectos',
      icon: '📁',
      action: 'navigate',
      target: '/moduloproyectos'
    },
    {
      id: 'divider',
      label: '',
      icon: '',
      action: 'navigate',
      target: '',
      isDivider: true
    },
    {
      id: 'cerrar-sesion',
      label: 'Cerrar sesión',
      icon: '🚪',
      action: 'method',
      target: 'cerrarSesion',
      cssClass: 'text-danger'
    }
  ];
  
  usuarioPerfil: UsuarioPerfil = {
    usuario: '',
    correo: '',
    plataformas: [],
    videojuegos: [],
    amigos: [],
    solicitudesAmistadEnviadas: [],
    solicitudesAmistadRecibidas: [],
    esPublico: true,
    notificacionesActivas: true
  };

  // Propiedad para el modelo de búsqueda
  model: string;

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.obtenerUsuarios(term))
    )

  constructor(
    private cuenta: RespuestasService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerPerfilUsuario();
  }

  obtenerPerfilUsuario(): void {
    if (!this.correoUsuario) {
      console.warn('No se encontró correo de usuario en localStorage');
      return;
    }

    this.cuenta.obtenerPorCorreo(this.correoUsuario).subscribe(res => {
      if (res.length !== 0) {
        this.usuarioPerfil = res[0];
        localStorage.setItem("NombreUser", res[0].usuario);
      }
    }, error => this.mostrarErrorTryCatch(error));
  }

  obtenerUsuarios(term: string): Observable<string[]> {
    return this.cuenta.getUsuarios(term === '' ? '  ' : term);
  }

  perfilusuario() {
    this.cuenta.obtenerPorCorreo(this.correoUsuario).subscribe(res => {
      if (res.length !== 0) {
        this.navegarAPerfil(res[0].id);
      }
    }, error => this.mostrarErrorTryCatch(error));
  }

  selected(event: SelectionEvent): void {
    this.cuenta.obtenerPorUsuario(event.item).subscribe(res => {
      if (res.length !== 0) {
        this.navegarAPerfil(res[0].id);
      }
    }, error => this.mostrarErrorTryCatch(error));
  }

  teclaEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const inputElement = event.target as HTMLInputElement;
      const value = inputElement.value;

      this.cuenta.obtenerPorUsuario(value).subscribe(res => {
        if (res.length !== 0) {
          this.navegarAPerfil(res[0].id);
        }
      }, error => this.mostrarErrorTryCatch(error));
    }
  }

  cerrarSesion() {
    firebase.auth().signOut();

    localStorage.removeItem('PerfilUsuario');
    localStorage.removeItem('NombreUser');

    this.router.navigate(['/']);
  }

  mostrarErrorTryCatch(error: string | Error): Promise<any> {
    const errorMessage = error instanceof Error ? error.message : error;
    return Swal.fire({
      icon: 'error', 
      title: errorMessage, 
      showConfirmButton: true, 
      heightAuto: false
    });
  }

  /**
   * Genera el HTML interno del dropdown basado en la configuración
   */
  private generateDropdownHTML(): string {
    return this.dropdownItems.map(item => {
      if (item.isDivider) {
        return '<hr style="margin: 8px 0; border: 0; border-top: 1px solid #555;">';
      }

      const colorClass = item.cssClass === 'text-danger' ? '#ff6b6b' : 'white';
      const hoverColor = item.cssClass === 'text-danger' 
        ? 'rgba(255, 107, 107, 0.1)' 
        : 'rgba(73, 155, 234, 0.1)';

      const onclick = item.action === 'method' 
        ? `window.angular_component.${item.target}(); window.angular_component.closeDropdown();`
        : `window.location.href='${item.target}'`;

      return `
        <div class="dropdown-item" 
             style="display: block; padding: 12px 16px; color: ${colorClass}; cursor: pointer; border-bottom: 1px solid #555; transition: all 0.2s ease;" 
             onmouseover="this.style.backgroundColor='${hoverColor}'; this.style.transform='translateX(5px)';" 
             onmouseout="this.style.backgroundColor='transparent'; this.style.transform='translateX(0)';"
             onclick="${onclick}">
          ${item.icon} ${item.label}
        </div>
      `;
    }).join('');
  }

  /**
   * Navega al perfil del usuario especificado
   * @param userId ID del usuario al que navegar
   */
  private navegarAPerfil(userId: string): void {
    const perfilActivo = this.router.url.includes('perfil');
    const nuevaUrl = `/perfil/${userId}`;
    
    if (this.router.url !== nuevaUrl) {
      window.location.href = nuevaUrl;
      setTimeout(() => {
        if (perfilActivo) {
          location.reload();
        }
      }, 100);
    }
  }

  /**
   * Alterna la visibilidad del dropdown del usuario
   */
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    
    if (this.dropdownOpen) {
      this.createExternalDropdown();
    } else {
      this.removeExternalDropdown();
    }
  }

  createExternalDropdown(): void {
    // Remover dropdown existente si existe
    this.removeExternalDropdown();
    
    // Crear dropdown en el body
    const dropdown = document.createElement('div');
    dropdown.id = DROPDOWN_ID;
    
    // Generar HTML dinámicamente basado en configuración
    dropdown.innerHTML = this.generateDropdownHTML();
    
    // Aplicar estilos usando constantes
    dropdown.style.cssText = `
      position: ${DROPDOWN_STYLES.POSITION} !important;
      top: ${DROPDOWN_STYLES.TOP} !important;
      right: ${DROPDOWN_STYLES.RIGHT} !important;
      z-index: ${DROPDOWN_STYLES.Z_INDEX} !important;
      background: ${DROPDOWN_STYLES.BACKGROUND} !important;
      border: ${DROPDOWN_STYLES.BORDER} !important;
      border-radius: ${DROPDOWN_STYLES.BORDER_RADIUS} !important;
      min-width: ${DROPDOWN_STYLES.MIN_WIDTH} !important;
      color: white !important;
      box-shadow: ${DROPDOWN_STYLES.BOX_SHADOW} !important;
      display: block !important;
      overflow: hidden !important;
    `;
    
    document.body.appendChild(dropdown);
    
    // Exponer el componente globalmente para las acciones del dropdown
    (window as any).angular_component = this;
    
    // Agregar listener para cerrar al hacer clic fuera
    setTimeout(() => {
      document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }, CLICK_OUTSIDE_DELAY);
  }

  handleClickOutside(event: Event): void {
    const dropdown = document.getElementById(DROPDOWN_ID);
    const target = event.target as HTMLElement;
    
    // Si el clic no fue en el dropdown ni en el botón del usuario
    if (dropdown && !dropdown.contains(target) && !target.closest('.nav-link')) {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
    this.removeExternalDropdown();
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
  }

  removeExternalDropdown(): void {
    const dropdown = document.getElementById(DROPDOWN_ID);
    if (dropdown) {
      dropdown.remove();
    }
  }

  ngOnDestroy(): void {
    // Limpiar dropdown y event listeners al destruir el componente
    this.removeExternalDropdown();
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    
    // Limpiar referencia global
    if ((window as any).angular_component === this) {
      delete (window as any).angular_component;
    }
  }
}
