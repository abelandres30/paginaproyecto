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
export class NotificacionesService {
  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//notificaciones.json';
  presURL2 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//mensajes.json';

  presURL1 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//notificaciones';


  constructor(private http: HttpClient) { }

    getNotifiaciones() {
      return this.http.get(this.presURL).map(res => res);
    }
    postRegistroNormal(registro: any): Observable<any> {
      return this.http.post<any>(this.presURL, registro, httpOptions );
    }
    postRegistroMensaje(registro: any): Observable<any> {
      return this.http.post<any>(this.presURL2, registro, httpOptions );
    }
    delnotificacion(id: String) {
      const url = `${this.presURL1}/${id}.json` ;
      return this.http.delete(url);
    }

}

