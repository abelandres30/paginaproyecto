import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import 'firebase/storage';
import * as $ from 'jquery';
import * as firebase from 'firebase';
import { ForoproblemasService } from '../../services/foroproblemas.service';
import { guardarpublicacion } from 'src/app/models/publicacion';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Comentario } from 'src/app/models/comentarios';


@Component({
  selector: 'app-moduloforoproblemas',
  templateUrl: './moduloforoproblemas.component.html',
  styleUrls: ['./moduloforoproblemas.component.css']
})
export class ModuloforoproblemasComponent implements OnInit {
  // estas son las nuevas variables que usare
  register;
  nombreusuario;
  Corrreousuario: string;
  fileImage: FileList = null;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  // esta es la nueva variable para tomar todos las publicaciones
  InfoPublicacion: guardarpublicacion[];
  posicion: any;
  Todoscomentarios: any[] = [];
  pos;
  existencia: boolean = false;
  existenciaComen: boolean = false;
  // estas son las variables para las imagenes
  filepath: string[] = [];
  fileToUpload: File[] = [];
  fileName: String[] = [];
  uploadPercen: Observable<number>;
  // estas son las variables para mis publicaciones guardadas
  InfoPublicacionGuardada: guardarpublicacion[];
  mispublicaciones;
  ArregloBooleanos: any[] = [];


  constructor(private storage: AngularFireStorage, private foroproblemas: ForoproblemasService) {
    // aqui obtengo el parametro del localstorage
    this.Corrreousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.proceso(1);

  }
  ngOnInit() {
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

  proceso(pos) {
    this.pos = pos;
    this.mispublicaciones = false;
    this.foroproblemas.getTodasPublicacionesproblemas()
      .snapshotChanges()
      .subscribe(res => {
        this.InfoPublicacion = [];
        res.forEach(elemento => {
          let x = elemento.payload.toJSON();
          if (elemento.key !== "ejemplo") {
            const datos = x as guardarpublicacion;
            if (this.pos === 1) {
              x['$key'] = elemento.key;
              this.InfoPublicacion.push(x as guardarpublicacion);
              this.existencia = true;
              this.obtenerArreglo();

            } else if (this.pos === 2) {
              if (datos.correo === this.Corrreousuario) {
                x['$key'] = elemento.key;
                this.InfoPublicacion.push(x as guardarpublicacion);
                this.existencia = true;
              }
            } else {
              for (const i in datos.guardadas) {
                if (datos.guardadas[i].correo === this.Corrreousuario) {
                  x['$key'] = elemento.key;
                  this.InfoPublicacion.push(x as guardarpublicacion);
                  this.existencia = true;
                }
              }
            }
          }
        });
        this.InfoPublicacion = this.InfoPublicacion.reverse();
      });
  }
  obtenerArreglo() {
    this.ArregloBooleanos = [];
    for (const o in this.InfoPublicacion) {
      if (this.InfoPublicacion[o].imagen !== undefined) {
        this.ArregloBooleanos.push(true);
      } else {
        this.ArregloBooleanos.push(false);
      }
    }
  }
  handleFileInput(files: FileList) {
    this.fileImage = files;
  }

  onSubmit() {
    const nombredelAlbum: string = $('#nombreAlbum').val().toString();
    if ((this.register.descripcion === '') || (this.register.plataforma === '') || (this.register.videojuego === '') || (this.register.titulo === '')) {
      alert('faltan agregar datos para la publicacion');
    } else {
      $("#publico").attr("disabled", "true");
      $("#cerrar").attr("disabled", "true");
      if (this.fileImage !== null) {
        let numerocontador = 0;
        for (let i = 0; i < this.fileImage.length; i++) {
          this.fileToUpload[i] = this.fileImage[i];
          this.fileName[i] = this.fileImage.item(i).name;
          const filePath = "'" + this.Corrreousuario + "'/" + this.fileToUpload[i].name;
          const ref = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, this.fileToUpload[i]);
          this.uploadPercen = task.percentageChanges();
          const fileRef = this.storage.ref(filePath);
          task.snapshotChanges().pipe(finalize(() => {
            numerocontador = numerocontador + 1;
            fileRef.getDownloadURL().subscribe(ref => {
              this.downloadURL = ref;
              const registro = new guardarpublicacion();
              registro.usuario = this.nombreusuario;
              registro.correo = this.Corrreousuario;
              registro.titulo = this.register.titulo;
              registro.descripcion = this.register.descripcion;
              registro.plataforma = this.register.plataforma;
              registro.videojuego = this.register.videojuego;
              registro.imagen = ref;
              registro.cantidadLikes = 0;
              registro.likes = [];
              registro.guardadas = [];
              this.foroproblemas.postRegistroNormal(registro)
                .subscribe(newpres => {
                  alert('Publicacion con exito');
                  $("#publico").attr("disabled", "false");
                  $("#cerrar").attr("disabled", "false");
                });
            });
          })).subscribe(newpre => { });
        }
      } else {
        const registro = new guardarpublicacion();
        registro.usuario = this.nombreusuario;
        registro.correo = this.Corrreousuario;
        registro.titulo = this.register.titulo;
        registro.descripcion = this.register.descripcion;
        registro.plataforma = this.register.plataforma;
        registro.videojuego = this.register.videojuego;
        registro.guardadas = [];
        this.foroproblemas.postRegistroNormal(registro)
          .subscribe(newpres => {
            alert('Publicacion con exito');
            $("#publico").attr("disabled", "false");
            $("#cerrar").attr("disabled", "false");
          });
      }
    }
  }

