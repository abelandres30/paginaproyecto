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
 

@Component({
  selector: 'app-usuariorecomendados',
  templateUrl: './usuariorecomendados.component.html',
  styleUrls: ['./usuariorecomendados.component.css']
})
export class UsuariorecomendadosComponent implements OnInit {
  existencia: boolean = false;
  respuestas: any [] = [];
  nombreusuario;
  nombreplataforma;
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

  constructor(
    private storage: AngularFireStorage,
    private cookie: CookieService,
    private notifiaciones: NotificacionesService,
    private usuarios: RespuestasService,
  ) {
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
     

      // aqui va la variable del local storage

      this.usuarios.getRespuestas()
      .subscribe(notifiaciones => {
        let i = 0;
        const portadasImagenes: string [] = [];
        const portadasNomAlbum: string [] = [];
        const portadasNomAlbum2: string [] = [];
        const portadasNomAlbum3: string [] = [];
        const portadasNomAlbum4: string [] = [];
        const portadasNomAlbum5: string [] = [];

        Object.keys(notifiaciones).forEach(function(key) {
          portadasImagenes[i] = notifiaciones[key].usuario;
          portadasNomAlbum[i] = notifiaciones[key].plataforma.Playstation;
          portadasNomAlbum2[i] = notifiaciones[key].plataforma.xbox;
          portadasNomAlbum3[i] = notifiaciones[key].plataforma.pc;
          portadasNomAlbum4[i] = notifiaciones[key].plataforma.NintendoWii;
          portadasNomAlbum5[i] = notifiaciones[key].plataforma.NintendoSwitch;

          i = i + 1;
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

  enviar() {

  }
}
