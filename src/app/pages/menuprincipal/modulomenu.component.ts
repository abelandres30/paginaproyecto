// Angular Core
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';

// Third-party libraries
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subject, of } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Local components
import { UsuariorecomendadosComponent } from '../usuariorecomendados/usuariorecomendados.component';

// Services
import { RegistroPublicacionService } from '../../services/registropublicacion.service';
import { ObtenerPublicacionService } from '../../services/publicaciones.service';
import { RespuestasService } from '../../services/cuentas.service';
import { FileValidationService, FileValidationResult } from '../../services/file-validation.service';

// Models
import { Publicacion } from '../../models/publicacion';

// Interfaces locales
interface PublicationFormData {
  titulo: string;
  descripcion: string;
  plataforma: string;
  videojuego: string;
  comentario: string;
  archivo: string;
  respondido: string;
  mensaje: string;
}

interface UserData {
  imagen?: string;
  [key: string]: any;
}

type FileFormat = 'image' | 'video' | 'unknown' | '';
type MediaUrl = string | ArrayBuffer | null;

// Enums y constantes
enum TabType {
  HOME = 'home',
  MY_PUBLICATIONS = 'menu1',
  SAVED_PUBLICATIONS = 'menu2'
}

enum PublicationCategory {
  ALL = 1,
  MY_PUBLICATIONS = 2,
  SAVED_PUBLICATIONS = 3
}

// Constantes de archivo
const FILE_CONSTRAINTS = {
  MAX_SIZE: 15 * 1024 * 1024, // 15MB (aumentado para videos)
  ALLOWED_TYPES: ['image/', 'video/'] as string[],
  PLACEHOLDER_IMAGE: 'assets/images/placeholder-image.png',
  SUPPORTED_IMAGE_TYPES: [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 
    'image/bmp', 'image/svg+xml', 'image/tiff'
  ],
  SUPPORTED_VIDEO_TYPES: [
    'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo', 
    'video/webm', 'video/x-flv', 'video/3gpp'
  ]
} as const;

// Constantes de localStorage
const STORAGE_KEYS = {
  USER_EMAIL: 'PerfilUsuario',
  USER_NAME: 'NombreUser'
} as const;

@Component({
  selector: 'app-modulomenu',
  templateUrl: './modulomenu.component.html',
  styleUrls: ['./modulomenu.component.css']
})

