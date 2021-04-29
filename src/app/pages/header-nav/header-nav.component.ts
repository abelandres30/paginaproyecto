import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent implements OnInit {
  Corrreousuario: string;
  nombreusuario: string;

  constructor() {
    this.Corrreousuario = localStorage.getItem('nombreUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
   }

  ngOnInit(): void {
  }

}
