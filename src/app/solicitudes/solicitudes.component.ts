import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../servicios/notificaciones.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  nombreusuario;
  notificacionUser1: string [] = [];
  notificacionUser2: string [] = [];
  notificacionMotivo: string [] = [];
  existenciaNoti: boolean = false;

  constructor(     private obtenernotifiaciones: NotificacionesService,
    ) {
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
        if (users === notificaciones[key].usuario1) {
          if (notificaciones[key].estado === 'false') {
            if (notificaciones[key].motivo === ' Te envio una solicitud de amistad') {
              notificacionUser1[i] = notificaciones[key];
              notificacionUser2[i] = notificaciones[key].usuario2;
              notificacionMotivo[i] = notificaciones[key].motivo;
              i = i + 1;
            }
          
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
  actualizar() {
    this.actualizartodo();
  }
  cancelaramigo(usuario, motivo) {
    this.obtenernotifiaciones.getNotifiaciones()
    .subscribe(notificacion => {
      const users = this.nombreusuario;
      const users2 = usuario;
      const motivo1 = motivo;
      let llave;
      Object.keys(notificacion).forEach(function(key) {
        if (notificacion[key].estado === 'false') {
          if (motivo1 === ' Te envio una solicitud de amistad') {
            if (notificacion[key].usuario1 === users && notificacion[key].usuario2 === users2) {
              llave = key;
            }
          }
        }
        });
        this.obtenernotifiaciones.delnotificacion(llave).subscribe(res => {
          alert('Se elimino la solicitud con exito');
          this.actualizartodo();

    
    });
      });
  }

  actualizartodo() {
      this.notificacionUser1 = [];
      this.notificacionUser2 = [];
      this.notificacionMotivo = [];
      // Aqui se obtienen las notificaciones
      this.obtenernotifiaciones.getNotifiaciones()
      .subscribe(notificaciones => {
        let i = 0;
        const notificacionUser1: string [] = [];
        const notificacionUser2: string [] = [];
        const notificacionMotivo: string [] = [];
        const users2 = this.nombreusuario;

        Object.keys(notificaciones).forEach(function(key) {
          if (users2 === notificaciones[key].usuario1) {
            if (notificaciones[key].estado === 'false') {
              if (notificaciones[key].motivo === ' Te envio una solicitud de amistad') {
                notificacionUser1[i] = notificaciones[key];
                notificacionUser2[i] = notificaciones[key].usuario2;
                notificacionMotivo[i] = notificaciones[key].motivo;
                i = i + 1;
              }
            
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
}
