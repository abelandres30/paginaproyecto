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
export class ForoproblemasService {
  presURL = 'https://proyectogamerface.firebaseio.com//foroproyectos.json';
  presURL1 = 'https://proyectogamerface.firebaseio.com//foroproyectos.json';
  presURL2 = 'https://proyectogamerface.firebaseio.com//foroproyectos';
  presURL4 = 'https://proyectogamerface.firebaseio.com//foroproblemas';


  constructor(private http: HttpClient) { }
  postRegistroNormal(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL, registro, httpOptions );
  }
  getProyectos() {
    return this.http.get(this.presURL1).map(res => res);

  }
  deproyectos(id: String) {
    const url = `${this.presURL2}/${id}.json` ;
    return this.http.delete(url);
  }
  deproblemas(id: String) {
    const url = `${this.presURL4}/${id}.json` ;
    return this.http.delete(url);
  }
}
