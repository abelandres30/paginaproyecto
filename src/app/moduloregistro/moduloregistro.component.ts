import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { RespuestasService } from '../servicios/respuestas.service';
import { FormBuilder, EmailValidator } from '@angular/forms';
import $ from 'jquery';

const httpOptions = {
  headers: new HttpHeaders({'content-type': 'application/json'})
}

class Usuarioperfil {
  usuario: any ;
  contraseña: string;
  repcontraseña: string;
  correo: EmailValidator;
  plataforma: {};
}

@Component({
  selector: 'app-moduloregistro',
  templateUrl: './moduloregistro.component.html',
  styleUrls: ['./moduloregistro.component.css']
})
export class ModuloregistroComponent implements OnInit {
  plataformaX: {
    xbox: string,
    Playstation: string,
    pc: string,
    NintendoWii: string,
    NintendoSwitch: string
  };
  register;
  respuestas: any[] = [];
  permiso:boolean = false;
  constructor(private router: Router, private pf: FormBuilder, private respuestasService: RespuestasService ) {
    this.respuestasService.getRespuestas()
      .subscribe(respuestas => {
        for ( const i in respuestas ) {
         this.respuestas[i] = respuestas[i];
        }
        });

    this.plataformaX = {
      xbox: '',
      Playstation: '',
      pc: '',
      NintendoWii: '',
      NintendoSwitch: ''
    };
  }
  ngOnInit() {
    this.register = {
      usuario: '',
      correo: '',
      contrasena: '',
      newcontrasena: '',
    };
  }
  juegos() {
    if ($('#favorite1').prop('checked')) {
        $('.objeto').remove();
      $('.juegos').append('<div class="objeto"><h6>Juegos de play station </h6></div>');
      $('.juegos').append('<div class="objeto"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> The last of us</div>');
      $('.juegos').append('<div class="objeto"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> God of war</div>');
      $('.juegos').append('<div class="objeto"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Ratchet and clank</div>');

  } else {
    $('.objeto').remove();
  }
    if ($('#favorite2').prop('checked')) {
      $('.objeto2').remove();

      $('.juegos').append('<div class="objeto2"><h6>Juegos de xbox </h6></div>');
      $('.juegos').append('<div class="objeto2"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Gears of war</div>');
      $('.juegos').append('<div class="objeto2"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Left for dead</div>');
      $('.juegos').append('<div class="objeto2"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Forza</div>');
  
    } else {
      $('.objeto2').remove();
    }
    if ($('#favorite3').prop('checked')) {
      $('.objeto3').remove();

      $('.juegos').append('<div class="objeto3"><h6>Juegos de Pc </h6></div>');
      $('.juegos').append('<div class="objeto3"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Lol</div>');
      $('.juegos').append('<div class="objeto3"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Fortnite</div>');
      $('.juegos').append('<div class="objeto3"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Otro juego</div>');
      } else {
        $('.objeto3').remove();

      }
    if ($('#favorite4').prop('checked')) {
      $('.objeto4').remove();

      $('.juegos').append('<div class="objeto4"><h6>Juegos de Wii </h6></div>');
      $('.juegos').append('<div class="objeto4"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Super smash bros</div>');
      $('.juegos').append('<div class="objeto4"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Zelda</div>');
      $('.juegos').append('<div class="objeto4"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Mario </div>');
      } else {
        $('.objeto4').remove();
      }
    if ($('#favorite5').prop('checked')) {
      $('.objeto5').remove();

      $('.juegos').append('<div class="objeto5"><h6>Juegos de Switch </h6></div>');
      $('.juegos').append('<div class="objeto5"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Ejemplo</div>');
      $('.juegos').append('<div class="objeto5"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Ejemplo2</div>');
      $('.juegos').append('<div class="objeto5"><input id="juegos2" type="checkbox" name="favorite1" value="chocolate" /> Ejemplo3</div>');
      } else {
        $('.objeto5').remove();
      }
  }
  onSubmit(value) {
    this.permiso = false;

    const dato = document.getElementById('newcontrasenaa');
    const dato2 = document.getElementById('contrasenaa');
    const dato3 = document.getElementById('electronico');
    const dato4 = document.getElementById('user');
    if ((this.register.usuario === '' ) && ( this.register.correo === '') && (this.register.contrasena === '') && (this.register.newcontrasena === '')) {

setTimeout(() => {
  alert('Faltan campos por llenas');
}, );

       const explode = function() {
        dato.style.borderColor = 'white';
        dato2.style.borderColor = 'white';
        dato3.style.borderColor = 'white';
        dato4.style.borderColor = 'white';
         };
         setTimeout(explode, 2000);
      dato.style.borderColor = 'red';
      dato2.style.borderColor = 'red';
      dato3.style.borderColor = 'red';
      dato4.style.borderColor = 'red';
    } else if (this.register.contrasena === this.register.newcontrasena) {
        const registro = new Usuarioperfil();
          for (const i in this.respuestas) {
            if (( this.respuestas[i].usuario === this.register.usuario)) {
           this.permiso = true;

             } else {

          }
          }
    
          if (this.permiso === true) {
             alert('El nombre de usuario que ingreso ya existe, escoga otro')
           
          } else {
            registro.usuario = this.register.usuario;
            registro.repcontraseña = this.register.newcontrasena;
            registro.contraseña = this.register.contrasena;
            registro.correo = this.register.correo;
            if ($('#favorite1').prop('checked')) {
              this.plataformaX.Playstation = 'true';
            } else {
              this.plataformaX.Playstation = 'false';
            }
            if ($('#favorite2').prop('checked')) {
              this.plataformaX.xbox = 'true';
            } else {
              this.plataformaX.xbox = 'false';
            }
            if ($('#favorite3').prop('checked')) {
              this.plataformaX.pc = 'true';
            } else {
              this.plataformaX.pc = 'false';
            }
            if ($('#favorite4').prop('checked')) {
              this.plataformaX.NintendoWii = 'true';
            } else {
              this.plataformaX.NintendoWii = 'false';
            }
            if ($('#favorite5').prop('checked')) {
              this.plataformaX.NintendoSwitch = 'true';
            } else {
              this.plataformaX.NintendoSwitch = 'false';
            }
            registro.plataforma = this.plataformaX;
            this.respuestasService.postRegistroNormal(registro)
            .subscribe(newpres => {});
    
            alert('Se creo la cuenta con exito');
            location.reload();
          }
       } else {
       dato.style.borderColor = 'red';
      }

  }

}
