import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import * as $ from 'jquery';
import { UsuariorecomendadosComponent } from '../usuariorecomendados/usuariorecomendados.component';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
//servicios
import { RegistroPublicacionService } from '../../services/registropublicacion.service';
import { ObtenerPublicacionService } from '../../services/publicaciones';
// models
import { guardarpublicacion } from '../../models/publicacion';
import { Guardarpubli } from '../../models/publicacion';
import { Megustas } from '../../models/Megustas';
import { Comentario } from '../../models/comentarios';
import { Amigos } from '../../models/amigos';
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

  elemento;
  nombreusuario2;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  register;
  data: any;

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
  idUser: string;

  url: any;
  format: any;

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

  Scroll(event) { }

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
    this.newproceso(1);
  }

  newproceso(pos: any)
  {
    console.log("si entra");
    this.InfoPublicacion = [];
    this.sinada = [];
    this.siimagen = [];
    this.sivideo = [];
    this.pos = pos;
    this.mispublicaciones = false;
    this.obtenerpublicacionService.getRespuestas()
      .subscribe(res =>
        {
        for (const i in res)
        {
          if (i !== "ejemplo")
          {
            let x = res[i];

            if (this.pos === 1)
            {
              x['$key'] = i;

              this.InfoPublicacion.push(x as guardarpublicacion);
              this.InfoPublicacion = this.InfoPublicacion.reverse();
              this.existencia = true;

              if (res[i].tipo === "image/jpeg" || res[i].tipo === "image/JPEG" || res[i].tipo === "image/png" || res[i].tipo === "image/PNG" || res[i].tipo === "image/jpg" || res[i].tipo === "image/JPG")
              {
                this.siimagen.push(true);
                this.sivideo.push(false);
                this.sinada.push(false);
              }
              else if (res[i].tipo === 'video/mp4' || res[i].tipo === 'video/MP4' || res[i].tipo === 'video/mkv' || res[i].tipo === 'video/MKV')
              {
                this.siimagen.push(false);
                this.sivideo.push(true);
                this.sinada.push(false);
              }
              else
              {
                this.siimagen.push(false);
                this.sivideo.push(false);
                this.sinada.push(true);
              }

              this.siimagen = this.siimagen.reverse();
              this.sivideo = this.sivideo.reverse();
              this.sinada = this.sinada.reverse();
            }
            else if (this.pos === 2)
            {
              if (res[i].correo === this.Corrreousuario)
              {
                x['$key'] = i;

                this.InfoPublicacion.push(x as guardarpublicacion);
                this.InfoPublicacion = this.InfoPublicacion.reverse();
                this.existencia = true;

                if (res[i].tipo === "image/jpeg" || res[i].tipo === "image/JPEG" || res[i].tipo === "image/png" || res[i].tipo === "image/PNG" || res[i].tipo === "image/jpg" || res[i].tipo === "image/JPG")
                {
                  this.siimagen.push(true);
                  this.sivideo.push(false);
                  this.sinada.push(false);
                }
                else if (res[i].tipo === 'video/mp4' || res[i].tipo === 'video/MP4' || res[i].tipo === 'video/mkv' || res[i].tipo === 'video/MKV')
                {
                  this.siimagen.push(false);
                  this.sivideo.push(true);
                  this.sinada.push(false);
                }
                else
                {
                  this.siimagen.push(false);
                  this.sivideo.push(false);
                  this.sinada.push(true);
                }

                this.siimagen = this.siimagen.reverse();
                this.sivideo = this.sivideo.reverse();
                this.sinada = this.sinada.reverse();
              }
            }
            else
            {
              for (const o in res[i].guardadas)
              {
                if (res[i].guardadas[o].correo === this.Corrreousuario)
                {
                  x['$key'] = i;

                  this.InfoPublicacion.push(x as guardarpublicacion);
                  this.InfoPublicacion = this.InfoPublicacion.reverse();
                  this.existencia = true;

                  if (res[i].tipo === "image/jpeg" || res[i].tipo === "image/JPEG" || res[i].tipo === "image/png" || res[i].tipo === "image/PNG" || res[i].tipo === "image/jpg" || res[i].tipo === "image/JPG")
                  {
                    this.siimagen.push(true);
                    this.sivideo.push(false);
                    this.sinada.push(false);
                  }
                  else if (res[i].tipo === 'video/mp4' || res[i].tipo === 'video/MP4' || res[i].tipo === 'video/mkv' || res[i].tipo === 'video/MKV')
                  {
                    this.siimagen.push(false);
                    this.sivideo.push(true);
                    this.sinada.push(false);
                  }
                  else
                  {
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
        }
      });
  }

  Guardarpublicacion(publicacion: any)
  {
    if (publicacion.correo !== this.Corrreousuario)
    {
      var x: any[] = [];
      let Entro: boolean = false;

      const registroPubliGuardada = new publicacionGuardada();
      registroPubliGuardada.correo = this.Corrreousuario;
      registroPubliGuardada.usuario = this.nombreusuario;

      if (publicacion.guardadas === null || publicacion.guardadas === undefined)
      {
        x.push(registroPubliGuardada);
      }
      else
      {
        for (const i in publicacion.guardadas)
        {
          if (publicacion.guardadas[i].correo === this.Corrreousuario)
          {
            Entro = true;
          }
          else
          {
            x.push(publicacion.guardadas[i] as publicacionGuardada);
          }
        }
        x.push(registroPubliGuardada);
      }
      if (Entro === false)
      {
        const registro = this.GenerarRegistro(publicacion.usuario, publicacion.titulo, publicacion.descripcion,
        publicacion.plataforma, publicacion.videojuego, publicacion.imagen, publicacion.tipo,
        publicacion.cantidadLikes, publicacion.likes, publicacion.comentarios,
        x, publicacion.correo);

        this.registropublicacionesService.putPublicacion(registro, publicacion.$key)
        .subscribe(res =>
        {
          this.newproceso(1);

          Swal.fire({
            icon: 'success',
            title: 'Se guardo con exito la publicacion',
            showConfirmButton: false,
            timer: 1500
          })
        })
      }
      else
      {
        Swal.fire({
          icon: 'error',
          title: 'Ya tiene guardada esta publicacion',
        })
      }
    }
  }

  eliminarpublicacion(publicacion: any, publisave:any)
  {
    var x: any[] = [];

    for (const i in publisave)
    {
      if (publisave[i].correo !== this.Corrreousuario)
      {
        x.push(publisave[i]);
      }
    }

    const registro = this.GenerarRegistro(publicacion.usuario, publicacion.titulo, publicacion.descripcion,
    publicacion.plataforma, publicacion.videojuego, publicacion.imagen, publicacion.tipo,
    publicacion.cantidadLikes, publicacion.likes, publicacion.comentarios,
    x, publicacion.correo);

    this.registropublicacionesService.putPublicacion(registro, publicacion.$key)
      .subscribe(res =>
        {
        Swal.fire({
          icon: 'success',
          title: 'Se Elimino la publicacion guardada con exito',
          showConfirmButton: false,
          timer: 1500
        })
        this.newproceso(3);
      })
  }

  megusta(publicacion:any, megustasInfo:any)
  {
    var x: any[] = [];
    let Entro: boolean = false;

    const RegistroGusta = new Megustas();
    RegistroGusta.CorreoUsuario = this.Corrreousuario;
    RegistroGusta.NombreUsuario = this.nombreusuario;

    if (publicacion.likes === null || publicacion.likes === undefined)
    {
      x.push(RegistroGusta);
    }
    else
    {
      for (const i in megustasInfo)
      {
        if (megustasInfo[i].CorreoUsuario === this.Corrreousuario)
        {
          Entro = true;
        }
        else
        {
          x.push(megustasInfo[i] as Megustas);
        }
      }
      x.push(RegistroGusta);
    }

    if (Entro === false)
    {
      const registro = this.GenerarRegistro(publicacion.usuario, publicacion.titulo, publicacion.descripcion,
      publicacion.plataforma, publicacion.videojuego, publicacion.imagen, publicacion.tipo,
      x.length, x, publicacion.comentarios,
      publicacion.guardadas, publicacion.correo);

      this.registropublicacionesService.putPublicacion(registro, publicacion.$key)
        .subscribe(res => {})
    }
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
      for (const i in publicacion.comentarios)
      {
        this.Todoscomentarios.push(publicacion.comentarios[i])
      }
    }
  }

  enviarComentario(publicacion:any, pos:any)
  {
    let comentario;

    if (pos === 1) { comentario = $(".comentarios").val().toString(); }
    else if (pos === 2) { comentario = $(".comentarios2").val().toString(); }

    if (comentario !== "")
    {
      var x: any[] = [];
      console.log(comentario);

      const registroComentario = new Comentario();
      registroComentario.comentario = comentario;
      registroComentario.usuario = this.nombreusuario;
      registroComentario.correo = this.Corrreousuario;

      if (publicacion.comentarios === null || publicacion.comentarios === undefined)
      {
        x.push(registroComentario);
      }
      else
      {
        for (const i in publicacion.comentarios)
        {
          x.push(publicacion.comentarios[i] as Comentario);
        }
        x.push(registroComentario);
      }

      const registro = this.GenerarRegistro(publicacion.usuario, publicacion.titulo, publicacion.descripcion,
      publicacion.plataforma, publicacion.videojuego, publicacion.imagen, publicacion.tipo,
      publicacion.cantidadLikes, publicacion.likes, x,
      publicacion.guardadas, publicacion.correo);

      this.registropublicacionesService.putPublicacion(registro, publicacion.$key)
        .subscribe(res =>
          {
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
    const nombredelAlbum: string = $('#nombreAlbum').val().toString();

    if ((this.register.descripcion === '') || (this.register.plataforma === '') || (this.register.videojuego === '') || (this.register.titulo === ''))
    {
      Swal.fire({
        icon: 'error',
        title: 'faltan agregar datos para la publicacion',
        showConfirmButton: true,
      })
    }
    else
    {
      $("#publico").attr("disabled", "true");
      $("#cerrar").attr("disabled", "true");

      if (this.fileImage !== null)
      {
        let numerocontador = 0;

        for (let i = 0; i < this.fileImage.length; i++)
        {
          this.fileToUpload[i] = this.fileImage[i];
          this.fileName[i] = this.fileImage.item(i).name;
          const filePath = "'" + this.Corrreousuario + "'/" + this.fileToUpload[i].name;
          const ref = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, this.fileToUpload[i]);
          this.uploadPercen = task.percentageChanges();
          const fileRef = this.storage.ref(filePath);

          task.snapshotChanges().pipe(finalize(() =>
          {
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
                .subscribe(newpres =>
                  {
                    Swal.fire({
                      icon: 'success',
                      title: 'Publicacion con exito',
                      showConfirmButton: true,
                    })

                    $("#publico").attr("disabled", "false");
                    $("#cerrar").attr("disabled", "false");
                });
            });
          })).subscribe(newpre => { });
        }
      }
      else
      {
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
          .subscribe(newpres =>
            {
            Swal.fire({
              icon: 'success',
              title: 'Publicacion con exito',
              showConfirmButton: false,
              timer: 1500
            })
            $("#publico").attr("disabled", "false");
            $("#cerrar").attr("disabled", "false");
          });
      }
    }
  }
  activador: boolean = true;

  GenerarRegistro(usuario:any, titulo:any, descripcion:any, plataforma:any, videojuego:any, imagen:any, tipo:any, cantidadLikes:any, likes:any, comentarios:any, guardadas:any, correo:any)
  {
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

  perfilusuario(correo:any)
  {
    this.idUser = "";
    this.cuenta.getAmigos()
      .subscribe(res =>
        {
        for (const i in res)
        {
          if (res[i].correo === correo)
          {
            this.idUser = i;
            this.router.navigate(['perfil', this.idUser]);
          }
        }
      });
  }
}
