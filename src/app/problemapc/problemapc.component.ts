import { Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-problemapc',
  templateUrl: './problemapc.component.html',
  styleUrls: ['./problemapc.component.css']
})
export class ProblemapcComponent implements OnInit {
  respuestas: any [] = [];
  respuestas2: any [] = [];
  respuestas5: any [] = [];

  register;

  nombreusuario;
  plataformasps: string;
  plataformaxbox: string;
  plataformapc: string;
  plataformawii: string;
  plataformaswitch: string;
  sinplataforma:String = 'sin plataformas';
  videojuegos: string[] = [];
  imagenperfil;
    // las siguientes variables son para jalar las imagenes del storage de firebase
    portadasImagenes: string [] = [];
    portadasNomAlbum: string [] = [];
    portadasIdAlbum: string [] = [];
    todaspublicaciones: string [] = [];
    publicacionUser: string[] = [];
    publicacionDescrip: string[] = [];
    publicacionPlataforma: string[] = [];
    publicacionVideojuego: string[] = [];
    publicacionTipo: string[] = [];
    // otras variables 
    todoscomentarios: string[] = [];
    comentadores: string[] = [];
    todoscomenta: string[] = [];
    // aqui son otros valores
    existencia: boolean = false;
    sivideo: boolean[] = [];
    siimagen: boolean[] = [];
    sinada: boolean[] = [];
    existenciaNoti: boolean = false;
    existenciaComen: boolean = false;

  constructor(
    private router: Router,
    private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,
    private registropublicacionesService: RegistroPublicacionService,
     private respuestasService: RespuestasService,
     private obtenerimagenes: ObtenerPublicacionService,
     private obtenernotifiaciones: NotificacionesService,
     private obtenerpublicacionService: ObtenerPublicacionService ) {
       
      // aqui es para obtener al usuario que se ingreso
      this.nombreusuario =  localStorage.getItem('nombreUsuario');


      // aqui es para obtener la informacion del usuario
      this.respuestasService.getRespuestas()
      .subscribe(respuestas => {
        for ( const i in respuestas ) {
         this.respuestas[i] = respuestas[i];
        }
        });
          this.obtenerpublicacionService.getpubliguardado()
          .subscribe(respuestas => {
            for (const i in respuestas) {
              this.respuestas2[i] = respuestas[i];
            }
          });
          this.obtenerpublicacionService.getComentarios()
          .subscribe(respuestas => {
            for (const i in respuestas) {
              this.respuestas5[i] = respuestas[i];
            }
          });
          // aqui es para obtener las publicaciones guardadas
          this.obtenerpublicacionService.getpubliguardado()
          .subscribe(guardado => {
            let numerototal: number = 0;
            for (const o in this.respuestas2) {

              numerototal = numerototal + 1;
            }
            let i = numerototal - 1;
            const users = this.nombreusuario;
            const portadasImagenes: string [] = [];
            const portadasNomAlbum: string [] = [];
            const publicacionTipo: string [] = [];
            const todaspublicaciones: string[] = [];
            const publicacionUser: string[] = [];
            const publicacionDescrip: string[] = [];
            const  publicacionPlataforma: string[] = [];
            const publicacionVideojuego: string[] = [];
            Object.keys(guardado).forEach(function(key) {

            if (users === guardado[key].usuario1) {

              todaspublicaciones[i] = guardado[key];
              publicacionTipo[i] = guardado[key].publitipo;
              portadasImagenes[i] = guardado[key].publiarchivo;
              portadasNomAlbum[i] = guardado[key].publititulo;
              publicacionUser[i] = guardado[key].publiusuario2;
              publicacionDescrip[i] = guardado[key].publidescripcion;
              publicacionPlataforma[i] = guardado[key].publiplataforma;
              publicacionVideojuego[i] = guardado[key].publivideojuego;
              i = i - 1;
            }
        });
        for (let i = portadasImagenes.length - 1; i > -1; i--) {

          if (publicacionTipo[i] === 'jpg' || publicacionTipo[i] === 'JPG' || publicacionTipo[i] === 'png' || publicacionTipo[i] === 'PNG'  ) {

            this.siimagen[i] = true;
            this.sivideo[i] = false;
            this.sinada[i] = false;
          } else if (publicacionTipo[i] === 'mp4' || publicacionTipo[i] === 'MP4' || publicacionTipo[i] === 'mkv' || publicacionTipo[i] === 'MKV'  ) {

            this.sivideo[i] = true;
            this.siimagen[i] = false;
            this.sinada[i] = false;
          } else if (publicacionTipo[i] === '' ) {

            this.sivideo[i] = false;
            this.siimagen[i] = false;
            this.sinada[i] = true;
          }

          this.portadasImagenes[i] = portadasImagenes[i];
          this.portadasNomAlbum[i] = portadasNomAlbum[i];
          this.todaspublicaciones[i] = todaspublicaciones[i];
          this.publicacionUser[i] = publicacionUser[i];
          this.publicacionDescrip[i] = publicacionDescrip[i];
          this.publicacionPlataforma[i] = publicacionPlataforma[i];
          this.publicacionVideojuego[i] = publicacionVideojuego[i];
          if (this.portadasImagenes[i] != null || this.portadasImagenes[i] !== 'undefined') {
            this.existencia = true;
             }
            }
          });
   }

