import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import 'firebase/storage';
import { ForoproblemasService } from '../../services/foroproblemas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modulocomponenteforoproblemas',
  templateUrl: './componenteforoproblemas.component.html',
  styleUrls: ['./componenteforoproblemas.component.css']
})

export class ComponenteforoproblemasComponent implements OnInit {
  @ViewChild("comentario") comentario: ElementRef;

  @Input() InfoPublicacion: any[]; // Aquí se define el parámetro que recibirá el hijo
  @Input() posicion: any; // Aquí se define el parámetro que recibirá el hijo
  @Input() nombreusuario: any; // Aquí se define el parámetro que recibirá el hijo

  constructor (private foroProblemas: ForoproblemasService) {}

  ngOnInit() {}

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
      this.foroProblemas.editarCamposNoArray(Parametros, publicacion.id);
      comentario = '';
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  guardarPublicacion(publicacion: any) {
    let usuario = this.nombreusuario;
    let guardadasArray = publicacion.guardadas ? [...publicacion.guardadas, usuario] : [usuario];

    var Parametros  = [
      { campo: 'guardadas', valor: guardadasArray },
    ]

    try {
      this.foroProblemas.editarCamposNoArray(Parametros, publicacion.id);
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  comprobarGuardadas(publicacion: any) {
    return publicacion.guardadas ? publicacion.guardadas.includes(this.nombreusuario) : false;
  }

  eliminarPublicacion(publicacion: any) {
    let guardadasArray = publicacion.guardadas.filter(res => res !== this.nombreusuario);

    var Parametros  = [
      { campo: 'guardadas', valor: guardadasArray },
    ]

    try {
      this.foroProblemas.editarCamposNoArray(Parametros, publicacion.id);
    } catch (error) {
      this.mostrarErrorTryCatch(error);
    }
  }

  mostrarErrorTryCatch(error: any) {
    return Swal.fire({icon: 'error',title: error ,showConfirmButton: true,});
  }
}
