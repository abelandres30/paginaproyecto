import { Component, OnInit } from '@angular/core';
import { RespuestasService } from '../servicios/respuestas.service';
import $ from 'jquery';
import { AngularFireStorage } from 'angularfire2/storage';
import { NotificacionesService } from '../servicios/notificaciones.service';
import {Message} from 'primeng/components/common/api';
import { ConfiguracionesService } from '../servicios/configuraciones.service';
import { EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';

class Informacion {
  newcorreo: string;
  newcontrasena: string;
}
class Usuarioperfil {
  usuario: any ;
  contraseña: string;
  repcontraseña: string;
  correo: EmailValidator;
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
  // variables para las notificaciones
  notificacionUser1: string [] = [];
  notificacionUser2: string [] = [];
  notificacionMotivo: string [] = [];
  existenciaNoti: boolean = false;
  entra: boolean = false;
  plataformasi: boolean = false;
  plataformasno: boolean = false;

  constructor(private router: Router,
    private Usuarios: RespuestasService,
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
            notificacionUser1[i] = notificaciones[key];
            notificacionUser2[i] = notificaciones[key].usuario1;
            notificacionMotivo[i] = notificaciones[key].motivo;
            i = i + 1;
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
  }
Cambiarcorreo() {
  let correoactuall: string = $('#correoactual').val();
  for (const i in this.respuestas) {
    if (this.respuestas[i].usuario === this.nombreusuario) {
      const registro = new Informacion();
      correoactuall = this.respuestas[i].correo;
      $('#correoactual').val(correoactuall);
    }
  }
}
  modificarCorreo() {
    if (this.register.correo === '' || this.register.contra === '' || this.register.newcontra === '') {
      this.msgs = [];
      this.msgs.push({severity:'error', detail:'Faltan datos por agregar'});
    } else {
        this.entra = true;
      // aqui se obtienen los datos antes de eliminarse
      this.Usuarios.getRespuestas()
      .subscribe(usuario => {
        const users = this.nombreusuario;
        let user2;
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
    registro.plataforma = this.plataformaX;
    registro.videojuego = this.videojuegox;
    this.Usuarios.postRegistroNormal(registro)
    .subscribe(newpres => {});
    alert('Se modifico la cuenta con exito');
    location.reload();
      });
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
        alert('Se elimino la cuenta con exito');
        this.router.navigate(['moduloregistro']);


      });
      });
  }
  Cambioplata() {
  // aqui se obtienen los datos antes de eliminarse
  this.Usuarios.getRespuestas()
  .subscribe(usuario => {
    const users = this.nombreusuario;
    let user2;
    let correo;
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
        registro.plataforma = this.plataformaX;
        registro.videojuego = this.videojuegox;
        this.Usuarios.postRegistroNormal(registro)
        .subscribe(newpres => {});
        alert('Se modifico la cuenta con exito');
        location.reload();
          });
    }
  imagen1() {
    alert('primera imagen');
    this.avatarimagen = 'img\img10.jpg';
  }
  imagen2(){
    alert('segunda imagen');
  }
  imagen3() {
    alert('Tercera imagen');
  }
}
