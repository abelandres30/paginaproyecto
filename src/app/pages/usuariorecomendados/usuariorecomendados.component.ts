import { Component, OnInit } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service';
import { Usuarioperfil } from 'src/app/models/cuenta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuariorecomendados',
  templateUrl: './usuariorecomendados.component.html',
  styleUrls: ['./usuariorecomendados.component.css']
})

export class UsuariorecomendadosComponent implements OnInit {
  nombreusuario;
  amigousuario: string[] = [];

  CorreoUsuario: string;
  InfoUsuarios: Usuarioperfil[] = [];
  InfoUser: Usuarioperfil;

  animacionCargando:boolean = true;

  constructor (private usuarios: RespuestasService )

  // CARGA EL SITIO
  {
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.CorreoUsuario = localStorage.getItem('PerfilUsuario')

    this.usuarios.obtenerPorCorreo(this.CorreoUsuario).subscribe(res => {
      this.InfoUser = res[0] as Usuarioperfil;
      this.usuarios.obtenerUsuariosRecomendados().subscribe((items) => {

        items = items.filter(item => item.correo !== this.CorreoUsuario && item !== 'ejemplo');

        var usuariosPlataforma = items.filter(item => item.plataforma?.some((plata:any) => this.InfoUser.plataforma?.find(itemArray => itemArray.slug === plata.slug)));

        var usuariosVideojuego = items.filter(item => item.videojuego?.some((juego:any) => this.InfoUser.videojuego?.find(itemArray => itemArray.slug === juego.slug)));

        let combinado = [...usuariosPlataforma, ...usuariosVideojuego];

        this.InfoUsuarios = combinado.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.correo === obj.correo
          ))
        );

        this.InfoUsuarios = this.InfoUsuarios.filter(objeto =>
          !this.InfoUser.solicitudesAmistadEnviadas?.some(correoObj => correoObj.correo === objeto.correo) &&
          !this.InfoUser.solicitudesAmistadRecibidas?.some(correoObj => correoObj.correo === objeto.correo) &&
          !this.InfoUser.amigos?.some(correoObj => correoObj.correo === objeto.correo)
        );

        this.animacionCargando = false;

      }, error => this.mostrarErrorTryCatch(error));
    }, error => this.mostrarErrorTryCatch(error) );
  }

  ngOnInit() {}

  enviarSolicitud(usuario: any, i:any) {
    let usuarioSolicitudRecibe = Object.assign({}, {
      correo: usuario.correo,
      usuario: usuario.usuario,
      id: usuario.id,
      usuarioRechazado: false
    });

    let usuarioSolicitudEnvia = Object.assign({}, {
      correo: this.InfoUser.correo,
      usuario: this.InfoUser.usuario,
      id: this.InfoUser['id'],
      usuarioRechazado: false
    });

    const div = document.getElementById(usuario.usuario);

    if (div) {
      let width = 300;
      let height = 100;
      let opacity = 1;

      const intervalo = setInterval(() => {
        if (width <= 0 || height <= 0 || opacity <= 0) {
          clearInterval(intervalo);
          div.style.display = 'none';

          try {
            this.usuarios.agregarSolicitudEnviada(usuarioSolicitudEnvia, usuarioSolicitudRecibe, this.InfoUser['id'], usuario.id);
          } catch (error) {
            this.mostrarErrorTryCatch(error);
          }
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
      }, 10);
    }
  }

  mensaje() { }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error',title: error ,showConfirmButton: true,});
  }
}
