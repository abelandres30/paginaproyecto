import { Component, OnInit } from '@angular/core';
import { Usuarioperfil } from '../../models/cuenta';
import { RespuestasService } from '../../services/cuentas.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css']
})

export class AmigosComponent implements OnInit {
  InfoUsuario: Usuarioperfil;
  InfoAmigo: Usuarioperfil;
  solicitudesRecibidas: any[] = [];
  solicitudesEnviadas: any[] = [];
  Corrreousuario: string;
  nombreusuario: string;
  existenciaPlataforma: boolean;
  idUser: string;

  constructor(private Cuenta: RespuestasService, private router: Router) { }

  ngOnInit(): void {
    this.Corrreousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.obtenerInformacionUsuario();
  }

  obtenerInformacionUsuario() {
    this.Cuenta.obtenerPorCorreo(this.Corrreousuario).subscribe(res => {
      this.InfoUsuario = res[0] as Usuarioperfil;
    });
  }

  eliminarSolicitud(solicitud: any, index: any) {
    const div = document.getElementById(solicitud.usuario);

    if (div) {
      let width = 300;
      let height = 100;
      let opacity = 1;

      const intervalo = setInterval(() => {
        if (width <= 0 || height <= 0 || opacity <= 0) {
          clearInterval(intervalo);
          div.style.display = 'none';
          this.Cuenta.eliminarSolicitudEnviada(this.InfoUsuario['id'], solicitud.id, this.InfoUsuario.correo,  solicitud.correo);
        } else {
          const randomWidthDecrease = Math.random() * 10;
          const randomHeightDecrease = Math.random() * 5;

          width -= randomWidthDecrease;
          height -= randomHeightDecrease;

          opacity -= 0.03 + Math.random() * 0.03;

          div.style.width = `${width}px`;
          div.style.height = `${height}px`;
          div.style.opacity = opacity.toString();
        }
      }, 50);
    }
  }

  aceptarSolicitud(solicitud: any, index: any) {
    let usuarioSolicitudRecibida = Object.assign({}, {
      correo: solicitud.correo,
      usuario: solicitud.usuario,
      imagen: solicitud.imagen,
      plataforma: solicitud.plataforma,
      videojuego: solicitud.videojuego,
      id: solicitud.id
    });

    let usuarioActual = Object.assign({}, {
      correo: this.InfoUsuario.correo,
      usuario: this.InfoUsuario.usuario,
      imagen: this.InfoUsuario.imagen,
      plataforma: this.InfoUsuario.plataforma,
      videojuego: this.InfoUsuario.videojuego,
      id: this.InfoUsuario['id']
    });

    const div = document.getElementById(solicitud.usuario);

    if (div) {
      let width = 300;
      let height = 100;
      let opacity = 1;

      const intervalo = setInterval(() => {
        if (width <= 0 || height <= 0 || opacity <= 0) {
          clearInterval(intervalo);
          div.style.display = 'none';
          this.Cuenta.aceptarSolicitud(usuarioSolicitudRecibida, usuarioActual, this.InfoUsuario['id'], solicitud.id, this.InfoUsuario.correo,  solicitud.correo);
        } else {
          const randomWidthDecrease = Math.random() * 10;
          const randomHeightDecrease = Math.random() * 5;

          width -= randomWidthDecrease;
          height -= randomHeightDecrease;

          opacity -= 0.03 + Math.random() * 0.03;

          div.style.width = `${width}px`;
          div.style.height = `${height}px`;
          div.style.opacity = opacity.toString();
        }
      }, 50);
    }
  }

  eliminarAmigo(usuario:any) {

    const div = document.getElementById(usuario.usuario);

    if (div) {
      let width = 300;
      let height = 100;
      let opacity = 1;

      const intervalo = setInterval(() => {
        if (width <= 0 || height <= 0 || opacity <= 0) {
          clearInterval(intervalo);
          div.style.display = 'none';
          this.Cuenta.eliminarAmigo(this.InfoUsuario['id'], usuario.id, this.InfoUsuario.correo, usuario.correo);
        } else {
          const randomWidthDecrease = Math.random() * 10;
          const randomHeightDecrease = Math.random() * 5;

          width -= randomWidthDecrease;
          height -= randomHeightDecrease;

          opacity -= 0.03 + Math.random() * 0.03;

          div.style.width = `${width}px`;
          div.style.height = `${height}px`;
          div.style.opacity = opacity.toString();
        }
      }, 50);
    }
  }
}
