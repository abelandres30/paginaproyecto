import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { catchError, map, tap} from 'rxjs/operators';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database'

const httpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class ObtenerPublicacionService {
  PublicacionesList:AngularFireList<any>;

  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publicaciones.json';
  presURL5 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publicaciones';

  presURL1 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//imagenes.json';
  presURL2 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//foroproblemas.json';
  presURL11 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//likes.json';
  presURL3 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//foroproblemas';
  presURL4 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//imagenes';
  presURL10 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//comentarios';

  presURL6 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//comentarios.json';
  presURL7 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publiguardado.json';
  presURL8 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publiguardado';

  constructor(private http: HttpClient,private firebase:AngularFireDatabase) { }

  getRespuestas() {
    return this.http.get(this.presURL).map(res => res);
  }
  getTodasPublicaciones() {
    return this.PublicacionesList = this.firebase.list('publicaciones');
  }

  getImagenes() {
    return this.http.get(this.presURL1).map(res => res);

  }
  getlike() {
    return this.http.get(this.presURL11).map(res => res);

  }
  getProblemas() {
    return this.http.get(this.presURL2).map(res => res);

  }
  getComentarios() {
    return this.http.get(this.presURL6).map(res => res);

  }
  getpubliguardado() {
    return this.http.get(this.presURL7).map(res => res);

  }
  deproblemas(id: String) {
    const url = `${this.presURL3}/${id}.json` ;
    return this.http.delete(url);
  }
  decomentarios(id: String) {
    const url = `${this.presURL10}/${id}.json` ;
    return this.http.delete(url);
  }
  deimagenes(id: String) {
    const url = `${this.presURL4}/${id}.json` ;
    return this.http.delete(url);
  }
  depublicaciones(id: String) {
    const url = `${this.presURL5}/${id}.json` ;
    return this.http.delete(url);
  }
  depublicacionesguardadas(id: String) {
    const url = `${this.presURL8}/${id}.json` ;
    return this.http.delete(url);
  }
  }
