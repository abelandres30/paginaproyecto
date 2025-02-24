import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable, Subject, of } from 'rxjs';
import * as $ from 'jquery';
import { UsuariorecomendadosComponent } from '../usuariorecomendados/usuariorecomendados.component';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
//servicios
import { RegistroPublicacionService } from '../../services/registropublicacion.service';
import { ObtenerPublicacionService } from '../../services/publicaciones';
// models
import { guardarpublicacion } from '../../models/publicacion';
import { Comentario } from '../../models/comentarios';
import { publicacionGuardada } from 'src/app/models/publicacionGuardada';
import { RespuestasService } from '../../services/cuentas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modulomenu',
  templateUrl: './modulomenu.component.html',
  styleUrls: ['./modulomenu.component.css']
})
export class ModulomenuComponent implements OnInit, AfterViewInit {
  @ViewChild(UsuariorecomendadosComponent) hijo: UsuariorecomendadosComponent;
  @ViewChild("Publicacion") Publicacion: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild("modalPublicacion") modalPublicacion: ElementRef;

  downloadURL: Observable<string>;
  register : any;
  data: any;

  // esta es la nueva variable para tomar todos las publicaciones
  InfoPublicacion: guardarpublicacion[];
  sivideo: boolean[] = [];
  siimagen: boolean[] = [];
  sinada: boolean[] = [];
  Corrreousuario: string;
  nombreusuario;
  usuarioInformacion: any = {};
  posicion: any;
  Todoscomentarios: any[] = [];
  pos : any;
  existencia: boolean = false;
  existenciaComen: boolean = false;

  // estas son las variables para las imagenes
  filepath: string[] = [];
  fileToUpload: File[] = [];
  fileName: String[] = [];
  uploadPercent: Observable<number>;
  fileImage: any = null;

  // estas son las variables para mis publicaciones guardadas
  InfoPublicacionGuardada: guardarpublicacion[];
  sivideoGuardada: boolean[] = [];
  siimagenGuardada: boolean[] = [];
  sinadaGuardada: boolean[] = [];
  mispublicaciones : any;
  idUser: string;

  url: any;
  format: any;

  activador: boolean = true;

  //metodo que utilizo para abrir la pantalla para agregar nueva publicacion
  ngAfterViewInit()
  {
    // this.Publicacion.nativeElement.click();
  }