export class ModulomenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(UsuariorecomendadosComponent) hijo: UsuariorecomendadosComponent;
  @ViewChild("Publicacion") Publicacion: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild("modalPublicacion") modalPublicacion: ElementRef;
  @ViewChild('btnPublicar') btnPublicar: ElementRef;
  @ViewChild('btnCerrar') btnCerrar: ElementRef;

  // Subject para manejo de suscripciones
  private readonly destroy$ = new Subject<void>();

  // Propiedades tipadas
  downloadURL: Observable<string>;
  register: PublicationFormData;
  data: UserData | null = null;

  // Variables de publicaciones
  infoPublicacion: Publicacion[] = [];
  correoUsuario: string | null = null;
  nombreUsuario: string | null = null;
  usuarioInformacion: UserData[] = [];
  posicion: number | null = null;

  // Variables para archivos e imágenes
  filePath: string[] = [];
  fileToUpload: File[] = [];
  fileName: string[] = [];
  uploadPercent: Observable<number> | null = null;
  fileImage: FileList | null = null;

  // Variables para publicaciones guardadas
  infoPublicacionGuardada: Publicacion[] = [];
  misPublicaciones: boolean = false;

  // Media handling
  url: MediaUrl = '';
  format: FileFormat = '';

  activador: boolean = true;
  
  // Control de tabs moderno
  activeTab: TabType = TabType.HOME;
  buttonsDisabled: boolean = false;
  
  // Control del modal nativo
  isModalOpen: boolean = false;

  // Estados de carga
  isLoadingPublications: boolean = false;
  isLoadingUserProfile: boolean = false;

  // Exposición de enums para el template
  readonly TabType = TabType;
  readonly PublicationCategory = PublicationCategory;

  constructor(
    private readonly storage: AngularFireStorage,
    private readonly registropublicacionesService: RegistroPublicacionService,
    private readonly publicacionService: ObtenerPublicacionService,
    private readonly cuenta: RespuestasService,
    private readonly fileValidationService: FileValidationService
  ) {
    // Constructor limpio - solo inyección de dependencias
    // La inicialización se mueve a ngOnInit
  }

  ngOnInit(): void {
    // Inicializar formulario
    this.initializeForm();
    
    // Cargar datos del usuario
    this.initializeUserData();
  }

  /**
   * Inicializa el formulario de publicación
   */
  private initializeForm(): void {
    this.register = {
      titulo: '',
      descripcion: '',
      plataforma: '',
      videojuego: '',
      comentario: '',
      archivo: '',
      respondido: '',
      mensaje: '',
    };
  }

  obtenerPublicaciones(): void {
    this.initializePublicationsLoad();
    this.loadAllPublications();
  }

  // Inicializa el estado para la carga de publicaciones
  private initializePublicationsLoad(): void {
    this.limpiarVariablesPublicaciones();
    this.isLoadingPublications = true;
  }

  // Carga todas las publicaciones desde el servicio
  private loadAllPublications(): void {
    this.publicacionService.getTodasPublicaciones()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (publicaciones: Publicacion[]) => {
          this.handlePublicationsSuccess(publicaciones);
        },
        error: (error) => {
          this.handlePublicationsError(error);
        }
      });
  }

  // Maneja el éxito en la carga de publicaciones
  private handlePublicationsSuccess(publicaciones: Publicacion[]): void {
    this.isLoadingPublications = false;
    this.limpiarVariablesPublicaciones();
    this.infoPublicacion = this.processPublicationsData(publicaciones);
  }

  // Maneja errore en la carga de publicaciones
  private handlePublicationsError(error: any): void {
    this.isLoadingPublications = false;
    this.mostrarErrorTryCatch(error, 'carga de publicaciones');
  }

  // Procesa los datos de publicaciones (reverse inmutable)
  private processPublicationsData(publicaciones: Publicacion[]): Publicacion[] {
    return [...publicaciones].reverse();
  }

  obtenerCategoriaPublicaciones(categoria: PublicationCategory): Publicacion[] {
    if (!this.infoPublicacion) {
      return [];
    }

    switch (categoria) {
      case PublicationCategory.ALL:
        return this.infoPublicacion;
      
      case PublicationCategory.MY_PUBLICATIONS:
        return this.infoPublicacion.filter(publicacion => 
          publicacion.autorCorreo === this.correoUsuario
        );
      
      case PublicationCategory.SAVED_PUBLICATIONS:
        return this.infoPublicacion.filter(publicacion => 
          publicacion.guardadas?.some(guardada => 
            guardada.correoUsuario === this.correoUsuario
          )
        );
      
      default:
        return [];
    }
  }

  handleFileInput(files: FileList): void {
    if (files.length === 0) {
      return;
    }

    const file: File = files[0];
    
    // Validar archivo antes de procesarlo
    if (!this.validateFile(file)) {
      this.limpiarArchivo();
      return;
    }
    
    this.fileImage = files;
    this.processFilePreview(file);
  }

  /**
   * Procesa la vista previa del archivo seleccionado
   */
  private processFilePreview(file: File): void {
    this.format = this.fileValidationService.getFileFormat(file);
    
    const reader = new FileReader();

    reader.onload = (event) => {
      this.url = event.target?.result as MediaUrl;
    };

    reader.onerror = (error) => {
      console.error('Error leyendo el archivo:', file.name, error);
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar archivo',
        text: 'No se pudo leer el archivo seleccionado. Verifica que el archivo no esté corrupto.',
        heightAuto: false
      });
      this.limpiarArchivo();
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.register.descripcion === '' || this.register.plataforma === '' || this.register.videojuego === '' || this.register.titulo === '') {
      Swal.fire({icon: 'error', title: 'Faltan agregar datos para la publicación', showConfirmButton: true, heightAuto: false});
      return;
    }

    this.toggleButtons(true);

    const registroBase: Publicacion = {
      id: '', // Se asignará por Firebase
      autorId: '', // TODO: Obtener ID del usuario
      autorNombre: this.nombreUsuario,
      autorCorreo: this.correoUsuario,
      autorIcono: this.usuarioInformacion[0]?.imagen,
      titulo: this.register.titulo,
      descripcion: this.register.descripcion,
      tipo: 'pregunta', // Tipo específico para menu principal
      plataforma: this.register.plataforma,
      videojuego: this.register.videojuego,
      cantidadLikes: 0,
      likes: [],
      comentarios: [],
      guardadas: [],
      fechaCreacion: new Date(),
      esActiva: true
    };

    if (this.fileImage !== null) {
      this.uploadFiles(registroBase);
    } else {
      this.savePublication(registroBase);
    }
  }

  /**
   * Controla el estado de los botones del modal sin jQuery
   */
  toggleButtons(disabled: boolean) {
    this.buttonsDisabled = disabled;
    
    // Método Angular nativo para controlar botones
    if (this.btnPublicar && this.btnCerrar) {
      this.btnPublicar.nativeElement.disabled = disabled;
      this.btnCerrar.nativeElement.disabled = disabled;
    }
  }

  /**
   * Cambia el tab activo sin Bootstrap/jQuery 
   */
  setActiveTab(tabId: TabType): void {
    this.activeTab = tabId;
  }

  /**
   * Verifica si un tab está activo
   */
  isTabActive(tabId: TabType): boolean {
    return this.activeTab === tabId;
  }

  /**
   * Obtiene el mensaje de estado actual del tab para accesibilidad
   */
  getCurrentTabStatus(): string {
    switch(this.activeTab) {
      case TabType.HOME: 
        return 'Mostrando todas las publicaciones';
      case TabType.MY_PUBLICATIONS: 
        return 'Mostrando mis publicaciones';
      case TabType.SAVED_PUBLICATIONS: 
        return 'Mostrando publicaciones guardadas';
      default: 
        return '';
    }
  }

  /**
   * Abre el modal de agregar publicación
   */
  openModal() {
    this.isModalOpen = true;
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal de agregar publicación
   */
  closeModal() {
    this.isModalOpen = false;
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
    // Limpiar formulario al cerrar
    this.limpiarApartadoPublicacion();
  }

  /**
   * Maneja el click en el backdrop del modal
   */
  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  /**
   * Maneja el escape key para cerrar el modal
   */
  onEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isModalOpen) {
      this.closeModal();
    }
  }

  /**
   * Optimización para mobile: detecta si los tabs son scrolleables
   */
  ngAfterViewInit(): void {
    this.checkTabsScrollable();
  }

  ngOnDestroy(): void {
    // Completar todas las suscripciones para evitar memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Verifica si los tabs necesitan scroll horizontal en mobile
   */
  private checkTabsScrollable() {
    const tabsContainer = document.querySelector('.nav-tabs');
    if (tabsContainer) {
      const isScrollable = tabsContainer.scrollWidth > tabsContainer.clientWidth;
      if (isScrollable) {
        tabsContainer.classList.add('scrollable');
      }
    }
  }

  /**
   * Maneja el resize de pantalla para responsive
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkTabsScrollable();
  }

  /**
   * Maneja la carga de imágenes para lazy loading
   */
  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }

  /**
   * Maneja la carga de videos para optimización
   */
  onVideoLoad(event: Event) {
    const video = event.target as HTMLVideoElement;
    video.classList.add('loaded');
  }

  /**
   * Maneja errores de carga de imágenes
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('error');
    
    // Log del error para debugging
    console.warn('Error cargando imagen:', {
      src: img.src,
      alt: img.alt
    });
    
    // Mostrar imagen placeholder en caso de error
    img.src = FILE_CONSTRAINTS.PLACEHOLDER_IMAGE;
  }

  /**
   * Maneja errores de carga de videos
   */
  onVideoError(event: Event) {
    const video = event.target as HTMLVideoElement;
    video.classList.add('error');
    // Ocultar video si hay error de carga
    video.style.display = 'none';
  }

  // Función para subir archivos
  uploadFiles(registroBase: Publicacion): void {
    if (!this.fileImage || this.fileImage.length === 0) {
      return;
    }

    this.processFilesUpload(registroBase);
  }

  // Procesa la carga de archivos de manera más organizada
  private processFilesUpload(registroBase: Publicacion): void {
    let uploadCounter = 0;
    const totalFiles = this.fileImage.length;

    for (let i = 0; i < totalFiles; i++) {
      this.uploadSingleFileWithProgress(registroBase, i, () => {
        uploadCounter++;
        if (uploadCounter === totalFiles) {
          this.handleUploadSuccess(registroBase);
        }
      });
    }
  }

  // Sube un archivo individual con seguimiento de progreso
  private uploadSingleFileWithProgress(
    registroBase: Publicacion, 
    index: number, 
    onComplete: () => void
  ): void {
    this.prepareFileForUpload(index);
    const filePath = this.generateUserFilePath(this.fileToUpload[index].name);
    const uploadTask = this.storage.upload(filePath, this.fileToUpload[index]);

    this.trackFileUploadProgress(uploadTask);
    this.handleFileUploadCompletion(uploadTask, filePath, registroBase, onComplete);
  }

  // Prepara el archivo para la carga
  private prepareFileForUpload(index: number): void {
    this.fileToUpload[index] = this.fileImage[index];
    this.fileName[index] = this.fileImage.item(index).name;
  }

  // Genera la ruta del archivo del usuario
  private generateUserFilePath(fileName: string): string {
    return `'${this.correoUsuario}'/${fileName}`;
  }

  // Rastrea el progreso de carga del archivo
  private trackFileUploadProgress(uploadTask: any): void {
    uploadTask.percentageChanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (progress: number | null) => {
          this.uploadPercent = of(progress);
        },
        error: (error) => this.mostrarErrorTryCatch(error)
      });
  }

  // Maneja la finalización de la carga del archivo
  private handleFileUploadCompletion(
    uploadTask: any,
    filePath: string,
    registroBase: Publicacion,
    onComplete: () => void
  ): void {
    const fileRef = this.storage.ref(filePath);
    
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        this.processFileUploadUrl(fileRef, registroBase, onComplete);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  // Procesa la URL del archivo subido
  private processFileUploadUrl(
    fileRef: any,
    registroBase: Publicacion,
    onComplete: () => void
  ): void {
    fileRef.getDownloadURL()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (downloadUrl: string) => {
          registroBase.imagen = downloadUrl;
          this.savePublicationWithImage(registroBase, onComplete);
        },
        error: (error) => this.mostrarErrorTryCatch(error)
      });
  }

  // Guarda la publicación con imagen
  private savePublicationWithImage(registroBase: Publicacion, onComplete: () => void): void {
    this.registropublicacionesService.postRegistroNormal(registroBase)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => onComplete(),
        error: (error) => this.mostrarErrorTryCatch(error)
      });
  }

  // Maneja el éxito de la carga completa
  private handleUploadSuccess(registroBase: Publicacion): void {
    Swal.fire({
      icon: 'success',
      title: 'Publicación con éxito',
      showConfirmButton: false,
      timer: 1500,
      heightAuto: false
    });

    this.infoPublicacion.push(registroBase);
    this.toggleButtons(false);
    this.limpiarApartadoPublicacion();
  }

  // Función para guardar publicación sin archivos
  savePublication(registroBase: Publicacion): void {
    this.registropublicacionesService.postRegistroNormal(registroBase)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handlePublicationSaveSuccess(registroBase);
        },
        error: (error) => this.mostrarErrorTryCatch(error)
      });
  }

  // Maneja el éxito al guardar una publicación
  private handlePublicationSaveSuccess(publicacion: Publicacion): void {
    this.showPublicationSuccessMessage();
    this.updateLocalPublications(publicacion);
    this.resetPublicationForm();
  }

  // Muestra mensaje de éxito para publicación guardada
  private showPublicationSuccessMessage(): void {
    Swal.fire({
      icon: 'success', 
      title: 'Publicación con éxito', 
      showConfirmButton: false, 
      timer: 1500, 
      heightAuto: false
    });
  }

  // Actualiza la lista local de publicaciones
  private updateLocalPublications(publicacion: Publicacion): void {
    this.infoPublicacion.push(publicacion);
  }

  // Resetea el formulario de publicación
  private resetPublicationForm(): void {
    this.toggleButtons(false);
    this.limpiarApartadoPublicacion();
  }

  /**
   * Limpia el formulario de publicación y restaura el estado inicial
   */
  limpiarApartadoPublicacion(): void {
    this.clearFormFields();
    this.resetFileUploadState();
    this.resetUploadProgress();
    this.closeModalIfOpen();
  }

  // Limpia todos los campos del formulario
  private clearFormFields(): void {
    Object.keys(this.register).forEach(key => { 
      this.register[key] = ''; 
    });
  }

  // Resetea el estado de carga de archivos
  private resetFileUploadState(): void {
    this.limpiarArchivo();
    this.toggleButtons(false);
  }

  // Resetea el progreso de subida
  private resetUploadProgress(): void {
    this.uploadPercent = null;
  }

  // Cierra el modal si está abierto
  private closeModalIfOpen(): void {
    if (this.isModalOpen) {
      this.closeModal();
    }
  }

  /**
   * Reinicia las variables de publicaciones
   */  
  limpiarVariablesPublicaciones(): void {
    this.infoPublicacion = [];
    this.misPublicaciones = false;
  }

  /**
   * Obtiene datos del localStorage de forma segura
   */
  private getStorageData(): { correo: string | null; nombre: string | null } {
    try {
      return {
        correo: localStorage.getItem(STORAGE_KEYS.USER_EMAIL),
        nombre: localStorage.getItem(STORAGE_KEYS.USER_NAME)
      };
    } catch (error) {
      console.error('Error accediendo a localStorage:', error);
      return { correo: null, nombre: null };
    }
  }

  /**
   * Inicializa los datos del usuario y carga las publicaciones
   */
  private initializeUserData(): void {
    const { correo, nombre } = this.getStorageData();
    
    if (!correo || !nombre) {
      console.warn('No se encontraron datos de usuario en localStorage');
      return;
    }

    this.correoUsuario = correo;
    this.nombreUsuario = nombre;

    this.loadUserProfile();
  }

  /**
   * Carga el perfil del usuario y sus publicaciones
   */
  private loadUserProfile(): void {
    if (!this.validateUserEmail()) {
      return;
    }

    this.startUserProfileLoad();
    this.fetchUserProfile();
  }

  // Valida que el correo del usuario esté disponible
  private validateUserEmail(): boolean {
    return !!this.correoUsuario;
  }

  // Inicia el estado de carga del perfil de usuario
  private startUserProfileLoad(): void {
    this.isLoadingUserProfile = true;
  }

  // Obtiene el perfil del usuario desde el servicio
  private fetchUserProfile(): void {
    this.cuenta.obtenerPorCorreo(this.correoUsuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userProfile: UserData[]) => {
          this.handleUserProfileResponse(userProfile);
        },
        error: (error) => {
          this.handleUserProfileError(error);
        }
      });
  }

  // Maneja la respuesta del perfil de usuario
  private handleUserProfileResponse(userProfile: UserData[]): void {
    this.isLoadingUserProfile = false;
    
    if (this.isValidUserProfile(userProfile)) {
      this.processUserProfile(userProfile);
    } else {
      this.handleEmptyUserProfile();
    }
  }

  // Valida si el perfil de usuario es válido
  private isValidUserProfile(userProfile: UserData[]): boolean {
    return userProfile && userProfile.length > 0;
  }

  // Procesa el perfil de usuario válido
  private processUserProfile(userProfile: UserData[]): void {
    this.usuarioInformacion = userProfile;
    this.obtenerPublicaciones();
  }

  // Maneja cuando no se encuentra perfil de usuario
  private handleEmptyUserProfile(): void {
    console.warn('No se encontró información del usuario para:', this.correoUsuario);
  }

  // Maneja errores en la carga del perfil de usuario
  private handleUserProfileError(error: any): void {
    this.isLoadingUserProfile = false;
    this.mostrarErrorTryCatch(error, 'carga de perfil de usuario');
  }

  /**
   * Limpia el archivo seleccionado y su preview
   */
  limpiarArchivo(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    
    this.url = '';
    this.format = '';
    this.fileImage = null;
    this.uploadPercent = null;
  }

  /**
   * Valida el archivo usando el servicio de validación
   */
  private validateFile(file: File): boolean {
    // Verificar si es un tipo de archivo soportado específicamente
    const allSupportedTypes = [
      ...FILE_CONSTRAINTS.SUPPORTED_IMAGE_TYPES,
      ...FILE_CONSTRAINTS.SUPPORTED_VIDEO_TYPES
    ];

    const validationConfig = {
      maxSizeBytes: FILE_CONSTRAINTS.MAX_SIZE,
      allowedTypes: FILE_CONSTRAINTS.ALLOWED_TYPES
    };

    const validationResult: FileValidationResult = this.fileValidationService.validateFile(file, validationConfig);

    if (!validationResult.isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo no válido',
        text: validationResult.error,
        heightAuto: false
      });
      return false;
    }

    return true;
  }

  /**
   * Muestra errores al usuario de forma consistente
   */
  mostrarErrorTryCatch(error: any, contexto?: string): Promise<any> {
    const mensaje = this.obtenerMensajeError(error);
    const titulo = contexto ? `Error en ${contexto}` : 'Error';
    
    console.error(`${titulo}:`, error);
    
    return Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      showConfirmButton: true,
      heightAuto: false
    });
  }

  /**
   * Extrae un mensaje de error legible
   */
  private obtenerMensajeError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.error?.message) {
      return error.error.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.';
  }
}
