import { Component, OnInit } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service';
import { Usuarioperfil } from 'src/app/models/cuenta';
import Swal from 'sweetalert2';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-usuariorecomendados',
  templateUrl: './usuariorecomendados.component.html',
  styleUrls: ['./usuariorecomendados.component.css']
})

export class UsuariorecomendadosComponent implements OnInit {
  nombreusuario;
  amigousuario: string[] = [];

  Correousuario: string;
  InfoUsuarios: Usuarioperfil[] = [];
  InfoUser: Usuarioperfil;

  animacionCargando:boolean = true;

  constructor (private usuarios: RespuestasService, private mensaje: MensajesService)

  // CARGA EL SITIO
  {
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.Correousuario = localStorage.getItem('PerfilUsuario')

    this.usuarios.obtenerPorCorreo(this.Correousuario).subscribe(res => {
      this.InfoUser = res[0] as Usuarioperfil;
      this.usuarios.obtenerUsuariosRecomendados().subscribe((items) => {

        items = items.filter(item => item.correo !== this.Correousuario && item !== 'ejemplo');

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

  enviarMensaje(perfil: string, correo: string) {
    Swal.fire({
      title: "Enviar mensaje a: " + perfil,
      input: "textarea",
      inputAttributes: { autocapitalize: "off" },
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText:'Cancelar',
      showLoaderOnConfirm: true,
      heightAuto: false,
      preConfirm: async (mensaje) => {
        try {
          if(mensaje === "") {
            Swal.showValidationMessage('No puedes enviar un mensaje vacío');
            return false;
          }

          const nuevoMensaje = {
            hora: Date.now(),
            mensaje: mensaje,
            usuario: this.nombreusuario
          }

          this.mensaje.getTodosmensajesSinObservable(this.nombreusuario).subscribe(res => {
            let id = '';
            let mensajes = [];

            res.forEach(result => {
              if(result.usuario1 === perfil || result.usuario2 === perfil) {
                id = result.id;
                mensajes = result.mensajes;
                return false;
              }
            });

            if(id !== '') {
              let mensajeJSON = [...mensajes, nuevoMensaje];

              var Parametros  = [
                { campo: 'mensajes', valor: mensajeJSON },
              ]

              this.mensaje.editarCamposNoArray(Parametros, id);
            }
            else {
              let objetoEnviar = {
                correo1: this.Correousuario,
                correo2: correo,
                usuario1: this.nombreusuario,
                usuario2: perfil,
                mensajes: [nuevoMensaje]
              }

              this.mensaje.postRegistroNormal(objetoEnviar);
            }
          }, error => this.mostrarErrorTryCatch(error));

        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Se mando con exito el mensaje',
          showConfirmButton: false,
          timer: 1500,
          heightAuto: false,
        }).then();
      }
    });
  }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error',title: error ,showConfirmButton: true, heightAuto: false});
  }
}
