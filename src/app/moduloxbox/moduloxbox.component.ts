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
import { url } from 'inspector';

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
class Usuarioperfil {
  usuario: string;
  descripcion: string ;
  plataforma: string;
  videojuego: string;
  titulo: string;
}
class Datospubli {
  usuario: string;
  titulo: string;
  ID: number;
  URL: string;
  tipo:string;
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
  publicacionTipo: string[] = [];

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
  sivideo: boolean[] = [];
  siimagen: boolean[] = []; 
  sinada: boolean[] = [];

 // aqui son otros valores
 existenciaComen: boolean = false;
  existencia: boolean = false;
  existenciaNoti: boolean = false;
  register;
  respuestas: any [] = [];
  respuestas2: any [] = [];
  respuestas5: any [] = [];

  nombreusuario;
  URL: string;
  tipo: string;
  id: number;
  plataformasps: string;
  plataformaxbox: string;
  plataformapc: string;
  plataformawii: string;
  plataformaswitch: string;
  sinplataforma:String = 'sin plataformas';
  videojuegos: string[] = [];
  imagenperfil;
  nomuser: string;
  nomtitulo: string;
  nomplataforma: string;
  nomvideojuego: string;
  nomdescrip: string;
  constructor(private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,
    private registropublicacionesService: RegistroPublicacionService,
     private respuestasService: RespuestasService,
     private obtenerimagenes: ObtenerPublicacionService,
     private obtenernotifiaciones: NotificacionesService,
     private obtenerpublicacionService: ObtenerPublicacionService,

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
        this.obtenerimagenes.getRespuestas()
        .subscribe(respuestas => {
          for ( const i in respuestas ) {
          this.respuestas2[i] = respuestas[i];
          }
          });
          this.obtenerpublicacionService.getComentarios()
          .subscribe(respuestas => {
            for (const i in respuestas) {
              this.respuestas5[i] = respuestas[i];
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
          const users = this.nombreusuario;

          let numerototal: number = 0;

          for (const o in this.respuestas2) {
            if (users === this.respuestas2[o].usuario) {
              numerototal = numerototal + 1;

            }
          }
          let i = numerototal - 1;
          const portadasImagenes: string [] = [];
          const portadasNomAlbum: string [] = [];
          const portadasIdAlbum: string [] = [];
          const portadasNomuser: string [] = [];
          const publicacionTipo: string [] = [];
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
                publicacionTipo[i] = imagenes[key].tipo;
                i = i - 1;
              } 
          });
          for (let i = portadasImagenes.length - 1; i > -1 ; i--) {

            if (this.nombreusuario === portadasNomuser[i]) {
              if (publicacionTipo[i] === 'jpg' || publicacionTipo[i] === 'JPG' || publicacionTipo[i] === 'png' || publicacionTipo[i] === 'PNG'  ) {
                this.siimagen[i] = true;
                this.sivideo[i] = false;
              } else if (publicacionTipo[i] === 'mp4' || publicacionTipo[i] === 'MP4') {
                this.sivideo[i] = true;
                this.siimagen[i] = false;
              } else if (publicacionTipo[i] === '' ) {
                this.sivideo[i] = false;
                this.siimagen[i] = false;
                this.sinada[i] = true;
              }
              this.portadasNomuser[i] = portadasNomuser[i];
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = portadasNomAlbum[i];
              this.portadasIdAlbum[i] = portadasIdAlbum[i];
              this.publicacionTipo[i] = publicacionTipo[i];
            }
            if (this.portadasImagenes[i] != null || this.portadasImagenes[i] !== 'undefined') {
              this.existencia = true;
            }
          }
          });
          // aqui es para obtener las publicaciones
        this.obtenerimagenes.getRespuestas()
        .subscribe(publicaciones => {
          let i = this.portadasNomuser.length  - 1;
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
                i = i - 1;
              }
            });
            for (let i = todaspublicaciones.length - 1; i > -1; i--) {
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
     proceso() {
      
        setTimeout(() => {
           // Aqui es para obtener las imagenes bien
        this.obtenerimagenes.getImagenes()
        .subscribe(imagenes =>  {
          const users = this.nombreusuario;

          let numerototal: number = 0;

          for (const o in this.respuestas2) {
            if (users === this.respuestas2[o].usuario) {
              numerototal = numerototal + 1;

            }
          }
          let i = numerototal - 1;
          const portadasImagenes: string [] = [];
          const portadasNomAlbum: string [] = [];
          const portadasIdAlbum: string [] = [];
          const portadasNomuser: string [] = [];
          const publicacionTipo: string [] = [];
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
                publicacionTipo[i] = imagenes[key].tipo;
                i = i - 1;
              } 
          });
          for (let i = portadasImagenes.length - 1; i > -1 ; i--) {

            if (this.nombreusuario === portadasNomuser[i]) {
              if (publicacionTipo[i] === 'jpg' || publicacionTipo[i] === 'JPG' || publicacionTipo[i] === 'png' || publicacionTipo[i] === 'PNG'  ) {
                this.siimagen[i] = true;
                this.sivideo[i] = false;
              } else if (publicacionTipo[i] === 'mp4' || publicacionTipo[i] === 'MP4') {
                this.sivideo[i] = true;
                this.siimagen[i] = false;
              } else if (publicacionTipo[i] === '' ) {
                this.sivideo[i] = false;
                this.siimagen[i] = false;
                this.sinada[i] = true;
              }
              this.portadasNomuser[i] = portadasNomuser[i];
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = portadasNomAlbum[i];
              this.portadasIdAlbum[i] = portadasIdAlbum[i];
              this.publicacionTipo[i] = publicacionTipo[i];
            }
            if (this.portadasImagenes[i] != null || this.portadasImagenes[i] !== 'undefined') {
              this.existencia = true;
            }
          }
          });
          // aqui es para obtener las publicaciones
        this.obtenerimagenes.getRespuestas()
        .subscribe(publicaciones => {
          let i = this.portadasNomuser.length  - 1;
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
                i = i - 1;
              }
            });
            for (let i = todaspublicaciones.length - 1; i > -1; i--) {
              if (this.nombreusuario === publicacionUser[i]) {
                this.todaspublicaciones[i] = todaspublicaciones[i];
                this.publicacionUser[i] = publicacionUser[i];
                this.publicacionDescrip[i] = publicacionDescrip[i];
                this.publicacionPlataforma[i] = publicacionPlataforma[i];
                this.publicacionVideojuego[i] = publicacionVideojuego[i];
              }
            }
        });

        }, 1000);
       
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
    Eliminar2publicacion(usuario, titulo, plataforma, videojuego, descripcion, URL, tipo , id) {
      let paso: boolean;
      let paso2: boolean;
      this.obtenerpublicacionService.getRespuestas()
      .subscribe(respuestas => {
        let llave: string;
        let paso3: boolean;
        Object.keys(respuestas).forEach(function(key) {
          if (respuestas[key].descripcion === descripcion && respuestas[key].plataforma === plataforma) {
            if (respuestas[key].titulo === titulo && respuestas[key].usuario === usuario) {
               if (respuestas[key].videojuego === videojuego) {
                llave = key;
                paso3 = true;
                
              } else {
                paso3 = false;
              }
            }
          }
        });
        if (paso3 === true) {
            paso = true;
        this.obtenerpublicacionService.depublicaciones(llave).subscribe(res => {
          console.log(res);
        });
        }
      
      });
      this.obtenerimagenes.getImagenes()
      .subscribe(respuestas => {
        let llave: string;
        Object.keys(respuestas).forEach(function(key){
          if (respuestas[key].tipo === '' && respuestas[key].titulo === titulo) {
            if (respuestas[key].usuario === usuario) {
              llave = key;
            }
          }
        });
        this.obtenerpublicacionService.deimagenes(llave).subscribe(res => {
          console.log(res);
        });
      });
      this.obtenerimagenes.getImagenes()
      .subscribe(respuestas => {
        let llave: string;
        let paso3: boolean;
        Object.keys(respuestas).forEach(function(key) {
          if (respuestas[key].ID === id && respuestas[key].URL === URL) {
            if (respuestas[key].tipo === tipo    && respuestas[key].titulo === titulo) {
              if (respuestas[key].usuario === usuario) {
                llave = key;
                paso3 = true;
              } else {
                paso3 = false;
              }
            }
          }
        });
        if ( paso3 === true) {
             paso2 = true;
        this.obtenerpublicacionService.deimagenes(llave).subscribe(res => {
          console.log(res);
          alert('Se elimino con exito la publicacion');
          
         
        });
        }
      });
      this.obtenerpublicacionService.getComentarios()
      .subscribe(respuestas2 => {

        const llave: string[] = [];
        let i = 0;
        Object.keys(respuestas2).forEach(function(key) {          
          if (respuestas2[key].descripcion === descripcion && respuestas2[key].nomplataforma === plataforma) {
            if (respuestas2[key].nomtitulo === titulo && respuestas2[key].nomvideojuego === videojuego) {

              if (respuestas2[key].usuario === usuario && usuario && respuestas2[key].usuario2 === usuario) {
                llave[i] = key;
                i = i + 1;
              }
            }
          }
        });
        for (let o = 0; o < llave.length; o++) {
          this.obtenerpublicacionService.decomentarios(llave[o]).subscribe(res2 => {
            console.log(res2);

          });
        }
        this.todaspublicaciones = [];
        this.publicacionVideojuego = [];
        this.publicacionDescrip = [];
        this.publicacionPlataforma = [];
        this.publicacionTipo = [];
        this.publicacionUser = [];
        this.portadasIdAlbum = [];
        this.portadasImagenes = [];
        this.portadasNomAlbum = [];
        this.portadasNomuser = [];
        this.proceso();

      });
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
            let i = contador - 1;
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
  ngOnInit() {
    this.register = {
      comentario: '',
      videojuego: '',
      plataforma: '',
      descripcion: '',
      titulo: '',
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

   
    this.todoscomenta = [];
    this.comentadores = [];
    this.todoscomentarios = [];
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
  editarpublicacion(titulo, plataforma, videojuego, descripcion, URL, tipo, id) {
    this.nomtitulo = '';
    this.nomplataforma = '';
    this.nomvideojuego = '';
    this.nomdescrip = '';
    this.URL = '';
    this.tipo = '';
    this.id = 1;
    this.nomtitulo = titulo;
    this.nomplataforma = plataforma;
    this.nomvideojuego = videojuego;
    this.nomdescrip = descripcion;
    this.URL = URL;
    this.tipo = tipo;
    this.id = id;
  } 
  habilitar() {
    $("input").removeAttr('disabled');
    $("textarea").removeAttr('disabled');
    $("select").removeAttr('disabled');

  }
  onSubmit() {
    if (this.register.titulo === '' && this.register.descripcion === '' && this.register.plataforma === '' && this.register.videojuego === '') {
      alert('faltan datos por agregar');
    } else {
      this.obtenerpublicacionService.getRespuestas()
      .subscribe(respuestas => {
        let llave;
        const titulo = this.nomtitulo;
        const descripcion = this.nomdescrip;
        const plataforma = this.nomplataforma;
        const videojuego = this.nomvideojuego;
        const usuario = this.nombreusuario;
        Object.keys(respuestas).forEach(function(key) {
          if (respuestas[key].descripcion ===  descripcion && respuestas[key].plataforma === plataforma) {
            if (respuestas[key].titulo === titulo && respuestas[key].usuario === usuario) {
               if (respuestas[key].videojuego === videojuego) {
                 llave = key;
               }
              }
            }
        });
        this.obtenerpublicacionService.depublicaciones(llave).subscribe(res2 => {
          console.log(res2);

        });
      });
      this.obtenerimagenes.getImagenes()
      .subscribe(respuestas => {
        let llave; 
        const usuario = this.nombreusuario;
        const tipo = this.tipo;
        const titulo = this.nomtitulo;
        const URL = this.URL;
        const id = this.id;
        Object.keys(respuestas).forEach(function(key) {
          if (respuestas[key].ID === id && respuestas[key].URL === URL) {
            if (respuestas[key].tipo === tipo    && respuestas[key].titulo === titulo) {
              if (respuestas[key].usuario === usuario) {
                llave = key;
              }
            }
          }
        });
        this.obtenerimagenes.deimagenes(llave).subscribe(res2 => {
          console.log(res2);

        });
      });
      this.obtenerimagenes.getImagenes()
      .subscribe(respuestas => {
        let llave; 
        const usuario = this.nombreusuario;
        const tipo = this.tipo;
        const titulo = this.nomtitulo;
        const URL = this.URL;
        const id = this.id;
        Object.keys(respuestas).forEach(function(key) {
      
            if (respuestas[key].tipo === ''    && respuestas[key].titulo === titulo) {
              if (respuestas[key].usuario === usuario) {
                llave = key;
              }
            }
          
        });
        this.obtenerimagenes.deimagenes(llave).subscribe(res2 => {
          console.log(res2);

        });
      });
      const registro = new Usuarioperfil();
      registro.usuario = this.nombreusuario;
      registro.titulo = this.register.titulo;
      registro.descripcion = this.register.descripcion;
      registro.plataforma = this.register.plataforma;
      registro.videojuego = this.register.videojuego;

      this.registropublicacionesService.postRegistroNormal(registro)
      .subscribe(newpres => {});
      if (this.URL === '') {
        const registro1 = new Datospubli();
        registro1.usuario = this.nombreusuario;
        registro1.titulo = this.register.titulo;
        registro1.tipo = '';
        this.registropublicacionesService.postRegistroImagenes(registro1)
        .subscribe(newpres => {});
      } else {
        const registro1 = new Datospubli();
        registro1.usuario = this.nombreusuario;
        registro1.titulo = this.register.titulo;
        registro1.ID = this.id;
        registro1.URL = this.URL;
        registro1.tipo = this.tipo;
        this.registropublicacionesService.postRegistroImagenes(registro1)
        .subscribe(newpres => {});      }
        alert('Se edito con exito');
        this.proceso();
    }
  }
}
