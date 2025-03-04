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
      this.InfoUsuario.solicitudesAmistadEnviadas !== undefined ? this.obtenerInfoAmistades(this.InfoUsuario['solicitudesAmistadEnviadas'],true) : null;
      this.InfoUsuario.solicitudesAmistadRecibidas !== undefined ? this.obtenerInfoAmistades(this.InfoUsuario['solicitudesAmistadRecibidas'], false) : null;
      this.InfoUsuario.amigos !== undefined ? this.obtenerAmigos(this.InfoUsuario['amigos']) : null;

    });
  }
  obtenerAmigos(amigos: any[]) {
    amigos.forEach((result) => {
      this.Cuenta.obtenerPorCorreo(result.correo).subscribe(res => {
        const usuario = res[0];
        const valorStatusUsuario = result.amigoBorrado;

        const arregloTemporal = this.InfoUsuario.amigos;

        if (arregloTemporal) {
          arregloTemporal.forEach((result2, index) => {
            if (result2.correo === usuario.correo) {
              arregloTemporal[index] = usuario;

              delete arregloTemporal[index].contrasena;
              delete arregloTemporal[index].videojuego;
              delete arregloTemporal[index].plataforma;
              delete arregloTemporal[index].amigos;
              delete arregloTemporal[index].descripcion;

              arregloTemporal[index]['amigoBorrado'] = valorStatusUsuario;
            }
          });
        }
      });
    });
  }

  obtenerInfoAmistades(solicitudesAmistad: any, campo: boolean) {
    solicitudesAmistad.forEach((result) => {
      this.Cuenta.obtenerPorCorreo(result.correo).subscribe(res => {
        const usuario = res[0];
        const valorStatusUsuario = result.usuarioRechazado;

        const arregloTemporal = campo ? this.InfoUsuario.solicitudesAmistadEnviadas : this.InfoUsuario.solicitudesAmistadRecibidas;

        if (arregloTemporal) {
          arregloTemporal.forEach((result2, index) => {
            if (result2.correo === usuario.correo) {
              arregloTemporal[index] = usuario;

              arregloTemporal[index]['usuarioRechazado'] = valorStatusUsuario;
            }
          });
        }
      });
    });
  }

  eliminarSolicitud(solicitud: any) {
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

  aceptarSolicitud(solicitud: any) {
    let usuarioSolicitudRecibida = Object.assign({}, {
      correo: solicitud.correo,
      usuario: solicitud.usuario,
      amigoBorrado: false,
      id: solicitud.id
    });

    let usuarioActual = Object.assign({}, {
      correo: this.InfoUsuario.correo,
      usuario: this.InfoUsuario.usuario,
      amigoBorrado: false,
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

  cambiarStatusSolicitud(solicitud: any, status: boolean, string: any) {

    let usuarioSolicitudRecibida = Object.assign({}, {
      correo: solicitud.correo,
      usuario: solicitud.usuario,
      usuarioRechazado: status,
      id: solicitud.id
    });

    let usuarioActual = Object.assign({}, {
      correo: this.InfoUsuario.correo,
      usuario: this.InfoUsuario.usuario,
      usuarioRechazado: status,
      id: this.InfoUsuario['id']
    });

    const div = document.getElementById(solicitud.usuario+string);

    if (div) {
      let width = 300;
      let height = 100;
      let opacity = 1;

      const intervalo = setInterval(() => {
        if (width <= 0 || height <= 0 || opacity <= 0) {
          clearInterval(intervalo);
          div.style.display = 'none';
          this.Cuenta.cambiarStatusSolicitud(usuarioSolicitudRecibida, usuarioActual, this.InfoUsuario['id'], solicitud.id, this.InfoUsuario.correo,  solicitud.correo);
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

