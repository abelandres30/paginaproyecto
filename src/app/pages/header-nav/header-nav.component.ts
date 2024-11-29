import { Component, OnInit, ViewChild } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
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
  IdUser: string;
  id: string[] = [];
  amigos = this.obtenerAmigos();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.amigos.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )


  constructor
  (
    private cuenta: RespuestasService,
    private _router: ActivatedRoute,
    private router: Router, private comunSrv: ComunService,
  )
  {

  }

  ngOnInit(): void
  {
    this.ObtenerPerfilUsuario();

    this.IdUser = this._router.snapshot.paramMap.get('id');
    this.cuenta.getAmigos()
      .subscribe(res =>
      {
        this.IdUser = this.comunSrv.CargarDato(res,"correo",this.Corrreousuario);
      })
  }

  ObtenerPerfilUsuario()
  {
    this.cuenta.getAmigos()
    .subscribe(
      res =>
      {
        this.UsuarioPerfil = this.comunSrv.CargarInformacion(res,"correo",this.Corrreousuario);
        localStorage.setItem("NombreUser", this.UsuarioPerfil.usuario);
      });
  }

  obtenerAmigos()
  {
    let amigos: any[] = [];
    this.cuenta.getAmigos()
      .subscribe(res =>
        {
        amigos = this.comunSrv.CargarInformaciones(res,"usuario");
      });

    return amigos;
  }

  perfilusuario()
  {
    if (this.router.url === "/perfil/" + this.IdUser || this.router.url === "/perfil/" + this.IdUser) {
      if (this.router.url !== "/perfil/" + this.IdUser)
      {
        this.router.navigate(['perfil', this.IdUser]);
        setTimeout(() =>
        {
          location.reload();
        }, 100);
      }
    }
    else
    {
      this.router.navigate(['perfil/'+ this.IdUser]);
    }
  }
  selected($e)
  {
    for(const i in this.amigos)
    {
      if (this.amigos[i] === $e.item)
      {
        if (this.router.url === "/perfil/" + this.IdUser || this.router.url === "/perfil/" + this.IdUser)
        {
          if (this.router.url !== "/perfil/" + this.IdUser)
          {
            this.router.navigate(['perfil', this.id[i]]);

            setTimeout(() =>
            {
              location.reload();
            }, 100);
          }
          else
          {
            this.router.navigate(['perfil', this.id[i]]);

            setTimeout(() =>
            {
              location.reload();
            }, 100);
          }
        }
        else
        {
          this.router.navigate(['perfil', this.id[i]]);
        }
      }
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
