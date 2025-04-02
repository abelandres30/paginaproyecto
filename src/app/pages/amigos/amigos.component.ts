import { Component, OnInit } from '@angular/core';
import { Usuarioperfil } from '../../models/cuenta';
import { RespuestasService } from '../../services/cuentas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css']
})

export class AmigosComponent implements OnInit {
  InfoUsuario: Usuarioperfil;
  solicitudesRecibidas: any[] = [];
  Corrreousuario: string;
  nombreusuario: string;
  animacionCargando:boolean = true;
  isLoading: boolean = true;
  isLoadingImg: boolean = true;

  constructor(private Cuenta: RespuestasService, private router: Router, private mensaje: MensajesService,) { }

  ngOnInit(): void {
    this.Corrreousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.obtenerInformacionUsuario();
  }

  obtenerInformacionUsuario() {
    this.Cuenta.obtenerPorCorreo(this.Corrreousuario).subscribe(res => {
      this.InfoUsuario = res[0] as Usuarioperfil;

      setTimeout(() => {
        this.isLoading = false;
      }, 100);

      this.InfoUsuario.solicitudesAmistadEnviadas !== undefined ? this.obtenerInfoAmistades(this.InfoUsuario['solicitudesAmistadEnviadas'],true) : null;
      this.InfoUsuario.solicitudesAmistadRecibidas !== undefined ? this.obtenerInfoAmistades(this.InfoUsuario['solicitudesAmistadRecibidas'], false) : null;
      this.InfoUsuario.amigos !== undefined ? this.obtenerAmigos(this.InfoUsuario['amigos']) : null;
    }, error => this.mostrarErrorTryCatch(error));
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

              const propiedadesAEliminar = ['contrasena', 'videojuego', 'plataforma', 'amigos', 'descripcion'];

              propiedadesAEliminar.forEach(propiedad => {
                  delete arregloTemporal[index][propiedad];
              });


              arregloTemporal[index]['amigoBorrado'] = valorStatusUsuario;
            }
          });
        }
      }, error => this.mostrarErrorTryCatch(error));
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
      }, error => this.mostrarErrorTryCatch(error));
    });
  }

  onImageLoad() {
      this.isLoadingImg = false;
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

          try {
            this.Cuenta.eliminarSolicitudEnviada(this.InfoUsuario['id'], solicitud.id, this.InfoUsuario.correo,  solicitud.correo);
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

          try {
            this.Cuenta.aceptarSolicitud(usuarioSolicitudRecibida, usuarioActual, this.InfoUsuario['id'], solicitud.id, this.InfoUsuario.correo,  solicitud.correo);
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

          try {
            this.Cuenta.cambiarStatusSolicitud(usuarioSolicitudRecibida, usuarioActual, this.InfoUsuario['id'], solicitud.id, this.InfoUsuario.correo,  solicitud.correo);
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

          try {
            this.Cuenta.eliminarAmigo(this.InfoUsuario['id'], usuario.id, this.InfoUsuario.correo, usuario.correo);
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
      }, 50);
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
                correo1: this.Corrreousuario,
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
    return Swal.fire({icon: 'error', title: error, showConfirmButton: true, heightAuto: false});
  }
}

