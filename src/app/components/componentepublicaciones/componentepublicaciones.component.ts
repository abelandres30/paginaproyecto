import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage';
import { Router } from '@angular/router';
//servicios
import { ObtenerPublicacionService } from '../../services/publicaciones.service';
// models
import { Publicacion, Comentario, PublicacionGuardada } from '../../models/publicacion';
import { RespuestasService } from '../../services/cuentas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modulocomponentepublicaciones',
  templateUrl: './componentepublicaciones.component.html',
  styleUrls: ['./componentepublicaciones.component.css']
})

export class ComponentepublicacionesComponent implements OnInit {
  @ViewChild("comentario") comentario: ElementRef;

  @Input() InfoPublicacion: Publicacion[]; // Array de publicaciones con tipado fuerte
  @Input() posicion: number; // Posición del elemento
  @Input() Corrreousuario: string; // Correo del usuario actual
  @Input() nombreusuario: string; // Nombre del usuario actual
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

  Guardarpublicacion(publicacion: Publicacion) {
    let arrayTemporal: PublicacionGuardada[] = [];
    let registroExiste: boolean = false;

    // Crear objeto guardado con estructura correcta
    const nuevaGuardada: PublicacionGuardada = {
      usuarioId: 'temp-id', // Se debería obtener del usuario logueado
      correoUsuario: this.Corrreousuario,
      fechaGuardado: new Date()
    };

    publicacion.guardadas ? registroExiste = !!publicacion.guardadas.find(res => res.correoUsuario === this.Corrreousuario) : publicacion.guardadas = [];

    if(registroExiste) {
      Swal.fire({icon: 'error', title: 'Ya tiene guardada esta publicacion', heightAuto: false })
      return false
    }

    arrayTemporal = [...publicacion.guardadas, nuevaGuardada]

    var Parametros  = [
      { campo: 'guardadas', valor: arrayTemporal },
    ]

    try {
      this.publicacionService.editarCamposNoArray(Parametros, publicacion.id);
      Swal.fire({ icon: 'success', title: 'Se guardo con exito la publicacion', showConfirmButton: false, timer: 1500, heightAuto: false  })
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  eliminarpublicacion(publicacion: Publicacion) {
    let arrayTemporal = [];
    arrayTemporal = publicacion.guardadas.filter(res => res.correoUsuario !== this.Corrreousuario);

    var Parametros  = [
      { campo: 'guardadas', valor: arrayTemporal },
    ]

    try {
      this.publicacionService.editarCamposNoArray(Parametros, publicacion['id']);
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  verificarPublicacion(publicacion: Publicacion) {
    return !publicacion.guardadas?.find(res => res.correoUsuario === this.Corrreousuario );
  }

  enviarComentario(publicacion:Publicacion) {
  let comentario = this.comentario.nativeElement.value;

    if (!comentario)
      return Swal.fire({icon: 'error', title: 'No escribio comentario', showConfirmButton: true, heightAuto: false});

    // Crear comentario con estructura completa
    const nuevoComentario: Comentario = {
      id: Date.now().toString(), // ID temporal
      usuarioId: 'temp-id', // Se debería obtener del usuario logueado
      nombreUsuario: this.nombreusuario,
      correoUsuario: this.Corrreousuario,
      contenido: comentario,
      fecha: new Date()
    };

    let comentariosArray = publicacion.comentarios ? [...publicacion.comentarios, nuevoComentario] : [nuevoComentario];

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

  perfilusuario(correo: string) {
    this.cuenta.obtenerPorCorreo(correo).subscribe(res => {
      if (res.length !== 0)
      {
        window.location.href = '/perfil/' + res[0].id;
      }
    }, error => this.mostrarErrorTryCatch(error));
  }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error', title: error, showConfirmButton: true, heightAuto: false});
  }
}
