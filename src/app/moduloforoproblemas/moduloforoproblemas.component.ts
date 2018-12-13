import { Component, OnInit, Input} from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import 'firebase/storage';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import $ from 'jquery';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';
import { GlobalesService } from '../servicios/globales.service';
import { RegistroproblemaService } from '../servicios/registroproblema.service';
import { NotificacionesService } from '../servicios/notificaciones.service';
import { RegistroPublicacionService } from '../servicios/registropublicacion.service';
import * as firebase from 'firebase';
import { ForoproblemasService } from '../servicios/foroproblemas.service';

class Usuarioperfil {
  miusuario: string;
  usuario: string;
  videojuego: string;
  plataforma: string;
  descripcion: string ;
}
class Usuarioperfil2 {
  miusuario: string;
  usuario: string;
  videojuego: string;
  plataforma: string;
  descripcion: string ;
}
class Comentario {
  // del comentario
  usuario2;
  comentario;
  usuario;
  nomplataforma;
  nomvideojuego;
  descripcion;

}
@Component({
  selector: 'app-moduloforoproblemas',
  templateUrl: './moduloforoproblemas.component.html',
  styleUrls: ['./moduloforoproblemas.component.css']
})
export class ModuloforoproblemasComponent implements OnInit {
  problemas: string[] = [];
  problemasusuario: string [] = [];
  problemasvideojuego: string [] = [];
  problemasPlataforma: string [] = [];
  problemasDescripcion: string [] = [];
  

  todoscomentarios: string[] = [];
  comentadores: string[] = [];
  todoscomenta: string[] = [];
  existenciaComen: boolean = false;

  existencia: boolean = false;
  comentacion: boolean = false;
  comentacion1: boolean = false;

  // aqui son las variables para las notificaciones
  notificacionUser1: string [] = [];
  notificacionUser2: string [] = [];
  notificacionMotivo: string [] = [];
  existenciaNoti: boolean = false;
  // saber si esta seleccionado mis guardados
  seleccionado: boolean = false;
  seleccionado2: boolean = true;
  register;
  register1;
  respuestas: any[] = [];
  respuestas2: any[] = [];
  respuestas5: any[] = [];

  nombreusuario;
  mostrar = [];
  contador: number;

