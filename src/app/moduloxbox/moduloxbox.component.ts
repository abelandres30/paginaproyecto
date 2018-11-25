import { Component, OnInit, Input} from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore} from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import $ from 'jquery';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';
import { GlobalesService } from '../servicios/globales.service';
import { RespuestasService } from '../servicios/respuestas.service';
import { NotificacionesService } from '../servicios/notificaciones.service';
import { RegistroPublicacionService } from '../servicios/registropublicacion.service';

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
  selector: 'app-moduloxbox',
  templateUrl: './moduloxbox.component.html',
  styleUrls: ['./moduloxbox.component.css']
})
export class ModuloxboxComponent implements OnInit {
  // aqui son las variables para obtener la informacion
  portadasImagenes: string [] = [];
  portadasNomAlbum: string [] = [];
  portadasIdAlbum: string [] = [];
  portadasNomuser: string[] = [];
  // variables de datos de la publicacion
  todaspublicaciones: string [] = [];
  publicacionUser: string[] = [];
  publicacionDescrip: string[] = [];
  publicacionPlataforma: string[] = [];
  publicacionVideojuego: string[] = [];
  notificacionUser1: string [] = [];
  notificacionUser2: string [] = [];
  notificacionMotivo: string [] = [];
  // aqui con otras variables que igual ocupo
  todoscomentarios: string[] = [];
  comentadores: string[] = [];
  todoscomenta: string[] = [];
 // aqui son otros valores
 existenciaComen: boolean = false;
  existencia: boolean = false;
  existenciaNoti: boolean = false;
  register;
  respuestas: any [] = [];
  nombreusuario;
  plataformasps: string;
  plataformaxbox: string;
  plataformapc: string;
  plataformawii: string;
  plataformaswitch: string;
  sinplataforma:String = 'sin plataformas';
videojuegos: string[] = [];
imagenperfil;
  constructor(private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,
    private registropublicacionesService: RegistroPublicacionService,
     private respuestasService: RespuestasService,
     private obtenerimagenes: ObtenerPublicacionService,
     private obtenernotifiaciones: NotificacionesService,

     ) {
        // aqui obtengo el parametro del localstorage
      this.nombreusuario =  localStorage.getItem('nombreUsuario');

      // aqui es para obtener la informacion del usuario
      this.respuestasService.getRespuestas()
      .subscribe(respuestas => {
        for ( const i in respuestas ) {
         this.respuestas[i] = respuestas[i];
        }
        });

        // Aqui se obtienen las notificaciones 
      this.obtenernotifiaciones.getNotifiaciones()
      .subscribe(notificaciones => {
        let i = 0;
        const notificacionUser1: string [] = [];
        const notificacionUser2: string [] = [];
        const notificacionMotivo: string [] = [];
        const users = this.nombreusuario;

        Object.keys(notificaciones).forEach(function(key) {
          if (users === notificaciones[key].usuario2) {
            if (notificaciones[key].estado === 'false') {
              notificacionUser1[i] = notificaciones[key];
              notificacionUser2[i] = notificaciones[key].usuario1;
              notificacionMotivo[i] = notificaciones[key].motivo;
              i = i + 1;
            }
         
          }
        });
        for (let i = 0; i < notificacionUser1.length; i++) {
          this.notificacionUser1[i] = notificacionUser1[i];
          this.notificacionUser2[i] = notificacionUser2[i];
          this.notificacionMotivo[i] = notificacionMotivo[i];
          if (this.notificacionUser1[i] != null || this.notificacionUser1[i] !== 'undefined') {
            this.existenciaNoti = true;
          }
        }
      });

        // Aqui es para obtener las imagenes bien
        this.obtenerimagenes.getImagenes()
        .subscribe(imagenes =>  {
          let i = 0;
          const users = this.nombreusuario;
          const portadasImagenes: string [] = [];
          const portadasNomAlbum: string [] = [];
          const portadasIdAlbum: string [] = [];
          const portadasNomuser: string [] = [];

          Object.keys(imagenes).forEach(function(key) {
            let nombreuser, albumNom, idAlbum: any;

            let url: any;
            // [nombreuser, albumNom, idAlbum] = key.split(',');
            // El url de la imagen de la portada

              if (imagenes[key].usuario === users) {
                portadasNomAlbum[i] = imagenes[key].titulo;
                portadasImagenes[i] = imagenes[key].URL;
                portadasNomuser[i] = imagenes[key].usuario;
                portadasIdAlbum[i] = imagenes[key].ID;
                i = i + 1;
              }
            
            
          });
          for (let i = 0; i < portadasImagenes.length; i++) {

            if (this.nombreusuario === portadasNomuser[i]) {
              this.portadasNomuser[i] = portadasNomuser[i];
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = portadasNomAlbum[i];
              this.portadasIdAlbum[i] = portadasIdAlbum[i];
            }
          
            if (this.portadasImagenes[i] != null || this.portadasImagenes[i] !== 'undefined') {
              this.existencia = true;
            }
          }
          });
          // aqui es para obtener las publicaciones
        this.obtenerimagenes.getRespuestas()
        .subscribe(publicaciones => {
          let i = 0;
          const users = this.nombreusuario;
          const todaspublicaciones: string[] = [];
           const publicacionUser: string[] = [];
           const publicacionDescrip: string[] = [];
           const  publicacionPlataforma: string[] = [];
            const publicacionVideojuego: string[] = [];
            Object.keys(publicaciones).forEach(function(key) {
              // aqui se obtienen los registros
              if (publicaciones[key].usuario === users) {
                todaspublicaciones[i] = publicaciones[key];
                publicacionUser[i] = publicaciones[key].usuario;
                publicacionDescrip[i] = publicaciones[key].descripcion;
                publicacionPlataforma[i] = publicaciones[key].plataforma;
                publicacionVideojuego[i] = publicaciones[key].videojuego;
                i = i + 1;
              }
              
            });
            for (let i = 0; i < todaspublicaciones.length; i++) {
              if (this.nombreusuario === publicacionUser[i]) {
                this.todaspublicaciones[i] = todaspublicaciones[i];
                this.publicacionUser[i] = publicacionUser[i];
                this.publicacionDescrip[i] = publicacionDescrip[i];
                this.publicacionPlataforma[i] = publicacionPlataforma[i];
                this.publicacionVideojuego[i] = publicacionVideojuego[i];
              }
            
            }
        });
     }
     enviarComentario(publiuser, publinom, publipla, publivideo, publidescrip) {
      if (this.register.comentario === ' ') {
        alert('No ha escrito el comentario');
      } else {
        const registropubli = new Comentario();
        registropubli.usuario2 = this.nombreusuario;
        registropubli.usuario = publiuser;
        registropubli.nomtitulo = publinom;
        registropubli.nomplataforma = publipla;
        registropubli.nomvideojuego = publivideo;
        registropubli.descripcion = publidescrip;
        registropubli.comentario = this.register.comentario;
        this.registropublicacionesService.postRegistroComentarios(registropubli)
        .subscribe(newpres => {});
        alert('Se agrego el comentario con exito');
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    }
  ngOnInit() {
    this.register = {
      comentario: ''
    };
  }
  comentar(i, publiuser, publinom, publipla, publivideo, publidescrip) {
    $( '#campo' + i).toggle();
    this.obtenerimagenes.getComentarios()
    .subscribe(comentarios => {
      let i = 0;
      const usu = publiuser;
      const titu = publinom;
      const plata = publipla;
      const videoju = publivideo;
      const descrip = publidescrip;
      const todoscomentarios: string[] = [];
      const comentadores: string[] = [];
      const todoscomenta: string[] = [];
      this.todoscomenta = [];
      this.comentadores = [];
      Object.keys(comentarios).forEach(function(key) {
        if (comentarios[key].usuario === usu && comentarios[key].nomtitulo === titu ) {
          if (comentarios[key].nomplataforma === plata && comentarios[key].nomvideojuego === videoju ) {
            if (comentarios[key].descripcion === descrip ) {
              todoscomenta[i] = comentadores[key];
              comentadores[i] = comentarios[key].usuario2;
              todoscomentarios[i] = comentarios[key].comentario;
              i = i + 1;
            }
          }
        }
      });
      for (let i = 0; i < comentadores.length; i++) {
        this.todoscomenta[i] = todoscomenta[i];
        this.comentadores[i] = comentadores[i];
        this.todoscomentarios[i] = todoscomentarios[i];
        if (this.todoscomenta[i] != null || this.todoscomenta[i] !== 'undefined') {
          this.existenciaComen = true;
        }
      }
    });
  }
  informacion() {

    this.videojuegos = [];
    for (const i in this.respuestas) {
      if ( this.respuestas[i].usuario === this.nombreusuario) {
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
          this.videojuegos.push('\n Black ops 4 ');

        }
        if (this.respuestas[i].videojuego.red_dead_redemption_2 === 'true') {
          this.videojuegos.push('\n red dead redemption 2 ');

        }if (this.respuestas[i].videojuego.fifa_19 === 'true') {
          this.videojuegos.push('\n fifa 19 ');

        }if (this.respuestas[i].videojuego.the_last_of_us === 'true') {
          this.videojuegos.push('\n the last of us ');

        }if (this.respuestas[i].videojuego.god_of_war_3 === 'true') {
          this.videojuegos.push('\n God of war 3 ');

        }if (this.respuestas[i].videojuego.ratchet_and_clank === 'true') {
          this.videojuegos.push('\n Ratchet and clank ');

        }if (this.respuestas[i].videojuego.gears_of_war === 'true') {
          this.videojuegos.push('\n Gears of war ');

        }if (this.respuestas[i].videojuego.left_for_dead === 'true') {
          this.videojuegos.push('\n left for dead ');

        }if (this.respuestas[i].videojuego.forza === 'true') {
          this.videojuegos.push('\n Forza ');

        }if (this.respuestas[i].videojuego.lol === 'true') {
          this.videojuegos.push('\n Lol ');

        }if (this.respuestas[i].videojuego.fornite === 'true') {
          this.videojuegos.push('\n Fornite ');

        }if (this.respuestas[i].videojuego.counter_strike === 'true') {
          this.videojuegos.push('\n Counter strike ');

        }if (this.respuestas[i].videojuego.super_smahs_bros === 'true') {
          this.videojuegos.push('\n Super smash bros ');

        }if (this.respuestas[i].videojuego.zelda === 'true') {
          this.videojuegos.push('\n Zelda ');

        }if (this.respuestas[i].videojuego.mario_bros === 'true') {
          this.videojuegos.push('\n Mario bros ');

        }if (this.respuestas[i].videojuego.pokemon_battle === 'true') {
          this.videojuegos.push('\n Pokemon battle ');

        }if (this.respuestas[i].videojuego.mario_party === 'true') {
          this.videojuegos.push('\n Mario party ');

        }if (this.respuestas[i].videojuego.mario_galaxy === 'true') {
          this.videojuegos.push('\n Mario galaxy ');

        }
      }
    }
  }
}
