import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comentario } from 'src/app/models/comentarios';
import { Usuarioperfil } from 'src/app/models/cuenta';
import { Megustas } from 'src/app/models/Megustas';
import { guardarpublicacion } from 'src/app/models/publicacion';
import { ObtenerPublicacionService } from 'src/app/services/publicaciones';
import { RegistroPublicacionService } from 'src/app/services/registropublicacion.service';
import { RespuestasService } from '../../services/cuentas.service'
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  Corrreousuario: string;
  nombreusuario: string;
  idUser: string;
  InfoUsuario: Usuarioperfil;
  InfoPublicacion: guardarpublicacion[];
  sivideo: boolean[] = [];
  siimagen: boolean[] = [];
  sinada: boolean[] = [];
  existencia: boolean = false;
  Todoscomentarios: any[] = [];
  pos;
  existenciaComen: boolean = false;
  posicion: any;
  // estas son las variables para obtener la informacion del usuario
  amigos: any[] = [];
  amigos2: any[] = [];
  amigoslista1: any[] = [];
  amigoslista2: any[] = [];
  plataforma: any[] = [];
  videojuego: any[] = [];
  plataformas: any[] = [];
  listaplataforma11: any[] = [];
  listaplataforma12: any[] = [];
  videojuegos: any[] = [];
  listavideojuegos11: any[] = [];
  listavideojuegos12: any[] = [];


  constructor(private _router: ActivatedRoute, private cuenta: RespuestasService, private router: Router, private obtenerpublicacionService: ObtenerPublicacionService
    , private registropublicacionesService: RegistroPublicacionService) {
    // router.events.subscribe(res => { this.proceso(); });
  }

  ngOnInit() {
    this.proceso();

  }
  proceso() {
    this.idUser = this._router.snapshot.paramMap.get('id');
    this.cuenta.getTodasCuentas()
      .snapshotChanges()
      .subscribe(res => {
        this.InfoUsuario = null;
        res.forEach(elemento => {
          let x = elemento.payload.toJSON();
          if (elemento.key !== "ejemplo") {
            const datos = x as Usuarioperfil;
            if (this.idUser === elemento.key) {
              this.InfoUsuario = x as Usuarioperfil;
              this.obtenerPublicaciones();
              this.ObtenerInfo();
              this.generarAmigos();

            }
          }
        })
      })
  }

  obtenerPublicaciones() {
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
            if (datos.correo === this.InfoUsuario.correo) {
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
        });
      });
  }
  ObtenerInfo() {
    // este es el espacio para las plataformas 
    this.plataformas = [];
    this.plataforma = [];
    this.listaplataforma11 = [];
    this.listaplataforma12 = [];
    this.plataformas = ["Play station", "Pc", "Xbox", "Wii"];
    if (this.InfoUsuario.plataforma !== undefined || this.InfoUsuario.plataforma !== null) {
      for (const i in this.InfoUsuario.plataforma) {
        let pos = 0;
        this.plataforma.push(this.InfoUsuario.plataforma[i]);
        for (const o in this.plataformas) {
          if (this.plataforma[i] === this.plataformas[o]) {
            this.plataformas.splice(pos, 1);
          }
          pos = pos + 1
        }
      }
    }
    if (this.plataforma.length > 1) {
      this.listaplataforma11 = this.plataforma.splice(0, (this.plataforma.length / 2));
      this.listaplataforma12 = this.plataforma.splice(0, this.plataforma.length);
    } else {
      this.listaplataforma11 = this.plataforma;
    }

    // este es el espacio para los videojuegos
    this.videojuegos = [];
    this.videojuego = [];
    this.videojuegos = ["God of war", "The last of us", "Ratchet and clank", "Gears of war"
      , "Halo", "left for dead", "Super Smash Bros", "Zelda", "Mario kart", "League of legends", "Fornite", "Forza"];
    this.listavideojuegos11 = [];
    this.listavideojuegos12 = [];
    if (this.InfoUsuario.videojuego !== undefined || this.InfoUsuario.videojuego !== null) {
      for (const i in this.InfoUsuario.videojuego) {
        let pos2 = 0;
        this.videojuego.push(this.InfoUsuario.videojuego[i]);
        for (const o in this.videojuegos) {
          if (this.videojuego[i] === this.videojuegos[o]) {
            this.videojuegos.splice(pos2, 1);
          }
          pos2 = pos2 + 1
        }
      }
    }

    if (this.videojuego.length > 1) {
      this.listavideojuegos11 = this.videojuego.splice(0, (this.videojuego.length / 2));
      this.listavideojuegos12 = this.videojuego.splice(0, this.videojuego.length);
    } else {
      this.listavideojuegos11 = this.videojuego;
    }
  }

  generarAmigos() {

    this.amigos = [];
    this.amigos2 = [];
    this.amigoslista1 = [];
    this.amigoslista2 = [];
    this.cuenta.getRespuestas()
      .subscribe(res => {
        for (const o in res) {
          if (this.InfoUsuario.amigos !== undefined || this.InfoUsuario.amigos !== null) {
            for (const i in this.InfoUsuario.amigos) {
              if (res[o].correo === this.InfoUsuario.amigos[i].correo) {
                let x = res[o];
                x['$key'] = o;
                this.amigos.push(res[o]);
                this.amigos2.push(x as Usuarioperfil);
              }
            }
          }
        }
        if (this.amigos.length > 1) {
          this.amigoslista1 = this.amigos.splice(0, (this.amigos.length / 2));
          this.amigoslista2 = this.amigos.splice(0, this.amigos.length);
        } else {
          this.amigoslista1 = this.amigos;
        }
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
      const registro = this.GenerarRegistro(publicacion.usuario, publicacion.titulo, publicacion.descripcion,
        publicacion.plataforma, publicacion.videojuego, publicacion.imagen, publicacion.tipo,
        x.length, x, publicacion.comentarios,
        publicacion.guardadas, publicacion.correo);
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

  enviarComentario(publicacion, pos) {
    let comentario;
    if (pos === 1) { comentario = $(".comentarios").val().toString(); }
    else if (pos === 2) { comentario = $(".comentarios2").val().toString(); }

    if (comentario !== "") {
      var x: any[] = [];

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
      const registro = this.GenerarRegistro(publicacion.usuario, publicacion.titulo, publicacion.descripcion,
        publicacion.plataforma, publicacion.videojuego, publicacion.imagen, publicacion.tipo,
        publicacion.cantidadLikes, publicacion.likes, x,
        publicacion.guardadas, publicacion.correo);
      this.registropublicacionesService.putPublicacion(registro, publicacion.$key)
        .subscribe(res => {
          alert("Se guardo tu comentario con exito");
        })
    } else {
      alert("No ha ingresado un comentario");
    }
  }
  GenerarRegistro(usuario, titulo, descripcion, plataforma, videojuego, imagen, tipo, cantidadLikes, likes, comentarios, guardadas, correo) {
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

  perfil(amigo) {
    const IdUser = amigo.$key;
    if (this.idUser !== IdUser) {
      this.router.navigate(['perfil', IdUser]);
      setTimeout(() => {
        location.reload();
      }, 100);
    }
  }

}
