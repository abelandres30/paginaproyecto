import { Component, OnInit} from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import 'firebase/storage';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import $ from 'jquery';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';
import { GlobalesService } from '../servicios/globales.service';
import { ForoproblemasService } from '../servicios/foroproblemas.service';
import { NotificacionesService } from '../servicios/notificaciones.service';
import { RegistroPublicacionService } from '../servicios/registropublicacion.service';
import * as firebase from 'firebase';

class Usuarioperfil {
  miusuario: string;
  usuario: string;
  idea: string;
  plataforma: string;
  descripcion: string ;

}
class Comentario {
  // del comentario
  usuario2;
  comentario;
  usuario;
  nomplataforma;
  idea;
  descripcion;

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
  respuestas5: any[] = [];

  register;
  // variables de la BD 
  problemas: string[] = [];
  problemasusuario: string [] = [];
  problemasvideojuego: string [] = [];
  problemasPlataforma: string [] = [];
  problemasDescripcion: string [] = [];

  todoscomentarios: string[] = [];
  comentadores: string[] = [];
  todoscomenta: string[] = [];
  existenciaComen: boolean = false;


  // variables de las notifiaciones 
  notificacionUser1: string [] = [];
  notificacionUser2: string [] = [];
  notificacionMotivo: string [] = [];
  existenciaNoti: boolean = false;
  resultado: boolean = true;
  resultado2: boolean = false;
  constructor( private storage: AngularFireStorage,
    private cookie: CookieService,
    private registropro: ForoproblemasService ,
    private obtenernotifiaciones: NotificacionesService,
    private obtenerpublicacionService: ObtenerPublicacionService,
    private registropublicacionesService: RegistroPublicacionService,
    ) {
      this.nombreusuario =  localStorage.getItem('nombreUsuario');

        // aqui obtendremos las notificaciones
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

        this.obtenerpublicacionService.getComentarios()
        .subscribe(respuestas => {
          for (const i in respuestas) {
            this.respuestas5[i] = respuestas[i];
          }
        });
  
        this.proceso();
   
    }

