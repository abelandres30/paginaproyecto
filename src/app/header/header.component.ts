import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { Router } from '@angular/router';
import { RespuestasService } from '../servicios/respuestas.service';
import $ from 'jquery';
import {SelectItem} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';
import '@firebase/firestore';
import '@firebase/auth';
import {Message} from 'primeng/components/common/api';
import * as firebase from 'firebase';


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
      apiKey: 'AIzaSyCOW5YBjn64EKoPxbZhIqTgjUgyCkXvsn4',
      authDomain: 'proyectogamerface.firebaseapp.com',
      databaseURL: 'https://proyectogamerface.firebaseio.com',
      projectId: 'proyectogamerface',
      storageBucket: 'proyectogamerface.appspot.com',
      messagingSenderId: '760545297980'
    });
  }

   onSubmit() {
    this.respuestasService.getRespuestas()
    .subscribe(respuestas => {
      for ( const i in respuestas ) {
       this.respuestas[i] = respuestas[i];
      }
      });
     this.usuar = $('#usuario').val();
     this.password = $('#contrasena').val();
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
              } else {
                localStorage.setItem('nombreUsuario', this.usuario);

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
