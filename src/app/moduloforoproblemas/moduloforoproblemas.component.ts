import { Component, OnInit, Input} from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import 'firebase/storage';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import $ from 'jquery';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';
import { GlobalesService } from '../servicios/globales.service';
import { RegistroproblemaService } from '../servicios/registroproblema.service';

class Usuarioperfil {
  usuario: string;
  videojuego: string;
  plataforma: string;
  descripcion: string ;

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
  existencia: boolean = false;
  comentacion: boolean = false;

  register;
  register1;
  respuestas: any[] = [];
  nombreusuario;

  constructor(
    private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,
     private postproblema: RegistroproblemaService,
     private obtenerProblema: ObtenerPublicacionService) {
      // aqui obtengo el parametro del localstorage
        this.nombreusuario =  localStorage.getItem('nombreUsuario');

        // aqui se obtiene la informacion de la tabla
        this.postproblema.postRegistroNormal()
        .subscribe(respuestas => {
          for (const i in respuestas) {
            this.respuestas[i] = respuestas[i];
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
          Object.keys(foroproblemas).forEach(function(key) {
            // El url de la imagen de la portada
            problemas[i] = foroproblemas[key];
            problemasusuario[i] = foroproblemas[key].usuario;
            problemasvideojuego[i] = foroproblemas[key].videojuego;
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
      videojuego: '',
      plataforma: '',
      descripcion: '',
    };
    this.register1 = {
      plataforma1: '',
      publicacion1: '',
    };
  }
  comentar() {
    if (this.comentacion === false ) {
      this.comentacion = true;
    } else {
      this.comentacion = false;
    }
  }

  saberplataforma() {
    const nombreplata: string = $('#caja5').val();
    const nombrepublicacion: string = $('#caja6').val();

 // aqui obtendremos las publicaciones
 this.obtenerProblema.getProblemas()
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
     problemasvideojuego[i] = foroproblemas[key].videojuego;
     problemasPlataforma[i] = foroproblemas[key].plataforma;
     problemasDescripcion[i] = foroproblemas[key].descripcion;
     i = i + 1;
   });
   for (let i = 0; i < problemas.length; i++) {
    this.problemas[i] = '';
    this.problemasusuario[i] = '';
    this.problemasvideojuego[i] = '';
    this.problemasPlataforma[i] = '';
    this.problemasDescripcion[i] = '';

    if (nombrepublicacion === 'Todas las Publicaciones') {
      if ( nombreplata === 'Todas las plataformas') {
        this.problemas[i] = problemas[i];
        this.problemasusuario[i] = problemasusuario[i];
        this.problemasvideojuego[i] = problemasvideojuego[i];
        this.problemasPlataforma[i] = problemasPlataforma[i];
        this.problemasDescripcion[i] = problemasDescripcion[i];
      } else if (nombreplata === 'Play station') {
          if (problemasPlataforma[i] === 'Play station') {
            this.problemas[i] = problemas[i];
            this.problemasusuario[i] = problemasusuario[i];
            this.problemasvideojuego[i] = problemasvideojuego[i];
            this.problemasPlataforma[i] = problemasPlataforma[i];
            this.problemasDescripcion[i] = problemasDescripcion[i];
          }
      } else if (nombreplata === 'Xbox') {
        if (problemasPlataforma[i] === 'Xbox') {
          this.problemas[i] = problemas[i];
          this.problemasusuario[i] = problemasusuario[i];
          this.problemasvideojuego[i] = problemasvideojuego[i];
          this.problemasPlataforma[i] = problemasPlataforma[i];
          this.problemasDescripcion[i] = problemasDescripcion[i];
        }
    } else if (nombreplata === 'Pc') {
      if (problemasPlataforma[i] === 'Pc') {
        this.problemas[i] = problemas[i];
        this.problemasusuario[i] = problemasusuario[i];
        this.problemasvideojuego[i] = problemasvideojuego[i];
        this.problemasPlataforma[i] = problemasPlataforma[i];
        this.problemasDescripcion[i] = problemasDescripcion[i];
      }
  } else if (nombreplata === 'Nintendo Wii') {
    if (problemasPlataforma[i] === 'Nintendo Wii') {
      this.problemas[i] = problemas[i];
      this.problemasusuario[i] = problemasusuario[i];
      this.problemasvideojuego[i] = problemasvideojuego[i];
      this.problemasPlataforma[i] = problemasPlataforma[i];
      this.problemasDescripcion[i] = problemasDescripcion[i];
    }
  } else if (nombreplata === 'Nintendo Switch') {
   if (problemasPlataforma[i] === 'Nintendo Switch') {
    this.problemas[i] = problemas[i];
    this.problemasusuario[i] = problemasusuario[i];
    this.problemasvideojuego[i] = problemasvideojuego[i];
    this.problemasPlataforma[i] = problemasPlataforma[i];
    this.problemasDescripcion[i] = problemasDescripcion[i];
   }
  }

    } else if (nombrepublicacion === 'Mis publicaciones') {
      if ( nombreplata === 'Todas las plataformas') {
        if (this.nombreusuario === problemasusuario[i]) {
          this.problemas[i] = problemas[i];
          this.problemasusuario[i] = problemasusuario[i];
          this.problemasvideojuego[i] = problemasvideojuego[i];
          this.problemasPlataforma[i] = problemasPlataforma[i];
          this.problemasDescripcion[i] = problemasDescripcion[i];
        }
      
      } else if (nombreplata === 'Play station') {
         if ( problemasPlataforma[i] === 'Play station') {
              if (this.nombreusuario === problemasusuario[i]) {
               this.problemas[i] = problemas[i];
               this.problemasusuario[i] = problemasusuario[i];
               this.problemasvideojuego[i] = problemasvideojuego[i];
                this.problemasPlataforma[i] = problemasPlataforma[i];
              this.problemasDescripcion[i] = problemasDescripcion[i];
              }
            }
        
      } else if (nombreplata === 'Xbox') {
        if ( problemasPlataforma[i] === 'Xbox') {
          if (this.nombreusuario === problemasusuario[i]) {
           this.problemas[i] = problemas[i];
           this.problemasusuario[i] = problemasusuario[i];
           this.problemasvideojuego[i] = problemasvideojuego[i];
            this.problemasPlataforma[i] = problemasPlataforma[i];
          this.problemasDescripcion[i] = problemasDescripcion[i];
          }
        }
    
    } else if (nombreplata === 'Pc') {
      if ( problemasPlataforma[i] === 'Pc') {
        if (this.nombreusuario === problemasusuario[i]) {
         this.problemas[i] = problemas[i];
         this.problemasusuario[i] = problemasusuario[i];
         this.problemasvideojuego[i] = problemasvideojuego[i];
          this.problemasPlataforma[i] = problemasPlataforma[i];
        this.problemasDescripcion[i] = problemasDescripcion[i];
        }
      }
  
  } else if (nombreplata === 'Nintendo Wii') {
    if ( problemasPlataforma[i] === 'Nintendi Wii') {
      if (this.nombreusuario === problemasusuario[i]) {
       this.problemas[i] = problemas[i];
       this.problemasusuario[i] = problemasusuario[i];
       this.problemasvideojuego[i] = problemasvideojuego[i];
        this.problemasPlataforma[i] = problemasPlataforma[i];
      this.problemasDescripcion[i] = problemasDescripcion[i];
      }
}
  } else if (nombreplata === 'Nintendo Switch') {
    if ( problemasPlataforma[i] === 'Nintendo Switch') {
      if (this.nombreusuario === problemasusuario[i]) {
       this.problemas[i] = problemas[i];
       this.problemasusuario[i] = problemasusuario[i];
       this.problemasvideojuego[i] = problemasvideojuego[i];
        this.problemasPlataforma[i] = problemasPlataforma[i];
      this.problemasDescripcion[i] = problemasDescripcion[i];
       }
      }
   }
  }
   }
   });

    }
    saberpublicacion() {
      const nombreplata: string = $('#caja5').val();
      const nombrepublicacion: string = $('#caja6').val();
  
   // aqui obtendremos las publicaciones
   this.obtenerProblema.getProblemas()
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
       problemasvideojuego[i] = foroproblemas[key].videojuego;
       problemasPlataforma[i] = foroproblemas[key].plataforma;
       problemasDescripcion[i] = foroproblemas[key].descripcion;
       i = i + 1;
     });
     for (let i = 0; i < problemas.length; i++) {
      this.problemas[i] = '';
      this.problemasusuario[i] = '';
      this.problemasvideojuego[i] = '';
      this.problemasPlataforma[i] = '';
      this.problemasDescripcion[i] = '';
  
      if (nombrepublicacion === 'Todas las Publicaciones') {
        if ( nombreplata === 'Todas las plataformas') {
          this.problemas[i] = problemas[i];
          this.problemasusuario[i] = problemasusuario[i];
          this.problemasvideojuego[i] = problemasvideojuego[i];
          this.problemasPlataforma[i] = problemasPlataforma[i];
          this.problemasDescripcion[i] = problemasDescripcion[i];
        } else if (nombreplata === 'Play station') {
            if (problemasPlataforma[i] === 'Play station') {
              this.problemas[i] = problemas[i];
              this.problemasusuario[i] = problemasusuario[i];
              this.problemasvideojuego[i] = problemasvideojuego[i];
              this.problemasPlataforma[i] = problemasPlataforma[i];
              this.problemasDescripcion[i] = problemasDescripcion[i];
            }
        } else if (nombreplata === 'Xbox') {
          if (problemasPlataforma[i] === 'Xbox') {
            this.problemas[i] = problemas[i];
            this.problemasusuario[i] = problemasusuario[i];
            this.problemasvideojuego[i] = problemasvideojuego[i];
            this.problemasPlataforma[i] = problemasPlataforma[i];
            this.problemasDescripcion[i] = problemasDescripcion[i];
          }
      } else if (nombreplata === 'Pc') {
        if (problemasPlataforma[i] === 'Pc') {
          this.problemas[i] = problemas[i];
          this.problemasusuario[i] = problemasusuario[i];
          this.problemasvideojuego[i] = problemasvideojuego[i];
          this.problemasPlataforma[i] = problemasPlataforma[i];
          this.problemasDescripcion[i] = problemasDescripcion[i];
        }
    } else if (nombreplata === 'Nintendo Wii') {
      if (problemasPlataforma[i] === 'Nintendo Wii') {
        this.problemas[i] = problemas[i];
        this.problemasusuario[i] = problemasusuario[i];
        this.problemasvideojuego[i] = problemasvideojuego[i];
        this.problemasPlataforma[i] = problemasPlataforma[i];
        this.problemasDescripcion[i] = problemasDescripcion[i];
      }
    } else if (nombreplata === 'Nintendo Switch') {
     if (problemasPlataforma[i] === 'Nintendo Switch') {
      this.problemas[i] = problemas[i];
      this.problemasusuario[i] = problemasusuario[i];
      this.problemasvideojuego[i] = problemasvideojuego[i];
      this.problemasPlataforma[i] = problemasPlataforma[i];
      this.problemasDescripcion[i] = problemasDescripcion[i];
     }
    }
  
      } else if (nombrepublicacion === 'Mis publicaciones') {
        if ( nombreplata === 'Todas las plataformas') {
          if (this.nombreusuario === problemasusuario[i]) {
            this.problemas[i] = problemas[i];
            this.problemasusuario[i] = problemasusuario[i];
            this.problemasvideojuego[i] = problemasvideojuego[i];
            this.problemasPlataforma[i] = problemasPlataforma[i];
            this.problemasDescripcion[i] = problemasDescripcion[i];
          }
        
        } else if (nombreplata === 'Play station') {
           if ( problemasPlataforma[i] === 'Play station') {
                if (this.nombreusuario === problemasusuario[i]) {
                 this.problemas[i] = problemas[i];
                 this.problemasusuario[i] = problemasusuario[i];
                 this.problemasvideojuego[i] = problemasvideojuego[i];
                  this.problemasPlataforma[i] = problemasPlataforma[i];
                this.problemasDescripcion[i] = problemasDescripcion[i];
                }
              }
          
        } else if (nombreplata === 'Xbox') {
          if ( problemasPlataforma[i] === 'Xbox') {
            if (this.nombreusuario === problemasusuario[i]) {
             this.problemas[i] = problemas[i];
             this.problemasusuario[i] = problemasusuario[i];
             this.problemasvideojuego[i] = problemasvideojuego[i];
              this.problemasPlataforma[i] = problemasPlataforma[i];
            this.problemasDescripcion[i] = problemasDescripcion[i];
            }
          }
      
      } else if (nombreplata === 'Pc') {
        if ( problemasPlataforma[i] === 'Pc') {
          if (this.nombreusuario === problemasusuario[i]) {
           this.problemas[i] = problemas[i];
           this.problemasusuario[i] = problemasusuario[i];
           this.problemasvideojuego[i] = problemasvideojuego[i];
            this.problemasPlataforma[i] = problemasPlataforma[i];
          this.problemasDescripcion[i] = problemasDescripcion[i];
          }
        }
    
    } else if (nombreplata === 'Nintendo Wii') {
      if ( problemasPlataforma[i] === 'Nintendi Wii') {
        if (this.nombreusuario === problemasusuario[i]) {
         this.problemas[i] = problemas[i];
         this.problemasusuario[i] = problemasusuario[i];
         this.problemasvideojuego[i] = problemasvideojuego[i];
          this.problemasPlataforma[i] = problemasPlataforma[i];
        this.problemasDescripcion[i] = problemasDescripcion[i];
        }
  }
    } else if (nombreplata === 'Nintendo Switch') {
      if ( problemasPlataforma[i] === 'Nintendo Switch') {
        if (this.nombreusuario === problemasusuario[i]) {
         this.problemas[i] = problemas[i];
         this.problemasusuario[i] = problemasusuario[i];
         this.problemasvideojuego[i] = problemasvideojuego[i];
          this.problemasPlataforma[i] = problemasPlataforma[i];
        this.problemasDescripcion[i] = problemasDescripcion[i];
         }
        }
     }
    }
     }
     });
    }
  publicar() {
    if ((this.register.videojuego === '') || (this.register.plataforma === '') || (this.register.descripcion === '')) {
      alert('Faltan datos por agregar');
    } else {
      const registro = new Usuarioperfil();
      registro.usuario = this.nombreusuario;
      registro.videojuego = this.register.videojuego;
      registro.plataforma = this.register.plataforma;
      registro.descripcion = this.register.descripcion;

      this.postproblema.postRegistroNormal(registro)
      .subscribe(newpres => {});
      alert('Publicacion con exito');
      location.reload();

    }
  }
}
