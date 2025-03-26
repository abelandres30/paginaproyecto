import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuarioperfil } from 'src/app/models/cuenta';
import { guardarpublicacion } from 'src/app/models/publicacion';
import { ObtenerPublicacionService } from 'src/app/services/publicaciones.service';
import { RespuestasService } from '../../services/cuentas.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {
  @ViewChild("comentario") comentario: ElementRef;

  Correousuario: string;
  nombreusuario: string;
  InfoUsuario: Usuarioperfil;
  InfoPublicacion: guardarpublicacion[];

  isLoading: boolean = true;

  constructor ( private _router: ActivatedRoute, private Cuenta: RespuestasService, private obtenerpublicacionService: ObtenerPublicacionService ) {}

  ngOnInit() {
    this.Correousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.obtenerInformacionPerfil();
  }

  obtenerInformacionPerfil() {
    let Id = this._router.snapshot.paramMap.get('id');

    this.Cuenta.obtenerPorId(Id).subscribe(res => {
      this.InfoUsuario = res as Usuarioperfil;

      setTimeout(() => {
        this.isLoading = false;
      }, 100);

      this.InfoUsuario.correo !== '' ? this.obtenerPublicaciones() : null;
      this.InfoUsuario.amigos !== undefined ? this.obtenerAmigos(this.InfoUsuario['amigos']) : null;
    }, error => this.mostrarErrorTryCatch(error));
  }

  obtenerPublicaciones() {
    this.obtenerpublicacionService.obtenerPorCorreo(this.InfoUsuario.correo).subscribe(res => {
      this.InfoPublicacion = res as guardarpublicacion[];
    }, error => this.mostrarErrorTryCatch(error))
  }

  obtenerAmigos(amigos: any[]) {
    amigos.forEach((result) => {
      this.Cuenta.obtenerPorCorreo(result.correo).subscribe(res => {
        const usuario = res[0];

        const arregloTemporal = this.InfoUsuario.amigos;

        if (arregloTemporal) {
          arregloTemporal.forEach((result2, index) => {
            if (result2.correo === usuario.correo) {
              arregloTemporal[index] = usuario;

              const propiedadesAEliminar = ['contrasena', 'videojuego', 'plataforma', 'amigos', 'descripcion'];

              propiedadesAEliminar.forEach(propiedad => {
                  delete arregloTemporal[index][propiedad];
              });
            }
          });
        }
      }, error => this.mostrarErrorTryCatch(error));
    });
  }

  verificarPublicacion(publicacion: guardarpublicacion) {
    return publicacion.guardadas?.find(res => res.correo === this.Correousuario );
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
      Swal.fire({icon: 'error',title: 'Ya tiene guardada esta publicacion', })
      return false
    }

    arrayTemporal = [...publicacion.guardadas, JSONUsuario]

    var Parametros  = [
      { campo: 'guardadas', valor: arrayTemporal },
    ]

    try {
      this.obtenerpublicacionService.editarCamposNoArray(Parametros, publicacion.id);
      Swal.fire({ icon: 'success',  title: 'Se guardo con exito la publicacion', showConfirmButton: false, timer: 1500  })
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
      return Swal.fire({icon: 'error',title: 'No escribio comentario',showConfirmButton: true,});

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

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error',title: error ,showConfirmButton: true,});
  }
}
