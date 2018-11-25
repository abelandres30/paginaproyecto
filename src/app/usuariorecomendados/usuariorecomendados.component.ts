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
}

@Component({
  selector: 'app-usuariorecomendados',
  templateUrl: './usuariorecomendados.component.html',
  styleUrls: ['./usuariorecomendados.component.css']
})
export class UsuariorecomendadosComponent implements OnInit {
  msgs: Message[] = [];

  existencia: boolean = false;
  existencianotifi: boolean = false;
  respuestas: any [] = [];
  nombreusuario;
  nombreplataforma;
  nombreusuario2;
  amigousuario: string[] = [];
  // aqui son las variales para obtener
  portadasImagenes: string [] = [];
  portadasNomAlbum: string [] = [];
  portadasNomAlbum2: string [] = [];
  portadasNomAlbum3: string [] = [];
  portadasNomAlbum4: string [] = [];
  portadasNomAlbum5: string [] = [];

  pl1: boolean = false;
  pl2: boolean = false;
  pl3: boolean = false;
  pl4: boolean = false;
  pl5: boolean = false;


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
        const todosamigos: string[] = this.amigousuario;
        const todos: string[] = [];
        const portadasImagenes: string [] = [];
        const portadasNomAlbum: string [] = [];
        const portadasNomAlbum2: string [] = [];
        const portadasNomAlbum3: string [] = [];
        const portadasNomAlbum4: string [] = [];
        const portadasNomAlbum5: string [] = [];

          Object.keys(notifiaciones).forEach(function(key) {
            // todoamigos es mi array con la lista de amigos agregados


            // en este if se compara si el usuario con el que estoy logeado esta en la lista de todos los usuarios
            if (notifiaciones[key].usuario === users) {
              //en este if compararo si un valor de la array de amigos es igual a otro usuario
            } else if ( todosamigos[o] === notifiaciones[key].usuario) {
              alert(notifiaciones[key].usuario + ' este si es igual');
              o = o + 1;
            } else {
                  if (notifiaciones[key].plataforma.Playstation === 'true' &&  pla1 === true) {
                  portadasImagenes[i] = notifiaciones[key].usuario;
                  portadasNomAlbum[i] = notifiaciones[key].plataforma.Playstation;
  
                  i = i + 1;
                } else if (notifiaciones[key].plataforma.NintendoWii === 'true' &&  pla4 === true ) {
                  portadasImagenes[i] = notifiaciones[key].usuario;
                  portadasNomAlbum4[i] = notifiaciones[key].plataforma.NintendoWii;
                
                  i = i + 1;
                } else if (notifiaciones[key].plataforma.pc === 'true' &&  pla3 === true) {
                  portadasImagenes[i] = notifiaciones[key].usuario;
                  portadasNomAlbum3[i] = notifiaciones[key].plataforma.pc;
                  i = i + 1;
                } else if (notifiaciones[key].plataforma.xbox === 'true' &&  pla2 === true) {
                  portadasImagenes[i] = notifiaciones[key].usuario;
                  portadasNomAlbum2[i] = notifiaciones[key].plataforma.xbox;
                  i = i + 1;
                } else if (notifiaciones[key].plataforma.NintendoSwitch === 'true') {
                  portadasImagenes[i] = notifiaciones[key].usuario;
                  portadasNomAlbum5[i] = notifiaciones[key].plataforma.NintendoSwitch;
                  i = i + 1;
                }
            }
                      // aqui termina el object key por lo que hace una iteracion mas

          });
        
       
        for ( let i = 0; i < portadasImagenes.length; i++) {
          if (portadasImagenes[i] === this.nombreusuario) {

          } else {
            if (portadasNomAlbum[i] === 'true' && this.pl1 === true) {
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'play station';
            } else if (portadasNomAlbum2[i] === 'true' && this.pl2 === true) {
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Xbox';
            } else if (portadasNomAlbum3[i] === 'true' && this.pl3 === true) {
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Pc';
            } else if (portadasNomAlbum4[i] === 'true' && this.pl4 === true) {
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Nintendo Wii';
            } else if (portadasNomAlbum5[i] === 'true' && this.pl5 === true) {
              this.portadasImagenes[i] = portadasImagenes[i];
              this.portadasNomAlbum[i] = 'Nintendo Switch';
            }
            if (this.portadasImagenes[i] != null || this.portadasImagenes[i] !== 'undefined') {
              this.existencia = true;
            }
          }
        }
      });
  }

  ngOnInit() {
  }

  enviar(usuario) {
    this.nombreusuario2 = usuario;
    for (const i in this.respuestas) {
      if (this.respuestas[i].usuario1 === this.nombreusuario && this.respuestas[i].usuario2 === usuario) {
        this.msgs = [];
        this.msgs.push({severity:'error', detail:' Ya tiene una solicitud de tu parte' });
        this.existencianotifi = true;
      }
    }
    if (this.existencianotifi === true) {

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
  
    $('#funciona').load('#funciona');

  }
  enviarr() {
    
  }
}
