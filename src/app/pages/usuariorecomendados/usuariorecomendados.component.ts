import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { CookieService } from 'ngx-cookie-service';
import { GlobalesService } from '../../services/globales.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { RespuestasService } from '../../services/cuentas.service';
import { Message } from 'primeng/api';
import { Usuarioperfil } from 'src/app/models/cuenta';

@Component({
  selector: 'app-usuariorecomendados',
  templateUrl: './usuariorecomendados.component.html',
  styleUrls: ['./usuariorecomendados.component.css']
})
export class UsuariorecomendadosComponent implements OnInit
{
  msgs: Message[] = [];
  msgs2: Message[] = [];
  existencia = false;
  nombreusuario;
  nombreplataforma;
  nombreusuario2;
  amigousuario: string[] = [];
  // variables booleanas
  sicoincidencia: boolean[] = [];
  videojuegos: string[] = [];
  coincidencia: any[] = [];
  register;

  esamigo: boolean = false;
  CorreoUsuario: string;
  InfoUsuarios: Usuarioperfil[];
  InfoUser: Usuarioperfil;

  constructor (
    private storage: AngularFireStorage, private cookie: CookieService,
    private usuarios: RespuestasService
  )

  // CARGA EL SITIO
  {
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.CorreoUsuario = localStorage.getItem('PerfilUsuario')

    this.usuarios.obtenerPorCorreo(this.CorreoUsuario).subscribe(res => {
      this.InfoUser = res[0] as Usuarioperfil;
      this.usuarios.obtenerUsuariosRecomendados().subscribe((items) => {

        items = items.filter(item => item.correo !== this.CorreoUsuario && item !== 'ejemplo');

        var usuariosPlataforma = items.filter(item => item.plataforma?.some((plata:any) => this.InfoUser.plataforma?.includes(plata)));
        var usuariosVideojuego = items.filter(item => item.videojuego?.some((juego:any) => this.InfoUser.videojuego?.includes(juego)));

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

        this.InfoUsuarios.length !== 0 ? this.existencia = true : this.existencia = false;

      });
    });
  }

  ngOnInit()
  {
    this.register = {mensaje: '',};
  }

  enviarSolicitud(usuario: any, i:any)
  {
    let usuarioSolicitudRecibe = Object.assign({}, {
      correo: usuario.correo,
      usuario: usuario.usuario,
      imagen: usuario.imagen,
      plataforma: usuario.plataforma,
      videojuego: usuario.videojuego,
      id: usuario.id
    });

    let usuarioSolicitudEnvia = Object.assign({}, {
      correo: this.InfoUser.correo,
      usuario: this.InfoUser.usuario,
      imagen: this.InfoUser.imagen,
      plataforma: this.InfoUser.plataforma,
      videojuego: this.InfoUser.videojuego,
      id: this.InfoUser['id']
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
          this.usuarios.agregarSolicitudEnviada(usuarioSolicitudEnvia, usuarioSolicitudRecibe, this.InfoUser['id'], usuario.id);
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

  mensaje() { }

  enviarmensaje(usuario)
  {
    this.nombreusuario2 = usuario;
  }
}
