import { Component, OnInit } from '@angular/core';
import { RespuestasService } from '../servicios/respuestas.service';
import $ from 'jquery';
import { AngularFireStorage } from 'angularfire2/storage';

class Informacion {
  newcorreo: string;
  newcontrasena: string;
}

@Component({
  selector: 'app-moduloconfiguracion',
  templateUrl: './moduloconfiguracion.component.html',
  styleUrls: ['./moduloconfiguracion.component.css']
})
export class ModuloconfiguracionComponent implements OnInit {
  avatarimagen;
  respuestas: any[] = [];
  register;
  nombreusuario;

  constructor(private Usuarios: RespuestasService) {
    // aqui obtengo el usuario del storage
    this.nombreusuario =  localStorage.getItem('nombreUsuario');
    // aqui obtiene todos los datos
    this.Usuarios.getRespuestas()
    .subscribe(respuestas => {
      for ( const i in respuestas ) {
       this.respuestas[i] = respuestas[i];
      }
      });

  }

  ngOnInit() {
    this.avatarimagen = 'img\img10.jpg';
    this.register = {
      correo: '',
      contra: '',
      newcontra: '',
    };

  }
Cambiarcorreo() {
  let correoactuall: string = $('#correoactual').val();
  for (const i in this.respuestas) {
    if (this.respuestas[i].usuario === this.nombreusuario) {
      const registro = new Informacion();
      correoactuall = this.respuestas[i].correo;
      $('#correoactual').val(correoactuall);

    }

  }



}
  imagen1() {
    alert('primera imagen');
    this.avatarimagen = 'img\img10.jpg';
  }
  imagen2(){
    alert('segunda imagen');
  }
  imagen3() {
    alert('Tercera imagen');
  }
}
