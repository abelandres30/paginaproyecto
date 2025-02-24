import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database'


const httpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};
@Injectable()

export class RespuestasService {
  CuentasList:AngularFireList<any>;

  presURL = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com///respuestas.json';
  presURLAmigo = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com///respuestas';
  presURL2 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com///amigos.json';
  presURL3 = 'https://proyectogamerface-9e004-default-rtdb.firebaseio.com///amigos';
  constructor(private http: HttpClient,private firebase:AngularFireDatabase) { }

  postRegistroNormal(registro: any): Observable<any> {
    return this.http.post<any>(this.presURL, registro, httpOptions );
  }

  getTodasCuentas() {
    return this.CuentasList = this.firebase.list('respuestas');
  }

  putCuenta(cuenta: any, id: String) {
    const newpre = JSON.stringify(cuenta);
    const url = `${this.presURLAmigo}/${id}.json` ;
    return this.http.put(url, newpre);
  }

  getRespuestas() {
    return this.http.get(this.presURL).map(res => res);
  }

  getUsuarios(term: string) {
    return this.firebase.list('respuestas', ref => ref.orderByChild('usuario').startAt(term).endAt(term + "\uf8ff")).valueChanges()
      .pipe(
        map(users => users.map(user => user['usuario'])) // Extraer solo el campo 'usuario'
      );
  }

  editarCamposNoArray(camposValores: any[], usuarioid: any) {
    return camposValores.map(val => {
      const updateData = {};
      updateData[val.campo] = val.valor;

      return this.firebase.object(`/respuestas/${usuarioid}`).update(updateData)
      .then(() => {
        return console.log('Campo actualizado correctamente');
      })
      .catch((error) => {
        console.error('Error al actualizar el campo:', error);
      });
    });
  }

  editarCamposArray(camposValores: any[], usuarioid: any) {
    return camposValores.map(val => {
      const userRef = this.firebase.list(`respuestas/${usuarioid}/${val.campo}`);
      const updateData = {};

      // Obtén el array de items
      return userRef.query.once('value').then(snapshot => {

        updateData[val.campo] = val.valor;

        return this.firebase.object(`respuestas/${usuarioid}`).update(updateData);
      });
    });

  }