  ngOnInit() {
    this.register = {
      idea: '',
      plataforma: '',
      descripcion: '',
      comentario: '',
    };
  }
  proceso() {
    setTimeout(() => {
      this.respuestas = [];
      this.registropro.getProyectos()
      .subscribe(foroproblemas => {
        for (const i in foroproblemas) {
          this.respuestas[i] = foroproblemas[i];
        }
      });

     // aqui obtendremos las publicaciones
     this.registropro.getProyectos()
     .subscribe(foroproblemas =>  {
       let i = 0;
       const problemas: string[] = [];
       const problemasusuario: string [] = [];
       const problemasvideojuego: string [] = [];
       const problemasPlataforma: string [] = [];
       const problemasDescripcion: string [] = [];
       const problemamiusuario: string[] = [];
       Object.keys(foroproblemas).forEach(function(key) {
         // El url de la imagen de la portada
         if (foroproblemas[key].miusuario === '') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          problemamiusuario[i] = foroproblemas[key].miusuario;
          i = i + 1;
         }
      
       });
       for (let i = 0; i < problemas.length; i++) {
          if (problemamiusuario[i] === '') {
            this.problemas[i] = problemas[i];
            this.problemasusuario[i] = problemasusuario[i];
            this.problemasvideojuego[i] = problemasvideojuego[i];
            this.problemasPlataforma[i] = problemasPlataforma[i];
            this.problemasDescripcion[i] = problemasDescripcion[i];
            if (this.problemas[i] != null || this.problemas[i] !== 'undefined') {
              this.existencia = true;
            }
          } 
       
       }
       });
    }, 1000);
      
  }
  guardarpublicacion(usuario, videojuego, plataforma, descripcion) {
    this.proceso();

    let condicion: boolean = false;
    for (const i in this.respuestas) {
      if (this.respuestas[i].usuario === usuario && this.respuestas[i].idea === videojuego) {
        if (this.respuestas[i].miusuario === this.nombreusuario && this.respuestas[i].plataforma === plataforma) {
          if (this.respuestas[i].descripcion === descripcion) {
            condicion = true;
          }
        }
      }
    }
    if (condicion === true) {
      alert('Esta publicacion ya esta guardada');
      this.proceso();
    } else {
      const registro = new Usuarioperfil();
      registro.miusuario = this.nombreusuario;
      registro.usuario = usuario;
      registro.idea = videojuego;
      registro.plataforma = plataforma;
      registro.descripcion = descripcion;
      this.registropro.postRegistroNormal(registro)
      .subscribe(newpres => {});
      alert('Se guardo con exito la publicacion');
    }

  }


  Eliminarpubli(usuario, videojuego, plataforma, descripcion) {
    this.registropro.getProyectos()
    .subscribe(proyectos => {
      let llave: string;
      const users = this.nombreusuario;
      Object.keys(proyectos).forEach(function(key) {
        if (proyectos[key].descripcion === descripcion && proyectos[key].idea === videojuego) {
          if (proyectos[key].miusuario === users && proyectos[key].plataforma === plataforma) {
            if (proyectos[key].usuario === usuario) {
              llave = key;
            }
          }
        }
      });
      this.registropro.deproyectos(llave).subscribe(res => {
        console.log(res);
        alert('Se elimino con exito la publicacion');
        this.saberpublicacion();
      });
    });
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
    let resultado: boolean;
    let resultado2: boolean;
   Object.keys(foroproblemas).forEach(function(key) {
     // El url de la imagen de la portada
     if (nombrepublicacion === 'Todas las Publicaciones') {
       resultado = true;
       resultado2 = false;
       if ( nombreplata === 'Todas las plataformas') {
         if (foroproblemas[key].miusuario === '') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
     
       } else if ( nombreplata === 'Play station') {
         if (foroproblemas[key].plataforma === 'Play station') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }

       } else if (nombreplata === 'Xbox') {
         if (foroproblemas[key].plataforma === 'Xbox') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }
       } else if (nombreplata === 'Pc') {
         if (foroproblemas[key].plataforma === 'Pc') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }
       } else if (nombreplata ===  'Nintendo Wii') {
         if (foroproblemas[key].plataforma === 'Nintendo Wii') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }
       } else if (nombreplata === 'Nintendo Switch') {
         if (foroproblemas[key].plataforma === 'Nintendo Switch') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }
       }
     } else if (nombrepublicacion === 'Mis publicaciones') {
      resultado = true;
      resultado2 = false;
      if ( nombreplata === 'Todas las plataformas') {
        if (foroproblemas[key].usuario === users) {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
        }
       } else if ( nombreplata === 'Play station') {
        if ( foroproblemas[key].plataforma === 'Play station') {
          if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].idea;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
          }
        }
       } else if (nombreplata === 'Xbox') {
        if ( foroproblemas[key].plataforma === 'Xbox') {
          if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].idea;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
          }
        }
       } else if (nombreplata === 'Pc') {
        if ( foroproblemas[key].plataforma === 'Pc') {
          if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].idea;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
          }
        }
        
       } else if (nombreplata ===  'Nintendo Wii') {
        if ( foroproblemas[key].plataforma === 'Nintendo Wii') {
          if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].idea;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
          }
        }
       } else if (nombreplata === 'Nintendo Switch') {
        if ( foroproblemas[key].plataforma === 'Nintendo Switch') {
          if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
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
    } else if (nombrepublicacion === 'Publicaciones guardadas') {
      resultado = false;
       resultado2 = true;
      if ( nombreplata === 'Todas las plataformas') {
          if (foroproblemas[key].miusuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
        
       } else if ( nombreplata === 'Play station') {
        if ( foroproblemas[key].plataforma === 'Play station') {
            if (foroproblemas[key].miusuario === users) {
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
            if (foroproblemas[key].miusuario === users) {
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
            if (foroproblemas[key].miusuario === users) {
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
            if (foroproblemas[key].miusuario === users) {
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
            if (foroproblemas[key].miusuario === users) {
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
     this.resultado = resultado;
     this.resultado2 = resultado2;
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
    let resultado: boolean;
    let resultado2: boolean;
   Object.keys(foroproblemas).forEach(function(key) {
     // El url de la imagen de la portada
     if (nombrepublicacion === 'Todas las Publicaciones') {
       resultado = true;
       resultado2 = false;
       if ( nombreplata === 'Todas las plataformas') {
        if (foroproblemas[key].miusuario === '') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].idea;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
       } else if ( nombreplata === 'Play station') {
         if (foroproblemas[key].plataforma === 'Play station') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }

       } else if (nombreplata === 'Xbox') {
         if (foroproblemas[key].plataforma === 'Xbox') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }
       } else if (nombreplata === 'Pc') {
         if (foroproblemas[key].plataforma === 'Pc') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }
       } else if (nombreplata ===  'Nintendo Wii') {
         if (foroproblemas[key].plataforma === 'Nintendo Wii') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }
       } else if (nombreplata === 'Nintendo Switch') {
         if (foroproblemas[key].plataforma === 'Nintendo Switch') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }
       }
     } else if (nombrepublicacion === 'Mis publicaciones') {
      resultado = true;
      resultado2 = false;
      if ( nombreplata === 'Todas las plataformas') {
        if (foroproblemas[key].usuario === users) {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
        }
       } else if ( nombreplata === 'Play station') {
        if ( foroproblemas[key].plataforma === 'Play station') {
          if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].idea;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
          }
        }
       } else if (nombreplata === 'Xbox') {
        if ( foroproblemas[key].plataforma === 'Xbox') {
          if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].idea;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
          }
        }
       } else if (nombreplata === 'Pc') {
        if ( foroproblemas[key].plataforma === 'Pc') {
          if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].idea;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
          }
        }
        
       } else if (nombreplata ===  'Nintendo Wii') {
        if ( foroproblemas[key].plataforma === 'Nintendo Wii') {
          if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].idea;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
          }
        }
       } else if (nombreplata === 'Nintendo Switch') {
        if ( foroproblemas[key].plataforma === 'Nintendo Switch') {
          if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
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
    } else if (nombrepublicacion === 'Publicaciones guardadas') {
      resultado = false;
       resultado2 = true;
      if ( nombreplata === 'Todas las plataformas') {
          if (foroproblemas[key].miusuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].idea;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
        
       } else if ( nombreplata === 'Play station') {
        if ( foroproblemas[key].plataforma === 'Play station') {
            if (foroproblemas[key].miusuario === users) {
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
            if (foroproblemas[key].miusuario === users) {
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
            if (foroproblemas[key].miusuario === users) {
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
            if (foroproblemas[key].miusuario === users) {
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
            if (foroproblemas[key].miusuario === users) {
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
     this.resultado = resultado;
     this.resultado2 = resultado2;
         this.problemas[i] = problemas[i];
         this.problemasusuario[i] = problemasusuario[i];
        this.problemasvideojuego[i] = problemasvideojuego[i];
        this.problemasPlataforma[i] = problemasPlataforma[i];
        this.problemasDescripcion[i] = problemasDescripcion[i];
   }
   });

    }
  comentar(i, publiuser, publivideo, publipla,  publidescrip) {
    let contador: number = 0;
    for (const i in this.respuestas5) {
      contador = contador + 1;
    }

    $( '#campo' + i).toggle();
    this.obtenerpublicacionService.getComentarios()
        .subscribe(comentarios => {
          let i = contador - 1;
          const usu = publiuser;
          const plata = publipla;
          const videoju = publivideo;
          const descrip = publidescrip;
          const todoscomentarios: string[] = [];
          const comentadores: string[] = [];
          const todoscomenta: string[] = [];
          this.todoscomenta = [];
          this.comentadores = [];
          Object.keys(comentarios).forEach(function(key) {
            if (comentarios[key].usuario === usu) {
              if (comentarios[key].nomplataforma === plata && comentarios[key].idea === videoju ) {
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
  cierro() {
    localStorage.removeItem('nombreUsuario');
    /*CERRANDO SESION */
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  }
  enviarComentario(publiuser, publivideo, publipla,  publidescrip) {
    if (this.register.comentario === ' ') {
      alert('No ha escrito el comentario');
    } else {
      const registropubli = new Comentario();
      registropubli.usuario2 = this.nombreusuario;
      registropubli.usuario = publiuser;
      registropubli.nomplataforma = publipla;
      registropubli.idea = publivideo;
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
          const plata = publipla;
          const videoju = publivideo;
          const descrip = publidescrip;
          const todoscomentarios: string[] = [];
          const comentadores: string[] = [];
          const todoscomenta: string[] = [];
          this.todoscomenta = [];
          this.comentadores = [];
          Object.keys(comentarios).forEach(function(key) {
            if (comentarios[key].usuario === usu) {
              if (comentarios[key].nomplataforma === plata && comentarios[key].idea === videoju ) {
                if (comentarios[key].descripcion === descrip ) {
                  todoscomenta[i] = comentadores[key];
                  comentadores[i] = comentarios[key].usuario2;
                  todoscomentarios[i] = comentarios[key].comentario;
                  i = i - 1;
                }
              }
            }
          });
          for (let i = comentadores.length; i > -1; i--) {
            this.todoscomenta[i] = todoscomenta[i];
            this.comentadores[i] = comentadores[i];
            this.todoscomentarios[i] = todoscomentarios[i];
            if (this.todoscomenta[i] != null || this.todoscomenta[i] !== 'undefined') {
              this.existenciaComen = true;
            }
          }
        });
            }, 1000);
            this.register.comentario = '';

    }
  }
  nombretuusuario(usuario) {
    localStorage.removeItem('suusuario');
    localStorage.setItem('suusuario', usuario);
  }
  proyecto() {
    if ((this.register.idea === '') || (this.register.plataforma === '') || (this.register.descripcion === '')) {
      alert('Faltan datos por agregar');
    } else {
      const registro = new Usuarioperfil();
      registro.miusuario = '';
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
