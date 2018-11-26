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

class Notificaciones {
  usuario1;
  usuario2;
  motivo;
  estado;
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

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  register;
  publicaciones: any[] = [];
  permiso: boolean = false;
  comentacion: boolean = false;
  idAlbumOriginalGlobal:string;
  title = 'app';

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

  notificacionUser1: string [] = [];
  notificacionUser2: string [] = [];
  notificacionMotivo: string [] = [];
  imagenperfil;
   todoscomentarios: string[] = [];
   comentadores: string[] = [];
   todoscomenta: string[] = [];
  // aqui son otros valores
  existencia: boolean = false;
  existenciaNoti: boolean = false;
  existenciaComen: boolean = false;
  sivideo: boolean[] = [];
  siimagen: boolean[] = []; 
  usuario = this.cookie.get('nombre');
  respuestas: any [] = [];
  respuestas2: any [] = [];
  nombreusuario;
  plataformasps: string;
  plataformaxbox: string;
  plataformapc: string;
  plataformawii: string;
  plataformaswitch: string;
  sinplataforma:String = 'sin plataformas';
  sinvideojuegos:String = 'sin videojuegos';

  videojuegos: string[] = [];

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
      archivo: ''
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
          this.obtenerpublicacionService.getRespuestas()
          .subscribe(respuestas => {
            for ( const i in respuestas ) {
            this.respuestas2[i] = respuestas[i];
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
          } else if (publicacionTipo[i] === 'mp4' || publicacionTipo[i] === 'MP4') {
            this.sivideo[i] = true;
            this.siimagen[i] = false;
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

            Object.keys(publicaciones).forEach(function(key) {
              // aqui se obtienen los registros
                todaspublicaciones[i] = publicaciones[key];
                publicacionUser[i] = publicaciones[key].usuario;
                publicacionDescrip[i] = publicaciones[key].descripcion;
                publicacionPlataforma[i] = publicaciones[key].plataforma;
                publicacionVideojuego[i] = publicaciones[key].videojuego;
                i = i + 1;
            });
            for (let i = 0; i < todaspublicaciones.length; i++) {
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
  onSubmit() {
    const nombredelAlbum: string = $('#nombreAlbum').val();
    if ((this.register.descripcion === '') || (this.register.plataforma === '' ) || (this.register.videojuego === '')) {
       alert('faltan agregar datos para la publicacion');
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
  cierro() {
    localStorage.removeItem('nombreUsuario');
    /*CERRANDO SESION */
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
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
  aceptaramigo(amigo, motivo) {

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
           if (notificacion[key].usuario1 === users2 && notificacion[key].usuario2 === users) {
            Usuario1 = notificacion[key].usuario1;
            Usuario2 = notificacion[key].usuario2;
            Motivo = notificacion[key].motivo;

           }
         });
       // aqui se elimina ese registro
       let llave;

       Object.keys(notificacion).forEach(function(key) {
       if (notificacion[key].usuario1 === users2 && notificacion[key].usuario2 === users) {
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
        location.reload();

       }, 1000);
    } else {

    }
  }
  activador:boolean = true;
  uploadFile(event) {
   
    this.activador = false;
    alert(this.register.archivo);
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
          const filePath = String('publicaimagenes/' + this.nombreusuario + ','  + nombredelAlbum + ',' + idAlbumOriginal);
          const task = this.storage.upload(filePath, file);
          setTimeout(() => {
            let ruta: any;
            // observe percentage changes
             this.uploadPercent = task.percentageChanges();
            // get notified when the download URL is available
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
          }, 5000);
        }
      });
  }
}
