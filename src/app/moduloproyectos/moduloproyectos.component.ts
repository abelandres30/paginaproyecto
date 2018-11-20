import { Component, OnInit} from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import 'firebase/storage';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import $ from 'jquery';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';
import { GlobalesService } from '../servicios/globales.service';
import { ForoproblemasService } from '../servicios/foroproblemas.service';

class Usuarioperfil {
  usuario: string;
  idea: string;
  plataforma: string;
  descripcion: string ;

}
@Component({
  selector: 'app-moduloproyectos',
  templateUrl: './moduloproyectos.component.html',
  styleUrls: ['./moduloproyectos.component.css']
})
export class ModuloproyectosComponent implements OnInit {
  // todas las variables
  existencia: boolean = false;
  comentacion: boolean = false;
  nombreusuario;
  respuestas: any[] = [];
  register;
  // variables de la BD 
  problemas: string[] = [];
  problemasusuario: string [] = [];
  problemasvideojuego: string [] = [];
  problemasPlataforma: string [] = [];
  problemasDescripcion: string [] = [];

  constructor( private storage: AngularFireStorage,
    private cookie: CookieService,
    private registropro: ForoproblemasService ,
    ) {
      this.nombreusuario =  localStorage.getItem('nombreUsuario');

        // aqui obtendremos las publicaciones
        this.registropro.getProyectos()
        .subscribe(foroproblemas =>  {
          let i = 0;
          const problemas: string[] = [];
          const problemasusuario: string [] = [];
          const problemasvideojuego: string [] = [];
          const problemasPlataforma: string [] = [];
          const problemasDescripcion: string [] = [];
          Object.keys(foroproblemas).forEach(function(key) {
            // El url de la imagen de la portada
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          });
          for (let i = 0; i < problemas.length; i++) {

            this.problemas[i] = problemas[i];
            this.problemasusuario[i] = problemasusuario[i];
            this.problemasvideojuego[i] = problemasvideojuego[i];
            this.problemasPlataforma[i] = problemasPlataforma[i];
            this.problemasDescripcion[i] = problemasDescripcion[i];
            
            if (this.problemas[i] != null || this.problemas[i] !== 'undefined') {
              this.existencia = true;
            }
          }
          });
    }

