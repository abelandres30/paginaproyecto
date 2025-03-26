

import { AutenticationService } from '../services/autentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AutenticationService, private router: Router) {}

  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  return this.authService.afAuth.authState
    .pipe(
      take(1),
      map(authState => !!authState),
      tap(authenticated => {
        if (authenticated) {
          if (state.url === '/' || state.url === '/moduloregistro') {
            this.router.navigate(['/modulomenu']);
          }
        } else {
          if (state.url !== '/') {
            this.router.navigate(['/']);
          }
        }
      }),
      map(authenticated => {return true }) // Asegúrate de devolver true o false
    );
  }
}

