import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { Router } from '@angular/router';
import { RespuestasService } from '../../services/cuentas.service';
import * as $ from 'jquery';
// import {SelectItem} from 'primeng/components/common/api';S

import '@firebase/firestore';
import '@firebase/auth';
// import {Message} from 'primeng/components/common/api';
import * as firebase from 'firebase';
import { Message } from 'primeng/api';


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
  entro: boolean = false;
  usuario;
  correo: any;
  constructor( private router: Router, private respuestasService: RespuestasService) {
      this.respuestasService.getRespuestas()
      .subscribe(respuestas => {
        for ( const i in respuestas ) {
         this.respuestas[i] = respuestas[i];
        }
        });
   }

  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyAArpBNLqNR_9qRq9adoTKeirNVtQX5VCE",
      authDomain: "proyectogamerface-9e004.firebaseapp.com",
      projectId: "proyectogamerface-9e004",
      storageBucket: "proyectogamerface-9e004.appspot.com",
      messagingSenderId: "550618814154",
      appId: "1:550618814154:web:569e2e62f716c015b24633",
      measurementId: "G-1GYYHE7R2K"
    });
  }

   onSubmit() {
    this.respuestasService.getRespuestas()
    .subscribe(respuestas => {
      for ( const i in respuestas ) {
       this.respuestas[i] = respuestas[i];
      }
      });
     this.usuar = $('#usuario').val().toString();
     this.password = $('#contrasena').val().toString();
     const email = this.usuar;
     const password2 = this.password;
     if ((this.usuar === '' ) || (this.password === '' )) {
       this.msgs = [];
        this.msgs.push({severity: 'info',  detail: 'Faltan datos por agregar     '});
     } else {
      for (const i in this.respuestas) {
        if (( this.respuestas[i].correo === this.usuar) && ( this.respuestas[i].contraseña === this.password  )) {
            this.entro = true;
            this.usuario = this.respuestas[i].usuario;
            this.correo = this.respuestas[i].correo;
         
          } else {
          this.permiso = false;
        }
       }
            firebase.auth().signInWithEmailAndPassword(email, password2).catch(function(error) {
              console.log(error.code);
              console.log(error.message);
               });
           firebase.auth().signInWithEmailAndPassword(email, password2).catch(function(error) {
          console.log(error.code);
          console.log(error.message);
           });
           setTimeout(() => {
            if (this.entro === true) {
              if (firebase.auth().currentUser === null) {
                this.permiso = false;
                localStorage.removeItem('nombreUsuario');
                localStorage.removeItem('NombreUser');
              } else {
                localStorage.setItem('nombreUsuario', this.correo);
                localStorage.setItem('NombreUser',this.usuario);

                window.alert('Bienvenido a Gamerface ');
                
                this.router.navigate(['modulomenu']);
                this.permiso = true;
              }
    
            }
           if (this.permiso === false) {
             this.msgs = [];
             this.msgs.push({severity:'error', detail:' Su cuenta no esta registrada'});
           }
           }, 1300);
      
     }

   }

  }
