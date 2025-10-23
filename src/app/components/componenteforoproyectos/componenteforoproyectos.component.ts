import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import 'firebase/storage';
import { ForoproyectosService } from '../../services/foroproyectos.service';
import { Publicacion, Comentario, PublicacionGuardada } from '../../models/publicacion';
import { UsuarioPerfil } from '../../models/cuenta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modulocomponenteforoproyectos',
  templateUrl: './componenteforoproyectos.component.html',
  styleUrls: ['./componenteforoproyectos.component.css']
})

export class ComponenteforoproyectosComponent implements OnInit {
  @ViewChild("comentario") comentario: ElementRef;

  @Input() InfoPublicacion: Publicacion[]; // Array de publicaciones con tipado fuerte
  @Input() posicion: number; // Posición del elemento
  @Input() nombreusuario: string; // Nombre del usuario actual
  @Input() usuarioCorreo?: string; // Correo del usuario para guardadas

  constructor (private foroProyectos: ForoproyectosService) {}

  ngOnInit(){}

  enviarComentario(publicacion: Publicacion) {
    let comentario = this.comentario.nativeElement.value;

    if (!comentario)
      return Swal.fire({icon: 'error', title: 'No escribio comentario', showConfirmButton: true, heightAuto: false});

    // Crear comentario con estructura completa
    const nuevoComentario: Comentario = {
      id: Date.now().toString(), // ID temporal
      usuarioId: 'temp-id', // Se debería obtener del usuario logueado
      nombreUsuario: this.nombreusuario,
      correoUsuario: this.usuarioCorreo || '',
      contenido: comentario,
      fecha: new Date()
    };

    let comentariosArray = publicacion.comentarios ? [...publicacion.comentarios, nuevoComentario] : [nuevoComentario];

    var Parametros  = [
      { campo: 'comentarios', valor: comentariosArray },
    ]

    try {
      this.foroProyectos.editarCamposNoArray(Parametros, publicacion.id);
      comentario = '';
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  guardarPublicacion(publicacion: Publicacion) {
    // Crear objeto guardado con estructura completa
    const nuevaGuardada: PublicacionGuardada = {
      usuarioId: 'temp-id', // Se debería obtener del usuario logueado
      correoUsuario: this.usuarioCorreo || '',
      fechaGuardado: new Date()
    };
    
    let guardadasArray = publicacion.guardadas ? [...publicacion.guardadas, nuevaGuardada] : [nuevaGuardada];

    var Parametros  = [
      { campo: 'guardadas', valor: guardadasArray },
    ]

    try {
      this.foroProyectos.editarCamposNoArray(Parametros, publicacion.id);
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  comprobarGuardadas(publicacion: Publicacion): boolean {
    return publicacion.guardadas ? 
           publicacion.guardadas.some(guardada => guardada.correoUsuario === this.usuarioCorreo) : 
           false;
  }

  eliminarPublicacion(publicacion: Publicacion) {
    let guardadasArray = publicacion.guardadas.filter(guardada => guardada.correoUsuario !== this.usuarioCorreo);

    var Parametros  = [
      { campo: 'guardadas', valor: guardadasArray },
    ]

    try {
      this.foroProyectos.editarCamposNoArray(Parametros, publicacion.id);
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error', title: error, showConfirmButton: true, heightAuto: false});
  }
}
