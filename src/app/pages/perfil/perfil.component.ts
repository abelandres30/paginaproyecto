import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioPerfil } from 'src/app/models/cuenta';
import { Publicacion } from 'src/app/models/publicacion';
import { ObtenerPublicacionService } from 'src/app/services/publicaciones.service';
import { RespuestasService } from '../../services/cuentas.service'
import Swal from 'sweetalert2';
import { MensajesService } from 'src/app/services/mensajes.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {
  @ViewChild("comentario") comentario: ElementRef;

  Correousuario: string;
  nombreusuario: string;
  InfoUsuario: UsuarioPerfil;
  InfoPublicacion: Publicacion[];
  isLoading: boolean = true;

  constructor (private _router: ActivatedRoute, private Cuenta: RespuestasService, private obtenerpublicacionService: ObtenerPublicacionService,
    private mensaje: MensajesService ) {}

  ngOnInit() {
    this.Correousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.obtenerInformacionPerfil();
  }

  obtenerInformacionPerfil() {
    let Id = this._router.snapshot.paramMap.get('id');

    this.Cuenta.obtenerPorId(Id).subscribe(res => {
      this.InfoUsuario = res as UsuarioPerfil;

      setTimeout(() => {
        this.isLoading = false;
      }, 100);

      this.InfoUsuario.correo !== '' ? this.obtenerPublicaciones() : null;
      this.InfoUsuario.amigos !== undefined ? this.obtenerAmigos(this.InfoUsuario.amigos) : null;
    }, error => this.mostrarErrorTryCatch(error));
  }

  obtenerPublicaciones() {
    this.obtenerpublicacionService.obtenerPorCorreo(this.InfoUsuario.correo).subscribe(res => {
      this.InfoPublicacion = res as Publicacion[];
    }, error => this.mostrarErrorTryCatch(error))
  }

  obtenerAmigos(amigos: string[]) {
    // TODO: Actualizar método para nueva estructura de interfaces
    // En las nuevas interfaces, amigos es un array de strings (IDs), no objetos
    // Este método necesita refactorización para obtener datos de usuario por ID
    console.log('obtenerAmigos - Método pendiente de actualización para nuevas interfaces', amigos);
  }

  verificarPublicacion(publicacion: Publicacion) {
    return publicacion.guardadas?.find(res => res.correoUsuario === this.Correousuario );
  }

  guardarPublicacion(publicacion: any) {
    let arrayTemporal = [];
    let registroExiste: boolean = false;

    let JSONUsuario = {
      correo: this.Correousuario,
      usuario: this.nombreusuario
    };

    publicacion.guardadas ? registroExiste = publicacion.guardadas.find(res => res.correo === this.Correousuario) : publicacion['guardadas'] = [];

    if(registroExiste) {
      Swal.fire({icon: 'error',title: 'Ya tiene guardada esta publicacion', heightAuto: false})
      return false
    }

    arrayTemporal = [...publicacion.guardadas, JSONUsuario]

    var Parametros  = [
      { campo: 'guardadas', valor: arrayTemporal },
    ]

    try {
      this.obtenerpublicacionService.editarCamposNoArray(Parametros, publicacion.id);
      Swal.fire({ icon: 'success',  title: 'Se guardo con exito la publicacion', showConfirmButton: false, timer: 1500, heightAuto: false  })
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  eliminarPublicacion(publicacion: any) {
    let guardadasArray = publicacion.guardadas.filter(res => res.correo !== this.Correousuario);

    var Parametros  = [
      { campo: 'guardadas', valor: guardadasArray },
    ]

    try {
      this.obtenerpublicacionService.editarCamposNoArray(Parametros, publicacion.id);
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  recargarSitio() {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  enviarComentario(publicacion: any) {
    let comentario = this.comentario.nativeElement.value;

    if (!comentario)
      return Swal.fire({icon: 'error', title: 'No escribio comentario', showConfirmButton: true, heightAuto: false});

    let usuario = this.nombreusuario;
    let cuerpoComentario = {usuario, comentario}

    let comentariosArray = publicacion.comentarios ? [...publicacion.comentarios, cuerpoComentario] : [cuerpoComentario];

    var Parametros  = [
      { campo: 'comentarios', valor: comentariosArray },
    ]

    try {
      this.obtenerpublicacionService.editarCamposNoArray(Parametros, publicacion.id);
      comentario = '';
    } catch (error) {
      this.mostrarErrorTryCatch(error);
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
    return Swal.fire({icon: 'error', title: error , showConfirmButton: true, heightAuto: false});
  }
}
