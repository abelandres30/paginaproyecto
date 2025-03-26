import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database'
import { catchError, map, tap, switchMap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class MensajesService {
  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//mensajes.json';
  presURL2 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//mensajes';

  PublicacionesList:AngularFireList<any>;

  constructor(private firebase:AngularFireDatabase,private http: HttpClient) { }

  postRegistroNormal(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL, registro, httpOptions );
  }

  getRespuestas() {
    return this.http.get(this.presURL).map(res => res);
  }

  getTodosmensajes(usuario: string) {
    return this.firebase.list('/mensajes', ref => ref.orderByChild('usuario').equalTo(usuario))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            id: c.payload.key,  // Aquí obtenemos el ID del registro
            ...c.payload.val() as any
          }));
        })
      );
  }

   editarCamposNoArray(camposValores: any[], usuarioid: any) {
    return camposValores.map(val => {
      const updateData = {};
      updateData[val.campo] = val.valor;

      return this.firebase.object(`/mensajes/${usuarioid}`).update(updateData)
      .then(() => {
        return console.log('Campo actualizado correctamente');
      })
      .catch((error) => {
        console.error('Error al actualizar el campo:', error);
      });
    });
  }

  putmensaje(publicacion: any, id: String) {
    const newpre = JSON.stringify(publicacion);
    const url = `${this.presURL2}/${id}.json` ;
    return this.http.put(url, newpre);
  }
}
