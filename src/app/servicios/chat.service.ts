import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Mensaje} from '../interface/mensaje.interface';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { RespuestasService } from './respuestas.service';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  nombreusuario;
  public nombre;
  public nombre2;
  public llave;
  public chats: Mensaje[] = [];
  public usuario: any = {};
  
  constructor(private afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public amigos: RespuestasService) {
      this.nombreusuario =  localStorage.getItem('nombreUsuario');

      this.amigos.getRespuestas()
      .subscribe(todosamigos => {
        let i = 0;
        const users = this.nombreusuario;
        const notificacionUser2: string [] = [];
        let nombre2;
        let nombre;
        let llave;
        Object.keys(todosamigos).forEach(function(key) {
          if (todosamigos[key].usuario === users) {
            llave = key;
            nombre = todosamigos[key].usuario;
            notificacionUser2[i] = todosamigos[key];
          }
          if (todosamigos[key].usuario === 'rosario') {
            nombre2 = todosamigos[key].usuario;
          }
        });
        for (let i = 0; i < notificacionUser2.length; i++) {
          this.nombre = nombre;
          this.llave = llave;
          this.nombre2 = nombre2;
        }
        this.usuario.nombre = nombre;
        this.usuario.uid = nombre;
        this.usuario.nombre2 = nombre2;
      });
     }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(100));
     return  this.itemsCollection.valueChanges().map( (mensajes: Mensaje[]) => {
       console.log(mensajes);
        this.chats = [];
        for (const mensaje of mensajes) {
          this.chats.unshift(mensaje);

        }
        return this.chats;
       // this.chats = mensajes;
     });
  }
  Agregarmensaje( text: string) {
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      nombre2: this.usuario.nombre2,
      mensaje: text,
      fecha: new Date().getTime(),
      uid: this.usuario.nombre
    };
    return this.itemsCollection.add( mensaje);
  }
}
