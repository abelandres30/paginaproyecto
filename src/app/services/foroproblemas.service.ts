import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Publicacion } from '../models/publicacion';

const httpOptions = {
  headers: new HttpHeaders({ 'content-type': 'application/json' })
};

interface CampoValor {
  campo: string;
  valor: any;
}

@Injectable({
  providedIn: 'root'
})

export class ForoproblemasService {
  private readonly baseURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com';
  private readonly foroProblemasPath = '/foroproblemas';
  private readonly foroProblemasURL = `${this.baseURL}${this.foroProblemasPath}.json`;
  
  private publicacionesList: AngularFireList<Publicacion>;

  constructor(private http: HttpClient, private firebase: AngularFireDatabase) { 
    this.publicacionesList = this.firebase.list<Publicacion>(this.foroProblemasPath);
  }

  /**
   * Obtiene todas las publicaciones del foro de problemas con tipado fuerte
   * @returns Observable con array de publicaciones tipadas
   */
  obtenerForoProblemas(): Observable<Publicacion[]> {
    return this.firebase.list<Publicacion>(this.foroProblemasPath, ref => ref.orderByKey())
      .snapshotChanges().pipe(
        map(changes => {
          return changes.map(c => ({
            id: c.key as string,
            ...c.payload.val() as Publicacion
          }));
        }),
        catchError(error => {
          console.error('Error al obtener publicaciones del foro de problemas:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Actualiza campos específicos de una publicación usando async/await
   * @param camposValores Array de campos y valores a actualizar
   * @param publicacionId ID de la publicación a actualizar
   * @returns Promise que se resuelve cuando la actualización es exitosa
   */
  async actualizarCamposPublicacion(camposValores: CampoValor[], publicacionId: string): Promise<void> {
    try {
      const updateData: any = {};
      
      // Construir objeto de actualización
      camposValores.forEach(campo => {
        updateData[campo.campo] = campo.valor;
      });

      // Realizar actualización
      await this.firebase.object(`${this.foroProblemasPath}/${publicacionId}`).update(updateData);
      console.log('Publicación actualizada correctamente');
      
    } catch (error) {
      console.error('Error al actualizar publicación:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva publicación en el foro de problemas
   * @param publicacion Datos de la publicación a crear
   * @returns Observable con la respuesta del servidor
   */
  crearPublicacion(publicacion: Publicacion): Observable<any> {
    return this.http.post<any>(this.foroProblemasURL, publicacion, httpOptions).pipe(
      catchError(error => {
        console.error('Error al crear publicación:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene la lista de publicaciones como AngularFireList para operaciones en tiempo real
   * @returns AngularFireList de publicaciones
   */
  obtenerListaPublicaciones(): AngularFireList<Publicacion> {
    return this.publicacionesList;
  }

  /**
   * Actualiza una publicación completa
   * @param publicacion Datos completos de la publicación
   * @param id ID de la publicación
   * @returns Observable con la respuesta
   */
  actualizarPublicacion(publicacion: Publicacion, id: string): Observable<any> {
    const url = `${this.baseURL}${this.foroProblemasPath}/${id}.json`;
    return this.http.put(url, publicacion, httpOptions).pipe(
      catchError(error => {
        console.error('Error al actualizar publicación completa:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene todas las publicaciones usando HTTP (método legacy para compatibilidad)
   * @returns Observable con las publicaciones
   */
  obtenerPublicacionesHTTP(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.foroProblemasURL).pipe(
      map(response => response || []),
      catchError(error => {
        console.error('Error al obtener publicaciones por HTTP:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Elimina una publicación del foro de problemas
   * @param id ID de la publicación a eliminar
   * @returns Observable con la respuesta
   */
  eliminarPublicacion(id: string): Observable<any> {
    const url = `${this.baseURL}${this.foroProblemasPath}/${id}.json`;
    return this.http.delete(url).pipe(
      catchError(error => {
        console.error('Error al eliminar publicación:', error);
        return throwError(() => error);
      })
    );
  }

  // MÉTODOS LEGACY (mantenidos para compatibilidad)
  /**
   * @deprecated Usar actualizarCamposPublicacion en su lugar
   */
  editarCamposNoArray(camposValores: any[], publicacionid: any) {
    return camposValores.map(val => {
      const updateData = {};
      updateData[val.campo] = val.valor;

      return this.firebase.object(`${this.foroProblemasPath}/${publicacionid}`).update(updateData)
      .then(() => {
        return console.log('Campo actualizado correctamente');
      })
      .catch((error) => {
        console.error('Error al actualizar el campo:', error);
      });
    });
  }
}
