import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Mensaje} from '../interface/mensaje.interface';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { RespuestasService } from './cuentas.service';

@Injectable({
  providedIn: 'root'
})

export class ChatService
{
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  nombreusuario : any;
  public nombre: any;
  public nombre2 : any;
  public llave : any;
  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth,
    public amigos: RespuestasService)
    {
      this.nombreusuario =  localStorage.getItem('PerfilUsuario');

      this.amigos.getRespuestas()
      .subscribe(todosamigos => {
        let i = 0;
        const users = this.nombreusuario;
        const notificacionUser2: string [] = [];
        let nombre2: any;
        let nombre: any;
        let llave: any;
        Object.keys(todosamigos).forEach(function(key) {
          if (todosamigos[key].usuario === users) {
            nombre = todosamigos[key].usuario;
            notificacionUser2[i] = todosamigos[key];
          }
        });
        for (let i = 0; i < notificacionUser2.length; i++) {
          this.nombre = nombre;
          this.nombre2 = nombre2;
        }
        this.usuario.nombre = nombre;
        this.usuario.uid = nombre;
        this.usuario.nombre2 = nombre2;
      });
     }

  cargarMensajes()
  {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(100));
     return  this.itemsCollection.valueChanges().map( (mensajes: Mensaje[]) => {
        this.chats = [];
        for (const mensaje of mensajes)
        {
          this.chats.unshift(mensaje);
        }
        return this.chats;
       // this.chats = mensajes;
     });
  }
  Agregarmensaje( text: string, user2: string)
  {
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      nombre2: user2,
      mensaje: text,
      fecha: new Date().getTime(),
      uid: this.usuario.nombre
    };
     this.nombre2 = user2;
    return this.itemsCollection.add( mensaje);
  }
}
