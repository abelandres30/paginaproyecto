import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-moduloconfiguracion',
  templateUrl: './moduloconfiguracion.component.html',
  styleUrls: ['./moduloconfiguracion.component.css']
})
export class ModuloconfiguracionComponent implements OnInit {
  avatarimagen;
  constructor() { }

  ngOnInit() {
    this.avatarimagen = 'img\img10.jpg';

  }

  imagen1() {
    alert('primera imagen');
    this.avatarimagen = 'img\img10.jpg';
  }
  imagen2(){
    alert('segunda imagen');
  }
  imagen3() {
    alert('Tercera imagen');
  }
}
