import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore} from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import $ from 'jquery';
import { GlobalesService } from '../servicios/globales.service';
import { NotificacionesService } from '../servicios/notificaciones.service';
import {RespuestasService } from '../servicios/respuestas.service';
import {Message} from 'primeng/components/common/api';

class Notificaciones {
  usuario1;
  usuario2;
  motivo;
  estado;
  mensaje;
}

@Component({
  selector: 'app-usuariorecomendados',
  templateUrl: './usuariorecomendados.component.html',
  styleUrls: ['./usuariorecomendados.component.css']
})
export class UsuariorecomendadosComponent implements OnInit {
  msgs: Message[] = [];
  msgs2: Message[] = [];
  existencia = false;
  existencianotifi = false;
  respuestas: any [] = [];
  nombreusuario;
  nombreplataforma;
  nombreusuario2;
  amigousuario: string[] = [];
  // variables booleanas
  sijuego: boolean[] = [];
  siplataforma: boolean[] = [];
  // aqui son las variales para obtener
  portadasImagenes: string [] = [];
  portadasNomAlbum: string [] = [];
  portadasNomAlbum2: string [] = [];
  portadasNomAlbum3: string [] = [];
  portadasNomAlbum4: string [] = [];
  portadasNomAlbum5: string [] = [];
  imagenperfil;
  nomusuario;
  plataformasps: string;
  plataformaxbox: string;
  plataformapc: string;
  plataformawii: string;
  plataformaswitch: string;
  sinplataforma: String = 'sin plataformas';
  sinvideojuegos: String = 'sin videojuegos';

  videojuegos: string[] = [];
  pl1: boolean = false;
  pl2: boolean = false;
  pl3: boolean = false;
  pl4: boolean = false;
  pl5: boolean = false;
  jue1: boolean = false;
  jue2: boolean = false;
  jue3: boolean = false;
  jue4: boolean = false;
  jue5: boolean = false;
  jue6: boolean = false;
  jue7: boolean = false;
  jue8: boolean = false;
  jue9: boolean = false;
  jue10: boolean = false;
  jue11: boolean = false;
  jue12: boolean = false;
  jue13: boolean = false;
  jue14: boolean = false;
  jue15: boolean = false;
  jue16: boolean = false;
  jue17: boolean = false;
  jue18: boolean = false;
  register;

