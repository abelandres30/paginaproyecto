import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { catchError, map, tap} from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class RegistroPublicacionService {
  presURL = 'https://proyectogamerface.firebaseio.com//publicaciones.json';
  presURL1 = 'https://proyectogamerface.firebaseio.com//imagenes.json';
  presURL2 = 'https://proyectogamerface.firebaseio.com//comentarios.json';

  constructor(private http: HttpClient) { }

  postRegistroNormal(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL, registro, httpOptions );
  }
  postRegistroComentarios(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL2, registro, httpOptions );
  }
  postRegistroImagenes(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL1, registro, httpOptions );

  }
}
