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

  obtenerForoPoblemas() {
    return this.firebase.list('/foroproblemas',ref => ref.orderByKey()).snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({
          id: c.payload.key,  // Aquí obtenemos el ID del registro
          ...c.payload.val() as any
        }));
      })
    );
  }

  editarCamposNoArray(camposValores: any[], publicacionid: any) {
    return camposValores.map(val => {
      const updateData = {};
      updateData[val.campo] = val.valor;

      return this.firebase.object(`/foroproblemas/${publicacionid}`).update(updateData)
      .then(() => {
        return console.log('Campo actualizado correctamente');
      })
      .catch((error) => {
        console.error('Error al actualizar el campo:', error);
      });
    });
  }

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
