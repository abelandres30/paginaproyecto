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




const httpOptions = {
  headers: new HttpHeaders({'content-type': 'application/json'})
};

class Usuarioperfil {
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
  existencia: boolean = false;
  usuario = this.cookie.get('nombre');

  constructor(
    private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,

     private registropublicacionesService: RegistroPublicacionService,
    private obtenerpublicacionService: ObtenerPublicacionService) {
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
      this.obtenerpublicacionService.getRespuestas()
      .subscribe(publicaciones => {
        for ( const i in publicaciones ) {
         this.publicaciones[i] = publicaciones[i];
        }
        });
        const descripcion: string[] = [];
        const plataforma: string[] = [];
        for (const i in this.publicaciones) {
          descripcion[i] = this.publicaciones[i].descripcion;
        }
    }

  onSubmit() {
    const nombredelAlbum: string = $('#nombreAlbum').val();

    if ((this.register.descripcion === '') || (this.register.plataforma === '' ) || (this.register.videojuego === '')) {
       alert('faltan agregar datos para la publicacion');
    } else {
        const registro = new Usuarioperfil();
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
  uploadFile(event) {

    const nombredelAlbum: string = $('#nombreAlbum').val();
    alert(nombredelAlbum);

      let idAlbumOriginal = 0;
      alert(idAlbumOriginal + '  aqui si es cero porque asi lo pongo' );

      this.obtenerpublicacionService.getImagenes()
      .subscribe(imagenes => {
      Object.keys(imagenes).forEach(function(key) {
          let flag: boolean = false;

          let publicacionNom, idalbum: string;
          [publicacionNom, idalbum] = key.split(',');
          alert(publicacionNom + '   nombre');
           alert(idalbum + '    id');
       if (nombredelAlbum === publicacionNom) {
             alert('si jala');
             if (Number(idAlbumOriginal) < Number(idalbum)) {
             idAlbumOriginal = Number(idalbum);
             alert (idAlbumOriginal + '   aqui deberia ser el ultimo que toma');
             flag = true;
       } else if (flag === false) {
             idAlbumOriginal = 0;
             alert(idAlbumOriginal + '  aqui el flag es falso');
        }
      }
    }
  );
      idAlbumOriginal = idAlbumOriginal + 1;
      this.idAlbumOriginalGlobal = String(idAlbumOriginal);

      alert(idAlbumOriginal);
  });


      alert(idAlbumOriginal + ' aqui ya no deberia de ser 0');

      for (let i = 0; i < 5; i++) {
        const file = event.target.files[0];
        alert(idAlbumOriginal + '   aqui menos deberia de ser 0');
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
