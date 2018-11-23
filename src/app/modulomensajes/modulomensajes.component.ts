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
import { RegistroamigosService } from '../servicios/registroamigos.service';

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
  TodosAmigos: string [] = [];
  CantidadAmigos: string [] = [];

  existenciaNoti: boolean = false;
  existenciaamigos: boolean = false;
  constructor(private storage: AngularFireStorage,
    private cookie: CookieService,
    private global: GlobalesService,
     private respuestasService: RespuestasService,
     private registropublicacionesService: RegistroPublicacionService,
     private obtenernotifiaciones: NotificacionesService,
     private obteneramigos: RegistroamigosService) {
       // aqui se obtiene el usuario
      this.nombreusuario =  localStorage.getItem('nombreUsuario');

      // aqui se obtienen los amigos que se tiene agregados
      this.obteneramigos.getRespuestas()
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
  }

}
