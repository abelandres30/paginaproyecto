import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsuarioPerfil } from '../../models/cuenta';
import { SolicitudAmistad, PerfilAmigo } from '../../models/amigos';
import { RespuestasService } from '../../services/cuentas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css']
})

export class AmigosComponent implements OnInit, OnDestroy {
  InfoUsuario: UsuarioPerfil;
  solicitudesRecibidas: SolicitudAmistad[] = [];
  Correousuario: string;
  nombreusuario: string;
  animacionCargando: boolean = true;
  isLoading: boolean = true;
  isLoadingImg: boolean = true;
  
  // Loading states específicos
  isLoadingAmigos: boolean = false;
  isLoadingSolicitudes: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';

  // Subject para manejar unsubscribe
  private destroy$ = new Subject<void>();

  constructor(private Cuenta: RespuestasService, private router: Router, private mensaje: MensajesService) { }

  ngOnInit(): void {
    this.Correousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.obtenerInformacionUsuario();
  }

  obtenerInformacionUsuario() {
    this.hasError = false;
    this.isLoading = true;
    
    this.Cuenta.obtenerPorCorreo(this.Correousuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          try {
            this.InfoUsuario = res[0] as UsuarioPerfil;
            
            // Procesar datos relacionados
            this.procesarDatosRelacionados();
            
            setTimeout(() => {
              this.isLoading = false;
            }, 100);
            
          } catch (error) {
            this.manejarError('Error al procesar información del usuario', error);
          }
        },
        error: (error) => {
          this.manejarError('Error al obtener información del usuario', error);
        }
      });
  }

  private procesarDatosRelacionados(): void {
    if (this.InfoUsuario.solicitudesAmistadEnviadas?.length) {
      this.isLoadingSolicitudes = true;
      this.obtenerInfoAmistades(this.InfoUsuario.solicitudesAmistadEnviadas, true);
    }
    
    if (this.InfoUsuario.solicitudesAmistadRecibidas?.length) {
      this.isLoadingSolicitudes = true;
      this.obtenerInfoAmistades(this.InfoUsuario.solicitudesAmistadRecibidas, false);
    }
    
    if (this.InfoUsuario.amigos?.length) {
      this.isLoadingAmigos = true;
      this.obtenerAmigos(this.InfoUsuario.amigos);
    }
  }

  obtenerAmigos(amigos: any[]) {
    if (!amigos || amigos.length === 0) {
      this.isLoadingAmigos = false;
      return;
    }

    let procesados = 0;
    const total = amigos.length;

    // Optimización: Procesar amigos de forma más eficiente
    amigos.forEach((amigo, index) => {
      this.Cuenta.obtenerPorCorreo(amigo.correo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            const usuario = res[0];
            
            if (usuario && this.InfoUsuario.amigos && this.InfoUsuario.amigos[index]) {
              // Crear objeto limpio sin propiedades sensibles
              const amigoLimpio = {
                ...usuario,
                amigoBorrado: amigo.amigoBorrado
              };
              
              // Eliminar propiedades sensibles/innecesarias
              const propiedadesAEliminar = ['videojuego', 'plataforma', 'amigos', 'descripcion', 'contraseña', 'repcontraseña'];
              propiedadesAEliminar.forEach(prop => delete amigoLimpio[prop]);
              
              // Actualizar directamente por índice (más eficiente que buscar)
              this.InfoUsuario.amigos[index] = amigoLimpio;
            }
            
            procesados++;
            if (procesados === total) {
              this.isLoadingAmigos = false;
            }
          },
          error: (error) => {
            procesados++;
            if (procesados === total) {
              this.isLoadingAmigos = false;
            }
            console.error('Error al obtener amigo:', error);
          }
        });
    });
  }

  obtenerInfoAmistades(solicitudesAmistad: any[], esEnviadas: boolean) {
    if (!solicitudesAmistad || solicitudesAmistad.length === 0) {
      this.isLoadingSolicitudes = false;
      return;
    }

    const arregloDestino = esEnviadas ? 
      this.InfoUsuario.solicitudesAmistadEnviadas : 
      this.InfoUsuario.solicitudesAmistadRecibidas;

    if (!arregloDestino) {
      this.isLoadingSolicitudes = false;
      return;
    }

    let procesados = 0;
    const total = solicitudesAmistad.length;

    // Optimización: Procesar solicitudes de forma más eficiente
    solicitudesAmistad.forEach((solicitud, index) => {
      this.Cuenta.obtenerPorCorreo(solicitud.correo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            const usuario = res[0];
            
            if (usuario && arregloDestino[index]) {
              // Actualizar directamente por índice con información completa
              arregloDestino[index] = {
                ...usuario,
                usuarioRechazado: solicitud.usuarioRechazado
              };
            }
            
            procesados++;
            if (procesados === total) {
              this.isLoadingSolicitudes = false;
            }
          },
          error: (error) => {
            procesados++;
            if (procesados === total) {
              this.isLoadingSolicitudes = false;
            }
            this.manejarError('Error al obtener solicitud de amistad', error);
          }
        });
    });
  }

  onImageLoad() {
    this.isLoadingImg = false;
  }

  onImageError(event: any) {
    // Imagen por defecto en caso de error
    event.target.src = 'assets/images/default-avatar.png';
  }

  trackByAmigoId(index: number, amigo: any): any {
    return amigo?.id || index;
  }

  trackBySolicitudUsuario(index: number, solicitud: any): any {
    return solicitud?.usuario || index;
  }

  /**
   * Animación reutilizable para eliminar elementos con efecto de desvanecimiento
   * @param elementId ID del elemento a animar
   * @param callback Función a ejecutar cuando termine la animación
   */
  private animarEliminacion(elementId: string, callback: () => void): void {
    const div = document.getElementById(elementId);
    
    if (!div) {
      callback(); // Si no encuentra el elemento, ejecuta el callback directamente
      return;
    }

    let width = 300;
    let height = 100;
    let opacity = 1;

    const intervalo = setInterval(() => {
      if (width <= 0 || height <= 0 || opacity <= 0) {
        clearInterval(intervalo);
        div.style.display = 'none';
        callback();
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

  eliminarSolicitud(solicitud: any) {
    if (!solicitud?.usuario) {
      this.manejarError('Datos de solicitud inválidos', new Error('Solicitud no válida'));
      return;
    }

    this.animarEliminacion(solicitud.usuario, () => {
      this.Cuenta.eliminarSolicitudEnviada(
        this.InfoUsuario['id'], 
        solicitud.id, 
        this.InfoUsuario.correo, 
        solicitud.correo
      ).then(() => {
        // Opcional: mostrar mensaje de éxito
        console.log('Solicitud eliminada correctamente');
      }).catch(error => {
        this.manejarError('Error al eliminar solicitud', error);
      });
    });
  }

  aceptarSolicitud(solicitud: any) {
    if (!this.validarDatosSolicitud(solicitud)) {
      return;
    }

    const usuarioSolicitudRecibida = {
      correo: solicitud.correo,
      usuario: solicitud.usuario,
      amigoBorrado: false,
      id: solicitud.id
    };

    const usuarioActual = {
      correo: this.InfoUsuario.correo,
      usuario: this.InfoUsuario.usuario,
      amigoBorrado: false,
      id: this.InfoUsuario['id']
    };

    this.animarEliminacion(solicitud.usuario, () => {
      this.Cuenta.aceptarSolicitud(
        usuarioSolicitudRecibida, 
        usuarioActual, 
        this.InfoUsuario['id'], 
        solicitud.id, 
        this.InfoUsuario.correo, 
        solicitud.correo
      ).then(() => {
        console.log('Solicitud aceptada correctamente');
      }).catch(error => {
        this.manejarError('Error al aceptar solicitud', error);
      });
    });
  }

  cambiarStatusSolicitud(solicitud: any, status: boolean, sufijo: string) {
    if (!this.validarDatosSolicitud(solicitud)) {
      return;
    }

    const usuarioSolicitudRecibida = {
      correo: solicitud.correo,
      usuario: solicitud.usuario,
      usuarioRechazado: status,
      id: solicitud.id
    };

    const usuarioActual = {
      correo: this.InfoUsuario.correo,
      usuario: this.InfoUsuario.usuario,
      usuarioRechazado: status,
      id: this.InfoUsuario['id']
    };

    this.animarEliminacion(solicitud.usuario + sufijo, () => {
      this.Cuenta.cambiarStatusSolicitud(
        usuarioSolicitudRecibida, 
        usuarioActual, 
        this.InfoUsuario['id'], 
        solicitud.id, 
        this.InfoUsuario.correo, 
        solicitud.correo
      ).then(() => {
        const accion = status ? 'rechazada' : 'restaurada';
        console.log(`Solicitud ${accion} correctamente`);
      }).catch(error => {
        this.manejarError('Error al cambiar estado de solicitud', error);
      });
    });
  }

  /**
   * Valida que los datos de la solicitud sean correctos
   */
  private validarDatosSolicitud(solicitud: any): boolean {
    if (!solicitud?.correo || !solicitud?.usuario || !solicitud?.id) {
      this.manejarError('Datos de solicitud incompletos', new Error('Faltan datos requeridos'));
      return false;
    }
    return true;
  }

  eliminarAmigo(usuario:any) {
    if (!usuario?.usuario || !usuario?.id) {
      this.manejarError('Datos de usuario inválidos', new Error('Usuario no válido'));
      return;
    }

    Swal.fire({
      title: "Quieres eliminar a: " + usuario.usuario,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.animarEliminacion(usuario.id, () => {
          this.Cuenta.eliminarAmigo(
            this.InfoUsuario['id'], 
            usuario.id, 
            this.InfoUsuario.correo, 
            usuario.correo
          ).then(() => {
            Swal.fire({
              title: 'Amigo eliminado',
              text: `${usuario.usuario} ha sido eliminado de tu lista de amigos`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              heightAuto: false
            });
          }).catch(error => {
            this.manejarError('Error al eliminar amigo', error);
          });
        });
      }
    });
  }

  enviarMensaje(perfil: string, correo: string) {
    if (!perfil || !correo) {
      this.manejarError('Datos de destinatario inválidos', new Error('Perfil o correo no válidos'));
      return;
    }

    Swal.fire({
      title: "Enviar mensaje a: " + perfil,
      input: "textarea",
      inputAttributes: { 
        autocapitalize: "off",
        placeholder: "Escribe tu mensaje aquí..."
      },
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText:'Cancelar',
      showLoaderOnConfirm: true,
      heightAuto: false,
      preConfirm: async (mensaje) => {
        return this.procesarEnvioMensaje(mensaje, perfil, correo);
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

  /**
   * Procesa el envío de mensaje de forma asíncrona
   */
  private async procesarEnvioMensaje(mensaje: string, perfil: string, correo: string): Promise<boolean> {
    try {
      if (!mensaje || mensaje.trim() === "") {
        Swal.showValidationMessage('No puedes enviar un mensaje vacío');
        return false;
      }

      const nuevoMensaje = {
        hora: Date.now(),
        mensaje: mensaje.trim(),
        usuario: this.nombreusuario
      };

      return new Promise((resolve) => {
        this.mensaje.getTodosmensajesSinObservable(this.nombreusuario)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              let id = '';
              let mensajes = [];

              // Buscar conversación existente
              const conversacionExistente = res.find(result => 
                result.usuario1 === perfil || result.usuario2 === perfil
              );

              if (conversacionExistente) {
                id = conversacionExistente.id;
                mensajes = conversacionExistente.mensajes || [];
                
                const mensajeJSON = [...mensajes, nuevoMensaje];
                const parametros = [
                  { campo: 'mensajes', valor: mensajeJSON }
                ];

                this.mensaje.editarCamposNoArray(parametros, id);
              } else {
                // Crear nueva conversación
                const objetoEnviar = {
                  correo1: this.Correousuario,
                  correo2: correo,
                  usuario1: this.nombreusuario,
                  usuario2: perfil,
                  mensajes: [nuevoMensaje]
                };

                this.mensaje.postRegistroNormal(objetoEnviar);
              }
              
              resolve(true);
            },
            error: (error) => {
              console.error('Error al enviar mensaje:', error);
              Swal.showValidationMessage('Error al enviar el mensaje. Inténtalo de nuevo.');
              resolve(false);
            }
          });
      });

    } catch (error) {
      Swal.showValidationMessage(`Error inesperado: ${error}`);
      return false;
    }
  }

  /**
   * Manejo centralizado de errores con mejor UX
   */
  private manejarError(mensaje: string, error: any): void {
    console.error(mensaje, error);
    this.hasError = true;
    this.errorMessage = mensaje;
    this.isLoading = false;
    this.isLoadingAmigos = false;
    this.isLoadingSolicitudes = false;
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      footer: 'Por favor, inténtalo de nuevo más tarde',
      showConfirmButton: true,
      heightAuto: false
    });
  }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error', title: error, showConfirmButton: true, heightAuto: false});
  }

  // Getter para contar solicitudes rechazadas
  get solicitudesRechazadasCount(): number {
    if (!this.InfoUsuario?.solicitudesAmistadRecibidas) {
      return 0;
    }
    return this.InfoUsuario.solicitudesAmistadRecibidas.filter((s: any) => s.usuarioRechazado).length;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

