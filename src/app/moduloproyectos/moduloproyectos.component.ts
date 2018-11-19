import { Component, OnInit} from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import 'firebase/storage';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import $ from 'jquery';
import { ObtenerPublicacionService } from '../servicios/obtenerpublicacion.service';
import { GlobalesService } from '../servicios/globales.service';

class Usuarioperfil {
  usuario: string;
  idea: string;
  plataforma: string;
  descripcion: string ;

}
@Component({
  selector: 'app-moduloproyectos',
  templateUrl: './moduloproyectos.component.html',
  styleUrls: ['./moduloproyectos.component.css']
})
export class ModuloproyectosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  proyecto() {

  }
 }
