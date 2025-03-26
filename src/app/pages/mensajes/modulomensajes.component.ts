import { Component, OnInit } from '@angular/core';
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
    }, error => this.mostrarErrorTryCatch(error));
  }

  obtenerAmigos(amigos: any[]) {
    amigos.forEach((result) => {
      this.cuenta.obtenerPorCorreo(result.correo).subscribe(res => {
        const usuario = res[0];
        const valorStatusUsuario = result.amigoBorrado;

        const arregloTemporal = this.UsuarioPerfil.amigos;

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

  Perfil(amigo: any) {
    this.usuarioAmigo = amigo;

    this.mensaje.getTodosmensajes(this.usuarioAmigo.usuario).subscribe(res => {
      this.mensajes = res;
    }, error => this.mostrarErrorTryCatch(error));
  }

  Enviar() {
    let mensajeJSON = Object.assign({}, {
      [this.UsuarioPerfil.usuario] : {
        correo: this.UsuarioPerfil.correo,
        amigosMensaje: [{
        [this.usuarioAmigo.usuario] : {
          correoAmigo: this.usuarioAmigo.correo,
          mensajes: [
            {mensaje: 'Ejemplo', hora: Date.now()}
          ]
        }}],
      }
    });

    let nuevaListaMensaje = [...this.mensajes, mensajeJSON];

    this.mensaje.editarCamposNoArray(nuevaListaMensaje, '');

    // let x: any[] = [];
    // let entro = false;
    // const mensajeText = $(".mensaje").val();

    // if (mensajeText !== "")
    // {
    //   const registro = new detallemensaje();
    //   registro.correo = this.Corrreousuario;
    //   registro.usuario = this.nombreusuario;
    //   registro.mensaje = mensajeText.toString();

    //    if (listamensajes === undefined || listamensajes === null)
    //    {
    //     x.push(registro);
    //    }
    //    else
    //   {
    //     for (const i in listamensajes)
    //     {
    //       x.push(listamensajes[i]);
    //     }
    //     x.push(registro);
    //    }

    //    const registroMensaje = new mensaje();
    //    registroMensaje.correo = mensajeInfo.correo;
    //    registroMensaje.correo2 = mensajeInfo.correo2;
    //    registroMensaje.usuario = mensajeInfo.usuario;
    //    registroMensaje.usuario2 = mensajeInfo.usuario2;
    //    registroMensaje.listaMensajes = x;

    //    this.mensaje.putmensaje(registroMensaje,mensajeInfo.$key)
    //    .subscribe(res => {
    //     $(".mensaje").val("");
    //    });
    // }
  }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error',title: error ,showConfirmButton: true,});
  }
}
