import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import '@firebase/firestore';
import '@firebase/auth';
import * as firebase from 'firebase';
import Swal from 'sweetalert2';

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
  entro: boolean = false;
  usuario;
  correo: any;
  ContradorCuentaIndice: number;

  // variable que controla el spinner
  DisplaySpinnerLoading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    this.DisplaySpinnerLoading = true;
    this.usuar = $('#usuario').val().toString();
    this.password = $('#contrasena').val().toString();

    if (this.usuar === "" || this.password === "")
    {
      Swal.fire({icon: 'error',title: 'No has ingresado datos',})

      this.DisplaySpinnerLoading = false;
    }
    else {
      firebase.auth().signInWithEmailAndPassword(this.usuar, this.password).then( (res) => {
        localStorage.setItem('PerfilUsuario', this.usuar);
        this.DisplaySpinnerLoading = false;
        this.router.navigate(['/modulomenu']);
      }, () => {

        Swal.fire({
          icon: 'error',
          title: 'La cuenta no existe',
        })

        this.DisplaySpinnerLoading = false;
      });
    }
  }
}
