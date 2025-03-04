import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import 'firebase/storage';
import { ForoproyectosService } from '../../services/foroproyectos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modulocomponenteforoproyectos',
  templateUrl: './componenteforoproyectos.component.html',
  styleUrls: ['./componenteforoproyectos.component.css']
})

export class ComponenteforoproyectosComponent implements OnInit {
  @ViewChild("comentario") comentario: ElementRef;

  @Input() InfoPublicacion: any[]; // Aquí se define el parámetro que recibirá el hijo
  @Input() posicion: any; // Aquí se define el parámetro que recibirá el hijo
  @Input() nombreusuario: any; // Aquí se define el parámetro que recibirá el hijo

  constructor (private storage: AngularFireStorage,private foroProyectos: ForoproyectosService) {}

  ngOnInit()
  {
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

    this.foroProyectos.editarCamposNoArray(Parametros, publicacion.id);
    comentario = '';
  }

  guardarPublicacion(publicacion: any) {
    let usuario = this.nombreusuario;
    let guardadasArray = publicacion.guardadas ? [...publicacion.guardadas, usuario] : [usuario];

    var Parametros  = [
      { campo: 'guardadas', valor: guardadasArray },
    ]

    this.foroProyectos.editarCamposNoArray(Parametros, publicacion.id);
  }

  comprobarGuardadas(publicacion: any) {
    return publicacion.guardadas ? publicacion.guardadas.includes(this.nombreusuario) : false;
  }

  eliminarPublicacion(publicacion: any) {
    let guardadasArray = publicacion.guardadas.filter(res => res !== this.nombreusuario);

    var Parametros  = [
      { campo: 'guardadas', valor: guardadasArray },
    ]

    this.foroProyectos.editarCamposNoArray(Parametros, publicacion.id);
  }
}
