import { Component, OnInit } from '@angular/core';
import { RespuestasService } from '../servicios/respuestas.service';
import $ from 'jquery';
import { AngularFireStorage } from 'angularfire2/storage';
import { NotificacionesService } from '../servicios/notificaciones.service';
import {Message} from 'primeng/components/common/api';
import { ConfiguracionesService } from '../servicios/configuraciones.service';
import { EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { ForoproblemasService } from '../servicios/foroproblemas.service';
import { RegistroPublicacionService } from '../servicios/registropublicacion.service';
import { RegistroproblemaService } from '../servicios/registroproblema.service';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';
import * as firebase from 'firebase';

class Informacion {
  newcorreo: string;
  newcontrasena: string;
}
class Usuarioperfil {
  usuario: any ;
  contraseña: string;
  repcontraseña: string;
  correo: EmailValidator;
  imagen: string;
  plataforma: {};
  videojuego: {};
}

@Component({
  selector: 'app-moduloconfiguracion',
  templateUrl: './moduloconfiguracion.component.html',
  styleUrls: ['./moduloconfiguracion.component.css']
})
export class ModuloconfiguracionComponent implements OnInit {
  // aqui van las variables para poner los videojuegos 
  plataformaX: {
    xbox: string,
    Playstation: string,
    pc: string,
    NintendoWii: string,
    NintendoSwitch: string
  };
  videojuegox: {
    black_ops_4: string,
    red_dead_redemption_2:string,
    fifa_19:string,
    the_last_of_us: string,
    god_of_war_3: string,
    ratchet_and_clank: string,
    gears_of_war: string,
    left_for_dead: string,
    forza: string,
    lol: string,
    fornite: string,
    counter_strike: string,
    super_smash_bros: string,
    zelda: string,
    mario_bros: string,
    pokemon_battle: string,
    mario_party: string,
    mario_galaxy: string
  };
  msgs: Message[] = [];
  imagenperfil;

  avatarimagen;
  respuestas: any[] = [];
  register;
  nombreusuario;
  nombreusuario2;
  plataformasps: string;
  plataformaxbox: string;
  plataformapc: string;
  plataformawii: string;
  plataformaswitch: string;
  sinplataforma:String = 'sin plataformas';
  plataformasps1: string;
  plataformaxbox1: string;
  plataformapc1: string;
  plataformawii1: string;
  plataformaswitch1: string;
  sinplataforma1:String = 'sin plataformas';
  sinvideojuegos:String = 'sin videojuegos';
  videojuegos: string[] = [];
  // variables para las notificaciones
  notificacionUser1: string [] = [];
  notificacionUser2: string [] = [];
  notificacionMotivo: string [] = [];
  existenciaNoti: boolean = false;
  entra: boolean = false;
  plataformasi: boolean = false;
  plataformasno: boolean = false;
  // variables de los usuarios
  TodosAmigos: string [] = [];
  CantidadAmigos: string [] = [];

  existenciaamigos: boolean = false;
  usuarioeliminado;
  constructor(private router: Router,
    private Usuarios: RespuestasService,
    private foro: ObtenerPublicacionService,
    private proble: ForoproblemasService,
    private publicaciones: RegistroPublicacionService,
    private problemas: RegistroproblemaService,
    private obtenernotificaciones: NotificacionesService,
    private configuracion: ConfiguracionesService) {
      // aqui equivalo las variables a nada 
      this.plataformaX = {
        xbox: '',
        Playstation: '',
        pc: '',
        NintendoWii: '',
        NintendoSwitch: ''
      };
      this.videojuegox = {
        black_ops_4: '',
        red_dead_redemption_2: '',
        fifa_19: '',
        the_last_of_us: '',
        god_of_war_3: '',
        ratchet_and_clank: '',
        gears_of_war: '',
        left_for_dead: '',
        forza: '',
        lol: '',
        fornite: '',
        counter_strike: '',
        super_smash_bros: '',
        zelda: '',
        mario_bros: '',
        pokemon_battle: '',
        mario_party: '',
        mario_galaxy: ''
      };
    // aqui obtengo el usuario del storage
    this.nombreusuario =  localStorage.getItem('nombreUsuario');
    // aqui obtiene todos los datos
    this.Usuarios.getRespuestas()
    .subscribe(respuestas => {
      for ( const i in respuestas ) {
       this.respuestas[i] = respuestas[i];
      }
      });

      
      // Aqui se obtienen las notificaciones 
      this.obtenernotificaciones.getNotifiaciones()
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
  }
  ngOnInit() {
    this.avatarimagen = 'img\img10.jpg';
    this.register = {
      correo: '',
      contra: '',
      newcontra: '',
    };
    firebase.initializeApp({
      apiKey: 'AIzaSyCOW5YBjn64EKoPxbZhIqTgjUgyCkXvsn4',
      authDomain: 'proyectogamerface.firebaseapp.com',
      databaseURL: 'https://proyectogamerface.firebaseio.com',
      projectId: 'proyectogamerface',
      storageBucket: 'proyectogamerface.appspot.com',
      messagingSenderId: '760545297980'
    });
  }
Cambiarcorreo() {
  this.Usuarios.getRespuestas()
  .subscribe(respuestas => {
    for ( const i in respuestas ) {
     this.respuestas[i] = respuestas[i];
    }
    });

  let correoactuall: string = $('#correoactual').val();
  for (const i in this.respuestas) {
    if (this.respuestas[i].usuario === this.nombreusuario) {
      const registro = new Informacion();
      correoactuall = this.respuestas[i].correo;
      $('#correoactual').val(correoactuall);
    }
  }
}
usuarioagregados() {
   // aqui se obtienen los amigos que se tiene agregados
   this.Usuarios.getAmigos()
   .subscribe(amigos => {
     let i = 0;
     const TodosAmigos: string [] = [];
     const users = this.nombreusuario;
     const CantidadAmigos: string[] = [];
     Object.keys(amigos).forEach(function(key) {
         if (users === amigos[key].usuario) {
           CantidadAmigos[i] = amigos[key];
           TodosAmigos[i] = amigos[key].amigos;
           i = i + 1;
         } else if (users === amigos[key].amigos) {
           CantidadAmigos[i] = amigos[key];
           TodosAmigos[i] = amigos[key].usuario;
           i = i + 1;
         }
     });
     for (let i = 0; i < CantidadAmigos.length; i++) {
       this.CantidadAmigos[i] = CantidadAmigos[i];
       this.TodosAmigos[i] = TodosAmigos[i];
       if (this.CantidadAmigos[i] != null || this.CantidadAmigos[i] !== 'undefined') {
         this.existenciaamigos = true;
       }
     }
   });

}
avatar() {
  for (const i in this.respuestas) {
    if ( this.respuestas[i].usuario === this.nombreusuario) {
      this.imagenperfil = this.respuestas[i].imagen;
    }
  }
}
  // aqui se obtiene el nombre del usuario a eliminar y se valida
  si(amigo) {
    this.usuarioeliminado = amigo;
  }
  // aqui se elimna al amigo seleccionado
  sieliminar() {
        this.Usuarios.getAmigos()
        .subscribe(amigo => {
          const users = this.nombreusuario;
          const user2 = this.usuarioeliminado;
          let llave;

        Object.keys(amigo).forEach(function(key) {
        if ((amigo[key].usuario === users && amigo[key].amigos === user2) || (amigo[key].usuario === user2 && amigo[key].amigos === users)) {
          llave = key;
        }

        });
        this.Usuarios.delAmigo(llave).subscribe(res => {
          alert('Se elimino la cuenta con exito');
          setTimeout(() => {
            location.reload();

          }, 1000);

        });
        });
    }
  modificarCorreo() {

    if (this.register.correo === '' || this.register.contra === '' || this.register.newcontra === '') {
      this.msgs = [];
      this.msgs.push({severity:'error', detail:'Faltan datos por agregar'});
    } else {
          if (this.register.contra === this.register.newcontra) {
            this.entra = true;
      // aqui se obtienen los datos antes de eliminarse
      this.Usuarios.getRespuestas()
      .subscribe(usuario => {
        const users = this.nombreusuario;
        let user2;
        let avatarimg;
        let pla1;
        let pla2;
        let pla3;
        let pla4;
        let pla5;
        let videojuego1;
        let videojuego2;
        let videojuego3;
        let videojuego4;
        let videojuego5;
        let videojuego6;
        let videojuego7;
        let videojuego8;
        let videojuego9;
        let videojuego10;
        let videojuego11;
        let videojuego12;
        let videojuego13;
        let videojuego14;
        let videojuego15;
        let videojuego16;
        let videojuego17;
        let videojuego18;
        Object.keys(usuario).forEach(function(key) {
          if (usuario[key].usuario === users) {
            user2 = usuario[key].usuario;
            avatarimg = usuario[key].imagen;
            pla1 = usuario[key].plataforma.Playstation;
            pla2 = usuario[key].plataforma.xbox;
            pla3 = usuario[key].plataforma.pc;
            pla4 = usuario[key].plataforma.NintendoWii;
            pla5 = usuario[key].plataforma.NintendoSwitch;
            videojuego1 = usuario[key].videojuego.black_ops_4;
            videojuego2 = usuario[key].videojuego.red_dead_redemption_2;
            videojuego3 = usuario[key].videojuego.fifa_19;
            videojuego4 = usuario[key].videojuego.the_last_of_us;
            videojuego5 = usuario[key].videojuego.god_of_war_3;
            videojuego6 = usuario[key].videojuego.ratchet_and_clank;
            videojuego7 = usuario[key].videojuego.gears_of_war;
            videojuego8 = usuario[key].videojuego.left_for_dead;
            videojuego9 = usuario[key].videojuego.forza;
            videojuego10 = usuario[key].videojuego.lol;
            videojuego11 = usuario[key].videojuego.fornite;
            videojuego12 = usuario[key].videojuego.counter_strike;
            videojuego13 = usuario[key].videojuego.super_smash_bros;
            videojuego14 = usuario[key].videojuego.zelda;
            videojuego15 = usuario[key].videojuego.mario_bros;
            videojuego16 = usuario[key].videojuego.pokemon_battle;
            videojuego17 = usuario[key].videojuego.mario_party;
            videojuego18 = usuario[key].videojuego.mario_galaxy;
          }
        });
        for (let i = 0; i < 2; i++) {
          this.plataformaX.Playstation = pla1;
          this.plataformaX.xbox = pla2;
          this.plataformaX.pc = pla3;
          this.plataformaX.NintendoWii = pla4;
          this.plataformaX.NintendoSwitch = pla5;
          this.videojuegox.black_ops_4 = videojuego1;
          this.videojuegox.red_dead_redemption_2 = videojuego2;
          this.videojuegox.fifa_19 = videojuego3;
          this.videojuegox.the_last_of_us = videojuego4;
          this.videojuegox.god_of_war_3 = videojuego5;
          this.videojuegox.ratchet_and_clank = videojuego6;
          this.videojuegox.gears_of_war = videojuego7;
          this.videojuegox.left_for_dead = videojuego8;
          this.videojuegox.forza = videojuego9;
          this.videojuegox.lol = videojuego10;
          this.videojuegox.fornite = videojuego11;
          this.videojuegox.counter_strike = videojuego12;
          this.videojuegox.super_smash_bros = videojuego13;
          this.videojuegox.zelda = videojuego14;
          this.videojuegox.mario_bros = videojuego15;
          this.videojuegox.pokemon_battle = videojuego16;
          this.videojuegox.mario_party = videojuego17;
          this.videojuegox.mario_galaxy = videojuego18;
          this.nombreusuario2 = user2;
        }
      // aqui se elimina ese registro
      let llave;

      Object.keys(usuario).forEach(function(key) {
      if (usuario[key].usuario === users) {
       llave = key;
      }

      });
      this.configuracion.delUsuario(llave).subscribe(res => {
        console.log(res);
      });
    const registro = new Usuarioperfil();
    registro.usuario = this.nombreusuario2;
    registro.repcontraseña = this.register.newcontra;
    registro.contraseña = this.register.contra;
    registro.correo = this.register.correo;
    registro.imagen = avatarimg;
    registro.plataforma = this.plataformaX;
    registro.videojuego = this.videojuegox;
    this.Usuarios.postRegistroNormal(registro)
    .subscribe(newpres => {});
    const user = firebase.auth().currentUser;

    user.updateEmail(this.register.correo).then(function() {
  // Update successful.
}).catch(function(error) {
  // An error happened.
});
    alert('Se modifico la cuenta con exito');
    setTimeout(() => {
      this.register.correo = '';
      this.register.contra = '';
      this.register.newcontra = '';
      this.Usuarios.getRespuestas()
      .subscribe(respuestas => {
        for ( const i in respuestas ) {
         this.respuestas[i] = respuestas[i];
        }
        });
  
      let correoactuall: string = $('#correoactual').val();
      for (const i in this.respuestas) {
        if (this.respuestas[i].usuario === this.nombreusuario) {
          const registro = new Informacion();
          correoactuall = this.respuestas[i].correo;
          $('#correoactual').val(correoactuall);
        }
      }
    }, 1000);
      });
          } else {
            this.msgs = [];
            this.msgs.push({severity:'error', detail:'Las contraseñas no son las mismas'});
          }
    }
  }

  Eliminarcuenta() {
    this.Usuarios.getRespuestas()
      .subscribe(usuario => {
        const users = this.nombreusuario;

      // aqui se elimina ese registro
      let llave;

      Object.keys(usuario).forEach(function(key) {
      if (usuario[key].usuario === users) {
       llave = key;
      }
      
      });
       this.configuracion.delUsuario(llave).subscribe(res => {
       });
      });
      // aqui elimino las publicaciones de los problemas del usuario
      this.foro.getProblemas()
      .subscribe(foroproblemas => {
        let i = 0;
        const users = this.nombreusuario;
        const llave: string[] = [];
        Object.keys(foroproblemas).forEach(function(key) {
          if (foroproblemas[key].usuario === users) {
            llave[i] = key;
            i = i + 1;
          }
        });
        for (let i = 0; i < llave.length; i++) {
          this.foro.deproblemas(llave[i]).subscribe(res => {
          
          });
        }
      });
          // aqui elimino las publicaciones de los proyectos del usuario
          this.proble.getProyectos()
          .subscribe(foroproyectos => {
            let i = 0;
            const users = this.nombreusuario;
            const llave: string[] = [];
            Object.keys(foroproyectos).forEach(function(key) {
              if (foroproyectos[key].usuario === users) {
                llave[i] = key;
                i = i + 1;
              }
            });
            for (let i = 0; i < llave.length; i++) {
              this.proble.deproyectos(llave[i]).subscribe(res => {
              
              });
            }
          });
          
            // aqui elimino las imagenes del usuario
            this.foro.getImagenes()
            .subscribe(imagenes => {
              let i = 0;
              const users = this.nombreusuario;
              const llave: string[] = [];
              Object.keys(imagenes).forEach(function(key) {
                if (imagenes[key].usuario === users) {
                  llave[i] = key;
                  i = i + 1;
                }
              });
              for (let i = 0; i < llave.length; i++) {
                this.foro.deimagenes(llave[i]).subscribe(res => {
                });
              }
            });
            
                // aqui elimino las notificaciones del usuario
                this.obtenernotificaciones.getNotifiaciones()
                .subscribe(notificaciones => {
                  let i = 0;
                  const users = this.nombreusuario;
                  const llave: string[] = [];
                  Object.keys(notificaciones).forEach(function(key) {
                    if (notificaciones[key].usuario1 === users) {
                      llave[i] = key;
                      i = i + 1;
                    }
                  });
                  for (let i = 0; i < llave.length; i++) {
                    this.obtenernotificaciones.delnotificacion(llave[i]).subscribe(res => {
                    });
                  }
                });

                    // aqui elimino las notificaciones del usuario
                    this.foro.getRespuestas()
                    .subscribe(notificaciones => {
                      let i = 0;
                      const users = this.nombreusuario;
                      const llave: string[] = [];
                      Object.keys(notificaciones).forEach(function(key) {
                        if (notificaciones[key].usuario === users) {
                          llave[i] = key;
                          i = i + 1;
                        }
                      });
                      for (let i = 0; i < llave.length; i++) {
                        this.foro.depublicaciones(llave[i]).subscribe(res => {
                        });
                      }
                    });


      alert('Se elimino la cuenta con exito');
      this.router.navigate(['moduloregistro']);


  }
  Cambioplata() {
   
  // aqui se obtienen los datos antes de eliminarse
  this.Usuarios.getRespuestas()
  .subscribe(usuario => {
    const users = this.nombreusuario;
    let user2;
    let correo;
    let avatarimg;
    let contrasena1;
    let contrasena2;
    let videojuego1;
    let videojuego2;
    let videojuego3;
    let videojuego4;
    let videojuego5;
    let videojuego6;
    let videojuego7;
    let videojuego8;
    let videojuego9;
    let videojuego10;
    let videojuego11;
    let videojuego12;
    let videojuego13;
    let videojuego14;
    let videojuego15;
    let videojuego16;
    let videojuego17;
    let videojuego18;
    Object.keys(usuario).forEach(function(key) {
      if (usuario[key].usuario === users) {
        user2 = usuario[key].usuario;
        correo = usuario[key].correo;
        avatarimg = usuario[key].imagen;
        contrasena1 = usuario[key].contraseña;
        contrasena2 = usuario[key].repcontraseña;
        videojuego1 = usuario[key].videojuego.black_ops_4;
        videojuego2 = usuario[key].videojuego.red_dead_redemption_2;
        videojuego3 = usuario[key].videojuego.fifa_19;
        videojuego4 = usuario[key].videojuego.the_last_of_us;
        videojuego5 = usuario[key].videojuego.god_of_war_3;
        videojuego6 = usuario[key].videojuego.ratchet_and_clank;
        videojuego7 = usuario[key].videojuego.gears_of_war;
        videojuego8 = usuario[key].videojuego.left_for_dead;
        videojuego9 = usuario[key].videojuego.forza;
        videojuego10 = usuario[key].videojuego.lol;
        videojuego11 = usuario[key].videojuego.fornite;
        videojuego12 = usuario[key].videojuego.counter_strike;
        videojuego13 = usuario[key].videojuego.super_smash_bros;
        videojuego14 = usuario[key].videojuego.zelda;
        videojuego15 = usuario[key].videojuego.mario_bros;
        videojuego16 = usuario[key].videojuego.pokemon_battle;
        videojuego17 = usuario[key].videojuego.mario_party;
        videojuego18 = usuario[key].videojuego.mario_galaxy;
      }
    });
    for (let i = 0; i < 2; i++) {
      this.videojuegox.black_ops_4 = videojuego1;
      this.videojuegox.red_dead_redemption_2 = videojuego2;
      this.videojuegox.fifa_19 = videojuego3;
      this.videojuegox.the_last_of_us = videojuego4;
      this.videojuegox.god_of_war_3 = videojuego5;
      this.videojuegox.ratchet_and_clank = videojuego6;
      this.videojuegox.gears_of_war = videojuego7;
      this.videojuegox.left_for_dead = videojuego8;
      this.videojuegox.forza = videojuego9;
      this.videojuegox.lol = videojuego10;
      this.videojuegox.fornite = videojuego11;
      this.videojuegox.counter_strike = videojuego12;
      this.videojuegox.super_smash_bros = videojuego13;
      this.videojuegox.zelda = videojuego14;
      this.videojuegox.mario_bros = videojuego15;
      this.videojuegox.pokemon_battle = videojuego16;
      this.videojuegox.mario_party = videojuego17;
      this.videojuegox.mario_galaxy = videojuego18;
      this.nombreusuario2 = user2;
    }
          // aqui se elimina ese registro
          let llave;

          Object.keys(usuario).forEach(function(key) {
          if (usuario[key].usuario === users) {
          llave = key;
          }

          });
          this.configuracion.delUsuario(llave).subscribe(res => {
            console.log(res);
          });
          // aqui comienzan las plataformas
          if ($('#favorite1').prop('checked')) {
            this.plataformaX.Playstation = 'true';
          } else {
            this.plataformaX.Playstation = 'false';
          }
          if ($('#favorite2').prop('checked')) {
            this.plataformaX.xbox = 'true';
          } else {
            this.plataformaX.xbox = 'false';
          }
          if ($('#favorite3').prop('checked')) {
            this.plataformaX.pc = 'true';
          } else {
            this.plataformaX.pc = 'false';
          }
          if ($('#favorite4').prop('checked')) {
            this.plataformaX.NintendoWii = 'true';
          } else {
            this.plataformaX.NintendoWii = 'false';
          }
          if ($('#favorite5').prop('checked')) {
            this.plataformaX.NintendoSwitch = 'true';
          } else {
            this.plataformaX.NintendoSwitch = 'false';
          }

        const registro = new Usuarioperfil();
        registro.usuario = this.nombreusuario2;
        registro.repcontraseña = contrasena2;
        registro.contraseña = contrasena1;
        registro.correo = correo;
        registro.imagen = avatarimg;
        registro.plataforma = this.plataformaX;
        registro.videojuego = this.videojuegox;
        this.Usuarios.postRegistroNormal(registro)
        .subscribe(newpres => {});
        alert('Se modifico la cuenta con exito');
        setTimeout(() => {
         location.reload();
    
        }, 1000);
        });
    }
    cambiarPlataformas() {
      
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
        }
      }
    }
    cambiarVideojuego() {
      this.videojuegos = [];
      for (const i in this.respuestas) {
        if ( this.respuestas[i].usuario === this.nombreusuario) {
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
    Cambiovideo() {
       // aqui se obtienen los datos antes de eliminarse
       this.Usuarios.getRespuestas()
       .subscribe(usuario => {
         const users = this.nombreusuario;
         let user2;
         let correo;
         let avatarimg;
         let contrasena1;
         let contrasena2;
         let pla1;
         let pla2;
         let pla3;
         let pla4;
         let pla5;
         Object.keys(usuario).forEach(function(key) {
           if (usuario[key].usuario === users) {
             user2 = usuario[key].usuario;
             correo = usuario[key].correo;
              avatarimg = usuario[key].imagen;
             contrasena1 = usuario[key].contraseña;
             contrasena2 = usuario[key].repcontraseña;
             pla1 = usuario[key].plataforma.Playstation;
             pla2 = usuario[key].plataforma.xbox;
             pla3 = usuario[key].plataforma.pc;
             pla4 = usuario[key].plataforma.NintendoWii;
             pla5 = usuario[key].plataforma.NintendoSwitch;
           
           }
         });
         for (let i = 0; i < 2; i++) {
           this.plataformaX.Playstation = pla1;
           this.plataformaX.xbox = pla2;
           this.plataformaX.pc = pla3;
           this.plataformaX.NintendoWii = pla4;
           this.plataformaX.NintendoSwitch = pla5;
           this.nombreusuario2 = user2;
         }
       // aqui se elimina ese registro
       let llave;
 
       Object.keys(usuario).forEach(function(key) {
       if (usuario[key].usuario === users) {
        llave = key;
       }
 
       });
       this.configuracion.delUsuario(llave).subscribe(res => {
         console.log(res);
       });
       
        // aqui comienzan los videojuegos
        if ($('#favorite6').prop('checked')) {
          this.videojuegox.black_ops_4 = 'true';
        } else {
          this.videojuegox.black_ops_4 = 'false';
        }
        if ($('#favorite7').prop('checked')) {
          this.videojuegox.red_dead_redemption_2 = 'true';
        } else {
          this.videojuegox.red_dead_redemption_2 = 'false';
        }
        if ($('#favorite8').prop('checked')) {
          this.videojuegox.fifa_19 = 'true';
        } else {
          this.videojuegox.fifa_19 = 'false';
        } if ($('#favorite9').prop('checked')) {
          this.videojuegox.the_last_of_us= 'true';
        } else {
          this.videojuegox.the_last_of_us = 'false';
        }
        if ($('#favorite10').prop('checked')) {
          this.videojuegox.god_of_war_3 = 'true';
        } else {
          this.videojuegox.god_of_war_3 = 'false';
        }
        if ($('#favorite11').prop('checked')) {
          this.videojuegox.ratchet_and_clank = 'true';
        } else {
          this.videojuegox.ratchet_and_clank = 'false';
        }
        if ($('#favorite12').prop('checked')) {
          this.videojuegox.gears_of_war = 'true';
        } else {
          this.videojuegox.gears_of_war = 'false';
        }
        if ($('#favorite13').prop('checked')) {
          this.videojuegox.left_for_dead = 'true';
        } else {
          this.videojuegox.left_for_dead = 'false';
        }
        if ($('#favorite14').prop('checked')) {
          this.videojuegox.forza = 'true';
        } else {
          this.videojuegox.forza = 'false';
        }
        if ($('#favorite15').prop('checked')) {
          this.videojuegox.lol = 'true';
        } else {
          this.videojuegox.lol = 'false';
        }
        if ($('#favorite16').prop('checked')) {
          this.videojuegox.fornite = 'true';
        } else {
          this.videojuegox.fornite = 'false';
        }
        if ($('#favorite17').prop('checked')) {
          this.videojuegox.counter_strike = 'true';
        } else {
          this.videojuegox.counter_strike = 'false';
        }
        if ($('#favorite18').prop('checked')) {
          this.videojuegox.super_smash_bros = 'true';
        } else {
          this.videojuegox.super_smash_bros = 'false';
        }
        if ($('#favorite19').prop('checked')) {
          this.videojuegox.zelda = 'true';
        } else {
          this.videojuegox.zelda = 'false';
        }
        if ($('#favorite20').prop('checked')) {
          this.videojuegox.mario_bros = 'true';
        } else {
          this.videojuegox.mario_bros = 'false';
        }
        if ($('#favorite21').prop('checked')) {
          this.videojuegox.pokemon_battle = 'true';
        } else {
          this.videojuegox.pokemon_battle = 'false';
        }
        if ($('#favorite22').prop('checked')) {
          this.videojuegox.mario_party = 'true';
        } else {
          this.videojuegox.mario_party = 'false';
        }
        if ($('#favorite23').prop('checked')) {
          this.videojuegox.mario_galaxy = 'true';
        } else {
          this.videojuegox.mario_galaxy = 'false';
        }
        const registro = new Usuarioperfil();
          registro.usuario = this.nombreusuario2;
          registro.repcontraseña = contrasena2;
          registro.contraseña = contrasena1;
          registro.correo = correo;
          registro.imagen = avatarimg;
          registro.plataforma = this.plataformaX;
          registro.videojuego = this.videojuegox;
          this.Usuarios.postRegistroNormal(registro)
          .subscribe(newpres => {});
          alert('Se modifico la cuenta con exito');
          setTimeout(() => {
            location.reload();

          }, 1000);

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
  imagen1() {
    const imagen = '..//..//assets//img11.png';
    this.cambiaravatar(imagen);
  }
  imagen2() {
    const imagen = '..//..//assets//img12.png';
    this.cambiaravatar(imagen);
    
  }
  imagen3() {
    const imagen = '..//..//assets//img13.png';
    this.cambiaravatar(imagen);
   }
   imagen4() {
    const imagen = '..//..//assets//img14.png';
    this.cambiaravatar(imagen);
   }
   imagen5() {
    const imagen = '..//..//assets//img15.png';
    this.cambiaravatar(imagen);
   }
   imagen6() {
    const imagen = '..//..//assets//img16.png';
    this.cambiaravatar(imagen);
   }
   imagen7() {
    const imagen = '..//..//assets//img17.png';
    this.cambiaravatar(imagen);
   }
   imagen8() {
    const imagen = '..//..//assets//img18.png';
    this.cambiaravatar(imagen);
   }
  cambiaravatar(avatar) {
    this.Usuarios.getRespuestas()
    .subscribe(usuario => {
      const users = this.nombreusuario;
      let user2;
      let correo;
      let contrasena1;
      let contrasena2;
      let pla1;
      let pla2;
      let pla3;
      let pla4;
      let pla5;
      let videojuego1;
      let videojuego2;
      let videojuego3;
      let videojuego4;
      let videojuego5;
      let videojuego6;
      let videojuego7;
      let videojuego8;
      let videojuego9;
      let videojuego10;
      let videojuego11;
      let videojuego12;
      let videojuego13;
      let videojuego14;
      let videojuego15;
      let videojuego16;
      let videojuego17;
      let videojuego18;
      Object.keys(usuario).forEach(function(key) {
        if (usuario[key].usuario === users) {
          user2 = usuario[key].usuario;
          correo = usuario[key].correo;
          contrasena1 = usuario[key].contraseña;
          contrasena2 = usuario[key].repcontraseña;
          pla1 = usuario[key].plataforma.Playstation;
          pla2 = usuario[key].plataforma.xbox;
          pla3 = usuario[key].plataforma.pc;
          pla4 = usuario[key].plataforma.NintendoWii;
          pla5 = usuario[key].plataforma.NintendoSwitch;
          videojuego1 = usuario[key].videojuego.black_ops_4;
          videojuego2 = usuario[key].videojuego.red_dead_redemption_2;
          videojuego3 = usuario[key].videojuego.fifa_19;
          videojuego4 = usuario[key].videojuego.the_last_of_us;
          videojuego5 = usuario[key].videojuego.god_of_war_3;
          videojuego6 = usuario[key].videojuego.ratchet_and_clank;
          videojuego7 = usuario[key].videojuego.gears_of_war;
          videojuego8 = usuario[key].videojuego.left_for_dead;
          videojuego9 = usuario[key].videojuego.forza;
          videojuego10 = usuario[key].videojuego.lol;
          videojuego11 = usuario[key].videojuego.fornite;
          videojuego12 = usuario[key].videojuego.counter_strike;
          videojuego13 = usuario[key].videojuego.super_smash_bros;
          videojuego14 = usuario[key].videojuego.zelda;
          videojuego15 = usuario[key].videojuego.mario_bros;
          videojuego16 = usuario[key].videojuego.pokemon_battle;
          videojuego17 = usuario[key].videojuego.mario_party;
          videojuego18 = usuario[key].videojuego.mario_galaxy;
        }
      });
      for (let i = 0; i < 2; i++) {
        this.plataformaX.Playstation = pla1;
        this.plataformaX.xbox = pla2;
        this.plataformaX.pc = pla3;
        this.plataformaX.NintendoWii = pla4;
        this.plataformaX.NintendoSwitch = pla5;
        this.videojuegox.black_ops_4 = videojuego1;
        this.videojuegox.red_dead_redemption_2 = videojuego2;
        this.videojuegox.fifa_19 = videojuego3;
        this.videojuegox.the_last_of_us = videojuego4;
        this.videojuegox.god_of_war_3 = videojuego5;
        this.videojuegox.ratchet_and_clank = videojuego6;
        this.videojuegox.gears_of_war = videojuego7;
        this.videojuegox.left_for_dead = videojuego8;
        this.videojuegox.forza = videojuego9;
        this.videojuegox.lol = videojuego10;
        this.videojuegox.fornite = videojuego11;
        this.videojuegox.counter_strike = videojuego12;
        this.videojuegox.super_smash_bros = videojuego13;
        this.videojuegox.zelda = videojuego14;
        this.videojuegox.mario_bros = videojuego15;
        this.videojuegox.pokemon_battle = videojuego16;
        this.videojuegox.mario_party = videojuego17;
        this.videojuegox.mario_galaxy = videojuego18;
        this.nombreusuario2 = user2;
      }
    // aqui se elimina ese registro
    let llave;

    Object.keys(usuario).forEach(function(key) {
    if (usuario[key].usuario === users) {
     llave = key;
    }

    });
    this.configuracion.delUsuario(llave).subscribe(res => {
      console.log(res);
    });
  const registro = new Usuarioperfil();
  registro.usuario = this.nombreusuario2;
  registro.repcontraseña = contrasena2;
  registro.contraseña = contrasena1;
  registro.correo = correo;
  registro.imagen = avatar;
  registro.plataforma = this.plataformaX;
  registro.videojuego = this.videojuegox;
  this.Usuarios.postRegistroNormal(registro)
  .subscribe(newpres => {});
  alert('Se modifico la cuenta con exito');
  setTimeout(() => {
    location.reload();

  }, 1000);

    });


  }




}
