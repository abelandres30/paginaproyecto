import { Injectable } from '@angular/core';
import {firebase} from '@firebase/app';
import { from } from 'rxjs';
import '@firebase/firestore';
import '@firebase/auth';
import { FirebaseAuth } from '@firebase/auth-types';

@Injectable({
  providedIn: 'root'
})
export class CrudusuariosService {
  db;
  constructor() {
    // this.db = firebase.firestore();
   }

   agregarUsuario(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) { });
   }
}
