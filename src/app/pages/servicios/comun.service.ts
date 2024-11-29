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

  CargarInformacion(Informacion: any, DatoBuscar: string, DatoComparar: any)
  {
    this.Resultado = null;

    for (const i in Informacion)
    {
      if (i !== "ejemplo")
      {
        if (Informacion[i][DatoBuscar] === DatoComparar)
        {
          this.Resultado = Informacion[i];
        }
      }
    }
    return this.Resultado;
  }


  CargarDato(Informacion: any, DatoBuscar: string, DatoComparar: any)
  {
    this.Resultado = null;

    for (const i in Informacion)
    {
      if (i !== "ejemplo")
      {
        if (Informacion[i][DatoBuscar] === DatoComparar)
        {
          this.Resultado = i;
        }
      }
    }
    return this.Resultado;
  }

  CargarInformaciones(Informacion:any, DatoBuscar: string)
  {
    this.Resultados = [];

    for (const i in Informacion)
    {
      if (i !== "ejemplo")
      {
        this.Resultados.push(Informacion[i][DatoBuscar]);
        this.ResultadosExtras.push(i);
      }
    }

    return this.Resultados;
  }

}
