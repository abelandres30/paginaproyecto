import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import $ from 'jquery';
import { RegistroPublicacionService } from '../servicios/registropublicacion.service';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';
import { GlobalesService } from '../servicios/globales.service';
import { RespuestasService } from '../servicios/respuestas.service';
import { NotificacionesService } from '../servicios/notificaciones.service';

@Component({
  selector: 'app-modulomensajes',
  templateUrl: './modulomensajes.component.html',
  styleUrls: ['./modulomensajes.component.css']
})
export class ModulomensajesComponent implements OnInit {
  nombreusuario;

  // son las variables para las notificaciones
  notificacionUser1: string [] = [];
  notificacionUser2: string [] = [];
  notificacionMotivo: string [] = [];
  existenciaNoti: boolean = false;
  constructor(private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,
     private respuestasService: RespuestasService,
     private registropublicacionesService: RegistroPublicacionService,
     private obtenernotifiaciones: NotificacionesService) {
       // aqui se obtiene el usuario
      this.nombreusuario =  localStorage.getItem('nombreUsuario');

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
  }

}
