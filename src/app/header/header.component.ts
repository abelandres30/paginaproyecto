import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RespuestasService } from '../servicios/respuestas.service';
import $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  respuestas: any[] = [];
  usuar: string;
  password: string;
  permiso: boolean;
  constructor( private router: Router, private respuestasService: RespuestasService) {
      this.respuestasService.getRespuestas()
      .subscribe(respuestas => {
        for ( const i in respuestas ) {
         this.respuestas[i] = respuestas[i];
        }
        });
   }

  ngOnInit() {
  }
   onSubmit() {
     this.usuar = $('#usuario').val();
     this.password = $('#contrasena').val();

     for (const i in this.respuestas) {
      if (( this.respuestas[i].correo === this.usuar) && ( this.respuestas[i].contraseña === this.password  )) {
         window.alert('Bienvenido a Gamerface ');
         this.router.navigate(['modulomenu']);
         this.permiso = true;
         return false;


      } else {
        this.permiso = false;

      }
     }
     if (this.permiso === false) {
       alert('fallo el ingreso de sesion');
     }

   }
}
