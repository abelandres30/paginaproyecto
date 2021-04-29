import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import * as $ from 'jquery';
import { UsuariorecomendadosComponent } from '../usuariorecomendados/usuariorecomendados.component';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
//servicios 
import { RegistroPublicacionService } from '../../services/registropublicacion.service';
import { ObtenerPublicacionService } from '../../services/publicaciones';
import { RegistroamigosService } from '../../services/registroamigos.service';
// models 
import { guardarpublicacion } from '../../models/publicacion';
import { Guardarpubli } from '../../models/publicacion';
import { Megustas } from '../../models/Megustas';
import { Comentario } from '../../models/comentarios';
import { Amigos } from '../../models/amigos';
import { publicacionGuardada } from 'src/app/models/publicacionGuardada';


@Component({
  selector: 'app-modulomenu',
  templateUrl: './modulomenu.component.html',
  styleUrls: ['./modulomenu.component.css']
})
export class ModulomenuComponent implements OnInit {
  @ViewChild(UsuariorecomendadosComponent) hijo: UsuariorecomendadosComponent;
  elemento;
  nombreusuario2;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  register;

  // esta es la nueva variable para tomar todos las publicaciones 
  InfoPublicacion: guardarpublicacion[];
  sivideo: boolean[] = [];
  siimagen: boolean[] = [];
  sinada: boolean[] = [];
  Corrreousuario: string;
  nombreusuario;
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
  fileImage: any = null;
  // estas son las variables para mis publicaciones guardadas 
  InfoPublicacionGuardada: guardarpublicacion[];
  sivideoGuardada: boolean[] = [];
  siimagenGuardada: boolean[] = [];
  sinadaGuardada: boolean[] = [];
  mispublicaciones;

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

  Scroll(event) {}

