import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RespuestasService } from '../../services/cuentas.service';
import { FormBuilder, EmailValidator } from '@angular/forms';
import * as $ from 'jquery';
import { AutenticationService } from '../../services/autentication.service';
import * as firebase from 'firebase';
import {Usuarioperfil} from '../../models/cuenta';
import swal from 'sweetalert2';

const httpOptions = {
  headers: new HttpHeaders({ 'content-type': 'application/json' })
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
  Videojuego: string[] = [
    "black ops 4","red dead redemtion","fifa 19","the last of us",
    "god of war ","ratchet and clank","gears of war","left for dead",
    "forza","lol","fornite","counter strike","super smash bros",
    "zelda","mario bros","pokemon battle",
    "mario party","mario galaxy",

  ]
  videojuegox: {
    black_ops_4: string,
    red_dead_redemption_2: string,
    fifa_19: string,
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
  permiso: boolean = false;
  permiso2: boolean = false;
  constructor(private router: Router, private pf: FormBuilder, private respuestasService: RespuestasService) {
    this.respuestasService.getRespuestas()
      .subscribe(respuestas => {
        for (const i in respuestas) {
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
    // firebase.initializeApp({
    //   apiKey: 'AIzaSyCOW5YBjn64EKoPxbZhIqTgjUgyCkXvsn4',
    //   authDomain: 'proyectogamerface.firebaseapp.com',
    //   databaseURL: 'https://proyectogamerface.firebaseio.com',
    //   projectId: 'proyectogamerface',
    //   storageBucket: 'proyectogamerface.appspot.com',
    //   messagingSenderId: '760545297980'
    // });
  }
  juegos() {
    if ($('#favorite1').prop('checked')) {
      $('#play').show();

    } else {
      $('#play').hide();
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
  onSubmit() {
    this.respuestasService.getRespuestas()
    .subscribe(respuestas => {
      for ( const i in respuestas ) {
       this.respuestas[i] = respuestas[i];
      }
      });
    this.permiso = false;

    const dato = document.getElementById('newcontrasenaa');
    const dato2 = document.getElementById('contrasenaa');
    const dato3 = document.getElementById('electronico');
    const dato4 = document.getElementById('user');




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

          } else if (this.register.contrasena.length < 8 ) {
              alert('La contraseña debe de contener mas de 8 caracteres');
          } else {
            registro.usuario = this.register.usuario;
            registro.repcontraseña = this.register.newcontrasena;
            registro.contraseña = this.register.contrasena;
            registro.correo = this.register.correo;
            registro.imagen = '..//..//assets//gamer.png';
         
            $('.checkbox:checked').each(
              function () {
                  registro.plataforma.push($(this).val());
              }
            );
            $('.checkbox2:checked').each(
              function () {
                  registro.videojuego.push($(this).val());
              }
            );
              if (registro.plataforma === []) {
                registro.plataforma.push("sin plataforma");
              }
              if (registro.videojuego === []){ 
                registro.videojuego.push("sin videojuego");
              }

            // registro.videojuego = this.videojuegox;
            const dato5 = this.register.correo;
            const dato6 = this.register.contrasena;

            const email = String(dato5);
            const password = String(dato6);
            localStorage.setItem('nombreUsuario', this.register.correo);
            localStorage.setItem('NombreUser', this.register.usuario);

            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
              console.log(error.code);
              console.log(error.message);
            });
            this.respuestasService.postRegistroNormal(registro)
            .subscribe(newpres => {});

            setTimeout(() => {
              alert('Se creo la cuenta con exito');
              this.register.usuario = '';
              this.register.correo = '';
              this.register.contrasena = '';
              this.register.newcontrasena = '';


                }, 1000);
          }
       } else {
       dato.style.borderColor = 'red';
      }

  }

}
