import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { catchError, map, tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};
@Injectable()

export class RespuestasService {

  presURL = 'https://proyectogamerface.firebaseio.com//respuestas.json';
  constructor(private http: HttpClient) { }

  postRegistroNormal(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL, registro, httpOptions );
  }
  getRespuestas() {
    return this.http.get(this.presURL).map(res => res);
  }
}