  ngOnInit() {
    this.register = {
      comentario: '',
    
    };
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
  comentar(i, publiuser, publinom, publipla, publivideo, publidescrip) {
    let contador: number = 0;
    for (const i in this.respuestas5) {
      contador = contador + 1;
    }
    this.todoscomenta = [];
    this.comentadores = [];
    this.todoscomentarios = [];
      $( '#campo' + i).toggle();

      this.obtenerpublicacionService.getComentarios()
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
          this.todoscomenta[i] = todoscomenta[i];
          this.comentadores[i] = comentadores[i];
          this.todoscomentarios[i] = todoscomentarios[i];
          if (this.todoscomenta[i] != null || this.todoscomenta[i] !== 'undefined') {
            this.existenciaComen = true;
          }
        }
      });
  }
  expandirpubli(i) {
    $( '#desexpandido' + i).toggle();
    $( '#opciones2' + i).toggle();
    $( '#expandido' + i).toggle();

  } 
  desexpandirpubli(i) {
    $( '#opciones2' + i).toggle();
    $( '#expandido' + i).toggle();
    $( '#desexpandido' + i).toggle();

  }
  nombrestorage(usuario) {
    if (this.nombreusuario === usuario) {
      this.router.navigate(['moduloxbox']);

    } else {
      localStorage.removeItem('suusuario');
      localStorage.setItem('suusuario', usuario);
    }
  

  }
  enviarComentario(i, publiuser, publinom, publipla, publivideo, publidescrip) {
    
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
        this.obtenerpublicacionService.getComentarios()
        .subscribe(comentarios => {
          let contador: number = 0;
          for (const i in this.respuestas5) {
            contador = contador + 1;
          }
          let i = contador  - 1;
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
                  i = i - 1;
                }
              }
            }
          });
          for (let i = comentadores.length - 1; i > -1; i--) {
            this.todoscomenta[i] = todoscomenta[i];
            this.comentadores[i] = comentadores[i];
            this.todoscomentarios[i] = todoscomentarios[i];
          }
          this.register.comentario = '';
        });
      }, 1000);
    }
  }
  editarpublicacion(i, publiuser, publinom, publipla, publivideo, publidescrip, tipo) {
    this.obtenerpublicacionService.getpubliguardado()
    .subscribe(respuestas1 => {
      const users = this.nombreusuario;
      let llave: string;
      const publiuser1 = publiuser;
      const publinom1 = publinom;
      const publipla1 = publipla;
      const publivideo1 = publivideo;
      const publidescrip1 = publidescrip;
      const tipo1 = tipo;
      Object.keys(respuestas1).forEach(function(key) {
        if ((respuestas1[key].usuario1 === users) && (respuestas1[key].publiusuario2 === publiuser1)) {
          if (respuestas1[key].publiarchivo === tipo1 && respuestas1[key].publidescripcion === publidescrip1) {
            if (respuestas1[key].publiplataforma === publipla1 && respuestas1[key].publititulo === publinom1 ) {
              if (respuestas1[key].publivideojuego === publivideo1) {
                llave = key;
              }
            }
          }
        }
     
     
      });
      this.obtenerpublicacionService.depublicacionesguardadas(llave).subscribe(res => {
        console.log(res);
      });
      alert('Se quito de la lista de guardados con exito');
      this.portadasImagenes = [];
      this.portadasNomAlbum = [];
      this.publicacionTipo = [];
      this.publicacionUser = [];
      this.publicacionDescrip = [];
      this.publicacionPlataforma = [];
      this.publicacionVideojuego = [];
      this.respuestas2 = [];
      this.todaspublicaciones = [];
      this.siimagen = [];
      this.sinada = [];
      this.sivideo = [];
      setTimeout(() => {
        this.obtenerpublicacionService.getpubliguardado()
        .subscribe(respuestas => {
          for (const i in respuestas) {
            this.respuestas2[i] = respuestas[i];
          }
        });
      }, 1000);
        // aqui es para obtener las publicaciones guardadas
       this.obtenerpublicacionService.getpubliguardado()
       .subscribe(guardado => {
         let numerototal: number = 0;
         for (const o in this.respuestas2) {

           numerototal = numerototal + 1;
         }
         let i = numerototal - 1;
         const portadasImagenes: string [] = [];
         const portadasNomAlbum: string [] = [];
         const publicacionTipo: string [] = [];
         const todaspublicaciones: string[] = [];
         const publicacionUser: string[] = [];
         const publicacionDescrip: string[] = [];
         const  publicacionPlataforma: string[] = [];
         const publicacionVideojuego: string[] = [];
         Object.keys(guardado).forEach(function(key) {

         if (users === guardado[key].usuario1) {

           todaspublicaciones[i] = guardado[key];
           publicacionTipo[i] = guardado[key].publitipo;
           portadasImagenes[i] = guardado[key].publiarchivo;
           portadasNomAlbum[i] = guardado[key].publititulo;
           publicacionUser[i] = guardado[key].publiusuario2;
           publicacionDescrip[i] = guardado[key].publidescripcion;
           publicacionPlataforma[i] = guardado[key].publiplataforma;
           publicacionVideojuego[i] = guardado[key].publivideojuego;
           i = i - 1;
         }
     });
     for (let i = portadasImagenes.length - 1; i > -1; i--) {

       if (publicacionTipo[i] === 'jpg' || publicacionTipo[i] === 'JPG' || publicacionTipo[i] === 'png' || publicacionTipo[i] === 'PNG'  ) {

         this.siimagen[i] = true;
         this.sivideo[i] = false;
         this.sinada[i] = false;
       } else if (publicacionTipo[i] === 'mp4' || publicacionTipo[i] === 'MP4' || publicacionTipo[i] === 'mkv' || publicacionTipo[i] === 'MKV'  ) {

         this.sivideo[i] = true;
         this.siimagen[i] = false;
         this.sinada[i] = false;
       } else if (publicacionTipo[i] === '' ) {

         this.sivideo[i] = false;
         this.siimagen[i] = false;
         this.sinada[i] = true;
       }

       this.portadasImagenes[i] = portadasImagenes[i];
       this.portadasNomAlbum[i] = portadasNomAlbum[i];
       this.todaspublicaciones[i] = todaspublicaciones[i];
       this.publicacionUser[i] = publicacionUser[i];
       this.publicacionDescrip[i] = publicacionDescrip[i];
       this.publicacionPlataforma[i] = publicacionPlataforma[i];
       this.publicacionVideojuego[i] = publicacionVideojuego[i];
       if (this.portadasImagenes[i] != null || this.portadasImagenes[i] !== 'undefined') {
         this.existencia = true;
          }
         }
       });
    });
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
  }