  constructor(private router: Router, private storage: AngularFireStorage,
    private registropublicacionesService: RegistroPublicacionService,private obtenerpublicacionService: ObtenerPublicacionService,) {
    // aqui obtengo el parametro del localstorage
    this.Corrreousuario = localStorage.getItem('nombreUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.newproceso(1);
  }


  newproceso(pos) {
    this.pos = pos;
    this.mispublicaciones = false;
    this.obtenerpublicacionService.getTodasPublicaciones()
      .snapshotChanges()
      .subscribe(res => {
        this.InfoPublicacion = [];
        this.sinada = [];
        this.siimagen = [];
        this.sivideo = [];
        res.forEach(elemento => {
          let x = elemento.payload.toJSON();
          if (elemento.key !== "ejemplo") {
            const datos = x as guardarpublicacion;
            if (this.pos === 1) {
              x['$key'] = elemento.key;
              this.InfoPublicacion.push(x as guardarpublicacion);
              this.InfoPublicacion = this.InfoPublicacion.reverse();
              this.existencia = true;
              if (datos.tipo === "image/jpeg" || datos.tipo === "image/JPEG" || datos.tipo === "image/png" || datos.tipo === "image/PNG" || datos.tipo === "image/jpg" || datos.tipo === "image/JPG") {
                this.siimagen.push(true);
                this.sivideo.push(false);
                this.sinada.push(false);
              } else if (datos.tipo === 'video/mp4' || datos.tipo === 'video/MP4' || datos.tipo === 'video/mkv' || datos.tipo === 'video/MKV') {
                this.siimagen.push(false);
                this.sivideo.push(true);
                this.sinada.push(false);
              } else {
                this.siimagen.push(false);
                this.sivideo.push(false);
                this.sinada.push(true);
              }
              this.siimagen = this.siimagen.reverse();
              this.sivideo = this.sivideo.reverse();
              this.sinada = this.sinada.reverse();
            } else if (this.pos === 2) {
              if (datos.correo === this.Corrreousuario) {
                x['$key'] = elemento.key;
                this.InfoPublicacion.push(x as guardarpublicacion);
                this.InfoPublicacion = this.InfoPublicacion.reverse();
                this.existencia = true;
                if (datos.tipo === "image/jpeg" || datos.tipo === "image/JPEG" || datos.tipo === "image/png" || datos.tipo === "image/PNG" || datos.tipo === "image/jpg" || datos.tipo === "image/JPG") {
                  this.siimagen.push(true);
                  this.sivideo.push(false);
                  this.sinada.push(false);
                } else if (datos.tipo === 'video/mp4' || datos.tipo === 'video/MP4' || datos.tipo === 'video/mkv' || datos.tipo === 'video/MKV') {
                  this.siimagen.push(false);
                  this.sivideo.push(true);
                  this.sinada.push(false);
                } else {
                  this.siimagen.push(false);
                  this.sivideo.push(false);
                  this.sinada.push(true);
                }
                this.siimagen = this.siimagen.reverse();
                this.sivideo = this.sivideo.reverse();
                this.sinada = this.sinada.reverse();
              }
            } else {
              for (const i in datos.guardadas) {
                if (datos.guardadas[i].correo === this.Corrreousuario) {
                  x['$key'] = elemento.key;
                  this.InfoPublicacion.push(x as guardarpublicacion);
                  this.InfoPublicacion = this.InfoPublicacion.reverse();
                  this.existencia = true;
                  if (datos.tipo === "image/jpeg" || datos.tipo === "image/JPEG" || datos.tipo === "image/png" || datos.tipo === "image/PNG" || datos.tipo === "image/jpg" || datos.tipo === "image/JPG") {
                    this.siimagen.push(true);
                    this.sivideo.push(false);
                    this.sinada.push(false);
                  } else if (datos.tipo === 'video/mp4' || datos.tipo === 'video/MP4' || datos.tipo === 'video/mkv' || datos.tipo === 'video/MKV') {
                    this.siimagen.push(false);
                    this.sivideo.push(true);
                    this.sinada.push(false);
                  } else {
                    this.siimagen.push(false);
                    this.sivideo.push(false);
                    this.sinada.push(true);
                  }
                  this.siimagen = this.siimagen.reverse();
                  this.sivideo = this.sivideo.reverse();
                  this.sinada = this.sinada.reverse();
                }
              }
            }
          }
        });
      });
  }
  Guardarpublicacion(publicacion) {
    if (publicacion.correo === this.Corrreousuario) {
        alert("esta publicacion es suya"); 
    } else {
      var x: any[] = [];
      let Entro: boolean = false;
      const registroPubliGuardada = new publicacionGuardada();
      registroPubliGuardada.correo = this.Corrreousuario;
      registroPubliGuardada.usuario = this.nombreusuario;
      if (publicacion.guardadas === null || publicacion.guardadas === undefined ) {
        x.push(registroPubliGuardada);
      } else {
        for (const i in publicacion.guardadas) {
          if (publicacion.guardadas[i].correo === this.Corrreousuario) {
            Entro = true;
          } else {
            x.push(publicacion.guardadas[i] as publicacionGuardada);
          }
        }
        x.push(registroPubliGuardada);
      }
      if (Entro === false) {
        const registro = this.GenerarRegistro(publicacion.usuario,publicacion.titulo,publicacion.descripcion,
          publicacion.plataforma,publicacion.videojuego,publicacion.imagen,publicacion.tipo,
          publicacion.cantidadLikes,publicacion.likes,publicacion.comentarios,
          x,publicacion.correo);
        this.registropublicacionesService.putPublicacion(registro, publicacion.$key)
          .subscribe(res => {
            alert("Se guardo esta publicacion");
          })
      } else {
        alert("ya tiene guardada esta publicacion");
      }
    }
  }

  eliminarpublicacion(publicacion,publisave) {
    var x: any[] = [];
    for (const i in publisave) {
      if (publisave[i].correo !== this.Corrreousuario) {
        x.push(publisave[i]);
      }
    }
    const registro = this.GenerarRegistro(publicacion.usuario,publicacion.titulo,publicacion.descripcion,
      publicacion.plataforma,publicacion.videojuego,publicacion.imagen,publicacion.tipo,
      publicacion.cantidadLikes,publicacion.likes,publicacion.comentarios,
      x,publicacion.correo);
    this.registropublicacionesService.putPublicacion(registro, publicacion.$key)
    .subscribe(res => {
      alert("Se elimino la publicacion guardada con exito");
    })
  }

  megusta(publicacion, megustasInfo) {
    var x: any[] = [];
    let Entro: boolean = false;

    const RegistroGusta = new Megustas();
    RegistroGusta.CorreoUsuario = this.Corrreousuario;
    RegistroGusta.NombreUsuario = this.nombreusuario;
    if (publicacion.likes === null || publicacion.likes === undefined) {
      x.push(RegistroGusta);
    } else {
      for (const i in megustasInfo) {
        if (megustasInfo[i].CorreoUsuario === this.Corrreousuario) {
          Entro = true;
        } else {
          x.push(megustasInfo[i] as Megustas);

        }
      }
      x.push(RegistroGusta);
    }
    if (Entro === false) {
      const registro = this.GenerarRegistro(publicacion.usuario,publicacion.titulo,publicacion.descripcion,
        publicacion.plataforma,publicacion.videojuego,publicacion.imagen,publicacion.tipo,
        x.length,x,publicacion.comentarios,
        publicacion.guardadas,publicacion.correo);
      this.registropublicacionesService.putPublicacion(registro, publicacion.$key)
        .subscribe(res => {
          alert("Se guardo Tu me gusta");
        })
    } else {
      alert("Ya le has dado me gusta a esta publicacion");
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

  enviarComentario(publicacion,pos) {
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
      const registro = this.GenerarRegistro(publicacion.usuario,publicacion.titulo,publicacion.descripcion,
        publicacion.plataforma,publicacion.videojuego,publicacion.imagen,publicacion.tipo,
        publicacion.cantidadLikes,publicacion.likes,x,
        publicacion.guardadas,publicacion.correo);
      this.registropublicacionesService.putPublicacion(registro, publicacion.$key)
        .subscribe(res => {
          alert("Se guardo tu comentario con exito");
        }) 
    } else {
      alert("No ha ingresado un comentario");
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
          const filePath = 'publicaimagenes/' + this.fileToUpload[i].name;
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
              registro.tipo = this.fileImage.item(i).type;
              registro.cantidadLikes = 0;
              registro.likes = [];
              registro.guardadas = [];
              this.registropublicacionesService.postRegistroNormal(registro)
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
        registro.cantidadLikes = 0;
        registro.likes = [];
        registro.guardadas = [];
        this.registropublicacionesService.postRegistroNormal(registro)
          .subscribe(newpres => {
            alert('Publicacion con exito');
            $("#publico").attr("disabled", "false");
            $("#cerrar").attr("disabled", "false");
          });
      }
    }
  }
  activador: boolean = true;

  GenerarRegistro(usuario,titulo,descripcion,plataforma,videojuego,imagen,tipo,cantidadLikes,likes,comentarios,guardadas,correo) {
    const registro = new guardarpublicacion();
    registro.usuario = usuario;
    registro.titulo = titulo;
    registro.descripcion = descripcion;
    registro.plataforma = plataforma;
    registro.videojuego = videojuego;
    registro.imagen = imagen;
    registro.tipo = tipo;
    registro.cantidadLikes = cantidadLikes;
    registro.likes = likes;
    registro.comentarios = comentarios;
    registro.guardadas = guardadas;
    registro.correo = correo;
    return registro;
  }
}
