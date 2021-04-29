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


@Injectable({
  providedIn: 'root'
})
export class ForoproyectosService {
  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//foroproyectos.json';
  presURL2 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//foroproyectos';
  PublicacionesList:AngularFireList<any>;
  constructor(private http: HttpClient,private firebase:AngularFireDatabase) {}
  postRegistroNormal(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL, registro, httpOptions );
  }
  getTodasPublicacionesproyecto() {
    return this.PublicacionesList = this.firebase.list('foroproyectos');
  }
  putPublicacion(publicacion: any, id: String) {
    const newpre = JSON.stringify(publicacion);
    const url = `${this.presURL2}/${id}.json` ;
    return this.http.put(url, newpre);
  }
  deproyectos(id: String) {
    const url = `${this.presURL2}/${id}.json` ;
    return this.http.delete(url);
  }
}
