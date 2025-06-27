import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service'
import { Usuarioperfil } from 'src/app/models/cuenta';
import { MensajesService } from '../../services/mensajes.service'
import { detallemensaje, mensaje } from '../../models/mensaje';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modulomensajes',
  templateUrl: './modulomensajes.component.html',
  styleUrls: ['./modulomensajes.component.css']
})

export class ModulomensajesComponent implements OnInit {
  @ViewChild("mensajeEnviar") mensajeEnviar: ElementRef;

  nombreusuario: any;
  existeamigo: boolean = false;
  Corrreousuario: string;
  UsuarioPerfil: Usuarioperfil;
  usuarioAmigo: Usuarioperfil;
  mensajes : any;
  mensajeUsuario: any[] = [];
  mensajeUsuario2: any[] = [];

  constructor(private cuenta: RespuestasService, private mensaje: MensajesService) {
    this.Corrreousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
  }

  ngOnInit() {
    this.ObtenerMensajesPerfil();
  }

  ObtenerMensajesPerfil() {
    this.mensaje.getTodosmensajes(this.nombreusuario).subscribe(res => {
      this.mensajes = res;

      let arrayTemporal = [];

      this.mensajes.forEach(result => {
        if(result.correo1 === this.Corrreousuario) {
          arrayTemporal.push(result.correo2);
        }

        if(result.correo2 === this.Corrreousuario) {
          arrayTemporal.push(result.correo1);
        }
      })

      arrayTemporal ? this.obtenerAmigos(arrayTemporal) : null;

      if(this.usuarioAmigo) {
        this.mensajes.forEach(result => {
          if (this.usuarioAmigo.correo === result.correo1 || this.usuarioAmigo.correo === result.correo2) {
            this.usuarioAmigo = result;
          }
        })
      }

    }, error => this.mostrarErrorTryCatch(error));
  }

  obtenerAmigos(amigos: any[]) {
    amigos.forEach((result) => {
      this.cuenta.obtenerPorCorreo(result).subscribe(res => {
        const usuario = res[0];

        delete usuario['id'];

        const valorStatusUsuario = result.amigoBorrado;

        let arregloTemporal = this.mensajes;

        if (arregloTemporal) {
          arregloTemporal.forEach((result2, index) => {
            if (result2.correo1 === usuario.correo || result2.correo2 === usuario.correo) {

              arregloTemporal[index] = Object.assign(arregloTemporal[index], usuario) ;

              const propiedadesAEliminar = ['contrasena', 'videojuego', 'plataforma', 'amigos', 'descripcion','repcontraseña'];

              propiedadesAEliminar.forEach(propiedad => {
                delete arregloTemporal[index][propiedad];
              });

              arregloTemporal[index]['amigoBorrado'] = valorStatusUsuario !== undefined ? valorStatusUsuario : false ;
            }
          });

          this.mensajes = arregloTemporal;
        }
      }, error => this.mostrarErrorTryCatch(error));
    });
  }

  Enviar() {
    if (this.mensajeEnviar.nativeElement.value === '')
      return this.mostrarErrorTryCatch('No puedes enviar un mensaje vacio');

    let id = '';

    const nuevoMensaje = {
      hora: Date.now(),
      mensaje: this.mensajeEnviar.nativeElement.value,
      usuario: this.nombreusuario
    }

    let mensajeJSON = [...this.usuarioAmigo['mensajes'], nuevoMensaje];

    var Parametros  = [
      { campo: 'mensajes', valor: mensajeJSON },
    ]

    this.mensajes.forEach(result => {
      if (this.usuarioAmigo.correo === result.correo1 || this.usuarioAmigo.correo === result.correo2) {
        id = result.id;
      }
    })

    this.mensaje.editarCamposNoArray(Parametros, id);

    this.mensajeEnviar.nativeElement.value = '';
  }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error',title: error ,showConfirmButton: true, heightAuto: false});
  }
}
