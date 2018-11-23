import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { RespuestasService } from '../servicios/respuestas.service';
import { FormBuilder, EmailValidator } from '@angular/forms';
import $ from 'jquery';
import { AutenticationService } from '../servicios/autentication.service';
import * as firebase from 'firebase';


const httpOptions = {
  headers: new HttpHeaders({'content-type': 'application/json'})
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
  selector: 'app-moduloregistro',
  templateUrl: './moduloregistro.component.html',
  styleUrls: ['./moduloregistro.component.css']
})
export class ModuloregistroComponent implements OnInit {
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
  register;
  respuestas: any[] = [];
  permiso:boolean = false;
  permiso2:boolean = false;
  constructor(private router: Router, private pf: FormBuilder, private respuestasService: RespuestasService ) {
    this.respuestasService.getRespuestas()
      .subscribe(respuestas => {
        for ( const i in respuestas ) {
         this.respuestas[i] = respuestas[i];
        }
        });

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
  }
  ngOnInit() {
    this.register = {
      usuario: '',
      correo: '',
      contrasena: '',
      newcontrasena: '',
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
  juegos() {
    if ($('#favorite1').prop('checked')) {
     $( '#play' ).show();

  } else {
    $( '#play' ).hide();
  }
    if ($('#favorite2').prop('checked')) {
      $('#xbox').show();
    } else {
      $('#xbox').hide();
    }
    if ($('#favorite3').prop('checked')) {
      $('#pc').show();
        } else {
        $('#pc').hide();

      }
    if ($('#favorite4').prop('checked')) {
      $('#wii').show();
        } else {
        $('#wii').hide();
      }
    if ($('#favorite5').prop('checked')) {
      $('#switch').show();
        } else {
        $('#switch').hide();
      }
  }
  onSubmit(value) {
    this.permiso = false;

    const dato = document.getElementById('newcontrasenaa');
    const dato2 = document.getElementById('contrasenaa');
    const dato3 = document.getElementById('electronico');
    const dato4 = document.getElementById('user');

    const dato5 = this.register.correo;
    const dato6 = this.register.contrasena;


    if ((this.register.usuario === '' ) || ( this.register.correo === '') || (this.register.contrasena === '') || (this.register.newcontrasena === '')) {

      setTimeout(() => {
        alert('Faltan campos por llenas');
          }, );

       const explode = function() {
        dato.style.borderColor = 'white';
        dato2.style.borderColor = 'white';
        dato3.style.borderColor = 'white';
        dato4.style.borderColor = 'white';
         };
         setTimeout(explode, 2000);
      dato.style.borderColor = 'red';
      dato2.style.borderColor = 'red';
      dato3.style.borderColor = 'red';
      dato4.style.borderColor = 'red';
    } else if (this.register.contrasena === this.register.newcontrasena) {
        const registro = new Usuarioperfil();
          for (const i in this.respuestas) {
            if (( this.respuestas[i].usuario === this.register.usuario)) {
           this.permiso = true;

             } else if (this.respuestas[i].correo === this.register.correo) {
               this.permiso2 = true;
             } else {

          }
          }
    
          if (this.permiso === true) {
             alert('El nombre de usuario que ingreso ya existe, ingrese otro');
           
          } else if (this.permiso2 === true) {
            alert('El correo que ingreso ya existe, ingrese otro');

          } else if (this.register.contrasena.length < 6 ) {
              alert('La contraseña debe de contener mas de 6 caracteres');
          } else {
            registro.usuario = this.register.usuario;
            registro.repcontraseña = this.register.newcontrasena;
            registro.contraseña = this.register.contrasena;
            registro.correo = this.register.correo;
            registro.imagen = 'img\\gamer.png';
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
            registro.plataforma = this.plataformaX;
            registro.videojuego = this.videojuegox;

            const email = String(dato5);
            const password = String(dato6);
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
              console.log(error.code);
              console.log(error.message);
            });
            this.respuestasService.postRegistroNormal(registro)
            .subscribe(newpres => {});
            alert('Se creo la cuenta con exito');
            localStorage.setItem('nombreUsuario', this.register.usuario);

            this.router.navigate(['modulomenu']);
          }
       } else {
       dato.style.borderColor = 'red';
      }

  }

}
