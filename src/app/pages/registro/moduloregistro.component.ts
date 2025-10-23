import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RespuestasService } from '../../services/cuentas.service';
import { FormBuilder, EmailValidator } from '@angular/forms';
import * as $ from 'jquery';
import * as firebase from 'firebase';
import {UsuarioPerfil, UsuarioRegistro} from '../../models/cuenta';
import Swal from 'sweetalert2';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AutenticationService } from 'src/app/services/autentication.service';

@Component({
  selector: 'app-moduloregistro',
  templateUrl: './moduloregistro.component.html',
  styleUrls: ['./moduloregistro.component.css']
})

export class ModuloregistroComponent implements OnInit {
  private inputSubject: Subject<string> = new Subject<string>();
  register: any;
  registerInicioSesion: any;
  usuarioExiste: boolean = false;
  loader: boolean = false;

  constructor ( private router: Router, private respuestasService: RespuestasService, private authService: AutenticationService ) {
    this.inputSubject.pipe(
      debounceTime(1000), // Espera 500ms después de la última pulsación
      switchMap(value => {
        this.verificarUsuario(value);
        return [];
      })
    ).subscribe();
  }

  ngOnInit() {
    this.register = {
      usuario: '', correoElectronico: '',
      contrasena: '', newcontrasena: '',
    };

    this.registerInicioSesion = {
      correo: '', contrasena: ''
    }
  }

  onSubmitInicioSesion() {
    const contrasena = document.getElementById('contra');
    const electronico = document.getElementById('correo');

    this.registerInicioSesion.contrasena === '' ? contrasena.style.borderColor = 'red' : contrasena.style.borderColor = 'white'
    this.registerInicioSesion.correo === '' ? electronico.style.borderColor = 'red' : electronico.style.borderColor = 'white'

    if(this.registerInicioSesion.contrasena === '' || this.registerInicioSesion.correo === '') {
      Swal.fire({ icon: 'error', title: 'Faltan datos por llenar', heightAuto: false})
      return false;
    }

    firebase.auth().signInWithEmailAndPassword(this.registerInicioSesion.correo, this.registerInicioSesion.contrasena).then((res) => {
      localStorage.setItem('PerfilUsuario', this.registerInicioSesion.correo);
      this.router.navigate(['/modulomenu']);
    }, (error) => {

      Swal.fire({icon: 'error',title: 'La cuenta no existe', heightAuto: false})

      contrasena.style.borderColor = 'red';
      electronico.style.borderColor = 'red';
    });
  }

  onSubmit() {
    let campoVacio: boolean = false;

    if(this.usuarioExiste) {
      Swal.fire({ icon: 'error', title: 'Ingrese otro usuario', heightAuto: false})
      return false;
    }

    Object.keys(this.register).forEach(clave => {
      let etiqueta = document.getElementById(clave.toString());
      this.register[clave] === '' ? etiqueta.style.borderColor = 'red' : etiqueta.style.borderColor = 'white'

      this.register[clave] = this.register[clave].replace(/ /g, '');;

      if(this.register[clave] === '')
        campoVacio = true;
    });

    if (campoVacio)
      Swal.fire({ icon: 'error', title: 'Faltan datos por llenar', heightAuto: false})
    else
    {
      if ((this.register.contrasena !== this.register.newcontrasena)) {
        Swal.fire({ icon: 'error', title: 'Las contraseñas no coinciden', heightAuto: false})
        return false;
      }

      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!regex.test(this.register.correoElectronico)) {
        Swal.fire({ icon: 'error', title: 'El formato del correo no es el correcto', heightAuto: false})
        return false;
      }

      const registro: UsuarioRegistro = {
        usuario: '',
        correo: '',
        contraseña: '',
        confirmacionContraseña: '',
        descripcion: ''
      };

      firebase.auth().fetchSignInMethodsForEmail(this.register.correoElectronico).then(res => {
        var element = <HTMLInputElement>document.getElementById("crearCuenta");
        element.disabled = true;

        this.loader = true;

        if (res.length !== 0) {
          Swal.fire({ icon: 'error', title: 'El correo ya se encuentra registrado', heightAuto: false})
          return false;
        }

        registro.usuario = this.register.usuario;
        registro.confirmacionContraseña = this.register.newcontrasena;
        registro.contraseña = this.register.contrasena;
        registro.correo = this.register.correoElectronico;
        // registro.imagen se manejará después del registro inicial

        const email = String(this.register.correoElectronico);
        const password = String(this.register.contrasena);

        localStorage.setItem('PerfilUsuario', this.register.correoElectronico);
        localStorage.setItem('NombreUser', this.register.usuario);

        firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
          this.respuestasService.postRegistroNormal(registro).subscribe(newpres => {


            setTimeout(() => {
              localStorage.setItem('PerfilUsuario', this.register.correoElectronico);
              this.router.navigate(['/modulomenu']);
            },1000);
          });

        }).catch(function(error) {
          console.log(error.message);
          console.log(error.code);
          Swal.fire({icon: 'error',title: error,});
        });
      }).catch(error => Swal.fire({icon: 'error',title: error, heightAuto: false}))
    }
  }

  onInputChange(event: any): void {
    const value = event.target.value;
    // Emitimos el valor al Subject
    this.inputSubject.next(value);
  }

  verificarUsuario(usuarioString: string) {
    let etiqueta = document.getElementById('usuario');
    this.respuestasService.obtenerPorUsuario(usuarioString).subscribe(res => {
      let [ usuario ] = res;

      if(usuario) {
        etiqueta.style.borderColor = 'red';
        this.usuarioExiste = true;
      }
      else
      {
        etiqueta.style.borderColor = 'white';
        this.usuarioExiste = false;
      }
    }, error => Swal.fire({icon: 'error',title: error, heightAuto: false}))
  }
}
