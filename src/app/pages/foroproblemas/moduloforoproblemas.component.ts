import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import 'firebase/storage';
import * as $ from 'jquery';
import { ForoproblemasService } from '../../services/foroproblemas.service';
import { guardarpublicacion } from 'src/app/models/publicacion';
import { Observable, Subject, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { RespuestasService } from 'src/app/services/cuentas.service';

@Component({
  selector: 'app-moduloforoproblemas',
  templateUrl: './moduloforoproblemas.component.html',
  styleUrls: ['./moduloforoproblemas.component.css']
})

export class ModuloforoproblemasComponent implements OnInit {
  @ViewChild("Publicacion") Publicacion: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild("modalPublicacion") modalPublicacion: ElementRef;

  // estas son las nuevas variables que usare
  usuarioInformacion: any = {};

  register;
  nombreusuario;
  Corrreousuario: string;

  fileImage: FileList = null;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  // esta es la nueva variable para tomar todos las publicaciones
  InfoPublicacion: guardarpublicacion[];
  plataformaSeleccionada: string = '';

  // estas son las variables para las imagenes
  filepath: string[] = [];
  fileToUpload: File[] = [];
  fileName: String[] = [];
  uploadPercen: Observable<number>;

  // estas son las variables para mis publicaciones guardadas
  InfoPublicacionGuardada: guardarpublicacion[];

  url: any;
  format: any;
  activador: boolean = true;

  // variables loading
  isLoading: boolean = true;

  constructor(private storage: AngularFireStorage, private foroproblemas: ForoproblemasService, private cuenta: RespuestasService) {
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
      titulo: '', descripcion: '', plataforma: '',
      videojuego: '', comentario: '', archivo: '',
      respondido: '', mensaje: '',
    };
  }

  obtenerPublicaciones() {
    this.foroproblemas.obtenerForoPoblemas().subscribe(res => {
      this.InfoPublicacion = res as guardarpublicacion[];
      console.log(res);
      this.isLoading = false;
    }, error => this.mostrarErrorTryCatch(error));
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
      Swal.fire({icon: 'error',  title: 'Faltan agregar datos para la publicación', showConfirmButton: true });
      return;
    }

    this.toggleButtons(true);

    const registroBase = new guardarpublicacion();
    registroBase.usuario = this.nombreusuario;
    registroBase.correo = this.Corrreousuario;
    registroBase.usuarioIcono = this.usuarioInformacion[0].imagen;
    registroBase.titulo = this.register.titulo;
    registroBase.descripcion = this.register.descripcion;
    registroBase.plataforma = this.register.plataforma;
    registroBase.videojuego = this.register.videojuego;
    registroBase.cantidadLikes = 0;
    registroBase.likes = [];
    registroBase.guardadas = [];

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

  uploadFiles(registroBase: guardarpublicacion) {
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

          this.foroproblemas.postRegistroNormal(registroBase)
            .subscribe(() => {
              if (numerocontador === this.fileImage.length) {
                Swal.fire({
                  icon: 'success',
                  title: 'Publicación con éxito',
                  showConfirmButton: false,
                  timer: 1500
                });

                this.toggleButtons(false);

                this.limpiarApartadoPublicacion();
              }
            });
        }, error => this.mostrarErrorTryCatch(error));
      })).subscribe(res => {console.log(res)}, error => this.mostrarErrorTryCatch(error));
    }
  }

  // Función para guardar publicación sin archivos
  savePublication(registroBase: guardarpublicacion) {
    this.foroproblemas.postRegistroNormal(registroBase).subscribe(() => {
      Swal.fire({icon: 'success', title: 'Publicación con éxito', showConfirmButton: false, timer: 1500 });
      this.toggleButtons(false);
      this.limpiarApartadoPublicacion();
    }, error => this.mostrarErrorTryCatch(error));
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

  formatearPublicaciones(pos: number) {
    let arregloTemporal: any[];
    this.InfoPublicacion ?
      this.plataformaSeleccionada === '' ? arregloTemporal = this.InfoPublicacion
      : arregloTemporal = this.InfoPublicacion.filter(res => res.plataforma === this.plataformaSeleccionada) : arregloTemporal = [];

    if (pos === 1) {
      return arregloTemporal
    } else if (pos === 2) {
      return arregloTemporal.filter(res => res.correo === this.Corrreousuario);
    } else
        return arregloTemporal.filter(res => res.guardadas && res.guardadas.some(guar => guar === this.nombreusuario));

  }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error',title: error ,showConfirmButton: true,});
  }
}