  constructor(
    private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,
     private postproblema: RegistroproblemaService,
     private registropublicacionesService: RegistroPublicacionService,
     private obtenerProblema: ObtenerPublicacionService,
     private obtenernotifiaciones: NotificacionesService,
     private problemass: ForoproblemasService) {
      // aqui obtengo el parametro del localstorage
        this.nombreusuario =  localStorage.getItem('nombreUsuario');
      this.obtenerProblema.getProblemas()
      .subscribe(respuestas => {
        for (const i in respuestas) {
          this.respuestas2[i] = respuestas[i];
        }
      });
      this.obtenerProblema.getComentarios()
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
      if (notificaciones[key].estado === 'false'){
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


          this.proceso();
        
       }
  ngOnInit() {
    this.register = {
      videojuego: '',
      plataforma: '',
      descripcion: '',
      comentario: ''
    };
    this.register1 = {
      plataforma1: '',
      publicacion1: '',
    };
  }

  proceso() {
    setTimeout(() => {
      this.respuestas2 = [];
      this.obtenerProblema.getProblemas()
      .subscribe(respuestas => {
        for (const i in respuestas) {
          this.respuestas2[i] = respuestas[i];
        }
      });
  
      // aqui obtendremos las publicaciones
      this.obtenerProblema.getProblemas()
      .subscribe(foroproblemas =>  {
  
        let i = 0;
        const problemas: string[] = [];
        const problemasusuario: string [] = [];
        const problemasvideojuego: string [] = [];
        const problemasPlataforma: string [] = [];
        const problemasDescripcion: string [] = [];
        const pruebas: string[] = [];
        this.problemas = [];
        this.problemasusuario = [];
        this.problemasPlataforma = [];
        this.problemasvideojuego = [];
        this.problemasDescripcion = [];
        Object.keys(foroproblemas).forEach(function(key) {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              pruebas[i] = foroproblemas[key].miusuario;
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].videojuego;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
            } else {
  
            }
        });
        for (let i = 0; i < problemas.length; i++) {
          if (pruebas[i] === '') {
            this.problemas[i] = problemas[i];
            this.problemasusuario[i] = problemasusuario[i];
            this.problemasvideojuego[i] = problemasvideojuego[i];
            this.problemasPlataforma[i] = problemasPlataforma[i];
            this.problemasDescripcion[i] = problemasDescripcion[i];
          } 
      
          if (this.problemas[i] != null || this.problemas[i] !== 'undefined') {
            this.existencia = true;
          }
        }
        });
    }, 1000);
   

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
  guardarpublicacion(probleusuario, problevideojuego, probleplataforma, probledescripcion) {
    this.proceso();
    let condicion: boolean = false;
    for (const i in this.respuestas2) {
      if (this.respuestas2[i].descripcion === probledescripcion && this.respuestas2[i].miusuario === this.nombreusuario) {

        if (this.respuestas2[i].plataforma === probleplataforma && this.respuestas2[i].usuario === probleusuario) {

          if (this.respuestas2[i].videojuego === problevideojuego) {
            condicion = true;
          }
        }
      }
    }
      if (condicion === true) {
        alert('Esta publicacion ya esta guardada');
        this.proceso();

      } else {
        const registro = new Usuarioperfil2();
        registro.miusuario = this.nombreusuario;
        registro.usuario = probleusuario;
        registro.videojuego = problevideojuego;
        registro.plataforma = probleplataforma;
        registro.descripcion = probledescripcion;
        this.postproblema.postRegistroNormal(registro)
        .subscribe(newpres => {});
        alert('Se guardo con exito la publicacion');
      }

 
  }
  eliminardelista(probleusuario, problevideojuego, probleplataforma, probledescripcion) {
    this.obtenerProblema.getProblemas()
    .subscribe(problemas => {
      let llave: string;
      const users = this.nombreusuario;
      Object.keys(problemas).forEach(function(key) {
        if (problemas[key].usuario === probleusuario && problemas[key].miusuario === users ) {
          if (problemas[key].descripcion === probledescripcion && problemas[key].plataforma === probleplataforma) {
            if (problemas[key].videojuego === problevideojuego) {
              llave = key;
            }
          }
        }
      });
      this.problemass.deproblemas(llave).subscribe(res => {
        console.log(res);
        alert('Se elimino con exito de la lista');
      });
      setTimeout(() => {
      this.saberpublicacion();  
      }, 1000);
    });
  }
  comentar(i, publiuser,  publivideo, publipla,  publidescrip) {
    let contador: number = 0;
    for (const i in this.respuestas5) {
      contador = contador + 1;
    }

    $( '#campo' + i).toggle();
    this.obtenerProblema.getComentarios()
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
        if (comentarios[key].usuario === usu ) {
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
  enviarComentario( publiuser,  publivideo, publipla, publidescrip) {
    
    if (this.register.comentario === ' ') {
      alert('No ha escrito el comentario');
    } else {
      const registropubli = new Comentario();
      registropubli.usuario2 = this.nombreusuario;
      registropubli.usuario = publiuser;
      registropubli.nomplataforma = publipla;
      registropubli.nomvideojuego = publivideo;
      registropubli.descripcion = publidescrip;
      registropubli.comentario = this.register.comentario;
      this.registropublicacionesService.postRegistroComentarios(registropubli)
      .subscribe(newpres => {});
      alert('Se agrego el comentario con exito');
      setTimeout(() => {
        this.obtenerProblema.getComentarios()
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
            if (comentarios[key].usuario === usu ) {
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
    }, 1000);
    this.register.comentario = '';
    }
  }
  nombretuusuario(usuario) {
    localStorage.removeItem('suusuario');
    localStorage.setItem('suusuario', usuario);
  }
  saberplataforma() {

    // aqui obtendremos las publicaciones
    this.obtenerProblema.getProblemas()
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
    let seleccionado: boolean = false;
    let seleccionado2: boolean = true;

   Object.keys(foroproblemas).forEach(function(key) {
     // El url de la imagen de la portada
     if (nombrepublicacion === 'Todas las Publicaciones') {
       seleccionado = false;
       seleccionado2 = true;
       if ( nombreplata === 'Todas las plataformas') {
         if (foroproblemas[key].miusuario === '') {
          problemas[i] = foroproblemas[key];
          problemasusuario[i] = foroproblemas[key].usuario;
          problemasvideojuego[i] = foroproblemas[key].videojuego;
          problemasPlataforma[i] = foroproblemas[key].plataforma;
          problemasDescripcion[i] = foroproblemas[key].descripcion;
          i = i + 1;
         }
  
       } else if ( nombreplata === 'Play station') {
         if (foroproblemas[key].plataforma === 'Play station') {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].videojuego;
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
            problemasvideojuego[i] = foroproblemas[key].videojuego;
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
            problemasvideojuego[i] = foroproblemas[key].videojuego;
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
            problemasvideojuego[i] = foroproblemas[key].videojuego;
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
            problemasvideojuego[i] = foroproblemas[key].videojuego;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
         }
       }
     } else if (nombrepublicacion === 'Mis publicaciones') {
      seleccionado = false;
      seleccionado2 = true;

      if ( nombreplata === 'Todas las plataformas') {
        if (foroproblemas[key].usuario === users) {
          if (foroproblemas[key].miusuario === '') {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
          }
       }
     }
    } else if (nombrepublicacion === 'Publicaciones guardadas') {
      seleccionado = true;
      seleccionado2 = false;

      if ( nombreplata === 'Todas las plataformas') {
          if (foroproblemas[key].miusuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].videojuego;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
        
       } else if ( nombreplata === 'Play station') {
        if ( foroproblemas[key].plataforma === 'Play station') {
            if (foroproblemas[key].miusuario === users) {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
       }
     }
    }
   });
   for (let i = 0; i < problemas.length; i++) {
          this.seleccionado = seleccionado;
          this.seleccionado2 = seleccionado2;
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
    this.obtenerProblema.getProblemas()
    .subscribe(foroproblemas =>  {
   
      let i = 0;
      const users = this.nombreusuario;
      const problemas: string[] = [];
      const problemasusuario: string [] = [];
      const problemasvideojuego: string [] = [];
      const nombreplata: string = $('#caja5').val();
      const nombrepublicacion: string = $('#caja6').val();
      const problemasPlataforma: string [] = [];
      const problemasDescripcion: string [] = [];
      let seleccionado: boolean = false;
      let seleccionado2: boolean = false;

      this.problemasusuario = [];
       this.problemasPlataforma = [];
       this.problemasvideojuego = [];
       this.problemas = [];
       this.problemasDescripcion = [];
      Object.keys(foroproblemas).forEach(function(key) {
        // El url de la imagen de la portada
        if (nombrepublicacion === 'Todas las Publicaciones') {
          seleccionado = false;
          seleccionado2 = true;
          if ( nombreplata === 'Todas las plataformas') {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].videojuego;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
          } else if ( nombreplata === 'Play station') {
            if (foroproblemas[key].plataforma === 'Play station') {
              if (foroproblemas[key].miusuario === '') {
                problemas[i] = foroproblemas[key];
                problemasusuario[i] = foroproblemas[key].usuario;
                problemasvideojuego[i] = foroproblemas[key].videojuego;
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
                problemasvideojuego[i] = foroproblemas[key].videojuego;
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
                problemasvideojuego[i] = foroproblemas[key].videojuego;
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
                problemasvideojuego[i] = foroproblemas[key].videojuego;
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
                problemasvideojuego[i] = foroproblemas[key].videojuego;
                problemasPlataforma[i] = foroproblemas[key].plataforma;
                problemasDescripcion[i] = foroproblemas[key].descripcion;
                i = i + 1;
               }
            }
          }
        } else if (nombrepublicacion === 'Mis publicaciones') {
          seleccionado = false;
          seleccionado2 = true;

         if ( nombreplata === 'Todas las plataformas') {
           if (foroproblemas[key].usuario === users) {
            if (foroproblemas[key].miusuario === '') {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
                  problemasvideojuego[i] = foroproblemas[key].videojuego;
                  problemasPlataforma[i] = foroproblemas[key].plataforma;
                  problemasDescripcion[i] = foroproblemas[key].descripcion;
                  i = i + 1;
                 }
              }
            }
          } else if (nombreplata === 'Xbox') {
           if ( foroproblemas[key].plataforma  === 'Xbox') {
             if (foroproblemas[key].usuario === users) {
              if (foroproblemas[key].miusuario === '') {
                problemas[i] = foroproblemas[key];
                problemasusuario[i] = foroproblemas[key].usuario;
                problemasvideojuego[i] = foroproblemas[key].videojuego;
                problemasPlataforma[i] = foroproblemas[key].plataforma;
                problemasDescripcion[i] = foroproblemas[key].descripcion;
                i = i + 1;
               }
             }
           }
          } else if (nombreplata === 'Pc') {
           if (foroproblemas[key].plataforma  === 'Pc') {
             if (foroproblemas[key].usuario === users) {
              if (foroproblemas[key].miusuario === '') {
                problemas[i] = foroproblemas[key];
                problemasusuario[i] = foroproblemas[key].usuario;
                problemasvideojuego[i] = foroproblemas[key].videojuego;
                problemasPlataforma[i] = foroproblemas[key].plataforma;
                problemasDescripcion[i] = foroproblemas[key].descripcion;
                i = i + 1;
               }
             }
           }
           
          } else if (nombreplata ===  'Nintendo Wii') {
           if ( foroproblemas[key].plataforma  === 'Nintendo Wii') {
             if (foroproblemas[key].usuario === users) {
              if (foroproblemas[key].miusuario === '') {
                problemas[i] = foroproblemas[key];
                problemasusuario[i] = foroproblemas[key].usuario;
                problemasvideojuego[i] = foroproblemas[key].videojuego;
                problemasPlataforma[i] = foroproblemas[key].plataforma;
                problemasDescripcion[i] = foroproblemas[key].descripcion;
                i = i + 1;
               }
             }
           }
          } else if (nombreplata === 'Nintendo Switch') {
           if ( foroproblemas[key].plataforma  === 'Nintendo Switch') {
             if (foroproblemas[key].usuario === users) {
              if (foroproblemas[key].miusuario === '') {
                problemas[i] = foroproblemas[key];
                problemasusuario[i] = foroproblemas[key].usuario;
                problemasvideojuego[i] = foroproblemas[key].videojuego;
                problemasPlataforma[i] = foroproblemas[key].plataforma;
                problemasDescripcion[i] = foroproblemas[key].descripcion;
                i = i + 1;
               }
             }
          }
        }
      } else if (nombrepublicacion === 'Publicaciones guardadas') {
        seleccionado = true;
        seleccionado2 = false;

        if ( nombreplata === 'Todas las plataformas') {
          if (foroproblemas[key].miusuario === users) {
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].videojuego;
            problemasPlataforma[i] = foroproblemas[key].plataforma;
            problemasDescripcion[i] = foroproblemas[key].descripcion;
            i = i + 1;
           }
        
       } else if ( nombreplata === 'Play station') {
        if ( foroproblemas[key].plataforma === 'Play station') {
            if (foroproblemas[key].miusuario === users) {
              problemas[i] = foroproblemas[key];
              problemasusuario[i] = foroproblemas[key].usuario;
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
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
              problemasvideojuego[i] = foroproblemas[key].videojuego;
              problemasPlataforma[i] = foroproblemas[key].plataforma;
              problemasDescripcion[i] = foroproblemas[key].descripcion;
              i = i + 1;
             }
             }
           }
      }
      });
      for (let i = 0; i < problemas.length; i++) {
        this.seleccionado = seleccionado;
        this.seleccionado2 = seleccionado2;
            this.problemas[i] = problemas[i];
            this.problemasusuario[i] = problemasusuario[i];
           this.problemasvideojuego[i] = problemasvideojuego[i];
           this.problemasPlataforma[i] = problemasPlataforma[i];
           this.problemasDescripcion[i] = problemasDescripcion[i];
      }
      });
     }

  publicar() {
    if ((this.register.videojuego === '') || (this.register.plataforma === '') || (this.register.descripcion === '')) {
      alert('Faltan datos por agregar');
    } else {
      const registro = new Usuarioperfil();
      registro.miusuario = '';
      registro.usuario = this.nombreusuario;
      registro.videojuego = this.register.videojuego;
      registro.plataforma = this.register.plataforma;
      registro.descripcion = this.register.descripcion;

      this.postproblema.postRegistroNormal(registro)
      .subscribe(newpres => {});
      alert('Publicacion con exito');
        setTimeout(() => {
          location.reload();

        }, 1000);
    }
  }
 
}
