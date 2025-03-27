import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { catchError, map, tap} from 'rxjs/operators';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database'
// import { guardarpublicacion } from '../../models/publicacion';
import { guardarpublicacion } from '../models/publicacion';

const httpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class ObtenerPublicacionService {

  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publicaciones.json';
  presURL5 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publicaciones';

  presURL1 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//imagenes.json';
  presURL2 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//foroproblemas.json';
  presURL11 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//likes.json';
  presURL3 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//foroproblemas';
  presURL4 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//imagenes';
  presURL10 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//comentarios';

  presURL6 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//comentarios.json';
  presURL7 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publiguardado.json';
  presURL8 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com//publiguardado';

  constructor(private http: HttpClient,private firebase:AngularFireDatabase) { }

  getRespuestas() {
    return this.http.get(this.presURL).map(res => res);
  }

  // Método para obtener las publicaciones como AngularFireList
  getTodasPublicaciones(): Observable<any> {
    return this.firebase.list('/publicaciones', ref => ref.orderByKey())
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            id: c.key,  // Aquí obtenemos el ID del registro
            ...c.payload.val() as any
          }));
        })
      );
  }

  editarCamposNoArray(camposValores: any[], publicacionid: any) {
    return camposValores.map(val => {
      const updateData = {};
      updateData[val.campo] = val.valor;

      return this.firebase.object(`/publicaciones/${publicacionid}`).update(updateData)
      .then(() => {
        return console.log('Campo actualizado correctamente');
      })
      .catch((error) => {
        console.error('Error al actualizar el campo:', error);
      });
    });
  }

  obtenerPorCorreo(usuario: string): Observable<any> {
    return this.firebase.list('/publicaciones', ref => ref.orderByChild('correo').equalTo(usuario))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            id: c.key,  // Aquí obtenemos el ID del registro
            ...c.payload.val() as any
          }));
        })
      );
  }

  // Actualizar un campo específico en los usuarios con el mismo correo
  actualizarCampoEnPublicaciones(usuario: string, campo: string, nuevoValor: any) {
    return this.firebase.database.ref('/publicaciones').orderByChild('correo').equalTo(usuario).once('value')
    .then(snapshot => {
      snapshot.forEach(childSnapshot => {
        this.firebase.object(`publicaciones/${childSnapshot.key}`).update({ [campo]: nuevoValor })
      })
    });
  }
}
