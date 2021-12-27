import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RespuestasService } from '../../services/cuentas.service';
import * as $ from 'jquery';
// import {SelectItem} from 'primeng/components/common/api';S

import '@firebase/firestore';
import '@firebase/auth';
// import {Message} from 'primeng/components/common/api';
import * as firebase from 'firebase';
import { Message } from 'primeng/api';
import Swal from 'sweetalert2';


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
  ContradorCuentaIndice: number;

  // variable que controla el spinner 
  DisplaySpinnerLoading: boolean = false;
  constructor(private router: Router, private respuestasService: RespuestasService) {}

  ngOnInit() {
    // firebase.initializeApp({
    //   apiKey: "AIzaSyAArpBNLqNR_9qRq9adoTKeirNVtQX5VCE",
    //   authDomain: "proyectogamerface-9e004.firebaseapp.com",
    //   projectId: "proyectogamerface-9e004",
    //   storageBucket: "proyectogamerface-9e004.appspot.com",
    //   messagingSenderId: "550618814154",
    //   appId: "1:550618814154:web:569e2e62f716c015b24633",
    //   measurementId: "G-1GYYHE7R2K"
    // });
  }

  onSubmit() {
    this.DisplaySpinnerLoading = true;
    this.usuar = $('#usuario').val().toString();
    this.password = $('#contrasena').val().toString();
    if (this.usuar === "" || this.password === "") 
    {
      Swal.fire({
        icon: 'error',
        title: 'No has ingresado datos',
      })
      this.DisplaySpinnerLoading = false;

    }
    else {
      firebase.auth().signInWithEmailAndPassword(this.usuar, this.password)
      .then( (res) =>  
      {
        console.log(res);
        localStorage.setItem('PerfilUsuario', this.usuar);            
        this.router.navigate(['/modulomenu']);
        this.DisplaySpinnerLoading = false;

      }, () => 
      {
        Swal.fire({
          icon: 'error',
          title: 'La cuenta no existe',
        })
        this.DisplaySpinnerLoading = false;
      });
    }
  }
}
