import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database'

const httpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//mensajes.json';
  presURL2 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//mensajes';

  PublicacionesList:AngularFireList<any>;

  constructor(private firebase:AngularFireDatabase,private http: HttpClient) { }

  postRegistroNormal(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL, registro, httpOptions );
  }
  getRespuestas() {
    return this.http.get(this.presURL).map(res => res);
  }
  getTodosmensajes() {
    return this.PublicacionesList = this.firebase.list('mensajes');
  }

  putmensaje(publicacion: any, id: String) {
    const newpre = JSON.stringify(publicacion);
    const url = `${this.presURL2}/${id}.json` ;
    return this.http.put(url, newpre);
  }
}
