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
@Injectable()

export class RespuestasService {
  CuentasList:AngularFireList<any>;

  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com///respuestas.json';
  presURLAmigo = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com///respuestas';
  presURL2 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com///amigos.json';
  presURL3 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com///amigos';
  constructor(private http: HttpClient,private firebase:AngularFireDatabase) { }

  postRegistroNormal(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL, registro, httpOptions );
  }
  getTodasCuentas() {
    return this.CuentasList = this.firebase.list('respuestas');
  }
  putCuenta(cuenta: any, id: String) {
    const newpre = JSON.stringify(cuenta);
    const url = `${this.presURLAmigo}/${id}.json` ;
    return this.http.put(url, newpre);
  }
  getRespuestas() {
    return this.http.get(this.presURL).map(res => res);
  }
  getAmigos() {
    return this.http.get(this.presURL).map(res => res);
  }
  delAmigo(id: String) {
    const url = `${this.presURL3}/${id}.json` ;
    return this.http.delete(url);
  }
}

