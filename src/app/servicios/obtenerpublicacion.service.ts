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
export class ObtenerPublicacionService {
  presURL = 'https://proyectogamerface.firebaseio.com//publicaciones.json';

  constructor(private http: HttpClient) { }

  getRespuestas() {
    return this.http.get(this.presURL).map(res => res);
  }
}
