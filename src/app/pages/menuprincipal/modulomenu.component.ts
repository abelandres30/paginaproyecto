import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subject, of } from 'rxjs';
import * as $ from 'jquery';
import { UsuariorecomendadosComponent } from '../usuariorecomendados/usuariorecomendados.component';
import { finalize } from 'rxjs/operators';
//servicios
import { RegistroPublicacionService } from '../../services/registropublicacion.service';
import { ObtenerPublicacionService } from '../../services/publicaciones.service';
// models
import { Publicacion } from '../../models/publicacion';
import { RespuestasService } from '../../services/cuentas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modulomenu',
  templateUrl: './modulomenu.component.html',
  styleUrls: ['./modulomenu.component.css']
})

export class ModulomenuComponent implements OnInit {
  @ViewChild(UsuariorecomendadosComponent) hijo: UsuariorecomendadosComponent;
  @ViewChild("Publicacion") Publicacion: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild("modalPublicacion") modalPublicacion: ElementRef;

  downloadURL: Observable<string>;
  register : any;
  data: any;

  // esta es la nueva variable para tomar todos las publicaciones
  InfoPublicacion: Publicacion[];
  Corrreousuario: string;
  nombreusuario: string;
  usuarioInformacion: any = {};
  posicion: any;

  // estas son las variables para las imagenes
  filepath: string[] = [];
  fileToUpload: File[] = [];
  fileName: String[] = [];
  uploadPercent: Observable<number>;
  fileImage: any = null;

  // estas son las variables para mis publicaciones guardadas
  InfoPublicacionGuardada: Publicacion[];
  mispublicaciones : any;

  url: any;
  format: any;

  activador: boolean = true;

  constructor (private storage: AngularFireStorage, private registropublicacionesService: RegistroPublicacionService,
    private publicacionService: ObtenerPublicacionService, private cuenta: RespuestasService
  ) {
    // aqui obtengo el parametro del localstorage
    this.Corrreousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');

    this.cuenta.obtenerPorCorreo(this.Corrreousuario).subscribe(res => {
      if (res.length !== 0)
      {
        this.usuarioInformacion = res;
        this.obtenerPublicaciones();
      }
    }, error => this.mostrarErrorTryCatch(error));
  }

  ngOnInit() {
    this.register = {
      titulo: '', descripcion: '',plataforma: '',
      videojuego: '',comentario: '',archivo: '',
      respondido: '',mensaje: '',
    };
  }

  obtenerPublicaciones() {
    this.limpiarVariablesPublicaciones();

    this.publicacionService.getTodasPublicaciones().subscribe(res => {
      this.limpiarVariablesPublicaciones();
      this.InfoPublicacion = res;
      this.InfoPublicacion = this.InfoPublicacion.reverse();
    }, error => this.mostrarErrorTryCatch(error));
  }

  obtenerCategoriaPublicaciones(posicion: number) {
    if(!this.InfoPublicacion)
      return [];

    if (posicion === 1)
      return this.InfoPublicacion;
    else if (posicion === 2)
      return this.InfoPublicacion.filter(res => res.autorCorreo === this.Corrreousuario);
    else
      return this.InfoPublicacion.filter(res =>  res.guardadas ? res.guardadas.find(guar => guar.correoUsuario === this.Corrreousuario) : null)
  }

  handleFileInput(files: FileList) {
    this.fileImage = files;
    if (this.fileImage.length > 0)
    {
      let file: File = this.fileImage[0];
      let myReader: FileReader = new FileReader();
      let that = this;

      myReader.onloadend = (loadEvent: any) => {
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
      Swal.fire({icon: 'error', title: 'Faltan agregar datos para la publicación', showConfirmButton: true, heightAuto: false});
      return;
    }

    this.toggleButtons(true);

    const registroBase: Publicacion = {
      id: '', // Se asignará por Firebase
      autorId: '', // TODO: Obtener ID del usuario
      autorNombre: this.nombreusuario,
      autorCorreo: this.Corrreousuario,
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

  toggleButtons(disabled: boolean) {
    disabled ? $("#publico").attr('disabled', 'disabled') : $("#publico").removeAttr("disabled");
    disabled ? $("#cerrar").attr('disabled', 'disabled') : $("#cerrar").removeAttr("disabled");
  }

  // Función para subir archivos
  uploadFiles(registroBase: Publicacion) {
    let numerocontador = 0;

    for (let i = 0; i < this.fileImage.length; i++) {
      this.fileToUpload[i] = this.fileImage[i];
      this.fileName[i] = this.fileImage.item(i).name;
      const filePath = `'${this.Corrreousuario}'/${this.fileToUpload[i].name}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.fileToUpload[i]);

      task.percentageChanges().subscribe(res => {
        this.uploadPercent = of(res);
      }, error => this.mostrarErrorTryCatch(error));

      const fileRef = this.storage.ref(filePath);

      task.snapshotChanges().pipe(finalize(() => {
        numerocontador++;

        fileRef.getDownloadURL().subscribe(ref => {
          registroBase.imagen = ref;
          registroBase.tipo = this.fileImage.item(i).type;

          this.registropublicacionesService.postRegistroNormal(registroBase)
            .subscribe(() => {
              if (numerocontador === this.fileImage.length) {
                Swal.fire({
                  icon: 'success',
                  title: 'Publicación con éxito',
                  showConfirmButton: false,
                  timer: 1500,
                  heightAuto: false
                });

                this.InfoPublicacion.push(registroBase);
                this.toggleButtons(false);

                this.limpiarApartadoPublicacion();
              }
            });
        }, error => this.mostrarErrorTryCatch(error));
      })).subscribe();
    }
  }

  // Función para guardar publicación sin archivos
  savePublication(registroBase: Publicacion) {
    this.registropublicacionesService.postRegistroNormal(registroBase).subscribe(() => {
      Swal.fire({icon: 'success', title: 'Publicación con éxito', showConfirmButton: false, timer: 1500, heightAuto: false});

      this.toggleButtons(false);
      this.InfoPublicacion.push(registroBase);

      this.limpiarApartadoPublicacion();
    }, error => this.mostrarErrorTryCatch(error));
  }

  limpiarApartadoPublicacion() {
    Object.keys(this.register).forEach(key => { this.register[key] = ''; });

    this.limpiarArchivo();
    this.toggleButtons(false);

    this.uploadPercent = of();
  }

  limpiarVariablesPublicaciones() {
    this.InfoPublicacion = [];
    this.mispublicaciones = false;
  }

  limpiarArchivo() {
    this.fileInput.nativeElement.value = '';
    this.url = '';
  }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error',title: error ,showConfirmButton: true, heightAuto: false});
  }
}
