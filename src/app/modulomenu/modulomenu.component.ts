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
  notificacionUser1: string [] = [];
  notificacionUser2: string [] = [];
  notificacionMotivo: string [] = [];

  // aqui son otros valores
  existencia: boolean = false;
  existenciaNoti: boolean = false;

  usuario = this.cookie.get('nombre');
  respuestas: any [] = [];
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
    };
  }


  constructor(
    private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,
     private respuestasService: RespuestasService,
     private registropublicacionesService: RegistroPublicacionService,
     private obtenernotifiaciones: NotificacionesService,
    private obtenerpublicacionService: ObtenerPublicacionService) {
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
            notificacionUser1[i] = notificaciones[key];
            notificacionUser2[i] = notificaciones[key].usuario1;
            notificacionMotivo[i] = notificaciones[key].motivo;
            i = i + 1;
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
        Object.keys(imagenes).forEach(function(key) {
          portadasImagenes[i] = imagenes[key].URL;
          portadasNomAlbum[i] = imagenes[key].titulo;
          portadasIdAlbum[i] = imagenes[key].ID;
          i = i + 1;
        });
        for (let i = 0; i < portadasImagenes.length; i++) {
          this.portadasImagenes[i] = portadasImagenes[i];
          this.portadasNomAlbum[i] = portadasNomAlbum[i];
          this.portadasIdAlbum[i] = portadasIdAlbum[i];
          if (this.portadasImagenes[i] != null || this.portadasImagenes[i] !== 'undefined') {
            this.existencia = true;
          }
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
              this.publicacionUser[i] = publicacionUser[i];
              this.publicacionDescrip[i] = publicacionDescrip[i];
              this.publicacionPlataforma[i] = publicacionPlataforma[i];
              this.publicacionVideojuego[i] = publicacionVideojuego[i];
            }
        });
    }

    comentar() {
      if (this.comentacion === false ) {
        this.comentacion = true;
      } else {
        this.comentacion = false;
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
        location.reload();
    }
  }
  cierro() {
    localStorage.removeItem('nombreUsuario');
  }
  informacion() {
    this.videojuegos = [];
    for (const i in this.respuestas) {
      if ( this.respuestas[i].usuario === this.nombreusuario) {

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
  activador:boolean = true;
  uploadFile(event) {
    this.activador = false;


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
            this.registropublicacionesService.postRegistroImagenes(registro1)
            .subscribe(newpres => {});
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Exito', detail:'Se subio correctamente la imagen'});
            this.activador = true;

          });
        }, 2000);
      }
    });
  }
}
