import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RespuestasService } from '../../services/cuentas.service';
import { FormBuilder, EmailValidator } from '@angular/forms';
import * as $ from 'jquery';
import { AutenticationService } from '../../services/autentication.service';
import * as firebase from 'firebase';
import {Usuarioperfil} from '../../models/cuenta';
import Swal from 'sweetalert2';

const httpOptions = {
  headers: new HttpHeaders({ 'content-type': 'application/json' })
}

@Component({
  selector: 'app-moduloregistro',
  templateUrl: './moduloregistro.component.html',
  styleUrls: ['./moduloregistro.component.css']
})
export class ModuloregistroComponent implements OnInit {

  plataformaX:
  {
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

  playstation: string[] = [ "The last of us", "God of war ","Ratchet and clank" ]
  xbox: string[] = [ "Gears of war", "Left for dead", "Forza", "Halo" ]
  nintendoSwitch: string[] = [ "Super smash bros", "Zelda", "Mario bros" ]
  pc: string[] = [ "Forza", "Fornite", "League of legends", "Counter strike" ]

  juegosSelecciondados: string[] = [];

  videojuegox:
  {
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

  constructor
  (
    private router: Router, private pf: FormBuilder, private respuestasService: RespuestasService
  )

  {
    this.respuestasService.getRespuestas()
      .subscribe(respuestas =>
        {
        for (const i in respuestas)
        {
          this.respuestas[i] = respuestas[i];
        }
      });

    this.plataformaX =
    {
      xbox: '',
      Playstation: '',
      pc: '',
      NintendoWii: '',
      NintendoSwitch: ''
    };

    this.videojuegox =
    {
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
  ngOnInit()
  {
    this.register =
    {
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

  juegos()
  {
    if ($('#favorite1').prop('checked'))
    {
      $('#play').show();
    }
    else
    {
      $('#play').hide();
    }
    if ($('#favorite2').prop('checked'))
    {
      $('#xbox').show();
    }
    else
    {
      $('#xbox').hide();
    }
    if ($('#favorite3').prop('checked'))
    {
      $('#pc').show();
    }
    else
    {
      $('#pc').hide();
    }
    if ($('#favorite4').prop('checked'))
    {
      $('#wii').show();
    }
    else
    {
      $('#wii').hide();
    }
    if ($('#favorite5').prop('checked'))
    {
      $('#switch').show();
    }
    else
    {
      $('#switch').hide();
    }
  }

  onSubmit()
  {
    this.respuestasService.getRespuestas()
    .subscribe(respuestas =>
      {
        for ( const i in respuestas )
        {
          this.respuestas[i] = respuestas[i];
        }
      });

    console.log(this.respuestas);
    this.permiso = false;

    const newcontrasena = document.getElementById('newcontrasenaa');
    const contrasena = document.getElementById('contrasenaa');
    const electronico = document.getElementById('electronico');
    const usuario = document.getElementById('user');

    console.log(this.register);

    if (this.register.usuario === ''  ||  this.register.correo === '' || this.register.contrasena === '' || this.register.newcontrasena === '')
    {
      Swal.fire({ icon: 'error', title: 'Faltan datos por llenar',})

      this.register.newcontrasena === '' ? newcontrasena.style.borderColor = 'red' : newcontrasena.style.borderColor = 'white'
      this.register.contrasena === '' ? contrasena.style.borderColor = 'red' : contrasena.style.borderColor = 'white'
      this.register.correo === '' ? electronico.style.borderColor = 'red' : electronico.style.borderColor = 'white'
      this.register.usuario === '' ? usuario.style.borderColor = 'red' : usuario.style.borderColor = 'white'
    }
    else if (this.register.contrasena === this.register.newcontrasena)
    {
      const registro = new Usuarioperfil();

      for (const i in this.respuestas)
      {
        if (( this.respuestas[i].usuario === this.register.usuario))
        {
          this.permiso = true;
        }
        else if (this.respuestas[i].correo === this.register.correo)
        {
          this.permiso2 = true;
        }
        else
        {

        }
      }

      if (this.permiso === true)
      {
          alert('El nombre de usuario que ingreso ya existe, ingrese otro');
      }
      else if (this.permiso2 === true)
      {
        alert('El correo que ingreso ya existe, ingrese otro');
      }
      else if (this.register.contrasena.length < 8 )
      {
          alert('La contraseña debe de contener mas de 8 caracteres');
      }
      else
      {
        registro.usuario = this.register.usuario;
        registro.repcontraseña = this.register.newcontrasena;
        registro.contraseña = this.register.contrasena;
        registro.correo = this.register.correo;
        registro.imagen = '..//..//assets//gamer.png';

        $('.checkbox:checked').each(
          function ()
          {
              registro.plataforma.push($(this).val());
          }
        );
        $('.checkbox2:checked').each(
          function ()
          {
              registro.videojuego.push($(this).val());
          }
        );

        if (registro.plataforma === [])
        {
          registro.plataforma.push("sin plataforma");
        }
        if (registro.videojuego === [])
        {
          registro.videojuego.push("sin videojuego");
        }

        // registro.videojuego = this.videojuegox;
        const correoStorage = this.register.correo;
        const contrasenaStorage = this.register.contrasena;

        const email = String(correoStorage);
        const password = String(contrasenaStorage);
        localStorage.setItem('PerfilUsuario', this.register.correo);
        localStorage.setItem('NombreUser', this.register.usuario);

        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
          console.log(error.code);
          console.log(error.message);
        });
        this.respuestasService.postRegistroNormal(registro)
        .subscribe(newpres => {});

        Swal.fire({
          icon: 'success',
          title: 'Se creo la cuenta',
          showConfirmButton: false,
          timer: 500
        })

        this.register.usuario = '';
        this.register.correo = '';
        this.register.contrasena = '';
        this.register.newcontrasena = '';

        setTimeout(() => {
          localStorage.setItem('PerfilUsuario', this.register.correo);
          this.router.navigate(['/modulomenu']);
        },1000);
      }
    }
  }

  seleccionarTodos() {
    $(".checkbox2").prop("checked", true);
  }

  quitarSeleccionados() {
    $(".checkbox2").prop("checked", false);
  }
}
