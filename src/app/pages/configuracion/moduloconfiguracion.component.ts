import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service';
import { UsuarioPerfil } from 'src/app/models/cuenta';
import Swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ObtenerPublicacionService } from 'src/app/services/publicaciones.service';
import { RawgApiService, RAWGGame, RAWGPlatform, RAWGGenre } from 'src/app/services/rawg-api.service';
import { Subject, Observable, forkJoin, of } from 'rxjs';
import { takeUntil, map, catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-moduloconfiguracion',
  templateUrl: './moduloconfiguracion.component.html',
  styleUrls: ['./moduloconfiguracion.component.css'],
  animations: [
    trigger('cambiarColor', [
      state('green', style({
        backgroundColor: '#17B169', color: 'white',
      })),
      state('rojo', style({
        backgroundColor: '#A52A2A', color: 'white',
      })),
      transition('green <=> rojo', [
        animate('2s ease')  // Aumentamos la duración para hacer más visible la animación
      ]),
    ]),
  ]
})

export class ModuloconfiguracionComponent implements OnInit, OnDestroy {
  @ViewChild("nombreVideojuego") nombreVideojuego: ElementRef;

  // ===== UNSUBSCRIBE =====
  private destroy$ = new Subject<void>();

  // ===== CONSTANTES =====
  private readonly SCROLL_SPEED = 1;
  private readonly SCROLL_INTERVAL_MS = 10;
  private readonly DICEBEAR_BASE_URL = 'https://api.dicebear.com/9.x/';
  private readonly DICEBEAR_CATEGORIES = {
    BOTTTS: 'bottts-neutral/svg',
    ADVENTURER: 'adventurer/svg'
  };

  // ===== INFORMACIÓN USUARIO =====
  correoUsuario: string;
  usuarioInfo: UsuarioPerfil;
  nombreUsuario: string;
  descripcion: string = '';
  editarDescripcion: boolean = false;

  // ===== ESTADOS DE CARGA =====
  isLoading: boolean = true;
  isLoadingVideojuegos: boolean = false;
  isLoadingGeneros: boolean = false;
  elementoInicial: boolean = true;

  // ===== FILTROS =====
  generoSeleccionado: string = 'all';
  plataformaSeleccionada: string = 'all';

  // ===== CONFIGURACIÓN SCROLL =====
  private scrollConfigs = {
    videojuegos: {
      interval: null as any,
      direction: 1,
      isMouseInside: false,
      containerSelector: '.scroll-container'
    },
    plataformas: {
      interval: null as any, 
      direction: 1,
      isMouseInside: false,
      containerSelector: '.plataformasCointainer'
    }
  };

  // ===== DATOS RAWG API =====
  rawgResultadosPlataformas: RAWGPlatform[] = [];
  rawgResultadosVideojuegos: RAWGGame[] = [];
  rawgResultadosGeneros: RAWGGenre[] = [];
  
  // Datos completos para navegación
  datosCompletosVideojuegos: any = null;
  paginaActual: number = 1;

  // Computed properties para la UI
  get listPage(): number {
    return this.paginaActual;
  }

  get tienePaginaAnterior(): boolean {
    return this.datosCompletosVideojuegos?.previous !== null;
  }

  get tienePaginaSiguiente(): boolean {
    return this.datosCompletosVideojuegos?.next !== null;
  }

  // ===== AVATARES =====
  private readonly avataresPredefinidos: string[] = [
    '../../assets/img11.png', '../../assets/img12.png', '../../assets/img13.png', 
    '../../assets/img14.png', '../../assets/img15.png', '../../assets/img16.png', 
    '../../assets/img17.png', '../../assets/img18.png'
  ];

