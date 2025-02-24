import { Component, OnInit, ViewChild } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map,switchMap  } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Usuarioperfil } from 'src/app/models/cuenta';
import {ComunService} from 'src/app/pages/servicios/comun.service';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent implements OnInit
{
  Corrreousuario: string = localStorage.getItem('PerfilUsuario');
  UsuarioPerfil: Usuarioperfil = new Usuarioperfil();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.obtenerUsuarios(term))
    )

  constructor (
    private cuenta: RespuestasService,
    private _router: ActivatedRoute,
    private router: Router, private comunSrv: ComunService,
  )

  {

  }

  ngOnInit(): void
  {
    this.ObtenerPerfilUsuario();
  }

  ObtenerPerfilUsuario()
  {
    this.cuenta.obtenerPorCorreo(this.Corrreousuario).subscribe(res => {
      if (res.length !== 0)
      {
        this.UsuarioPerfil = res[0];
        localStorage.setItem("NombreUser", res[0].usuario);
      }
    });
  }

  obtenerUsuarios(term: string)
  {
    return this.cuenta.getUsuarios(term === '' ? '  ' : term);
  }

  perfilusuario()
  {
    var PerfilActivo: boolean = false;
    this.router.url.includes('perfil') ? PerfilActivo = true : PerfilActivo = false;
    this.cuenta.obtenerPorCorreo(this.Corrreousuario).subscribe(res => {
      if (res.length !== 0)
      {
        if (this.router.url !== '/perfil/' + res[0].id) {
          this.router.navigate(['perfil', res[0].id]);
          setTimeout(() => {
            PerfilActivo ? location.reload() : null;
          }, 100);
        }
      }
    });
  }

  selected($e: any)
  {
    var PerfilActivo: boolean = false;
    this.router.url.includes('perfil') ? PerfilActivo = true : PerfilActivo = false;

    this.cuenta.obtenerPorUsuario($e.item).subscribe(res => {

      if (this.router.url !== '/perfil/' + res[0].id) {
        this.router.navigate(['perfil', res[0].id]);
        setTimeout(() => {
          PerfilActivo ? location.reload() : null;
        }, 100);
      }
    });
  }

  teclaEnter(event: KeyboardEvent): void {
    var PerfilActivo: boolean = false;
    this.router.url.includes('perfil') ? PerfilActivo = true : PerfilActivo = false;

    if (event.key === 'Enter') {
      const inputElement = event.target as HTMLInputElement;
      const value = inputElement.value;

      this.cuenta.obtenerPorUsuario(value).subscribe(res => {
        console.log(res.length);
        if (res.length !== 0)
        {
          if (this.router.url !== '/perfil/' + res[0].id) {
            this.router.navigate(['perfil', res[0].id]);
            setTimeout(() => {
              PerfilActivo ? location.reload() : null;
            }, 100);
          }
        }

      });
    }
  }

  cierro()
  {
    firebase.auth().signOut();
    localStorage.removeItem('PerfilUsuario');
    localStorage.removeItem('NombreUser');

    this.router.navigate(['moduloregistro']);
  }
}
