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
  plataforma: {
  };
}

@Component({
  selector: 'app-moduloregistro',
  templateUrl: './moduloregistro.component.html',
  styleUrls: ['./moduloregistro.component.css']
})
export class ModuloregistroComponent implements OnInit {
  plataforma1: boolean = false;
  plataforma2: boolean = false;
  plataforma3: boolean = false;
  plataforma4: boolean = false;
  plataforma5: boolean = false;
  register;
  respuestas: any[] = [];
  cadena: string;
  nombre = '';
  constructor(private router: Router, private pf: FormBuilder, private respuestasService: RespuestasService ) { }

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

        registro.usuario = this.register.usuario;
        registro.repcontraseña = this.register.newcontrasena;
        registro.contraseña = this.register.contrasena;
        registro.correo = this.register.correo;
        if ($('#favorite1').prop('checked')) {
          registro.plataforma = 'Play station';
          this.plataforma1 = true;

        }  if ($('#favorite2').prop('checked')) {
          this.plataforma2 = true;
          registro.plataforma = 'Xbox';
        }  if ($('#favorite3').prop('checked')) {
          registro.plataforma = 'Pc';
          this.plataforma3 = true;
        }  if ($('#favorite4').prop('checked')) {
          registro.plataforma = 'Nintendo Wii';
          this.plataforma4 = true;
        }  if ($('#favorite5').prop('checked')) {
          registro.plataforma = 'Nintendo swich';
          this.plataforma5 = true;
        } if (((this.plataforma1 === false ) && (this.plataforma2 === false ) && (this.plataforma3 === false ) && (this.plataforma4 === false )&&(this.plataforma5 === false ))) {
          registro.plataforma = 'Sin plataforma';
        } else if (((this.plataforma1 === true ) && (this.plataforma2 === true ) && (this.plataforma3 === true ) && (this.plataforma4 === true )&&(this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Xbox','plataforma 3':'Pc','plataforma 4':'Nintendo wii','plataforma 5':'Nintendo Switch'};
        } else if (((this.plataforma1 === true ) && (this.plataforma2 === true ) && (this.plataforma3 === true ) && (this.plataforma4 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Xbox','plataforma 3':'Pc','plataforma 4':'Nintendo wii'};
        } else if (((this.plataforma1 === true ) && (this.plataforma2 === true ) && (this.plataforma3 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Xbox','plataforma 3':'Pc','plataforma 4':'Nintendo Swicht'};
        } else if (((this.plataforma1 === true ) && (this.plataforma2 === true ) && (this.plataforma4 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Xbox','plataforma 3':'Nintendo Wii','plataforma 4':'Nintendo swich'};
        } else if (((this.plataforma1 === true ) && (this.plataforma3 === true ) && (this.plataforma4 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Pc','plataforma 3':'Nintendo wii','plataforma 4':'Nintendo swicth'};
        } else if (((this.plataforma2 === true ) && (this.plataforma3 === true ) && (this.plataforma4 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Xbox', 'plataforma 2':'Pc','plataforma 3':'Nintendo Wii','plataforma 4':'Nintendo Swicht'};

        } else if (((this.plataforma1 === true ) && (this.plataforma2 === true ) && (this.plataforma3 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Xbox','plataforma 3':'Pc'};
        } else if (((this.plataforma1 === true ) && (this.plataforma2 === true ) && (this.plataforma4 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Xbox','plataforma 3':' Nintendo Wii'};
        } else if (((this.plataforma1 === true ) && (this.plataforma2 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Xbox','plataforma 3':'Nintendo Swich'};
        }  else if (((this.plataforma1 === true ) && (this.plataforma3 === true ) && (this.plataforma4 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Pc','plataforma 3':'Nintendo Wii'};
        } else if (((this.plataforma1 === true ) && (this.plataforma3 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Pc','plataforma 3':'Nintendo Swich'};
        } else if (((this.plataforma1 === true ) && (this.plataforma4 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Nintendo Wii','plataforma 3':'Nintendo Swich'};
        } else if (((this.plataforma2 === true ) && (this.plataforma3 === true ) && (this.plataforma4 === true ))) {
          registro.plataforma = {'plataforma 1': 'Xbox', 'plataforma 2':'Nintendo Pc','plataforma 3':'Nintendo wii'};
        } else if (((this.plataforma2 === true ) && (this.plataforma3 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Xbox', 'plataforma 2':'Nintendo Pc','plataforma 3':'Nintendo Swich'};
        } else if (((this.plataforma2 === true ) && (this.plataforma4 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Xbox', 'plataforma 2':'Nintendo Wii','plataforma 3':'Nintendo Swich'};
        } else if (((this.plataforma3 === true ) && (this.plataforma4 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Pc', 'plataforma 2':'Nintendo Wii','plataforma 3':'Nintendo Swich'};
        } else if (((this.plataforma1 === true ) && (this.plataforma2 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Xbox'};
        } else if (((this.plataforma1 === true ) && (this.plataforma3 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Pc'};
        } else if (((this.plataforma1 === true ) && (this.plataforma4 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Nintendo Wii'};
        } else if (((this.plataforma1 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Play station', 'plataforma 2':'Nintendo Swicht'};
        } else if (((this.plataforma2 === true ) && (this.plataforma3 === true ))) {
          registro.plataforma = {'plataforma 1': 'Xbox', 'plataforma 2':'Pc'};
        } else if (((this.plataforma2 === true ) && (this.plataforma4 === true ))) {
          registro.plataforma = {'plataforma 1': 'Xbox', 'plataforma 2':'Nintendo Wii'};
        } else if (((this.plataforma2 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Xbox', 'plataforma 2':'Nintendo Swich'};
        } else if (((this.plataforma3 === true ) && (this.plataforma4 === true ))) {
          registro.plataforma = {'plataforma 1': 'Pc', 'plataforma 2':'Nintendo Wii'};
        } else if (((this.plataforma3 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Pc', 'plataforma 2':'Nintendo Swich'};
        } else if (((this.plataforma4 === true ) && (this.plataforma5 === true ))) {
          registro.plataforma = {'plataforma 1': 'Nintendo Wii', 'plataforma 2':'Nintendo Swich'};
        }
        this.respuestasService.postRegistroNormal(registro)
        .subscribe(newpres => {});

        alert('Se creo la cuenta con exito');
        location.reload();
       } else {
       dato.style.borderColor = 'red';
      }

  }

}
