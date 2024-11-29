import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
// import $ from 'jquery';
import { GlobalesService } from '../../services/globales.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import {RespuestasService } from '../../services/cuentas.service';
// import {Message} from 'primeng/components/common/api';
import { ObtenerPublicacionService } from '../../services/publicaciones';
import { RegistroPublicacionService } from '../../services/registropublicacion.service';
import * as $ from 'jquery';

class Notificaciones {
  usuario1;
  usuario2;
  motivo;
  estado;
  mensaje;
}
class Comentario {
  // del comentario
  usuario2;
  comentario;
  usuario;
  nomtitulo;
  nomplataforma;
  nomvideojuego;
  descripcion;

}
const httpOptions = {
  headers: new HttpHeaders({'content-type': 'application/json'})
};
@Component({
  selector: 'app-biografiausu',
  templateUrl: './biografiausu.component.html',
  styleUrls: ['./biografiausu.component.css']
})
export class BiografiausuComponent implements OnInit {
  nombresuusuario;
  // aqui son las variables para obtener la informacion
  portadasImagenes1: string [] = [];
  portadasNomAlbum1: string [] = [];
  portadasIdAlbum1: string [] = [];
  portadasNomuser1: string[] = [];
  // variables de datos de la publicacion
  todaspublicaciones1: string [] = [];
  publicacionUser1: string[] = [];
  publicacionDescrip1: string[] = [];
  publicacionPlataforma1: string[] = [];
  publicacionVideojuego1: string[] = [];
  notificacionUser11: string [] = [];
  notificacionUser21: string [] = [];
  notificacionMotivo1: string [] = [];
  // aqui con otras variables que igual ocupo
  todoscomentarios1: string[] = [];
  comentadores1: string[] = [];
  todoscomenta1: string[] = [];
  sivideo1: boolean[] = [];
  siimagen1: boolean[] = [];
  sinada1: boolean[] = [];

 // aqui son otros valores
 existenciaComen1: boolean = false;
  existencia1: boolean = false;
  existenciaNoti1: boolean = false;
  register1;
  respuestas: any [] = [];
  respuestas2: any [] = [];
  respuestas3: any [] = [];
  respuestas5: any [] = [];

  existencianotifi: boolean = false;