  ngOnInit()
  {
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

  constructor
  (
    private router: Router, private storage: AngularFireStorage,
    private registropublicacionesService: RegistroPublicacionService, private obtenerpublicacionService: ObtenerPublicacionService,
    private cuenta: RespuestasService
  )
  {
    // aqui obtengo el parametro del localstorage
    this.Corrreousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');

    this.cuenta.obtenerPorCorreo(this.Corrreousuario).subscribe(res => {
      if (res.length !== 0)
      {
        this.usuarioInformacion = res;
      }
    });

    this.obtenerPublicaciones(1);
  }

  obtenerPublicaciones(pos: any)
  {
    this.limpiarVariablesPublicaciones(pos);

    setTimeout(() => {
      this.obtenerpublicacionService.getTodasPublicaciones().snapshotChanges().subscribe(res => {
        this.limpiarVariablesPublicaciones(pos);

        res.map(val => {
          if(val.key === 'ejemplo') return null;

          if (this.pos === 1) {
            this.llenarPublicaciones(val.payload.val(), val.key);
          } else if (this.pos === 2 && val.payload.val().correo === this.Corrreousuario) {
            this.llenarPublicaciones(val.payload.val(), val.key);
          } else if (this.pos !== 2) {
            const guardada = val.payload.val().guardadas?.find((guardadaItem) => guardadaItem.correo === this.Corrreousuario);
            guardada ? this.llenarPublicaciones(val.payload.val(), val.key) : null;
          }
        });

        this.InfoPublicacion = this.InfoPublicacion.reverse();

        this.siimagen = this.siimagen.reverse();
        this.sivideo = this.sivideo.reverse();
        this.sinada = this.sinada.reverse();
      });
    }, 100);
  }

  llenarPublicaciones(res: any, i: any)
  {
    res['$key'] = i;

    this.InfoPublicacion.push(res);

    const imageTypes = ["image/jpeg", "image/JPEG", "image/png", "image/PNG", "image/jpg", "image/JPG"];
    const videoTypes = ["video/mp4", "video/MP4", "video/mkv", "video/MKV"];

    if (imageTypes.includes(res.tipo)) {
      this.siimagen.push(true);
      this.sivideo.push(false);
      this.sinada.push(false);
    } else if (videoTypes.includes(res.tipo)) {
      this.siimagen.push(false);
      this.sivideo.push(true);
      this.sinada.push(false);
    } else {
      this.siimagen.push(false);
      this.sivideo.push(false);
      this.sinada.push(true);
    }

    this.existencia = true;
  }


  Guardarpublicacion(publicacion: any)
  {
    if (publicacion.correo !== this.Corrreousuario)
    {
      let publicacionYaGuardada: boolean = false;

      const registroPubliGuardada = new publicacionGuardada();
      registroPubliGuardada.correo = this.Corrreousuario;
      registroPubliGuardada.usuario = this.nombreusuario;

      if (publicacion.guardadas === null || publicacion.guardadas === undefined)
      {
        publicacion.guardadas = [registroPubliGuardada];
      }
      else
      {
        publicacion.guardadas.map(res => {
          if (res.correo === this.Corrreousuario)
          {
            Swal.fire({icon: 'error',title: 'Ya tiene guardada esta publicacion', })
            publicacionYaGuardada = true;
          }
          else
          {
            publicacion.guardadas.push(registroPubliGuardada);
          }
        })
      }

      if (!publicacionYaGuardada)
      {
        var Llave = publicacion.$key;
        delete publicacion.$key;
        const registro = publicacion as guardarpublicacion;

        this.registropublicacionesService.putPublicacion(registro, Llave).subscribe(res => {
          Swal.fire({ icon: 'success',  title: 'Se guardo con exito la publicacion', showConfirmButton: false, timer: 1500  })
        })
      }
    }
  }

  eliminarpublicacion(publicacion: any)
  {
    var index = this.InfoPublicacion.findIndex(PublicacionArray => PublicacionArray['$key'] ===  publicacion['$key']);

    var indexGuardadas = publicacion.guardadas.findIndex(Public => Public.correo ===  this.Corrreousuario);

    publicacion.guardadas.splice(indexGuardadas,1);

    this.InfoPublicacion = this.InfoPublicacion.filter(PublicacionArray => PublicacionArray['$key'] !==  publicacion['$key']);
    this.siimagen.splice(index,1);
    this.sivideo.splice(index,1);

    var Llave = publicacion.$key;
    delete publicacion.$key;
    const registro = publicacion as guardarpublicacion;

    this.registropublicacionesService.putPublicacion(registro, Llave)
      .subscribe(res =>
        {
        // Swal.fire({ icon: 'success',title: 'Se Elimino la publicacion guardada con exito',showConfirmButton: false,timer: 1500})
      })
  }

  comentar(publicacion:any, posicion:any)
  {
    this.Todoscomentarios = [];
    this.posicion = posicion;

    if (publicacion.comentarios === null || publicacion.comentarios === undefined)
    {
      this.existenciaComen = false;
    }
    else
    {
      this.existenciaComen = true;
      publicacion.comentarios.map(res => {
        this.Todoscomentarios.push(res);
      })
    }
  }

  enviarComentario(publicacion:any, pos:any)
  {
    let comentario;

    if (pos === 1) { comentario = $(".comentarios").val().toString(); }
    else if (pos === 2) { comentario = $(".comentarios2").val().toString(); }

    if (comentario !== "")
    {
      const registroComentario = new Comentario();
      registroComentario.comentario = comentario;
      registroComentario.usuario = this.nombreusuario;
      registroComentario.correo = this.Corrreousuario;

      if (publicacion.comentarios === null || publicacion.comentarios === undefined)
      {
        publicacion.comentarios = [registroComentario];
      }
      else
      {
        publicacion.comentarios.push(registroComentario);
      }

      var Llave = publicacion.$key;
      delete publicacion.$key;
      const registro = publicacion as guardarpublicacion;

      this.registropublicacionesService.putPublicacion(registro, Llave) .subscribe(res => {
        this.Todoscomentarios.push(registroComentario);
      })
    }
  }

  handleFileInput(files: FileList)
  {
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

  onSubmit()
  {
    if (this.register.descripcion === '' || this.register.plataforma === '' || this.register.videojuego === '' || this.register.titulo === '') {
      Swal.fire({
        icon: 'error',
        title: 'Faltan agregar datos para la publicación',
        showConfirmButton: true,
      });

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

  // Función para subir archivos
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
      });

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
                  timer: 1500
                });

                this.InfoPublicacion.push(registroBase);
                this.toggleButtons(false);

                this.limpiarApartadoPublicacion();
              }
            });
        });
      })).subscribe();
    }
  }

  // Función para guardar publicación sin archivos
  savePublication(registroBase: guardarpublicacion) {
    this.registropublicacionesService.postRegistroNormal(registroBase)
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Publicación con éxito',
          showConfirmButton: false,
          timer: 1500
        });

        this.toggleButtons(false);
        this.InfoPublicacion.push(registroBase);

        this.limpiarApartadoPublicacion();
    });
  }

  perfilusuario(correo:any)
  {
    this.idUser = "";
    this.cuenta.obtenerPorCorreo(this.Corrreousuario).subscribe(res => {
      if (res.length !== 0)
      {
        this.router.navigate(['perfil', res[0].id]);
      }
    });
  }

  limpiarApartadoPublicacion()
  {
    Object.keys(this.register).forEach(key => { this.register[key] = ''; });

    this.limpiarArchivo();
    this.toggleButtons(false);

    this.uploadPercent = of();
  }

  limpiarVariablesPublicaciones(pos:any)
  {
    this.InfoPublicacion = [];
    this.sinada = [];
    this.siimagen = [];
    this.sivideo = [];
    this.pos = pos;
    this.mispublicaciones = false;
  }

  limpiarArchivo()
  {
    this.fileInput.nativeElement.value = '';
    this.url = '';
  }
}