  ngOnInit() {
    this.register = {
      idea: '',
      plataforma: '',
      descripcion: '',
    };
  }
  saberplataforma() {
     // aqui obtendremos las publicaciones
 this.registropro.getProyectos()
 .subscribe(foroproblemas =>  {

   let i = 0;
   const problemas: string[] = [];
   const users = this.nombreusuario;

   const problemasusuario: string [] = [];
   const problemasvideojuego: string [] = [];
   const nombreplata: string = $('#caja5').val();
   const nombrepublicacion: string = $('#caja6').val();
   const problemasPlataforma: string [] = [];
   const problemasDescripcion: string [] = [];
   this.problemasusuario = [];
    this.problemasPlataforma = [];
    this.problemasvideojuego = [];
    this.problemas = [];
    this.problemasDescripcion = [];
   Object.keys(foroproblemas).forEach(function(key) {
     // El url de la imagen de la portada
     if (nombrepublicacion === 'Todas las Publicaciones') {
       if ( nombreplata === 'Todas las plataformas') {
        problemas[i] = foroproblemas[key];
        problemasusuario[i] = foroproblemas[key].usuario;
        problemasvideojuego[i] = foroproblemas[key].idea;
        problemasPlataforma[i] = foroproblemas[key].plataforma;
        problemasDescripcion[i] = foroproblemas[key].descripcion;
        i = i + 1;
       } else if ( nombreplata === 'Play station') {
         if (foroproblemas[key].plataforma === 'Play station') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }

       } else if (nombreplata === 'Xbox') {
         if (foroproblemas[key].plataforma === 'Xbox') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
       } else if (nombreplata === 'Pc') {
         if (foroproblemas[key].plataforma === 'Pc') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
       } else if (nombreplata ===  'Nintendo Wii') {
         if (foroproblemas[key].plataforma === 'Nintendo Wii') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
       } else if (nombreplata === 'Nintendo Switch') {
         if (foroproblemas[key].plataforma === 'Nintendo Switch') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
       }
     } else if (nombrepublicacion === 'Mis publicaciones') {
      if ( nombreplata === 'Todas las plataformas') {
        if (foroproblemas[key].usuario === users) {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
        }
       } else if ( nombreplata === 'Play station') {
        if ( foroproblemas[key].plataforma === 'Play station') {
          if (foroproblemas[key].usuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          }
        }
       } else if (nombreplata === 'Xbox') {
        if ( foroproblemas[key].plataforma === 'Xbox') {
          if (foroproblemas[key].usuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          }
        }
       } else if (nombreplata === 'Pc') {
        if ( foroproblemas[key].plataforma === 'Pc') {
          if (foroproblemas[key].usuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          }
        }
        
       } else if (nombreplata ===  'Nintendo Wii') {
        if ( foroproblemas[key].plataforma === 'Nintendo Wii') {
          if (foroproblemas[key].usuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          }
        }
       } else if (nombreplata === 'Nintendo Switch') {
        if ( foroproblemas[key].plataforma === 'Nintendo Switch') {
          if (foroproblemas[key].usuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          }
       }
     }
    }
   });
   for (let i = 0; i < problemas.length; i++) {
         this.problemas[i] = problemas[i];
         this.problemasusuario[i] = problemasusuario[i];
        this.problemasvideojuego[i] = problemasvideojuego[i];
        this.problemasPlataforma[i] = problemasPlataforma[i];
        this.problemasDescripcion[i] = problemasDescripcion[i];
   }
   });

    }
    saberpublicacion() {
         // aqui obtendremos las publicaciones
 this.registropro.getProyectos()
 .subscribe(foroproblemas =>  {

   let i = 0;
   const problemas: string[] = [];
   const users = this.nombreusuario;

   const problemasusuario: string [] = [];
   const problemasvideojuego: string [] = [];
   const nombreplata: string = $('#caja5').val();
   const nombrepublicacion: string = $('#caja6').val();
   const problemasPlataforma: string [] = [];
   const problemasDescripcion: string [] = [];
   this.problemasusuario = [];
    this.problemasPlataforma = [];
    this.problemasvideojuego = [];
    this.problemas = [];
    this.problemasDescripcion = [];
   Object.keys(foroproblemas).forEach(function(key) {
     // El url de la imagen de la portada
     if (nombrepublicacion === 'Todas las Publicaciones') {
       if ( nombreplata === 'Todas las plataformas') {
        problemas[i] = foroproblemas[key];
        problemasusuario[i] = foroproblemas[key].usuario;
        problemasvideojuego[i] = foroproblemas[key].idea;
        problemasPlataforma[i] = foroproblemas[key].plataforma;
        problemasDescripcion[i] = foroproblemas[key].descripcion;
        i = i + 1;
       } else if ( nombreplata === 'Play station') {
         if (foroproblemas[key].plataforma === 'Play station') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }

       } else if (nombreplata === 'Xbox') {
         if (foroproblemas[key].plataforma === 'Xbox') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
       } else if (nombreplata === 'Pc') {
         if (foroproblemas[key].plataforma === 'Pc') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
       } else if (nombreplata ===  'Nintendo Wii') {
         if (foroproblemas[key].plataforma === 'Nintendo Wii') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
       } else if (nombreplata === 'Nintendo Switch') {
         if (foroproblemas[key].plataforma === 'Nintendo Switch') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
       }
     } else if (nombrepublicacion === 'Mis publicaciones') {
      if ( nombreplata === 'Todas las plataformas') {
        if (foroproblemas[key].usuario === users) {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
        }
       } else if ( nombreplata === 'Play station') {
        if ( foroproblemas[key].plataforma === 'Play station') {
          if (foroproblemas[key].usuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          }
        }
       } else if (nombreplata === 'Xbox') {
        if ( foroproblemas[key].plataforma === 'Xbox') {
          if (foroproblemas[key].usuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          }
        }
       } else if (nombreplata === 'Pc') {
        if ( foroproblemas[key].plataforma === 'Pc') {
          if (foroproblemas[key].usuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          }
        }
        
       } else if (nombreplata ===  'Nintendo Wii') {
        if ( foroproblemas[key].plataforma === 'Nintendo Wii') {
          if (foroproblemas[key].usuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          }
        }
       } else if (nombreplata === 'Nintendo Switch') {
        if ( foroproblemas[key].plataforma === 'Nintendo Switch') {
          if (foroproblemas[key].usuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
          }
       }
     }
    }
   });
   for (let i = 0; i < problemas.length; i++) {
         this.problemas[i] = problemas[i];
         this.problemasusuario[i] = problemasusuario[i];
        this.problemasvideojuego[i] = problemasvideojuego[i];
        this.problemasPlataforma[i] = problemasPlataforma[i];
        this.problemasDescripcion[i] = problemasDescripcion[i];
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
  proyecto() {
    if ((this.register.idea === '') || (this.register.plataforma === '') || (this.register.descripcion === '')) {
      alert('Faltan datos por agregar');
    } else {
      const registro = new Usuarioperfil();
      registro.usuario = this.nombreusuario;
      registro.idea = this.register.idea;
      registro.plataforma = this.register.plataforma;
      registro.descripcion = this.register.descripcion;

      this.registropro.postRegistroNormal(registro)
      .subscribe(newpres => {});
      alert('Publicacion con exito');
      location.reload();

    }
  }
 }
