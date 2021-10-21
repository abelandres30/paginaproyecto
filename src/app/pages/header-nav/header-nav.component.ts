import { Component, OnInit, ViewChild } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent implements OnInit {
  Corrreousuario: string = localStorage.getItem('nombreUsuario');
  nombreusuario: string = localStorage.getItem('NombreUser');
  IdUser: string;
  idUser: string;
  id: string[] = [];
  amigos = this.obtenerAmigos();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.amigos.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )


  constructor(private cuenta: RespuestasService, private _router: ActivatedRoute, private router: Router) {
    this.Corrreousuario = localStorage.getItem('nombreUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');

  }

  ngOnInit(): void {
    this.idUser = this._router.snapshot.paramMap.get('id');
    this.cuenta.getAmigos()
      .subscribe(res => {
        for (const i in res) {
          if (res[i].correo === this.Corrreousuario) {
            this.IdUser = i;
          }
        }
      })
  }

  obtenerAmigos() {
    let amigos: any[] = [];
    this.cuenta.getAmigos()
      .subscribe(res => {
        for (const i in res) {
          if (i !== "ejemplo") {
            amigos.push(res[i].usuario);
            this.id.push(i);
          }
        }

      });
    return amigos;
  }



  perfilusuario() {
    if (this.router.url === "/perfil/" + this.IdUser || this.router.url === "/perfil/" + this.idUser) {
      if (this.router.url !== "/perfil/" + this.IdUser) {
        this.router.navigate(['perfil', this.IdUser]);

        setTimeout(() => {
          location.reload();
        }, 100);
      }
    } else {
      this.router.navigate(['perfil', this.IdUser]);
    }
  }
  selected($e) {
    for(const i in this.amigos) {
      if (this.amigos[i] === $e.item) {
        if (this.router.url === "/perfil/" + this.IdUser || this.router.url === "/perfil/" + this.idUser) {
          if (this.router.url !== "/perfil/" + this.IdUser) {
            this.router.navigate(['perfil', this.id[i]]);
    
            setTimeout(() => {
              location.reload();
            }, 100);
          } else {
            this.router.navigate(['perfil', this.id[i]]);
    
            setTimeout(() => {
              location.reload();
            }, 100);
          }
        } else {
          this.router.navigate(['perfil', this.id[i]]);
        }
      }
    }
  }
  cierro()
  {
    firebase.auth().signOut();
    this.router.navigate(['moduloregistro']);
  }
}
