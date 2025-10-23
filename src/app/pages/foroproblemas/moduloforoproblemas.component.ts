import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import 'firebase/storage';
import { ForoproblemasService } from '../../services/foroproblemas.service';
import { Publicacion } from 'src/app/models/publicacion';
import { Observable, Subject, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { RespuestasService } from 'src/app/services/cuentas.service';

// Interface para el formulario de nueva publicación
interface FormularioPublicacion {
  titulo: string;
  descripcion: string;
  plataforma: string;
  videojuego: string;
  comentario: string;
  archivo: string;
  respondido: string;
  mensaje: string;
  [key: string]: string; // Permite acceso dinámico para Object.keys()
}

@Component({
  selector: 'app-moduloforoproblemas',
  templateUrl: './moduloforoproblemas.component.html',
  styleUrls: ['./moduloforoproblemas.component.css']
})
export class ModuloforoproblemasComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('modalPublicacion') modalPublicacion: ElementRef;
  @ViewChild('publicoBtn') publicoBtn: ElementRef;
  @ViewChild('cerrarBtn') cerrarBtn: ElementRef;

  // Variables de usuario
  usuarioInformacion: any[] = [];
  register: FormularioPublicacion;
  nombreusuario: string;
  correoUsuario: string;

  // Variables para manejo de archivos
  fileImage: FileList = null;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  fileToUpload: File[] = [];
  fileName: String[] = [];

  // Variables de publicaciones
  InfoPublicacion: Publicacion[];
  plataformaSeleccionada: string = '';

  url: string | ArrayBuffer | null = null;
  format: string | null = null;
  activador: boolean = true;

  // variables loading
  isLoading: boolean = true;

  constructor(private storage: AngularFireStorage, private foroproblemas: ForoproblemasService, private cuenta: RespuestasService) {
    // aqui obtengo el parametro del localstorage
    this.correoUsuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');

    this.cuenta.obtenerPorCorreo(this.correoUsuario).subscribe(res => {
      if (res.length !== 0)
      {
        this.usuarioInformacion = res;
        this.obtenerPublicaciones();
      }
    }, error => this.mostrarError(error, 'Error al cargar información del usuario'));
  }

  ngOnInit() {
    this.register = {
      titulo: '', descripcion: '', plataforma: '',
      videojuego: '', comentario: '', archivo: '',
      respondido: '', mensaje: '',
    };
  }

  obtenerPublicaciones() {
    this.foroproblemas.obtenerForoProblemas().subscribe(res => {
      this.InfoPublicacion = res as Publicacion[];
      this.isLoading = false;
    }, error => this.mostrarError(error, 'Error al cargar publicaciones'));
  }

  handleFileInput(files: FileList) {
    this.fileImage = files;
    if (this.fileImage.length > 0)
    {
      let file: File = this.fileImage[0];
      let myReader: FileReader = new FileReader();
      let that = this;

      myReader.onloadend = (loadEvent: ProgressEvent<FileReader>) => {
        (this.fileImage[0].type.indexOf("video")> -1) ? this.format = 'video' : this.format = 'image';
      };

      myReader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }

      myReader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.register.descripcion === '' || this.register.plataforma === '' || this.register.videojuego === '' || this.register.titulo === '') {
      this.mostrarMensajeValidacion('Por favor completa todos los campos requeridos: título, descripción, plataforma y videojuego.');
      return;
    }

    this.toggleButtons(true);

    const registroBase: Publicacion = {
      id: '',
      autorId: '',
      autorNombre: this.nombreusuario,
      autorCorreo: this.correoUsuario,
      autorIcono: this.usuarioInformacion[0]?.imagen,
      titulo: this.register.titulo,
      descripcion: this.register.descripcion,
      tipo: 'problema',
      plataforma: this.register.plataforma,
      videojuego: this.register.videojuego,
      likes: [],
      cantidadLikes: 0,
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

  toggleButtons(disabled: boolean) {
    if (this.publicoBtn) {
      this.publicoBtn.nativeElement.disabled = disabled;
    }
    if (this.cerrarBtn) {
      this.cerrarBtn.nativeElement.disabled = disabled;
    }
  }

  uploadFiles(registroBase: Publicacion) {
    let numerocontador = 0;

    for (let i = 0; i < this.fileImage.length; i++) {
      this.fileToUpload[i] = this.fileImage[i];
      this.fileName[i] = this.fileImage.item(i).name;
      const filePath = `'${this.correoUsuario}'/${this.fileToUpload[i].name}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.fileToUpload[i]);

      task.percentageChanges().subscribe(res => {
        this.uploadPercent = of(res);
      }, error => this.mostrarError(error, 'Error al subir archivo'));

      const fileRef = this.storage.ref(filePath);

      task.snapshotChanges().pipe(finalize(() => {
        numerocontador++;

        fileRef.getDownloadURL().subscribe(ref => {
          registroBase.imagen = ref;

          this.foroproblemas.crearPublicacion(registroBase)
            .subscribe(() => {
              if (numerocontador === this.fileImage.length) {
                Swal.fire({
                  icon: 'success',
                  title: 'Publicación con éxito',
                  showConfirmButton: false,
                  timer: 1500,
                  heightAuto: false
                });

                this.toggleButtons(false);
                this.limpiarApartadoPublicacion();
              }
            });
        }, error => this.mostrarError(error, 'Error al obtener URL de descarga'));
      })).subscribe(res => {}, error => this.mostrarError(error, 'Error al procesar archivo'));
    }
  }

  // Función para guardar publicación sin archivos
  savePublication(registroBase: Publicacion) {
    this.foroproblemas.crearPublicacion(registroBase).subscribe(() => {
      Swal.fire({icon: 'success', title: 'Publicación creada con éxito', showConfirmButton: false, timer: 1500, heightAuto: false });
      this.toggleButtons(false);
      this.limpiarApartadoPublicacion();
    }, error => this.mostrarError(error, 'Error al crear publicación'));
  }

  limpiarApartadoPublicacion() {
    Object.keys(this.register).forEach(key => { this.register[key] = ''; });

    this.limpiarArchivo();
    this.toggleButtons(false);

    this.uploadPercent = of();
  }

  limpiarArchivo() {
    this.fileInput.nativeElement.value = '';
    this.url = '';
  }

  /**
   * Obtiene publicaciones filtradas según la posición del tab
   * @param pos 1=Todas, 2=Mis publicaciones, 3=Guardadas
   */
  formatearPublicaciones(pos: number): Publicacion[] {
    if (!this.InfoPublicacion) {
      return [];
    }

    const publicacionesFiltradas = this.filtrarPorPlataforma();

    switch (pos) {
      case 1: 
        return publicacionesFiltradas;
      case 2: 
        return this.filtrarMisPublicaciones(publicacionesFiltradas);
      case 3: 
        return this.filtrarPublicacionesGuardadas(publicacionesFiltradas);
      default:
        return publicacionesFiltradas;
    }
  }

  /**
   * Filtra publicaciones por plataforma seleccionada
   */
  private filtrarPorPlataforma(): Publicacion[] {
    return this.plataformaSeleccionada === '' 
      ? this.InfoPublicacion 
      : this.InfoPublicacion.filter(pub => pub.plataforma === this.plataformaSeleccionada);
  }

  /**
   * Filtra publicaciones del usuario actual
   */
  private filtrarMisPublicaciones(publicaciones: Publicacion[]): Publicacion[] {
    return publicaciones.filter(pub => pub.autorCorreo === this.correoUsuario);
  }

  /**
   * Filtra publicaciones guardadas por el usuario actual
   */
  private filtrarPublicacionesGuardadas(publicaciones: Publicacion[]): Publicacion[] {
    return publicaciones.filter(pub => 
      pub.guardadas && 
      pub.guardadas.some(guardada => guardada.correoUsuario === this.correoUsuario)
    );
  }

  /**
   * Muestra un mensaje de error al usuario usando SweetAlert2
   * @param error Error recibido del servidor o aplicación
   * @param titulo Título personalizado para el error (opcional)
   */
  private mostrarError(error: unknown, titulo?: string): Promise<any> {
    console.error('Error en ForoProblemas:', error);
    
    let errorMessage: string;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as any).message;
    } else {
      errorMessage = 'Ha ocurrido un error inesperado';
    }

    return Swal.fire({
      icon: 'error',
      title: titulo || 'Error',
      text: errorMessage,
      showConfirmButton: true,
      heightAuto: false,
      confirmButtonText: 'Entendido'
    });
  }

  /**
   * Muestra un mensaje de validación al usuario
   * @param mensaje Mensaje de validación a mostrar
   */
  private mostrarMensajeValidacion(mensaje: string): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: 'Datos incompletos',
      text: mensaje,
      showConfirmButton: true,
      heightAuto: false,
      confirmButtonText: 'Entendido'
    });
  }
}