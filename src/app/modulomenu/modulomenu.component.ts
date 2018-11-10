import { Component, OnInit,Input} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import $ from 'jquery';
import { RegistroPublicacionService } from '../servicios/registropublicacion.service';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';



const httpOptions = {
  headers: new HttpHeaders({'content-type': 'application/json'})
};

class Usuarioperfil {
  descripcion: string ;
  plataforma: string;
  videojuego: string;
}

@Component({
  selector: 'app-modulomenu',
  templateUrl: './modulomenu.component.html',
  styleUrls: ['./modulomenu.component.css']
})
export class ModulomenuComponent implements OnInit {
  register;
  publicaciones: any[] = [];
  permiso: boolean = true;
  constructor(private registropublicacionesService: RegistroPublicacionService,
    private obtenerpublicacionService: ObtenerPublicacionService) {
      
      this.obtenerpublicacionService.getRespuestas()
      .subscribe(publicaciones => {
        for ( const i in publicaciones ) {
         this.publicaciones[i] = publicaciones[i];
        }
        });
    }
  ngOnInit() {
    this.register = {
      descripcion: '',
      plataforma: '',
      videojuego: ''
    };
    for ( const i in this.publicaciones) {
        $('.apartado').append('<div class="objeto3"><h6 style="color:white;"> {{this.publicaciones[i].plataforma}}</h6></div>');

      
     }
     $('.apartado').append('<div style="background-color:darkslategrey;"class="objeto3"><h6 style="color:white;">Swordlegendary </h6><h6 style="color:white;">Plataforma Ps4 </h6><h6 style="color:white;">Descripcion: <h6 style="color:greenyellow;">Ya estoy a mitad del juego the last of us, aqui les dejo una foto para que miren  </h6></h6></div>');
     $('.apartado').append('<div ><img src="../../assets/descarga.jpg"  ></div>');
     $('.apartado').append('<div class="objeto3"><button (click)="comentario()">Comentar</button></div>');
  }
  comentario() {
    alert('hola');
  }
  onSubmit() {
    if ((this.register.descripcion === '') || (this.register.plataforma === '' ) || (this.register.videojuego === '')) {
       alert('faltan agregar datos para la publicacion');
    } else {
      const registro = new Usuarioperfil();
      registro.descripcion = this.register.descripcion;
      registro.plataforma = this.register.plataforma;
      registro.videojuego = this.register.videojuego;
      this.registropublicacionesService.postRegistroNormal(registro)
      .subscribe(newpres => {});
      alert('Publicacion con exito');
    }
  }
}