  comentar(publicacion, posicion) {
    this.Todoscomentarios = [];
    this.posicion = posicion;

    if (publicacion.comentarios === null || publicacion.comentarios === undefined) {
      this.existenciaComen = false;
    } else {
      this.existenciaComen = true;
      for (const i in publicacion.comentarios) {
        this.Todoscomentarios.push(publicacion.comentarios[i])
      }
    }
  }

  enviarComentario(publicacion, pos) {
    let comentario;
    if (pos === 1) { comentario = $(".comentarios").val().toString(); }
    else if (pos === 2) { comentario = $(".comentarios2").val().toString(); }

    if (comentario !== "") {
      var x: any[] = [];
      console.log(comentario);

      const registroComentario = new Comentario();
      registroComentario.comentario = comentario;
      registroComentario.usuario = this.nombreusuario;
      registroComentario.correo = this.Corrreousuario;
      if (publicacion.comentarios === null || publicacion.comentarios === undefined) {
        x.push(registroComentario);
      } else {
        for (const i in publicacion.comentarios) {
          x.push(publicacion.comentarios[i] as Comentario);
        }
        x.push(registroComentario);
      }
      const registro = new guardarpublicacion();
      registro.usuario = publicacion.usuario;
      registro.titulo = publicacion.titulo;
      registro.descripcion = publicacion.descripcion;
      registro.plataforma = publicacion.plataforma;
      registro.videojuego = publicacion.videojuego;
      registro.imagen = publicacion.imagen;
      registro.comentarios = x;
      registro.correo = publicacion.correo;
      registro.guardadas = publicacion.guardadas;
      this.foroproblemas.putPublicacion(registro, publicacion.$key)
        .subscribe(res => {
          alert("Se guardo tu comentario con exito");
        })
    } else {
      alert("No ha ingresado un comentaro");
    }
  }

  cierro() {
    localStorage.removeItem('nombreUsuario');
    /*CERRANDO SESION */
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
    }, function (error) {
      // An error happened.
    });
  }

  nombretuusuario(usuario) {
    localStorage.removeItem('suusuario');
    localStorage.setItem('suusuario', usuario);
  }

  onEditClick(skill: any) {
    let x = this.InfoPublicacion;
    if (skill === "all") {
      this.proceso(this.pos);
    } else {
      this.InfoPublicacion = [];
      this.foroproblemas.getProblemas()
        .subscribe(res => {
          for (const i in res) {
            if (this.pos === 1) {
              if (res[i].plataforma === skill) {
                this.InfoPublicacion.push(res[i] as guardarpublicacion)
              }
            } else if (this.pos === 2) {
              if (res[i].plataforma === skill) {
                this.InfoPublicacion.push(res[i] as guardarpublicacion)
              }
            } else {
              if (res[i].plataforma === skill) {
                this.InfoPublicacion.push(res[i] as guardarpublicacion)
              }
            }
          }

        });
    }
  }
}
