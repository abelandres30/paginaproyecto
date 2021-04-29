import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {
  public authState: any = null;


  constructor(public afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
   }
   registroUsuario(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(error => {
      console.log(error);
    });
  }
  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
}
