import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { Router } from '@angular/router';
import { RespuestasService } from '../servicios/respuestas.service';
import $ from 'jquery';
import {SelectItem} from 'primeng/components/common/api';

import {Message} from 'primeng/components/common/api';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  msgs: Message[] = [];
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
     if ((this.usuar === '' )&& (this.password === '' )) {
       alert('Le faltan campos por llenar');
     } else {
      for (const i in this.respuestas) {
        if (( this.respuestas[i].correo === this.usuar) && ( this.respuestas[i].contraseña === this.password  )) {
           window.alert('Bienvenido a Gamerface ');
           this.msgs = [];
           this.msgs.push({severity: 'success', summary: 'Success Message', detail: 'Order submitted'});
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
}
