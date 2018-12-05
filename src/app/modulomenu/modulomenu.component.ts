import { Component, OnInit} from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import $ from 'jquery';
import { RegistroPublicacionService } from '../servicios/registropublicacion.service';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';
import { GlobalesService } from '../servicios/globales.service';
import { RespuestasService } from '../servicios/respuestas.service';
import { NotificacionesService } from '../servicios/notificaciones.service';
import {Message} from 'primeng/components/common/api';
import { RegistroamigosService } from '../servicios/registroamigos.service';
import { max } from 'rxjs/operators';

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
class Amigos {
  usuario;
  amigos;
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

@Component({
  selector: 'app-modulomenu',
  templateUrl: './modulomenu.component.html',
  styleUrls: ['./modulomenu.component.css']
})
export class ModulomenuComponent implements OnInit {
  msgs: Message[] = [];
  msgs3: Message[] = [];
  msgs4: Message[] = [];

  nombreusuario2;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  register;
  publicaciones: any[] = [];
  permiso: boolean = false;
  comentacion: boolean = false;
  idAlbumOriginalGlobal:string;
  title = 'app';
  boleanusuario: boolean = false;
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

  simensaje: boolean[] = [];
  sisolicitud: boolean[] = [];
  simensaje2: boolean[] = [];
  sisolicitud2: boolean[] = [];
  notificacionUser1: string [] = [];
  notificacionUser2: string [] = [];
  notificacionMotivo: string [] = [];
  notificacionMensaje: string[] = [];
  notificacionUser12: string [] = [];
  notificacionUser22: string [] = [];
  notificacionMotivo2: string [] = [];
  notificacionMensaje2: string[] = [];
  imagenperfil;
  imagenperfil2;

  todoscomentarios: string[] = [];
  comentadores: string[] = [];
  todoscomenta: string[] = [];
  // aqui son otros valores
  existencia: boolean = false;
  existenciaNoti: boolean = false;
  existenciaNoti2: boolean = false;

  existenciaComen: boolean = false;
  existenciausuariobuscador: boolean = false;
  sivideo: boolean[] = [];
  siimagen: boolean[] = [];
  sinada: boolean[] = [];
  usuario = this.cookie.get('nombre');
  respuestas: any [] = [];
  respuestas2: any [] = [];
  respuestas3: any [] = [];
  nombreusuario;
  plataformasps: string;
  plataformaxbox: string;
  plataformapc: string;
  plataformawii: string;
  plataformaswitch: string;
  sinplataforma:String = 'sin plataformas';
  sinvideojuegos:String = 'sin videojuegos';
  videojuegos: string[] = [];
  infousuario;
  plataformasps2: string;
  plataformaxbox2: string;
  plataformapc2: string;
  plataformawii2: string;
  plataformaswitch2: string;
  sinplataforma2:String = 'sin plataformas';
  sinvideojuegos2:String = 'sin videojuegos';
  videojuegos2: string[] = [];
  mensajerver;
  usuariover;
  existencianotifi: boolean;


