import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { catchError, map, tap} from 'rxjs/operators';
import { json } from 'body-parser';
const httpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class RegistroamigosService {
  presURL = 'https://proyectogamerface.firebaseio.com//notificaciones';
  presURL1 = 'https://proyectogamerface.firebaseio.com//amigos.json';
  

  constructor(private http: HttpClient) { }
  deNotificacion(id: String) {
    const url = `${this.presURL}/${id}.json` ;
    return this.http.delete(url);
  }
  postRegistroNormal(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL1, registro, httpOptions );
  }
  getRespuestas() {
    return this.http.get(this.presURL1).map(res => res);
  }
}
