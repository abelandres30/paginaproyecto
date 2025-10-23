import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { catchError, map, tap} from 'rxjs/operators';
import { Publicacion, NuevaPublicacion } from '../models/publicacion';

const httpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class RegistroPublicacionService {
  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publicaciones.json';
  presURLPubli = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publicaciones';
  presURL1 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//imagenes.json';
  presURL2 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//comentarios.json';
  presURL3 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publiguardado.json';
  presURL4 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//likes.json';

  constructor(private http: HttpClient) { }

  postRegistroNormal(registro: NuevaPublicacion): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.presURL, registro, httpOptions );
  }

  putPublicacion(publicacion: Publicacion, id: string) {
    const newpre = JSON.stringify(publicacion);
    const url = `${this.presURLPubli}/${id}.json` ;
    return this.http.put(url, newpre);
  }

  postRegistroComentarios(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL2, registro, httpOptions );
  }

  postRegistroImagenes(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL1, registro, httpOptions );
  }

  postguardadopublicacion(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL3, registro, httpOptions );
  }

  postlike(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL4, registro, httpOptions );
  }
}
