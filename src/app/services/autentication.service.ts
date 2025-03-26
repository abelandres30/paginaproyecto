import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {

  constructor(public afAuth: AngularFireAuth, private router: Router) {}

  get authState(): Observable<any> {
    return this.afAuth.authState; // En este caso, estamos usando Firebase
  }

  isAuthenticated(): boolean {
    const usuario = localStorage.getItem('PerfilUsuario');
    return usuario != null;  // Si el token no es nulo, el usuario está autenticado
  }
  registroUsuario(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(error => {
      console.log(error);
    });
  }

  signOut(): void {
    this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}
