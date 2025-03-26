import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ComunService {
  Resultado: any;
  Resultados: Array<any>;
  ResultadosExtras: Array<any>;
  DatoBuscarMetodo: string;

  constructor() { }
}