  obtenerPorUsuario(usuario: string): Observable<any> {
    return this.firebase.list('/respuestas', ref => ref.orderByChild('usuario').equalTo(usuario))
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

  obtenerPorCorreo(usuario: string): Observable<any> {
    return this.firebase.list('/respuestas', ref => ref.orderByChild('correo').equalTo(usuario))
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

  // Método para realizar la búsqueda comparando un campo con valores de un array
  obtenerUsuariosRecomendados(): Observable<any[]> {
    return this.firebase.list('respuestas').snapshotChanges().pipe(map(changes => {
        return changes.map(c => ({
          id: c.payload.key,  // Aquí obtenemos el ID del registro
          ...c.payload.val() as any
        }));
      })
    );
  }

  // Metodo para agregar en el perfil actual la solicitud enviada
  agregarSolicitudEnviada(usuarioSolicitudEnvia: any, usuarioSolicitudRecibe: any, llaveUsuarioEnvia: any, llaveUsuarioRecibe: any)
  {
    return this.firebase.object(`respuestas/${llaveUsuarioEnvia}`).query.once('value').then((res:any) => {
      var data: any = res.val();

      if(data)
      {
        const solicitudesAmistadEnviadasExistentes = data.solicitudesAmistadEnviadas || [];

        var solicitudesActualizadas = [ ...solicitudesAmistadEnviadasExistentes.filter((item: any) => item !== usuarioSolicitudRecibe), ...[usuarioSolicitudRecibe]];

        this.firebase.object(`respuestas/${llaveUsuarioEnvia}`).update({ solicitudesAmistadEnviadas: solicitudesActualizadas, }).then(() => {
          console.log('Se actualizo');
          this.agregarSolicitudRecibida(usuarioSolicitudEnvia, llaveUsuarioRecibe);

        }).catch((error) => {
          console.error('Error al actualizar el objeto en Firebase', error);
        });
      }
    });
  }

  // Metodo para enviar la solicitud enviada al usuario y se agrege como solicitud recibida
  agregarSolicitudRecibida(usuarioSolicitudEnvia: any, llaveUsuarioRecibe: any) {
    return this.firebase.object(`respuestas/${llaveUsuarioRecibe}`).query.once('value').then((res:any) => {
      var data: any = res.val();

      if(data)
      {
        const solicitudesAmistadEnviadasExistentes = data.solicitudesAmistadRecibidas || [];

        var solicitudesActualizadas = [ ...solicitudesAmistadEnviadasExistentes.filter((item: any) => item !== usuarioSolicitudEnvia), ...[usuarioSolicitudEnvia]];

        this.firebase.object(`respuestas/${llaveUsuarioRecibe}`).update({ solicitudesAmistadRecibidas: solicitudesActualizadas, }).then(() => {
          console.log('Se actualizo');
          return 'Se envio';
        }).catch((error) => {
          console.error('Error al actualizar el objeto en Firebase', error);
        });
      }
    })
  }

  // Metood para enviar la solicitud enviada en el perfil actual
  eliminarSolicitudEnviada(llaveUsuarioEnviado: any, llaveUsuarioRecibido: any, correoEnviado: any,  correoRecibido: any) {
    const userRef = this.firebase.list(`respuestas/${llaveUsuarioEnviado}/solicitudesAmistadEnviadas`);

    // Obtén el array de items
    return userRef.query.once('value').then(snapshot => {
      const solicitudesAmistadEnviadas = snapshot.val();
      const index = solicitudesAmistadEnviadas.findIndex((solicitud: any) => solicitud.correo ===  correoRecibido);

      if (index === -1) {
        return Promise.reject('Item no encontrado');
      }

      solicitudesAmistadEnviadas.splice(index, 1);
      this.eliminarSolicitudRecibida(llaveUsuarioRecibido, correoEnviado);

      return this.firebase.object(`respuestas/${llaveUsuarioEnviado}`).update({solicitudesAmistadEnviadas: solicitudesAmistadEnviadas});
    });
  }

  // Metodo para eliminar la solicitud recibida del perfil acutal
  eliminarSolicitudRecibida(llaveUsuarioRecibido:any, correoEnviado: any) {
    const userRef = this.firebase.list(`respuestas/${llaveUsuarioRecibido}/solicitudesAmistadRecibidas`);

    return userRef.query.once('value').then(snapshot => {
      const solicitudesAmistadRecibidas = snapshot.val();
      const index = solicitudesAmistadRecibidas.findIndex((solicitud: any) => solicitud.correo ===  correoEnviado);

      if (index === -1) {
        return Promise.reject('Item no encontrado');
      }

      solicitudesAmistadRecibidas.splice(index, 1);

      return this.firebase.object(`respuestas/${llaveUsuarioRecibido}`).update({solicitudesAmistadRecibidas: solicitudesAmistadRecibidas});
    });
  }

  // Metodo para agregar como amigo en el perfil actual
  aceptarSolicitud(usuarioSolicitudRecibida: any, usuarioActual: any, llaveUsuario: any, llaveUsuarioRecibida: any, corrreoUsuario: any, correoRecibido: any) {
    return this.firebase.object(`respuestas/${llaveUsuario}`).query.once('value').then((res:any) => {
      var data: any = res.val();

      if(data)
      {
        const amigosExistentes = data.amigos || [];

        var amigosActualizados = [ ...amigosExistentes.filter((item: any) => item !== usuarioSolicitudRecibida), ...[usuarioSolicitudRecibida]];

        this.firebase.object(`respuestas/${llaveUsuario}`).update({ amigos: amigosActualizados }).then(() => {
          console.log('Se actualizo');
          this.agregarAmigoRecibido(usuarioActual, llaveUsuario, llaveUsuarioRecibida, corrreoUsuario, correoRecibido);

        }).catch((error) => {
          console.error('Error al actualizar el objeto en Firebase', error);
        });
      }
    });
  }

  // Metodo para agregar amigo en el perfil Usuario
  agregarAmigoRecibido(usuarioActual: any, llaveUsuario: any, llaveUsuarioRecibida: any, corrreoUsuario: any, correoRecibido: any) {

    return this.firebase.object(`respuestas/${llaveUsuarioRecibida}`).query.once('value').then((res:any) => {
      var data: any = res.val();

      if(data)
      {
        const amigosExistentes = data.amigos || [];

        var amigosActualizados = [ ...amigosExistentes.filter((item: any) => item !== usuarioActual), ...[usuarioActual]];

        this.firebase.object(`respuestas/${llaveUsuarioRecibida}`).update({ amigos: amigosActualizados }).then(() => {
          console.log('Se actualizo');

          this.eliminarSolicitudEnviada(llaveUsuarioRecibida, llaveUsuario, correoRecibido, corrreoUsuario,)

        }).catch((error) => {
          console.error('Error al actualizar el objeto en Firebase', error);
        });
      }
    });
  }

  // Metodo para eliminar amigo del perfil actual
  eliminarAmigo(llaveUsuario: any, llaveUsuarioAmigo: any, correo: any,  correoUsuarioAmigo: any) {
    const userRef = this.firebase.list(`respuestas/${llaveUsuario}/amigos`);

    // Obtén el array de items
    return userRef.query.once('value').then(snapshot => {
      const amigos = snapshot.val();
      const index = amigos.findIndex((solicitud: any) => solicitud.correo ===  correoUsuarioAmigo);

      if (index === -1) {
        return Promise.reject('Item no encontrado');
      }

      amigos.splice(index, 1);
      this.eliminarUsuarioAmigo(llaveUsuarioAmigo, correo);

      return this.firebase.object(`respuestas/${llaveUsuario}`).update({amigos: amigos});
    });
  }

  // Metodo para eliminar amigo del perfil usuario
  eliminarUsuarioAmigo(llaveUsuario:any, correoPerfilActual: any) {
    const userRef = this.firebase.list(`respuestas/${llaveUsuario}/amigos`);

    return userRef.query.once('value').then(snapshot => {
      const amigos = snapshot.val();
      const index = amigos.findIndex((solicitud: any) => solicitud.correo ===  correoPerfilActual);

      if (index === -1) {
        return Promise.reject('Item no encontrado');
      }

      amigos.splice(index, 1);

      return this.firebase.object(`respuestas/${llaveUsuario}`).update({amigos: amigos});
    });
  }

  getAmigos() {
    return this.http.get(this.presURL).map(res => res);
  }
}

