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
export class ConfiguracionesService {
  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//respuestas';

  constructor(private http: HttpClient) { }
  delUsuario(id: String) {
    const url = `${this.presURL}/${id}.json` ;
    return this.http.delete(url);
  }

}