  ngOnInit() {
    $(document).ready(function() {
      $('form input').change(function () {
        $('form p').text(this.files.length + ' file(s) selected');
      });
    });
    
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


  constructor(
    private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,
     private respuestasService: RespuestasService,
     private registropublicacionesService: RegistroPublicacionService,
     private obtenernotifiaciones: NotificacionesService,
    private obtenerpublicacionService: ObtenerPublicacionService,
    private registroamigos: RegistroamigosService) {
      // aqui obtengo el parametro del localstorage
      this.nombreusuario =  localStorage.getItem('nombreUsuario');
     

      // aqui es para obtener la informacion del usuario
        this.respuestasService.getRespuestas()
        .subscribe(respuestas => {
          for ( const i in respuestas ) {
          this.respuestas[i] = respuestas[i];
          }
          });
          this.obtenernotifiaciones.getNotifiaciones()
          .subscribe(respuestas => {
            for ( const i in respuestas ) {
             this.respuestas3[i] = respuestas[i];
            }
            });

          this.obtenerpublicacionService.getRespuestas()
          .subscribe(respuestas => {
            for ( const i in respuestas ) {
            this.respuestas2[i] = respuestas[i];
            }
            });
          






      // aqui es para obtener las imagenes del storage
      this.obtenerpublicacionService.getImagenes()
      .subscribe(imagenes =>  {
        let i = 0;
        const portadasImagenes: string [] = [];
        const portadasNomAlbum: string [] = [];
        const portadasIdAlbum: string [] = [];
        const publicacionTipo: string [] = [];
        Object.keys(imagenes).forEach(function(key) {
            portadasImagenes[i] = imagenes[key].URL;
            portadasNomAlbum[i] = imagenes[key].titulo;
            portadasIdAlbum[i] = imagenes[key].ID;
            publicacionTipo[i] = imagenes[key].tipo;
            i = i + 1;
          
        });
        for (let i = 0; i < portadasImagenes.length; i++) {
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
          this.portadasIdAlbum[i] = portadasIdAlbum[i];
        }
        });
      // aqui es para obtener las publicaciones
        this.obtenerpublicacionService.getRespuestas()
        .subscribe(publicaciones => {
          let i = 0;
          const todaspublicaciones: string[] = [];
           const publicacionUser: string[] = [];
           const publicacionDescrip: string[] = [];
           const  publicacionPlataforma: string[] = [];
            const publicacionVideojuego: string[] = [];
            const portadasNomAlbum: string [] = [];
            Object.keys(publicaciones).forEach(function(key) {
              // aqui se obtienen los registros
                todaspublicaciones[i] = publicaciones[key];
                publicacionUser[i] = publicaciones[key].usuario;
                portadasNomAlbum[i] = publicaciones[key].titulo;
                publicacionDescrip[i] = publicaciones[key].descripcion;
                publicacionPlataforma[i] = publicaciones[key].plataforma;
                publicacionVideojuego[i] = publicaciones[key].videojuego;
                i = i + 1;
            });
            for (let i = 0; i < todaspublicaciones.length; i++) {
              this.todaspublicaciones[i] = todaspublicaciones[i];
              this.publicacionUser[i] = publicacionUser[i];
              this.portadasNomAlbum[i] = portadasNomAlbum[i];
              this.publicacionDescrip[i] = publicacionDescrip[i];
              this.publicacionPlataforma[i] = publicacionPlataforma[i];
              this.publicacionVideojuego[i] = publicacionVideojuego[i];
               
              if (this.portadasImagenes[i] != null || this.portadasImagenes[i] !== 'undefined') {
                this.existencia = true;
              }
            }
        });
    }
    misnotifiaciones() {
      this.notificacionUser1 = [];
      this.notificacionUser2 = [];
      this.notificacionMotivo = [];
      this.notificacionMensaje = [];
      this.simensaje = [];
      this.sisolicitud = [];
      this.obtenernotifiaciones.getNotifiaciones()
      .subscribe(respuestas => {
        for ( const i in respuestas ) {
         this.respuestas3[i] = respuestas[i];
        }
        });

      // Aqui se obtienen las notificaciones
      this.obtenernotifiaciones.getNotifiaciones()
      .subscribe(notificaciones => {
        let i = 0;
        const notificacionUser1: string [] = [];
        const notificacionUser2: string [] = [];
        const notificacionMotivo: string [] = [];
        const notificacionMensaje: string [] = [];

        const users = this.nombreusuario;

        Object.keys(notificaciones).forEach(function(key) {
          if (users === notificaciones[key].usuario2) {
            if (notificaciones[key].estado === 'false') {
              notificacionUser1[i] = notificaciones[key];
              notificacionUser2[i] = notificaciones[key].usuario1;
              notificacionMotivo[i] = notificaciones[key].motivo;
              notificacionMensaje[i] = notificaciones[key].mensaje;
              i = i + 1;
            }
          }
        });
        for (let i = 0; i < notificacionUser1.length; i++) {
          if (notificacionMotivo[i] === ' Te envio una solicitud de amistad') {
            this.sisolicitud[i] = true;
            this.simensaje[i] = false;
          } else if (notificacionMotivo[i] === ' Te envio un mensaje') {
            this.sisolicitud[i] = false;
            this.simensaje[i] = true;
          }
          this.notificacionUser1[i] = notificacionUser1[i];
          this.notificacionUser2[i] = notificacionUser2[i];
          this.notificacionMotivo[i] = notificacionMotivo[i];
          this.notificacionMensaje[i] = notificacionMensaje[i];
          if (this.notificacionUser1[i] != null || this.notificacionUser1[i] !== 'undefined') {
            this.existenciaNoti = true;
          }
        }
      });
    }
    comentar(i, publiuser, publinom, publipla, publivideo, publidescrip) {
        $( '#campo' + i).toggle();

        this.obtenerpublicacionService.getComentarios()
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
    
    enviarComentario(i,publiuser, publinom, publipla, publivideo, publidescrip) {
    
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
            }
            this.register.comentario = '';
          });
        }, 1000);
      }
    }
    solicitudesenviadas() {
      this.obtenernotifiaciones.getNotifiaciones()
      .subscribe(respuestas => {
        for ( const i in respuestas ) {
         this.respuestas3[i] = respuestas[i];
        }
        });
        
      
    }
    EnviarMensaje() {
      this.nombreusuario2 = $('#buscador').val();
   
    }
  onSubmit() {
    const nombredelAlbum: string = $('#nombreAlbum').val();
    if ((this.register.descripcion === '') || (this.register.plataforma === '' ) || (this.register.videojuego === '')) {
       alert('faltan agregar datos para la publicacion');
    } else {
        if (this.register.archivo === '') {
          const registro1 = new Datospubli();
          registro1.usuario = this.nombreusuario;
          registro1.titulo = this.register.titulo;
          registro1.tipo = '';
          this.registropublicacionesService.postRegistroImagenes(registro1)
          .subscribe(newpres => {});


          const registro = new Usuarioperfil();
          registro.usuario = this.nombreusuario;
          registro.titulo = this.register.titulo;
          registro.descripcion = this.register.descripcion;
          registro.plataforma = this.register.plataforma;
          registro.videojuego = this.register.videojuego;
    
          this.registropublicacionesService.postRegistroNormal(registro)
          .subscribe(newpres => {});
          alert('Publicacion con exito');
          setTimeout(() => {
            location.reload();
  
          }, 1000);
        } else {
          const registro = new Usuarioperfil();
          registro.usuario = this.nombreusuario;
          registro.titulo = this.register.titulo;
          registro.descripcion = this.register.descripcion;
          registro.plataforma = this.register.plataforma;
          registro.videojuego = this.register.videojuego;
    
          this.registropublicacionesService.postRegistroNormal(registro)
          .subscribe(newpres => {});
          alert('Publicacion con exito');
          setTimeout(() => {
            location.reload();
  
          }, 1000);
        }
      
    }
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
 
  todasnotificaciones() {
    this.notificacionUser22 = [];
    this.notificacionUser12 = [];
    this.notificacionMotivo2 = [];
    this.notificacionMensaje2 = [];
    $( '#campotodas').toggle();
     // Aqui se obtienen las notificaciones 
     this.obtenernotifiaciones.getNotifiaciones()
     .subscribe(notificaciones => {
       let i = 0;
       const notificacionUser12: string [] = [];
       const notificacionUser22: string [] = [];
       const notificacionMotivo2: string [] = [];
       const notificacionMensaje2: string [] = [];

       const users = this.nombreusuario;

       Object.keys(notificaciones).forEach(function(key) {
         if (users === notificaciones[key].usuario2) {
           if (notificaciones[key].estado === 'true') {
             notificacionUser12[i] = notificaciones[key];
             notificacionUser22[i] = notificaciones[key].usuario1;
             notificacionMotivo2[i] = notificaciones[key].motivo;
             notificacionMensaje2[i] = notificaciones[key].mensaje;
             i = i + 1;
           }
         }
       });
       for (let i = 0; i < notificacionUser12.length; i++) {
         if (notificacionMotivo2[i] === ' Te envio una solicitud de amistad') {
           this.sisolicitud2[i] = true;
           this.simensaje2[i] = false;
         } else if (notificacionMotivo2[i] === ' Te envio un mensaje') {
           this.sisolicitud2[i] = false;
           this.simensaje2[i] = true;
         }
         this.notificacionUser12[i] = notificacionUser12[i];
         this.notificacionUser22[i] = notificacionUser22[i];
         this.notificacionMotivo2[i] = notificacionMotivo2[i];
         this.notificacionMensaje2[i] = notificacionMensaje2[i];
         if (this.notificacionUser12[i] != null || this.notificacionUser12[i] !== 'undefined') {
           this.existenciaNoti2 = true;
         }
       }
     });
  }
  Enviarmensaje2(usuario) {
    if (this.register.mensaje === '') {
      this.msgs4 = [];
      this.msgs4.push({severity:'error', detail:' Falta agregar el mensaje' });
       } else {
        const registro = new Notificaciones();
           registro.usuario1 = this.nombreusuario;
          registro.usuario2 = usuario;
          registro.motivo = ' Te envio un mensaje';
          registro.estado = 'false';
          registro.mensaje = this.register.mensaje;
          this.obtenernotifiaciones.postRegistroNormal(registro)
            .subscribe(newpres => {});



        this.msgs4 = [];
        this.msgs4.push({severity:'success', detail:' Se envio el mensaje con exito' });
        this.register.mensaje = '';
  }
}
  Enviarsolicitud() {
    this.obtenernotifiaciones.getNotifiaciones()
    .subscribe(respuestas => {
      for ( const i in respuestas ) {
       this.respuestas3[i] = respuestas[i];
      }
      });
      setTimeout(() => {
        const usuariobuscado: string = $('#buscador').val();
        for (const i in this.respuestas3) {
          if (this.respuestas3[i].usuario1 === this.nombreusuario && this.respuestas3[i].usuario2 === usuariobuscado && this.respuestas3[i].motivo === ' Te envio una solicitud de amistad') {
            this.msgs3 = [];
            this.msgs3.push({severity:'error', detail:' Ya tiene una solicitud de tu parte' });
            this.existencianotifi = true;
          }
        }
        if (this.existencianotifi === true) {
    
        } else {
          const registro = new Notificaciones();
          registro.usuario1 = this.nombreusuario;
            registro.usuario2 = usuariobuscado;
            registro.motivo = ' Te envio una solicitud de amistad';
            registro.estado = 'false';
            this.obtenernotifiaciones.postRegistroNormal(registro)
              .subscribe(newpres => {});
              this.msgs3 = [];
              this.msgs3.push({severity:'success', summary:'Solicitud enviada a', detail:usuariobuscado});
            
            } 
      }, 1000);
  
  }
  infobuscado() {
    this.boleanusuario = false;
    this.existenciausuariobuscador = true;
    this.infousuario = '';
    this.imagenperfil2 = '';
    this.videojuegos2 = [];
    const usuariobuscado: string = $('#buscador').val();
    this.plataformapc2 = '';
    this.plataformasps2 = '';
    this.plataformaswitch2 = '';
    this.plataformawii2 = '';
    this.plataformaxbox2 = '';
    if (usuariobuscado === '') {
      alert('No ingreso ningun usuario');
      this.existenciausuariobuscador = false;
    } else {

      for (const i in this.respuestas) {
        if ( this.respuestas[i].usuario === usuariobuscado) {
            this.boleanusuario = true;
            this.existenciausuariobuscador = false;
            this.imagenperfil2 = this.respuestas[i].imagen;
            this.infousuario = usuariobuscado;
          if (this.respuestas[i].plataforma.Playstation === 'true' ) {
            this.plataformasps2 = 'play station';
            this.sinplataforma2 = '';
          }
          if (this.respuestas[i].plataforma.xbox === 'true') {
            this.plataformaxbox2 = 'xbox';
            this.sinplataforma2 = '';
  
          }
          if (this.respuestas[i].plataforma.pc === 'true') {
            this.plataformapc2 = 'pc';
            this.sinplataforma2 = '';
  
          }
          if (this.respuestas[i].plataforma.NintendoWii === 'true') {
            this.plataformawii2 = 'Nintendo Wii';
            this.sinplataforma2 = '';
  
          }
          if (this.respuestas[i].plataforma.NintendoSwitch === 'true') {
            this.plataformaswitch2 = 'Nintendo Switch';
            this.sinplataforma2 = '';
  
          }
          if (this.respuestas[i].videojuego.black_ops_4 === 'true') {
            this.videojuegos2.push('\n Black ops 4 ');
            this.sinvideojuegos2 = '';
  
  
          }
          if (this.respuestas[i].videojuego.red_dead_redemption_2 === 'true') {
            this.videojuegos2.push('\n red dead redemption 2 ');
            this.sinvideojuegos2 = '';
  
  
          }if (this.respuestas[i].videojuego.fifa_19 === 'true') {
            this.videojuegos2.push('\n fifa 19 ');
            this.sinvideojuegos2 = '';

          }if (this.respuestas[i].videojuego.the_last_of_us === 'true') {
            this.videojuegos2.push('\n the last of us ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.god_of_war_3 === 'true') {
            this.videojuegos2.push('\n God of war 3 ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.ratchet_and_clank === 'true') {
            this.videojuegos2.push('\n Ratchet and clank ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.gears_of_war === 'true') {
            this.videojuegos2.push('\n Gears of war ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.left_for_dead === 'true') {
            this.videojuegos2.push('\n left for dead ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.forza === 'true') {
            this.videojuegos2.push('\n Forza ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.lol === 'true') {
            this.videojuegos2.push('\n Lol ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.fornite === 'true') {
            this.videojuegos2.push('\n Fornite ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.counter_strike === 'true') {
            this.videojuegos2.push('\n Counter strike ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.super_smahs_bros === 'true') {
            this.videojuegos2.push('\n Super smash bros ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.zelda === 'true') {
            this.videojuegos2.push('\n Zelda ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.mario_bros === 'true') {
            this.videojuegos2.push('\n Mario bros ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.pokemon_battle === 'true') {
            this.videojuegos2.push('\n Pokemon battle ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.mario_party === 'true') {
            this.videojuegos2.push('\n Mario party ');
            this.sinvideojuegos2 = '';
  
          }if (this.respuestas[i].videojuego.mario_galaxy === 'true') {
            this.videojuegos2.push('\n Mario galaxy ');
            this.sinvideojuegos2 = '';
  
          }
        }
      }
    }
    if (this.existenciausuariobuscador === true) {
      alert('El usuario ingresado no existe');
    }
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
          this.sinvideojuegos = '';


        }
        if (this.respuestas[i].videojuego.red_dead_redemption_2 === 'true') {
          this.videojuegos.push('\n red dead redemption 2 ');
          this.sinvideojuegos = '';


        }if (this.respuestas[i].videojuego.fifa_19 === 'true') {
          this.videojuegos.push('\n fifa 19 ');

        }if (this.respuestas[i].videojuego.the_last_of_us === 'true') {
          this.videojuegos.push('\n the last of us ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.god_of_war_3 === 'true') {
          this.videojuegos.push('\n God of war 3 ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.ratchet_and_clank === 'true') {
          this.videojuegos.push('\n Ratchet and clank ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.gears_of_war === 'true') {
          this.videojuegos.push('\n Gears of war ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.left_for_dead === 'true') {
          this.videojuegos.push('\n left for dead ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.forza === 'true') {
          this.videojuegos.push('\n Forza ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.lol === 'true') {
          this.videojuegos.push('\n Lol ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.fornite === 'true') {
          this.videojuegos.push('\n Fornite ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.counter_strike === 'true') {
          this.videojuegos.push('\n Counter strike ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.super_smahs_bros === 'true') {
          this.videojuegos.push('\n Super smash bros ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.zelda === 'true') {
          this.videojuegos.push('\n Zelda ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.mario_bros === 'true') {
          this.videojuegos.push('\n Mario bros ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.pokemon_battle === 'true') {
          this.videojuegos.push('\n Pokemon battle ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.mario_party === 'true') {
          this.videojuegos.push('\n Mario party ');
          this.sinvideojuegos = '';

        }if (this.respuestas[i].videojuego.mario_galaxy === 'true') {
          this.videojuegos.push('\n Mario galaxy ');
          this.sinvideojuegos = '';

        }
      }
    }
  }
  respondermensaje(amigo, mensaje) {
    
    if (this.register.respondido === '') {
      alert('No ha ingresado ningun mensaje a enviar');
    } else {
      // aqui se obtienen los datos antes de eliminarse
      this.obtenernotifiaciones.getNotifiaciones()
      .subscribe(notificacion => {
        const users = this.nombreusuario;
        const users2 = amigo;
         let Motivo;
         let Usuario1;
         let Usuario2;
         let mensaje2;
        Object.keys(notificacion).forEach(function(key) {
          if (notificacion[key].usuario1 === users2 && notificacion[key].usuario2 === users && notificacion[key].motivo === ' Te envio un mensaje' && notificacion[key].mensaje === mensaje ) {
           Usuario1 = notificacion[key].usuario1;
           Usuario2 = notificacion[key].usuario2;
           Motivo = notificacion[key].motivo;
            mensaje2 = notificacion[key].mensaje;
          }
        });
      // aqui se elimina ese registro
      let llave;

      Object.keys(notificacion).forEach(function(key) {
      if (notificacion[key].usuario1 === users2 && notificacion[key].usuario2 === users && notificacion[key].motivo === ' Te envio un mensaje' && notificacion[key].mensaje === mensaje) {
       llave = key;
      }
      });
      this.registroamigos.deNotificacion(llave).subscribe(res => {
        console.log(res);

      });
       const registro = new Notificaciones();

        registro.usuario1 = Usuario1;
        registro.usuario2 = Usuario2;
        registro.motivo = Motivo;
         registro.estado = 'true';
         registro.mensaje = mensaje2;
         this.obtenernotifiaciones.postRegistroNormal(registro)
         .subscribe(newpres => {});
        });
        const registro2 = new Notificaciones();

        registro2.usuario1 = this.nombreusuario;
        registro2.usuario2 = amigo;
        registro2.motivo = ' Te envio un mensaje';
         registro2.estado = 'false';
         registro2.mensaje = this.register.respondido;
         this.obtenernotifiaciones.postRegistroNormal(registro2)
         .subscribe(newpres => {});
          alert('Se envio con exito el mensaje');
          this.register.respondido = '';
          setTimeout(() => {
            this.misnotifiaciones();
            
          }, 1000);
      }
}
  Rechazar(amigo, motivo, mensaje) {
    if (motivo === ' Te envio una solicitud de amistad') {
      // aqui se obtienen los datos antes de eliminarse
      this.obtenernotifiaciones.getNotifiaciones()
      .subscribe(notificacion => {
        const users = this.nombreusuario;
        const users2 = amigo;
         let Motivo;
         let Usuario1;
         let Usuario2;

        Object.keys(notificacion).forEach(function(key) {
          if (notificacion[key].usuario1 === users2 && notificacion[key].usuario2 === users && notificacion[key].motivo === motivo ) {
           Usuario1 = notificacion[key].usuario1;
           Usuario2 = notificacion[key].usuario2;
           Motivo = notificacion[key].motivo;

          }
        });
      // aqui se elimina ese registro
      let llave;

      Object.keys(notificacion).forEach(function(key) {
      if (notificacion[key].usuario1 === users2 && notificacion[key].usuario2 === users && notificacion[key].motivo === motivo) {
       llave = key;
      }
      });
      this.registroamigos.deNotificacion(llave).subscribe(res => {
        console.log(res);

      });
       const registro = new Notificaciones();

        registro.usuario1 = Usuario1;
        registro.usuario2 = Usuario2;
        registro.motivo = Motivo;
         registro.estado = 'true';
         this.obtenernotifiaciones.postRegistroNormal(registro)
         .subscribe(newpres => {});
         setTimeout(() => {
          this.misnotifiaciones();
         }, 1000);
      });

    } else {
        // aqui se obtienen los datos antes de eliminarse
        this.obtenernotifiaciones.getNotifiaciones()
        .subscribe(notificacion => {
          const users = this.nombreusuario;
          const users2 = amigo;
           let Motivo;
           let Usuario1;
           let Usuario2;
          let mensaje2;
          Object.keys(notificacion).forEach(function(key) {
            if (notificacion[key].usuario1 === users2 && notificacion[key].usuario2 === users && notificacion[key].motivo === motivo && notificacion[key].mensaje === mensaje ) {
             Usuario1 = notificacion[key].usuario1;
             Usuario2 = notificacion[key].usuario2;
             Motivo = notificacion[key].motivo;
              mensaje2 = notificacion[key].mensaje;
            }
          });
        // aqui se elimina ese registro
        let llave;
  
        Object.keys(notificacion).forEach(function(key) {
        if (notificacion[key].usuario1 === users2 && notificacion[key].usuario2 === users && notificacion[key].motivo === motivo && notificacion[key].mensaje === mensaje) {
         llave = key;
        }
        });
        this.registroamigos.deNotificacion(llave).subscribe(res => {
          console.log(res);
  
        });
         const registro = new Notificaciones();
  
          registro.usuario1 = Usuario1;
          registro.usuario2 = Usuario2;
          registro.motivo = Motivo;
           registro.estado = 'true';
           registro.mensaje = mensaje2;
           this.obtenernotifiaciones.postRegistroNormal(registro)
           .subscribe(newpres => {});
           setTimeout(() => {
            this.misnotifiaciones();
          }, 1000);
        });
    }
  }

  expandirmenu() {
    $( '#desexpandir').toggle();
    $( '#expandir').toggle();
    $( '#Opciones').toggle();
    this.obtenernotifiaciones.getNotifiaciones()
    .subscribe(respuestas => {
      for ( const i in respuestas ) {
       this.respuestas3[i] = respuestas[i];
      }
      });
  }
  desexpandirmenu() {
    $( '#expandir').toggle();
    $( '#desexpandir').toggle();
    $( '#Opciones').toggle();

  }
  respondertumensaje() {
    $( '#campomensaje').toggle();
  }
  aceptaramigo(amigo, motivo, mensaje) {

    if (motivo === ' Te envio una solicitud de amistad') {
       // aqui se obtienen los datos antes de eliminarse
       this.obtenernotifiaciones.getNotifiaciones()
       .subscribe(notificacion => {
         const users = this.nombreusuario;
         const users2 = amigo;
          let Motivo;
          let Usuario1;
          let Usuario2;

         Object.keys(notificacion).forEach(function(key) {
           if (notificacion[key].usuario1 === users2 && notificacion[key].usuario2 === users && notificacion[key].motivo === motivo ) {
            Usuario1 = notificacion[key].usuario1;
            Usuario2 = notificacion[key].usuario2;
            Motivo = notificacion[key].motivo;

           }
         });
       // aqui se elimina ese registro
       let llave;

       Object.keys(notificacion).forEach(function(key) {
       if (notificacion[key].usuario1 === users2 && notificacion[key].usuario2 === users && notificacion[key].motivo === motivo) {
        llave = key;
       }
       });
       this.registroamigos.deNotificacion(llave).subscribe(res => {
         console.log(res);

       });
        const registro = new Notificaciones();

         registro.usuario1 = Usuario1;
         registro.usuario2 = Usuario2;
         registro.motivo = Motivo;
          registro.estado = 'true';
          this.obtenernotifiaciones.postRegistroNormal(registro)
          .subscribe(newpres => {});
       });

       const datos = new Amigos();
       datos.usuario = this.nombreusuario;
       datos.amigos = amigo ;
       this.registroamigos.postRegistroNormal(datos)
      .subscribe(newpres => {});
       alert('Se acepto con exito');
       setTimeout(() => {
        this.misnotifiaciones();
       }, 1000);
    } else {
      this.mensajerver = mensaje;
      this.usuariover = amigo;

    }
  }
  activador:boolean = true;
  uploadFile(event) {
    this.activador = false;
    const cadena = this.register.archivo;
    const cadena2 = cadena.charAt(cadena.length - 3);
    const cadena3 = cadena.charAt(cadena.length - 2);
    const cadena4 = cadena.charAt(cadena.length - 1);
    const finalcadena = cadena2 + cadena3 + cadena4;
    const nombredelAlbum: string = $('#nombreAlbum').val();
      let idAlbumOriginal = 0;
        this.obtenerpublicacionService.getImagenes()
        .subscribe(imagenes => {
        Object.keys(imagenes).forEach(function(key) {
            let flag: boolean = false;
  
            let nombreuser, publicacionNom, idalbum: string;
           nombreuser = imagenes[key].usuario;
           publicacionNom = imagenes[key].titulo;
           idalbum = imagenes[key].ID;
         if (nombredelAlbum === publicacionNom) {
               if (Number(idAlbumOriginal) < Number(idalbum)) {
               idAlbumOriginal = Number(idalbum);
               flag = true;
         } else if (flag === false) {
               idAlbumOriginal = 1;
          }
        }
      }
    );
        idAlbumOriginal = idAlbumOriginal + 1;
        this.idAlbumOriginalGlobal = String(idAlbumOriginal);
        for (let i = 0; i < 1; i++) {
          const file = event.target.files[0];
          const tamaño = event.target.files[0].size;


          if (tamaño < 500000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {
              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 7000);

          } else if (tamaño < 1000000 ) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {
              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 15000);
          } else if (tamaño > 1000000 && tamaño < 2000000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {

              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 30000);
          } else if (tamaño > 2000000 && tamaño < 3000000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {

              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 45000);
          } else if (tamaño > 3000000 && tamaño < 4000000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {

              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 60000);
          } else if (tamaño > 4000000 && tamaño < 5000000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {

              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 75000);
          } else if (tamaño > 5000000 && tamaño < 6000000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {

              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 90000);
          } else if (tamaño > 6000000 && tamaño < 7000000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {

              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 115000);
          } else if (tamaño > 7000000 && tamaño < 8000000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {

              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 140000);
          } else if (tamaño > 8000000 && tamaño < 9000000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {

              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 165000);
          } else if (tamaño > 9000000 && tamaño < 10000000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {

              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 190000);
          } else if (tamaño > 10000000 && tamaño < 15000000) {
            const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
            const task = this.storage.upload(filePath, file);
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
            setTimeout(() => {

              const fileRef = this.storage.ref(filePath);
  
              fileRef.getDownloadURL().subscribe(ref => {
                this.downloadURL = ref;
                // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
                ruta = ref;
                const registro1 = new Datospubli();
                registro1.usuario = this.nombreusuario;
                registro1.titulo = this.register.titulo;
                registro1.ID = idAlbumOriginal;
                registro1.URL = ruta;
                registro1.tipo = finalcadena;
                this.registropublicacionesService.postRegistroImagenes(registro1)
                .subscribe(newpres => {});
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
                this.activador = true;
              });
            }, 270000);
          } else if (tamaño > 15000000) {
            alert('No puede subir archivos mayores a 15 megas');
          }
        }
      });
  }
}
