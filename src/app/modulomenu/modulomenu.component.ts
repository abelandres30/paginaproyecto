import { Component, OnInit, Input} from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore} from 'angularfire2/firestore'; 
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import $ from 'jquery';
import { RegistroPublicacionService } from '../servicios/registropublicacion.service';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';
import { GlobalesService } from '../servicios/globales.service';
import { RespuestasService } from '../servicios/respuestas.service';

const httpOptions = {
  headers: new HttpHeaders({'content-type': 'application/json'})
};

class Usuarioperfil {
  usuario: string;
  descripcion: string ;
  plataforma: string;
  videojuego: string;
  titulo: string;
  URL: String;
}

@Component({
  selector: 'app-modulomenu',
  templateUrl: './modulomenu.component.html',
  styleUrls: ['./modulomenu.component.css']
})
export class ModulomenuComponent implements OnInit {
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  register;
  publicaciones: any[] = [];
  permiso: boolean = false;
  idAlbumOriginalGlobal:string;
  title = 'app';

  // las siguientes variables son para jalar las imagenes del storage de firebase
  portadasImagenes: string [] = [];
  portadasNomAlbum: string [] = [];
  portadasIdAlbum: string [] = [];
  
  // aqui son otros valores
  existencia: boolean = false;
  usuario = this.cookie.get('nombre');
  respuestas: any [] = [];
  nombreusuario;
  plataformasps: string;
  plataformaxbox: string;
  plataformapc: string;
  plataformawii: string;
  plataformaswitch: string;
  sinplataforma:String = 'sin plataformas';
videojuegos: string[] = [];
  constructor(
    private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,
     private respuestasService: RespuestasService,
     private registropublicacionesService: RegistroPublicacionService,
    private obtenerpublicacionService: ObtenerPublicacionService) {
      // aqui obtengo el parametro del localstorage
      this.nombreusuario =  localStorage.getItem('nombreUsuario');

      // aqui es para obtener la informacion del usuario
      this.respuestasService.getRespuestas()
      .subscribe(respuestas => {
        for (const i in respuestas) {
          this.respuestas[i] = respuestas[i];
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
          let albumNom, idAlbum: any;
          let url: any;
          [albumNom, idAlbum] = key.split(',');
          // El url de la imagen de la portada
          portadasImagenes[i] = imagenes[key];
          portadasNomAlbum[i] = albumNom;
          portadasIdAlbum[i] = idAlbum;
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
        registro.URL = 'https://firebasestorage.googleapis.com/v0/b/proyectogamerface.appspot.com/o/publicaciones%2Fhhh?alt=media&token=51b5d45e-0acb-497a-8efe-449b9a706e91'
  
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

  uploadFile(event) {

    const nombredelAlbum: string = $('#nombreAlbum').val();

      let idAlbumOriginal = 0;

      this.obtenerpublicacionService.getImagenes()
      .subscribe(imagenes => {
      Object.keys(imagenes).forEach(function(key) {
          let flag: boolean = false;

          let publicacionNom, idalbum: string;
          [publicacionNom, idalbum] = key.split(',');
       if (nombredelAlbum === publicacionNom) {
             if (Number(idAlbumOriginal) < Number(idalbum)) {
             idAlbumOriginal = Number(idalbum);
             flag = true;
       } else if (flag === false) {
             idAlbumOriginal = 0;
        }
      }
    }
  );
      idAlbumOriginal = idAlbumOriginal + 1;
      this.idAlbumOriginalGlobal = String(idAlbumOriginal);

      

      for (let i = 0; i < 5; i++) {
        const file = event.target.files[0];
        const filePath = String('publicaimagenes/' + nombredelAlbum + ',' + idAlbumOriginal);
        const task = this.storage.upload(filePath, file);
        let ruta: any;
        // observe percentage changes
         this.uploadPercent = task.percentageChanges();
        // get notified when the download URL is available
        const fileRef = this.storage.ref(filePath);
        fileRef.getDownloadURL().subscribe(ref => {
          this.downloadURL = ref;
          // RUTA TIENE LA RUTA PARA ACCEDER AL ARCHIVO */
          ruta = ref;
          const nombre: String = nombredelAlbum + ',' + idAlbumOriginal;
          const rootRef = firebase.database().ref().child('imagenes').child(String(nombre)).set(ruta);
          this.registropublicacionesService.postRegistroImagenes(rootRef).subscribe(newpres=>{});
        });
      }
  });
}


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
}
