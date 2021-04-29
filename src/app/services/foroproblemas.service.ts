import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { catchError, map, tap} from 'rxjs/operators';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database'
import { guardarpublicacion } from '../models/publicacion';

const httpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ForoproblemasService {
  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//foroproblemas.json';
  presURL2 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//foroproblemas';
  PublicacionesList:AngularFireList<any>;


  constructor(private http: HttpClient,private firebase:AngularFireDatabase) { }
  postRegistroNormal(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL, registro, httpOptions );
  }
  getTodasPublicacionesproblemas() {
    return this.PublicacionesList = this.firebase.list('foroproblemas');
  }
  putPublicacion(publicacion: any, id: String) {
    const newpre = JSON.stringify(publicacion);
    const url = `${this.presURL2}/${id}.json` ;
    return this.http.put(url, newpre);
  }
  getProblemas() {
    return this.http.get(this.presURL).map(res => res);

  }
  deproblemas(id: String) {
    const url = `${this.presURL2}/${id}.json` ;
    return this.http.delete(url);
  }
}