  esamigo: boolean = false;
  constructor(
    private storage: AngularFireStorage,
    private cookie: CookieService,
    private notifiaciones: NotificacionesService,
    private usuarios: RespuestasService
  ) {
    this.notifiaciones.getNotifiaciones()
.subscribe(respuestas => {
  for ( const i in respuestas ) {
   this.respuestas[i] = respuestas[i];
  }
  });
    this.nombreusuario =  localStorage.getItem('nombreUsuario');
      this.usuarios.getRespuestas()
      .subscribe(respuestas => {
        for (const i in respuestas ) {
          this.respuestas[i] = respuestas[i];
          if (this.respuestas[i].usuario === this.nombreusuario) {
            if (this.respuestas[i].plataforma.Playstation === 'true') {
              this.pl1 = true;
            }
            if (this.respuestas[i].plataforma.xbox === 'true') {
              this.pl2 = true;
            }
            if (this.respuestas[i].plataforma.pc === 'true') {
              this.pl3 = true;
            }
            if (this.respuestas[i].plataforma.NintendoWii === 'true') {
              this.pl4 = true;
            } if (this.respuestas[i].plataforma.NintendoSwitch === 'true') {
              this.pl5 = true;
            }
            if (this.respuestas[i].videojuego.black_ops_4 === 'true') {
              this.jue1 = true;
            }
            if (this.respuestas[i].videojuego.counter_strike === 'true') {
              this.jue2 = true;
            } if (this.respuestas[i].videojuego.fifa_19 === 'true') {
              this.jue3 = true;
            } if (this.respuestas[i].videojuego.fornite === 'true') {
              this.jue4 = true;
            } if (this.respuestas[i].videojuego.forza === 'true') {
              this.jue5 = true;
            } if (this.respuestas[i].videojuego.gears_of_war === 'true') {
              this.jue6 = true;
            } if (this.respuestas[i].videojuego.god_of_war_3 === 'true') {
              this.jue7 = true;
            } if (this.respuestas[i].videojuego.left_for_dead === 'true') {
              this.jue8 = true;
            } if (this.respuestas[i].videojuego.lol === 'true') {
              this.jue9 = true;
            } if (this.respuestas[i].videojuego.mario_bros === 'true') {
              this.jue10 = true;
            } if (this.respuestas[i].videojuego.mario_galaxy === 'true') {
              this.jue11 = true;
            } if (this.respuestas[i].videojuego.mario_party === 'true') {
              this.jue12 = true;
            } if (this.respuestas[i].videojuego.pokemon_battle === 'true') {
              this.jue13 = true;
            } if (this.respuestas[i].videojuego.ratchet_and_clank === 'true') {
              this.jue14 = true;
            } if (this.respuestas[i].videojuego.red_dead_redemption_2 === 'true') {
              this.jue15 = true;
            } if (this.respuestas[i].videojuego.super_smahs_bros === 'true') {
              this.jue16 = true;
            } if (this.respuestas[i].videojuego.the_last_of_us === 'true') {
              this.jue17 = true;
            } if (this.respuestas[i].videojuego.zelda === 'true') {
              this.jue18 = true;
            }
          }
        }
      });
     
      this.usuarios.getAmigos()
      .subscribe(respuestas => {
        let i = 0;

        let esamigo: boolean = false;
        let amigousuario: string [] = [];
        const users = this.nombreusuario;

        Object.keys(respuestas).forEach(function(key) {
          if (respuestas[key].usuario === users) {
            amigousuario[i] = respuestas[key].amigos;
            i = i + 1;
          } else if (respuestas[key].amigos === users) {
            amigousuario[i] = respuestas[key].usuario;
          }

        });
        for (let i = 0; i < amigousuario.length; i++) {
          this.amigousuario[i] = amigousuario[i];

        }
      });



      // aqui va la variable del local storage

      this.usuarios.getRespuestas()
      .subscribe(notifiaciones => {
        let i = 0;
        let o = 0;
        let e = 0;
        const users = this.nombreusuario;
        let pla1: boolean = false;
        let pla2: boolean = false ;
        let pla3:boolean = false;
        let pla4:boolean = false;
        let pla5:boolean = false;
        let jue1: boolean = false;
        let jue2: boolean = false;
        let jue3: boolean = false;
        let jue4: boolean = false;
        let jue5: boolean = false;
        let jue6: boolean = false;
        let jue7: boolean = false;
        let jue8: boolean = false;
        let jue9: boolean = false;
        let jue10: boolean = false;
        let jue11: boolean = false;
        let jue12: boolean = false;
        let jue13: boolean = false;
        let jue14: boolean = false;
        let jue15: boolean = false;
        let jue16: boolean = false;
        let jue17: boolean = false;
        let jue18: boolean = false;
        if (this.pl1 === true) {
          pla1 = true;
        }
        if (this.pl4 === true) {
          pla4 = true;
        }
        if (this.pl2 === true) {
          pla2 = true;
        }
        if (this.pl3 === true) {
          pla3 = true;
        }
        if (this.pl5 === true) {
          pla5 = true;
        }
        if (this.jue1 === true) {
          jue1 = true;
        }
        if (this.jue2 === true) {
          jue2 = true;
        } 
         if (this.jue3 === true) {
          jue3 = true;
        } 
         if (this.jue4 === true) {
          jue4 = true;
        } 
         if (this.jue5 === true) {
          jue5 = true;
        } 
         if (this.jue6 === true) {
          jue6 = true;
        } 
         if (this.jue7 === true) {
          jue7 = true;
        } 
         if (this.jue8 === true) {
          jue8 = true;
        }
          if (this.jue9 === true) {
          jue9 = true;
        }
          if (this.jue10 === true) {
          jue10 = true;
        }
          if (this.jue11 === true) {
          jue11 = true;
        }
          if (this.jue12 === true) {
          jue12 = true;
        }
          if (this.jue13 === true) {
          jue13 = true;
        }
          if (this.jue14 === true) {
          jue14 = true;
        }
          if (this.jue15 === true) {
          jue15 = true;
        }
          if (this.jue16 === true) {
          jue16 = true;
        }
          if (this.jue17 === true) {
          jue17 = true;
        }
          if (this.jue18 === true) {
          jue18 = true;
        }
        const todosamigos: string[] = this.amigousuario;
        const todos: string[] = [];
        const portadasImagenes: string [] = [];
        const portadasNomAlbum: string [] = [];
        const portadasNomAlbum2: string [] = [];
        const portadasNomAlbum3: string [] = [];
        const portadasNomAlbum4: string [] = [];
        const portadasNomAlbum5: string [] = [];
        const portadajuego1: string[] = [];
        const portadajuego2: string[] = [];
        const portadajuego3: string[] = [];
        const portadajuego4: string[] = [];
        const portadajuego5: string[] = [];
        const portadajuego6: string[] = [];
        const portadajuego7: string[] = [];
        const portadajuego8: string[] = [];
        const portadajuego9: string[] = [];
        const portadajuego10: string[] = [];
        const portadajuego11: string[] = [];
        const portadajuego12: string[] = [];
        const portadajuego13: string[] = [];
        const portadajuego14: string[] = [];
        const portadajuego15: string[] = [];
        const portadajuego16: string[] = [];
        const portadajuego17: string[] = [];
        const portadajuego18: string[] = [];

        console.log('AQUI');
        console.log(notifiaciones);
        console.log(todosamigos);
        let bol: boolean;
        Object.keys(notifiaciones).forEach(function(key)  {
          const element = notifiaciones[key];
          let element2: string;
          for (let indexx = 0; indexx < todosamigos.length; indexx++) {
            element2 = todosamigos[indexx];
            if (element.usuario === element2 || element.usuario === users) {
              bol = true;
            }
          }
          if (bol === true) {
          } else {
            if (element.usuario === users ) {

            } else if (element.plataforma.Playstation === 'true' &&  pla1 === true) {
              portadasImagenes[i] = element.usuario;
              portadasNomAlbum[i] = element.plataforma.Playstation;
              i = i + 1;
            } else if (element.plataforma.NintendoWii === 'true' &&  pla4 === true ) {
              portadasImagenes[i] = element.usuario;
              portadasNomAlbum4[i] = element.plataforma.NintendoWii;
              i = i + 1;
            } else if (element.plataforma.pc === 'true' &&  pla3 === true) {
              portadasImagenes[i] = element.usuario;
              portadasNomAlbum3[i] = notifiaciones[key].plataforma.pc;
              i = i + 1;
            } else if (element.plataforma.xbox === 'true' &&  pla2 === true) {
              portadasImagenes[i] = element.usuario;
              portadasNomAlbum2[i] = element.plataforma.xbox;
              i = i + 1;
            } else if (element.plataforma.NintendoSwitch === 'true' && pla5 === true) {
              portadasImagenes[i] = element.usuario;
              portadasNomAlbum5[i] = element.plataforma.NintendoSwitch;
              i = i + 1;
            } else if (element.videojuego.black_ops_4 === 'true' && jue1 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego1[i] = element.videojuego.black_ops_4;
              i = i + 1;
            } else if (element.videojuego.counter_strike === 'true'  && jue2 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego2[i] = element.videojuego.counter_strike;
              i = i + 1;
            } else if (element.videojuego.fifa_19 === 'true' && jue3 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego3[i] = element.videojuego.fifa_19;
              i = i + 1;
            } else if (element.videojuego.fornite === 'true' && jue4 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego4[i] = element.videojuego.fornite;
              i = i + 1;
            } else if (element.videojuego.forza === 'true' && jue5 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego5[i] = element.videojuego.forza;
              i = i + 1;
            } else if (element.videojuego.gears_of_war === 'true' && jue6 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego6[i] = element.videojuego.gears_of_war;
              i = i + 1;

            } else if (element.videojuego.god_of_war_3 === 'true' && jue7 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego7[i] = element.videojuego.god_of_war_3;
              i = i + 1;

            } else if (element.videojuego.left_for_dead === 'true' && jue8 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego8[i] = element.videojuego.left_for_dead;
              i = i + 1;

            } else if (element.videojuego.lol === 'true' && jue9 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego9[i] = element.videojuego.lol;
              i = i + 1;

            } else if (element.videojuego.mario_bros === 'true' && jue10 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego10[i] = element.videojuego.mario_bros;
              i = i + 1;

            } else if (element.videojuego.mario_galaxy === 'true' && jue11 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego11[i] = element.videojuego.mario_galaxy;
              i = i + 1;

            } else if (element.videojuego.mario_party === 'true' && jue12 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego12[i] = element.videojuego.mario_party;
              i = i + 1;

            } else if (element.videojuego.pokemon_battle === 'true' && jue13 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego13[i] = element.videojuego.pokemon_battle;
              i = i + 1;

            } else if (element.videojuego.ratchet_and_clank === 'true' && jue14 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego14[i] = element.videojuego.ratchet_and_clank;
              i = i + 1;

            } else if (element.videojuego.red_dead_redemption_2 === 'true' && jue15 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego15[i] = element.videojuego.red_dead_redemption_2;
              i = i + 1;

            } else if (element.videojuego.super_smahs_bros === 'true' && jue16 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego16[i] = element.videojuego.super_smahs_bros;
              i = i + 1;

            } else if (element.videojuego.the_last_of_us === 'true' && jue17 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego17[i] = element.videojuego.the_last_of_us;
              i = i + 1;

            } else if (element.videojuego.zelda === 'true' && jue18 === true) {
              portadasImagenes[i] = element.usuario;
              portadajuego18[i] = element.videojuego.zelda;
              i = i + 1;

            }
          }
          bol = false;
        });

          Object.keys(notifiaciones).forEach(function(key) {
            // todoamigos es mi array con la lista de amigos agregados
            for (let index = 0; index < todosamigos.length; index++) {
              const element = todosamigos[index];
              if (notifiaciones[key].usuario !== element) {
              
              }

            }

          });
        
        for ( let i = 0; i < portadasImagenes.length; i++) {
          if (portadasImagenes[i] === this.nombreusuario) {

          } else {
            if (portadasNomAlbum[i] === 'true' && this.pl1 === true) {
              this.siplataforma[i] = true;
              this.sijuego[i] = false;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'play station';
            } else if (portadasNomAlbum2[i] === 'true' && this.pl2 === true) {
              this.siplataforma[i] = true;
              this.sijuego[i] = false;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Xbox';
            } else if (portadasNomAlbum3[i] === 'true' && this.pl3 === true) {
              this.siplataforma[i] = true;
              this.sijuego[i] = false;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Pc';
            } else if (portadasNomAlbum4[i] === 'true' && this.pl4 === true) {
              this.siplataforma[i] = true;
              this.sijuego[i] = false;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Nintendo Wii';
            } else if (portadasNomAlbum5[i] === 'true' && this.pl5 === true) {
              this.siplataforma[i] = true;
              this.sijuego[i] = false;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Nintendo Switch';
            } else if (portadajuego1[i] === 'true' && this.jue1 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Black ops 4';
            } else if (portadajuego2[i] === 'true' && this.jue2 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Counter strike';
            } else if (portadajuego3[i] === 'true' && this.jue3 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Fifa 19';
            } else if (portadajuego4[i] === 'true' && this.jue4 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Fornite';
            } else if (portadajuego5[i] === 'true' && this.jue5 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Forza';
            } else if (portadajuego6[i] === 'true' && this.jue6 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Gears of war';
            } else if (portadajuego7[i] === 'true' && this.jue7 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'God of war 3';
            } else if (portadajuego8[i] === 'true' && this.jue8 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Left for dead';
            } else if (portadajuego9[i] === 'true' && this.jue9 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Lol';
            } else if (portadajuego10[i] === 'true' && this.jue10 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Mario bross';
            } else if (portadajuego11[i] === 'true' && this.jue11 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Mario galaxy';
            } else if (portadajuego12[i] === 'true' && this.jue12 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Mario party';
            } else if (portadajuego13[i] === 'true' && this.jue13 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Pokemon battle';
            } else if (portadajuego14[i] === 'true' && this.jue14 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Rachet and clank';
            } else if (portadajuego15[i] === 'true' && this.jue15 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Red dead redemption 2';
            } else if (portadajuego16[i] === 'true' && this.jue16 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Super marios brosh';
            } else if (portadajuego17[i] === 'true' && this.jue17 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'The last of us ';
            } else if (portadajuego18[i] === 'true' && this.jue18 === true) {
              this.siplataforma[i] = false;
              this.sijuego[i] = true;
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Zelda';
            }
            if (this.portadasImagenes[i] != null || this.portadasImagenes[i] !== 'undefined') {
              this.existencia = true;
            }
          }
        }
      });
  }
  nombretuusuario(usuario) {
    localStorage.removeItem('suusuario');
    localStorage.setItem('suusuario', usuario);
  }
  ngOnInit() {
    this.register = {
      mensaje: '',
    };
  }
  imagen(usuario) {
    this.videojuegos = [];
    this.plataformapc = '';
    this.plataformasps = '';
    this.plataformaswitch = '';
    this.plataformawii = '';
    this.plataformaxbox = '';
    this.sinplataforma = 'Sin plataformas';
    this.sinvideojuegos = 'Sin videojuegos';
    for (const i in this.respuestas) {
      if ( this.respuestas[i].usuario === usuario) {
          this.nomusuario = this.respuestas[i].usuario;
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
  enviar(usuario) {
    this.existencianotifi = false;
    this.nombreusuario2 = usuario;
    setTimeout(() => {
      this.notifiaciones.getNotifiaciones()
    .subscribe(respuestas => {
      for ( const i in respuestas ) {
       this.respuestas[i] = respuestas[i];
      }
      });
    }, 1000);
    
    for (const i in this.respuestas) {
      if (this.respuestas[i].usuario1 === this.nombreusuario && this.respuestas[i].usuario2 === usuario && this.respuestas[i].motivo === ' Te envio una solicitud de amistad') {
        this.msgs = [];
        this.msgs.push({severity:'error', detail:' Ya tiene una solicitud de tu parte' });
        this.existencianotifi = true;
      }
    }
    if (this.existencianotifi === true) {
      this.notifiaciones.getNotifiaciones()
      .subscribe(respuestas => {
        for ( const i in respuestas ) {
         this.respuestas[i] = respuestas[i];
        }
        });
    } else {
      const registro = new Notificaciones();
      registro.usuario1 = this.nombreusuario;
        registro.usuario2 = usuario;
        registro.motivo = ' Te envio una solicitud de amistad';
        registro.estado = 'false';
        this.notifiaciones.postRegistroNormal(registro)
          .subscribe(newpres => {});
          this.msgs = [];
          this.msgs.push({severity:'success', summary:'Solicitud enviada a', detail:usuario});
        }
  }
  mensaje() {

  }
  enviarmensaje(usuario) {
    this.nombreusuario2 = usuario;
  }
  Enviarmensaje2(usuario) {
    if (this.register.mensaje === '') {
      this.msgs2 = [];
      this.msgs2.push({severity:'error', detail:' Falta agregar el mensaje' });
       } else {
        const registro = new Notificaciones();
           registro.usuario1 = this.nombreusuario;
          registro.usuario2 = usuario;
          registro.motivo = ' Te envio un mensaje';
          registro.estado = 'false';
          registro.mensaje = this.register.mensaje;
          this.notifiaciones.postRegistroNormal(registro)
            .subscribe(newpres => {});



        this.msgs2 = [];
        this.msgs2.push({severity:'success', detail:' Se envio el mensaje con exito' });
        this.register.mensaje = '';
    }


  }
}
