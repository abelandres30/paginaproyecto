import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage';
import { Router } from '@angular/router';
//servicios
import { ObtenerPublicacionService } from '../../services/publicaciones.service';
// models
import { guardarpublicacion } from '../../models/publicacion';
import { RespuestasService } from '../../services/cuentas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modulocomponentepublicaciones',
  templateUrl: './componentepublicaciones.component.html',
  styleUrls: ['./componentepublicaciones.component.css']
})

export class ComponentepublicacionesComponent implements OnInit {
  @ViewChild("comentario") comentario: ElementRef;

  @Input() InfoPublicacion: guardarpublicacion[]; // Aquí se define el parámetro que recibirá el hijo
  @Input() posicion: any; // Aquí se define el parámetro que recibirá el hijo
  @Input() Corrreousuario: any; // Aquí se define el parámetro que recibirá el hijo
  @Input() nombreusuario: any; // Aquí se define el parámetro que recibirá el hijo
  isLoading: boolean = true;

  constructor (private publicacionService: ObtenerPublicacionService, private cuenta: RespuestasService, private router: Router) {}

  ngOnInit() {

  }

  onImageLoad() {
    this.isLoading = false;
  }

  onVideoLoad() {
    this.isLoading = false;
  }

  Guardarpublicacion(publicacion: any) {
    let arrayTemporal = [];
    let registroExiste: boolean = false;

    let JSONUsuario = {
      correo: this.Corrreousuario,
      usuario: this.nombreusuario
    };

    publicacion.guardadas ? registroExiste = publicacion.guardadas.find(res => res.correo === this.Corrreousuario) : publicacion['guardadas'] = [];

    if(registroExiste) {
      Swal.fire({icon: 'error',title: 'Ya tiene guardada esta publicacion', })
      return false
    }

    arrayTemporal = [...publicacion.guardadas, JSONUsuario]

    var Parametros  = [
      { campo: 'guardadas', valor: arrayTemporal },
    ]

    try {
      this.publicacionService.editarCamposNoArray(Parametros, publicacion.id);
      Swal.fire({ icon: 'success',  title: 'Se guardo con exito la publicacion', showConfirmButton: false, timer: 1500  })
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  eliminarpublicacion(publicacion: guardarpublicacion) {
    let arrayTemporal = [];
    arrayTemporal = publicacion.guardadas.filter(res => res.correo !== this.Corrreousuario);

    var Parametros  = [
      { campo: 'guardadas', valor: arrayTemporal },
    ]

    try {
      this.publicacionService.editarCamposNoArray(Parametros, publicacion['id']);
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  verificarPublicacion(publicacion: guardarpublicacion) {
    return !publicacion.guardadas?.find(res => res.correo === this.Corrreousuario );
  }

  enviarComentario(publicacion:guardarpublicacion) {
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
      this.publicacionService.editarCamposNoArray(Parametros, publicacion['id']);
      comentario = '';
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  perfilusuario(correo:any) {
    this.cuenta.obtenerPorCorreo(correo).subscribe(res => {
      if (res.length !== 0)
      {
        window.location.href = '/perfil/' + res[0].id;
      }
    }, error => this.mostrarErrorTryCatch(error));
  }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error',title: error ,showConfirmButton: true,});
  }
}