  private readonly avataresGenerados: string[] = [
    `${this.DICEBEAR_BASE_URL}${this.DICEBEAR_CATEGORIES.BOTTTS}`,
    `${this.DICEBEAR_BASE_URL}${this.DICEBEAR_CATEGORIES.BOTTTS}?seed=Felix`,
    `${this.DICEBEAR_BASE_URL}${this.DICEBEAR_CATEGORIES.BOTTTS}?seed=Aidan`,
    `${this.DICEBEAR_BASE_URL}${this.DICEBEAR_CATEGORIES.BOTTTS}?seed=Caleb`,
    `${this.DICEBEAR_BASE_URL}${this.DICEBEAR_CATEGORIES.BOTTTS}?seed=Sophia`,
    `${this.DICEBEAR_BASE_URL}${this.DICEBEAR_CATEGORIES.ADVENTURER}`,
    `${this.DICEBEAR_BASE_URL}${this.DICEBEAR_CATEGORIES.ADVENTURER}?seed=Emery`,
    `${this.DICEBEAR_BASE_URL}${this.DICEBEAR_CATEGORIES.ADVENTURER}?seed=Jack`
  ];

  get listaAvatares(): string[] {
    return [...this.avataresPredefinidos, ...this.avataresGenerados];
  }

  constructor(
    private Cuenta: RespuestasService, 
    private publicaciones: ObtenerPublicacionService,
    private rawgApiService: RawgApiService
  ) {
    this.correoUsuario = localStorage.getItem('PerfilUsuario');
    this.nombreUsuario = localStorage.getItem('NombreUser');
  }

  ngOnInit(): void {
    // Cargar información del usuario primero, luego los datos RAWG
    this.obtenerInformacionUsuario();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.limpiarIntervalosScroll();
  }

  activarScroll() {
    this.limpiarIntervalosScroll();
    this.iniciarScrollAutomatico('videojuegos');
    this.iniciarScrollAutomatico('plataformas');
  }

  private limpiarIntervalosScroll(): void {
    if (this.scrollConfigs.videojuegos.interval) {
      clearInterval(this.scrollConfigs.videojuegos.interval);
    }
    if (this.scrollConfigs.plataformas.interval) {
      clearInterval(this.scrollConfigs.plataformas.interval);
    }
  }