  nombreusuario;
  plataformasps: string;
  plataformaxbox: string;
  plataformapc: string;
  plataformawii: string;
  plataformaswitch: string;
  sinplataforma:String = 'sin plataformas';
  videojuegos1: string[] = [];
  imagenperfil;
  constructor(
    private storage: AngularFireStorage,
    private notifiaciones: NotificacionesService,
    private usuarios: RespuestasService,
    private global: GlobalesService,
    private registropublicacionesService: RegistroPublicacionService,
     private respuestasService: RespuestasService,
     private obtenerimagenes: ObtenerPublicacionService,
     private obtenernotifiaciones: NotificacionesService) {

      this.nombreusuario =  localStorage.getItem('PerfilUsuario');
      this.nombresuusuario =  localStorage.getItem('suusuario');
      // aqui es para obtener la informacion del usuario
        this.respuestasService.getRespuestas()
        .subscribe(respuestas => {
          for (const i in respuestas) {
            this.respuestas[i] = respuestas[i];
          }
        });
        this.obtenerimagenes.getRespuestas()
        .subscribe(respuestas => {
          for ( const i in respuestas ) {

          this.respuestas2[i] = respuestas[i];
          }
          });
          this.notifiaciones.getNotifiaciones()
          .subscribe(respuestas => {
            for ( const i in respuestas ) {
             this.respuestas3[i] = respuestas[i];
            }
            });
            this.obtenerimagenes.getComentarios()
            .subscribe(respuestas => {
              for (const i in respuestas) {
                this.respuestas5[i] = respuestas[i];
              }
            });

        setTimeout(() => {
          this.mostrar();
          this.mostrarpubli();
        }, 500);
    }
    mostrarpubli() {
        // Aqui es para obtener las imagenes bien
        this.obtenerimagenes.getImagenes()
        .subscribe(imagenes =>  {
          const users = this.nombresuusuario;

          let numerototal: number = 0;

          for (const o in this.respuestas2) {
            if (users === this.respuestas2[o].usuario) {
              numerototal = numerototal + 1;
            }
          }
          let i = numerototal - 1;
          const portadasImagenes1: string [] = [];
          const portadasNomAlbum1: string [] = [];
          const portadasIdAlbum1: string [] = [];
          const portadasNomuser1: string [] = [];
          const publicacionTipo1: string [] = [];
          Object.keys(imagenes).forEach(function(key) {
              if (imagenes[key].usuario === users) {
                portadasNomAlbum1[i] = imagenes[key].titulo;
                portadasImagenes1[i] = imagenes[key].URL;
                portadasNomuser1[i] = imagenes[key].usuario;
                portadasIdAlbum1[i] = imagenes[key].ID;
                publicacionTipo1[i] = imagenes[key].tipo;
                i = i - 1;
              }
          });
          for (let i = portadasImagenes1.length - 1; i > -1 ; i--) {

            if (this.nombresuusuario === portadasNomuser1[i]) {
              if (publicacionTipo1[i] === 'jpg' || publicacionTipo1[i] === 'JPG' || publicacionTipo1[i] === 'png' || publicacionTipo1[i] === 'PNG'  ) {
                this.siimagen1[i] = true;
                this.sivideo1[i] = false;
              } else if (publicacionTipo1[i] === 'mp4' || publicacionTipo1[i] === 'MP4') {
                this.sivideo1[i] = true;
                this.siimagen1[i] = false;
              } else if (publicacionTipo1[i] === '' ) {
                this.sivideo1[i] = false;
                this.siimagen1[i] = false;
                this.sinada1[i] = true;
              }
              this.portadasNomuser1[i] = portadasNomuser1[i];
              this.portadasImagenes1[i] = portadasImagenes1[i];
              this.portadasNomAlbum1[i] = portadasNomAlbum1[i];
              this.portadasIdAlbum1[i] = portadasIdAlbum1[i];
            }
            if (this.portadasImagenes1[i] != null || this.portadasImagenes1[i] !== 'undefined') {
              this.existencia1 = true;
            }
          }
          });
          // aqui es para obtener las publicaciones
        this.obtenerimagenes.getRespuestas()
        .subscribe(publicaciones => {

          let i = this.portadasNomuser1.length  - 1;
          const users = this.nombresuusuario;
          const todaspublicaciones1: string[] = [];
            const publicacionUser1: string[] = [];
            const publicacionDescrip1: string[] = [];
            const  publicacionPlataforma1: string[] = [];
            const publicacionVideojuego1: string[] = [];
            Object.keys(publicaciones).forEach(function(key) {
              // aqui se obtienen los registros
              if (publicaciones[key].usuario === users) {
                todaspublicaciones1[i] = publicaciones[key];
                publicacionUser1[i] = publicaciones[key].usuario;
                publicacionDescrip1[i] = publicaciones[key].descripcion;
                publicacionPlataforma1[i] = publicaciones[key].plataforma;
                publicacionVideojuego1[i] = publicaciones[key].videojuego;
                i = i - 1;
              }
            });
            for (let i = todaspublicaciones1.length - 1; i > -1; i--) {
              if (this.nombresuusuario === publicacionUser1[i]) {
                this.todaspublicaciones1[i] = todaspublicaciones1[i];
                this.publicacionUser1[i] = publicacionUser1[i];
                this.publicacionDescrip1[i] = publicacionDescrip1[i];
                this.publicacionPlataforma1[i] = publicacionPlataforma1[i];
                this.publicacionVideojuego1[i] = publicacionVideojuego1[i];
              }
            }
        });
    }
    mostrar() {
      this.videojuegos1 = [];
          this.mostrarpubli();

      for (const i in this.respuestas) {
        if ( this.respuestas[i].usuario === this.nombresuusuario) {
            this.imagenperfil = this.respuestas[i].imagen;
          if (this.respuestas[i].plataforma.Playstation === 'true' ) {
            this.plataformasps = 'play station';
            this.sinplataforma = '';
          }
          if (this.respuestas[i].plataforma.xbox === 'true') {
            this.plataformaxbox = 'xbox';
            this.sinplataforma = '';

          }
          if (this.respuestas[i].plataforma.pc === 'true') {
            this.plataformapc = 'pc';
            this.sinplataforma = '';

          }
          if (this.respuestas[i].plataforma.NintendoWii === 'true') {
            this.plataformawii = 'Nintendo Wii';
            this.sinplataforma = '';

          }
          if (this.respuestas[i].plataforma.NintendoSwitch === 'true') {
            this.plataformaswitch = 'Nintendo Switch';
            this.sinplataforma = '';

          }
          if (this.respuestas[i].videojuego.black_ops_4 === 'true') {
            this.videojuegos1.push('\n Black ops 4 ');

          }
          if (this.respuestas[i].videojuego.red_dead_redemption_2 === 'true') {
            this.videojuegos1.push('\n red dead redemption 2 ');

          }if (this.respuestas[i].videojuego.fifa_19 === 'true') {
            this.videojuegos1.push('\n fifa 19 ');

          }if (this.respuestas[i].videojuego.the_last_of_us === 'true') {
            this.videojuegos1.push('\n the last of us ');

          }if (this.respuestas[i].videojuego.god_of_war_3 === 'true') {
            this.videojuegos1.push('\n God of war 3 ');

          }if (this.respuestas[i].videojuego.ratchet_and_clank === 'true') {
            this.videojuegos1.push('\n Ratchet and clank ');

          }if (this.respuestas[i].videojuego.gears_of_war === 'true') {
            this.videojuegos1.push('\n Gears of war ');

          }if (this.respuestas[i].videojuego.left_for_dead === 'true') {
            this.videojuegos1.push('\n left for dead ');

          }if (this.respuestas[i].videojuego.forza === 'true') {
            this.videojuegos1.push('\n Forza ');

          }if (this.respuestas[i].videojuego.lol === 'true') {
            this.videojuegos1.push('\n Lol ');

          }if (this.respuestas[i].videojuego.fornite === 'true') {
            this.videojuegos1.push('\n Fornite ');

          }if (this.respuestas[i].videojuego.counter_strike === 'true') {
            this.videojuegos1.push('\n Counter strike ');

          }if (this.respuestas[i].videojuego.super_smahs_bros === 'true') {
            this.videojuegos1.push('\n Super smash bros ');

          }if (this.respuestas[i].videojuego.zelda === 'true') {
            this.videojuegos1.push('\n Zelda ');

          }if (this.respuestas[i].videojuego.mario_bros === 'true') {
            this.videojuegos1.push('\n Mario bros ');

          }if (this.respuestas[i].videojuego.pokemon_battle === 'true') {
            this.videojuegos1.push('\n Pokemon battle ');

          }if (this.respuestas[i].videojuego.mario_party === 'true') {
            this.videojuegos1.push('\n Mario party ');

          }if (this.respuestas[i].videojuego.mario_galaxy === 'true') {
            this.videojuegos1.push('\n Mario galaxy ');

          }
        }
      }
    }
      enviarComentario(i, publiuser, publinom, publipla, publivideo, publidescrip) {
        if (this.register1.comentario === ' ') {
          alert('No ha escrito el comentario');
        } else {
          const registropubli = new Comentario();
          registropubli.usuario2 = this.nombreusuario;
          registropubli.usuario = publiuser;
          registropubli.nomtitulo = publinom;
          registropubli.nomplataforma = publipla;
          registropubli.nomvideojuego = publivideo;
          registropubli.descripcion = publidescrip;
          registropubli.comentario = this.register1.comentario;
          this.registropublicacionesService.postRegistroComentarios(registropubli)
          .subscribe(newpres => {});
          alert('Se agrego el comentario con exito');
          setTimeout(() => {
            this.obtenerimagenes.getComentarios()
            .subscribe(comentarios => {
              let contador: number = 0;
              for (const i in this.respuestas5) {
                contador = contador + 1;
              }
              let i = contador - 1;
              const usu = publiuser;
              const titu = publinom;
              const plata = publipla;
              const videoju = publivideo;
              const descrip = publidescrip;
              const todoscomentarios: string[] = [];
              const comentadores: string[] = [];
              const todoscomenta: string[] = [];
              this.todoscomenta1 = [];
              this.comentadores1 = [];
              Object.keys(comentarios).forEach(function(key) {
                if (comentarios[key].usuario === usu && comentarios[key].nomtitulo === titu ) {
                  if (comentarios[key].nomplataforma === plata && comentarios[key].nomvideojuego === videoju ) {
                    if (comentarios[key].descripcion === descrip ) {
                      todoscomenta[i] = comentadores[key];
                      comentadores[i] = comentarios[key].usuario2;
                      todoscomentarios[i] = comentarios[key].comentario;
                      i = i - 1;
                    }
                  }
                }
              });
              for (let i = comentadores.length - 1; i > -1; i--) {
                this.todoscomenta1[i] = todoscomenta[i];
                this.comentadores1[i] = comentadores[i];
                this.todoscomentarios1[i] = todoscomentarios[i];
              }
              this.register1.comentario = '';
            });
          }, 1000);
        }
    }
  ngOnInit() {
    this.register1 = {
      comentario: '',
      mensaje: ''
    };
  }
  cierro() {
    localStorage.removeItem('nombreUsuario');
    /*CERRANDO SESION */
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  }
  comentar(i, publiuser, publinom, publipla, publivideo, publidescrip) {
    let contador: number = 0;
    for (const i in this.respuestas5) {
      contador = contador + 1;
    }
    this.todoscomenta1 = [];
    this.comentadores1 = [];
    this.todoscomentarios1 = [];
    $( '#campo' + i).toggle();
    this.obtenerimagenes.getComentarios()
    .subscribe(comentarios => {
      let i = contador - 1;
      const usu = publiuser;
      const titu = publinom;
      const plata = publipla;
      const videoju = publivideo;
      const descrip = publidescrip;
      const todoscomentarios: string[] = [];
      const comentadores: string[] = [];
      const todoscomenta: string[] = [];
      this.todoscomenta1 = [];
      this.comentadores1 = [];
      Object.keys(comentarios).forEach(function(key) {
        if (comentarios[key].usuario === usu && comentarios[key].nomtitulo === titu ) {
          if (comentarios[key].nomplataforma === plata && comentarios[key].nomvideojuego === videoju ) {
            if (comentarios[key].descripcion === descrip ) {
              todoscomenta[i] = comentadores[key];
              comentadores[i] = comentarios[key].usuario2;
              todoscomentarios[i] = comentarios[key].comentario;
              i = i - 1;
            }
          }
        }
      });
      for (let i = comentadores.length - 1; i > -1; i--) {
        this.todoscomenta1[i] = todoscomenta[i];
        this.comentadores1[i] = comentadores[i];
        this.todoscomentarios1[i] = todoscomentarios[i];
        if (this.todoscomenta1[i] != null || this.todoscomenta1[i] !== 'undefined') {
          this.existenciaComen1 = true;
        }
      }
    });
  }
  enviar() {
    this.existencianotifi = false;

    this.actualizar();

    for (const i in this.respuestas3) {
      if (this.respuestas3[i].usuario1 === this.nombreusuario && this.respuestas3[i].usuario2 === this.nombresuusuario && this.respuestas3[i].motivo === ' Te envio una solicitud de amistad') {
        this.existencianotifi = true;
        setTimeout(() => {
          this.notifiaciones.getNotifiaciones()
          .subscribe(respuestas => {
            for ( const i in respuestas ) {
             this.respuestas3[i] = respuestas[i];
            }
            });
        }, 2000);
      }
    }
    if (this.existencianotifi === true) {
      setTimeout(() => {
        alert('Ya tiene una solicitud de tu parte');

        this.notifiaciones.getNotifiaciones()
        .subscribe(respuestas => {
          for ( const i in respuestas ) {
           this.respuestas3[i] = respuestas[i];
          }
          });
          this.respuestas3 = [];
      }, 1000);

    } else {
      const registro = new Notificaciones();
      registro.usuario1 = this.nombreusuario;
        registro.usuario2 = this.nombresuusuario;
        registro.motivo = ' Te envio una solicitud de amistad';
        registro.estado = 'false';
        this.notifiaciones.postRegistroNormal(registro)
          .subscribe(newpres => {});
          setTimeout(() => {
            alert('Solicitud enviada a  ' + this.nombresuusuario);
            this.respuestas3 = [];
            this.notifiaciones.getNotifiaciones()
            .subscribe(respuestas => {
              for ( const i in respuestas ) {
               this.respuestas3[i] = respuestas[i];
              }
              });
          }, 1000);
        }
  }
  actualizar() {
          this.notifiaciones.getNotifiaciones()
          .subscribe(respuestas => {
            for ( const i in respuestas ) {
             this.respuestas3[i] = respuestas[i];
            }
            });
  }
  Enviarmensaje2() {
    if (this.register1.mensaje === '') {
      alert('Falta agregar el mensaje');
       } else {
        const registro = new Notificaciones();
           registro.usuario1 = this.nombreusuario;
          registro.usuario2 = this.nombresuusuario;
          registro.motivo = ' Te envio un mensaje';
          registro.estado = 'false';
          registro.mensaje = this.register1.mensaje;
          this.notifiaciones.postRegistroNormal(registro)
            .subscribe(newpres => {});
        alert('Se envio el mensaje con exito');
        this.register1.mensaje = '';
    }
  }
}