  // ===== MÉTODOS DE CARGA RAWG =====
  private cargarDatosRawg(): void {
    this.isLoading = true;
    
    // Usar forkJoin para cargar todos los datos en paralelo
    const datosParalelos = [
      this.cargarPlataformas(),
      this.cargarVideojuegos(), 
      this.cargarGeneros()
    ];
    
    // Cuando todos terminen, actualizar el estado de loading
    forkJoin(datosParalelos)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.marcarElementosAgregados();
        },
        error: (error) => {
          console.error('Error cargando datos RAWG:', error);
          this.isLoading = false;
        }
      });
  }

  private cargarPlataformas(): Observable<void> {
    return this.rawgApiService.obtenerPlataformas()
      .pipe(
        takeUntil(this.destroy$),
        map((plataformas) => {
          this.rawgResultadosPlataformas = plataformas;
          return void 0; // Retornar void para forkJoin
        }),
        catchError((error) => {
          console.error('Error cargando plataformas:', error);
          this.rawgResultadosPlataformas = [];
          return of(void 0); // Continuar con array vacío
        })
      );
  }

  private cargarVideojuegos(): Observable<void> {
    this.isLoadingVideojuegos = true;
    return this.rawgApiService.obtenerVideojuegosConPaginacion('', 'all', 'all')
      .pipe(
        takeUntil(this.destroy$),
        map((response) => {
          console.log('Videojuegos cargados en componente:', response.results.length);
          console.log('Datos de paginación:', { next: response.next, previous: response.previous });
          this.rawgResultadosVideojuegos = response.results;
          this.datosCompletosVideojuegos = response;
          this.isLoadingVideojuegos = false;
          return void 0;
        }),
        catchError((error) => {
          console.error('Error cargando videojuegos:', error);
          this.rawgResultadosVideojuegos = [];
          this.datosCompletosVideojuegos = null;
          this.isLoadingVideojuegos = false;
          return of(void 0);
        })
      );
  }

  private cargarGeneros(): Observable<void> {
    this.isLoadingGeneros = true;
    return this.rawgApiService.obtenerGeneros()
      .pipe(
        takeUntil(this.destroy$),
        map((generos) => {
          this.rawgResultadosGeneros = generos;
          this.isLoadingGeneros = false;
          return void 0;
        }),
        catchError((error) => {
          console.error('Error cargando géneros:', error);
          this.rawgResultadosGeneros = [];
          this.isLoadingGeneros = false;
          return of(void 0);
        })
      );
  }

  // ===== MÉTODOS DE SCROLL =====
  private iniciarScrollAutomatico(tipo: 'videojuegos' | 'plataformas'): void {
    const config = this.scrollConfigs[tipo];
    const contenedor = document.querySelector(
      tipo === 'videojuegos' ? config.containerSelector : '.plataformasCointainer'
    );

    if (!contenedor) return;

    config.interval = setInterval(() => {
      if (!config.isMouseInside) {
        const nuevaPosicion = contenedor.scrollLeft + (this.SCROLL_SPEED * config.direction);
        contenedor.scrollTo({ left: nuevaPosicion, behavior: 'smooth' });

        // Cambiar dirección al llegar a los extremos
        if (nuevaPosicion >= contenedor.scrollWidth - contenedor.clientWidth) {
          config.direction = -1;
        } else if (nuevaPosicion <= 0) {
          config.direction = 1;
        }
      }
    }, this.SCROLL_INTERVAL_MS);
  }

  detenerScroll(tipo: 'videojuegos' | 'plataformas'): void {
    this.scrollConfigs[tipo].isMouseInside = true;
  }

  reanudarScroll(tipo: 'videojuegos' | 'plataformas'): void {
    this.scrollConfigs[tipo].isMouseInside = false;
  }

  // ===== MÉTODOS DE BÚSQUEDA Y FILTRADO =====
  buscarVideojuego(): void {
    const nombre = this.nombreVideojuego?.nativeElement?.value?.trim();
    
    if (!nombre) {
      this.cargarVideojuegos();
      return;
    }

    this.isLoadingVideojuegos = true;
    
    this.rawgApiService.obtenerVideojuegos(nombre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.rawgResultadosVideojuegos = response;
          this.isLoadingVideojuegos = false;
          this.marcarElementosAgregados();
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.isLoadingVideojuegos = false;
        }
      });
  }

  cambioGenero(genero: RAWGGenre): void {
    this.isLoadingGeneros = true;
    this.generoSeleccionado = genero.id.toString();
    this.filtrarVideojuegos();
  }

  cambioPlatforma(plataforma: RAWGPlatform): void {
    this.plataformaSeleccionada = plataforma.id.toString();
    this.filtrarVideojuegos();
  }

  private filtrarVideojuegos(): void {
    this.isLoadingVideojuegos = true;
    
    const genero = this.generoSeleccionado !== 'all' ? this.generoSeleccionado : undefined;
    const plataforma = this.plataformaSeleccionada !== 'all' ? this.plataformaSeleccionada : undefined;

    this.rawgApiService.obtenerVideojuegos(undefined, genero, plataforma)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.rawgResultadosVideojuegos = response;
          this.isLoadingVideojuegos = false;
          this.isLoadingGeneros = false;
        },
        error: (error) => {
          console.error('Error filtrando:', error);
          this.isLoadingVideojuegos = false;
          this.isLoadingGeneros = false;
        }
      });
  }

  // ===== MÉTODOS DE PAGINACIÓN =====
  actualizarListaJuegos(siguiente: boolean): void {
    if (!this.datosCompletosVideojuegos) {
      console.error('No hay datos de paginación disponibles');
      return;
    }

    const url = siguiente ? this.datosCompletosVideojuegos.next : this.datosCompletosVideojuegos.previous;
    
    if (!url) {
      console.log(siguiente ? 'No hay página siguiente' : 'No hay página anterior');
      return;
    }

    this.isLoadingVideojuegos = true;
    
    this.rawgApiService.actualizarPaginaJuegos(url)
      .pipe(
        takeUntil(this.destroy$),
        map((response) => {
          console.log(`Página ${siguiente ? 'siguiente' : 'anterior'} cargada:`, response.results.length);
          this.rawgResultadosVideojuegos = response.results;
          this.datosCompletosVideojuegos = response;
          this.paginaActual = siguiente ? this.paginaActual + 1 : this.paginaActual - 1;
          this.marcarElementosAgregados(); // Remarcar elementos agregados en la nueva página
          this.isLoadingVideojuegos = false;
          return void 0;
        }),
        catchError((error) => {
          console.error('Error actualizando página de videojuegos:', error);
          this.isLoadingVideojuegos = false;
          return of(void 0);
        })
      )
      .subscribe();
  }

  // ===== MÉTODOS DE GESTIÓN DE ESTADO =====
  marcarElementosAgregados(): void {
    if (!this.usuarioInfo) {
      console.log('No hay información de usuario para marcar elementos');
      return;
    }

    console.log('Marcando elementos agregados...', {
      videojuegos: this.usuarioInfo.videojuegos?.length || 0,
      plataformas: this.usuarioInfo.plataformas?.length || 0
    });

    // Marcar videojuegos ya agregados
    if (this.usuarioInfo.videojuegos?.length > 0) {
      this.rawgResultadosVideojuegos.forEach(juego => {
        const yaAgregado = this.usuarioInfo.videojuegos.some(v => v.nombre === juego.name);
        (juego as any).Agregado = yaAgregado;
        if (yaAgregado) {
          console.log(`Videojuego marcado como agregado: ${juego.name}`);
        }
      });
    }

    // Marcar plataformas ya agregadas  
    if (this.usuarioInfo.plataformas?.length > 0) {
      this.rawgResultadosPlataformas.forEach(plataforma => {
        if (plataforma.platforms) {
          plataforma.platforms.forEach(platform => {
            const yaAgregado = this.usuarioInfo.plataformas.some(p => p.nombre === platform.name);
            (platform as any).Agregado = yaAgregado;
            if (yaAgregado) {
              console.log(`Plataforma marcada como agregada: ${platform.name}`);
            }
          });
        }
      });
    }
  }

  // ===== MÉTODOS DE GESTIÓN USUARIO =====
  private obtenerInformacionUsuario(): void {
    if (!this.correoUsuario) {
      console.error('No hay correo de usuario disponible');
      this.isLoading = false;
      return;
    }

    this.Cuenta.obtenerPorCorreo(this.correoUsuario)
      .pipe(
        take(1), // Solo tomar el primer valor, no suscribirse a cambios
        map(res => res[0] as UsuarioPerfil),
        catchError(error => {
          console.error('Error obteniendo información del usuario:', error);
          this.isLoading = false;
          throw error;
        })
      )
      .subscribe({
        next: (usuarioInfo) => {
          this.usuarioInfo = usuarioInfo;
          this.descripcion = usuarioInfo.descripcion || '';
          // Solo cargar datos RAWG una vez al inicio
          this.cargarDatosRawg();
          this.activarScroll();
        },
        error: (error) => {
          console.error('Error procesando información del usuario:', error);
          this.isLoading = false;
        }
      });
  }

  // ===== MÉTODO GENÉRICO PARA ACTUALIZACIONES =====
  private async actualizarCampoUsuario(campo: string, valor: any, mensajeExito: string): Promise<void> {
    if (!this.usuarioInfo?.id) {
      console.error('No hay información de usuario disponible');
      return;
    }

    const parametros = [{ campo, valor }];

    try {
      // Esperar a que la actualización en Firebase termine
      await Promise.all(this.Cuenta.editarCamposNoArray(parametros, this.usuarioInfo.id));
      
      // Solo actualizar el estado local después de que Firebase confirme la actualización
      (this.usuarioInfo as any)[campo] = valor;
      
      console.log(mensajeExito);
      
      // No llamar marcarElementosAgregados aquí - ya se actualizó el estado local
    } catch (error) {
      console.error(`Error actualizando ${campo}:`, error);
      throw error;
    }
  }

  // ===== MÉTODOS DE GESTIÓN DE PLATAFORMAS =====
  async agregarPlataforma(slugPadre: string, item: any): Promise<void> {
    if (!item?.name) {
      console.error('Item inválido para agregar plataforma');
      return;
    }

    const nuevaPlataforma = {
      id: item.id?.toString() || Date.now().toString(),
      nombre: item.name,
      icono: slugPadre
    };

    // Verificar si ya existe
    const plataformasExistentes = this.usuarioInfo.plataformas || [];
    if (plataformasExistentes.some(p => p.nombre === nuevaPlataforma.nombre)) {
      console.log('La plataforma ya está agregada');
      return;
    }

    // Actualizar estado visual inmediatamente para la animación
    console.log(`Cambiando estado de plataforma ${item.name} a agregado: true`);
    item.Agregado = true;

    const arregloCombinado = [...plataformasExistentes, nuevaPlataforma];
    
    try {
      await this.actualizarCampoUsuario('plataformas', arregloCombinado, 'Plataforma agregada correctamente');
    } catch (error) {
      // Si hay error, revertir el estado visual
      item.Agregado = false;
      console.error('Error agregando plataforma, estado revertido');
    }
  }

  async eliminarPlataforma(itemParametro: any): Promise<void> {
    const nombreAEliminar = itemParametro.name || itemParametro.nombre;
    if (!nombreAEliminar) {
      console.error('No se puede identificar la plataforma a eliminar');
      return;
    }

    // Actualizar estado visual inmediatamente para la animación
    console.log(`Cambiando estado de plataforma ${nombreAEliminar} a agregado: false`);
    itemParametro.Agregado = false;

    const arrayLimpio = this.usuarioInfo.plataformas?.filter(
      itemInfo => itemInfo.nombre !== nombreAEliminar
    ) || [];

    try {
      await this.actualizarCampoUsuario('plataformas', arrayLimpio, 'Plataforma eliminada correctamente');
    } catch (error) {
      // Si hay error, revertir el estado visual
      itemParametro.Agregado = true;
      console.error('Error eliminando plataforma, estado revertido');
    }
  }

  // ===== MÉTODOS DE GESTIÓN DE VIDEOJUEGOS =====
  async agregarVideojuego(item: any): Promise<void> {
    if (!item?.name) {
      console.error('Item inválido para agregar videojuego');
      return;
    }

    const nuevoVideojuego = {
      id: item.id?.toString() || Date.now().toString(),
      nombre: item.name,
      genero: item.genres?.[0]?.name || 'No especificado',
      plataforma: item.platforms?.[0]?.platform?.name || 'No especificada',
      imagen: item.background_image
    };

    // Verificar si ya existe
    const videojuegosExistentes = this.usuarioInfo.videojuegos || [];
    if (videojuegosExistentes.some(v => v.nombre === nuevoVideojuego.nombre)) {
      console.log('El videojuego ya está agregado');
      return;
    }

    // Actualizar estado visual inmediatamente para la animación
    item.Agregado = true;

    const arregloCombinado = [...videojuegosExistentes, nuevoVideojuego];
    
    try {
      await this.actualizarCampoUsuario('videojuegos', arregloCombinado, 'Videojuego agregado correctamente');
    } catch (error) {
      // Si hay error, revertir el estado visual
      item.Agregado = false;
      console.error('Error agregando videojuego, estado revertido');
    }
  }

  async eliminarVideojuego(itemParametro: any): Promise<void> {
    const nombreAEliminar = itemParametro.name || itemParametro.nombre;
    if (!nombreAEliminar) {
      console.error('No se puede identificar el videojuego a eliminar');
      return;
    }

    // Actualizar estado visual inmediatamente para la animación
    itemParametro.Agregado = false;

    const arrayLimpio = this.usuarioInfo.videojuegos?.filter(
      itemInfo => itemInfo.nombre !== nombreAEliminar
    ) || [];

    try {
      await this.actualizarCampoUsuario('videojuegos', arrayLimpio, 'Videojuego eliminado correctamente');
    } catch (error) {
      // Si hay error, revertir el estado visual
      itemParametro.Agregado = true;
      console.error('Error eliminando videojuego, estado revertido');
    }
  }

  // ===== MÉTODOS DE DESCRIPCIÓN Y AVATAR =====
  async actualizarDescripcion(): Promise<void> {
    if (this.descripcion.trim() === '') {
      console.log('La descripción no puede estar vacía');
      return;
    }

    this.editarDescripcion = false;
    await this.actualizarCampoUsuario('descripcion', this.descripcion.trim(), 'Descripción actualizada correctamente');
  }

  async cambiarAvatar(avatar: string): Promise<void> {
    if (!avatar) {
      console.error('Avatar inválido');
      return;
    }

    try {
      // Actualizar en publicaciones también
      this.publicaciones.actualizarCampoEnPublicaciones(this.correoUsuario, 'usuarioIcono', avatar);
      await this.actualizarCampoUsuario('imagen', avatar, 'Avatar actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando avatar en publicaciones:', error);
    }
  }

  // ===== MÉTODOS DE DESACTIVACIÓN DE CUENTA =====
  desactivarCuenta(): void {
    // TODO: Implementar lógica de desactivación con SweetAlert
    console.log('Funcionalidad de desactivación de cuenta pendiente');
  }

  // ===== MÉTODOS DE MANEJO DE EVENTOS DEL MOUSE =====
  onMouseEnter(tipo: 'videojuegos' | 'plataformas'): void {
    this.detenerScroll(tipo);
  }

  onMouseLeave(tipo: 'videojuegos' | 'plataformas'): void {
    this.reanudarScroll(tipo);
  }

  // ===== MÉTODOS DE MANEJO DE SCROLL =====
  onScroll(event: WheelEvent, tipo: 'videojuegos' | 'plataformas'): void {
    const selector = tipo === 'videojuegos' ? '.scroll-container' : '.plataformasCointainer';
    const scrollContainer = document.querySelector(selector) as HTMLElement;

    if (!scrollContainer) return;
    
    if (event.deltaY !== 0) {
      scrollContainer.scrollLeft += event.deltaY;
    }
    
    event.preventDefault();
  }

  // ===== MÉTODOS PARA ELIMINAR DESDE LA SECCIÓN DE CUENTA =====
  async EliminarVideojuego(videojuego: any): Promise<void> {
    if (!videojuego?.nombre) {
      console.error('Videojuego inválido para eliminar');
      return;
    }

    const arrayLimpio = this.usuarioInfo.videojuegos?.filter(
      item => item.nombre !== videojuego.nombre
    ) || [];

    try {
      await this.actualizarCampoUsuario('videojuegos', arrayLimpio, 'Videojuego eliminado correctamente');
      
      // Actualizar estado visual en las listas de RAWG si el videojuego está presente
      this.marcarElementosAgregados();
    } catch (error) {
      console.error('Error eliminando videojuego:', error);
    }
  }

  async EliminarPlataforma(plataforma: any, icono?: any): Promise<void> {
    if (!plataforma?.nombre) {
      console.error('Plataforma inválida para eliminar');
      return;
    }

    const arrayLimpio = this.usuarioInfo.plataformas?.filter(
      item => item.nombre !== plataforma.nombre
    ) || [];

    try {
      await this.actualizarCampoUsuario('plataformas', arrayLimpio, 'Plataforma eliminada correctamente');
      
      // Actualizar estado visual en las listas de RAWG si la plataforma está presente
      this.marcarElementosAgregados();
    } catch (error) {
      console.error('Error eliminando plataforma:', error);
    }
  }
}


