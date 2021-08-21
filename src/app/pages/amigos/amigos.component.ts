import { Component, OnInit } from '@angular/core';
import { Usuarioperfil } from '../../models/cuenta';
import { RespuestasService } from '../../services/cuentas.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css']
})
export class AmigosComponent implements OnInit {
  InfoUsuario: Usuarioperfil;
  InfoAmigo: Usuarioperfil;
  Amigos: any[] = [];
  Amigos2: any[] = [];
  Lista1: any[] = [];
  Lista2: any[] = [];

  solicitudesRecibidas: any[] = [];
  solicitudesEnviadas: any[] = [];
  plataformas: any[] = [];
  videojuegos: any[] = [];
  Corrreousuario: string;
  nombreusuario: string;
  pos: any;
  existenciaPlataforma: boolean;
  entro = false;
  idUser: string;
  constructor(private Cuenta: RespuestasService, private router: Router) { }

  ngOnInit(): void {
    this.Corrreousuario = localStorage.getItem('nombreUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.proceso();
  }

  proceso() {
    this.Cuenta.getTodasCuentas()
      .snapshotChanges()
      .subscribe(res => {
        this.InfoUsuario = null;
        this.Amigos = [];
        this.solicitudesEnviadas = [];
        this.solicitudesRecibidas = [];
        this.Lista1 = [];
        this.Lista2 = [];
        res.forEach(elemento => {
          let x = elemento.payload.toJSON();
          if (elemento.key !== "ejemplo") {
            const datos = x as Usuarioperfil;
            if (datos.correo === this.Corrreousuario) {
              x['$key'] = elemento.key;
              this.InfoUsuario = x as Usuarioperfil;
              this.generarInfo(this.InfoUsuario);
            }
          }
        })
      })
  }

  generarInfo(InfoUsuario: Usuarioperfil) {
    this.Cuenta.getAmigos()
    .subscribe(res =>{
      for(const i in res) {
        for (const o in InfoUsuario.amigos) {
          if (res[i].correo === InfoUsuario.amigos[o].correo) {
            this.Amigos.push(res[i]);
          }
        }
      }

      if (this.Amigos.length > 1) {
        this.Lista1 = this.Amigos.splice(0,(this.Amigos.length/2));
        this.Lista2 = this.Amigos.splice(0,(this.Amigos.length));
      } else {
        this.Lista1 = this.Amigos;
      }
    })

    for (const i in InfoUsuario.solicitudesAmistadEnviadas) {
      this.solicitudesEnviadas.push(InfoUsuario.solicitudesAmistadEnviadas[i]);
    }
    for (const i in InfoUsuario.solicitudesAmistadRecibidas) {
      this.solicitudesRecibidas.push(InfoUsuario.solicitudesAmistadRecibidas[i]);
    }

  }

  posicion(solicitudes, pos) {
    this.plataformas = [];
    this.videojuegos = [];
    this.pos = pos;
    for (const o in solicitudes.plataforma) {
      if (solicitudes.plataforma !== undefined && solicitudes.plataforma !== null) {
        this.plataformas.push(solicitudes.plataforma[o]);
      } else {
      }
    }
    for (const o in solicitudes.videojuego) {
      if (solicitudes.videojuego !== undefined && solicitudes.videojuego !== null) {
        this.videojuegos.push(solicitudes.videojuego[o]);
      } else {
      }
    }
  }
  aceptarAmigo(solicitud, InfoUsuario) {
    this.ObtenerInfoActualizada(solicitud, InfoUsuario);
    this.EliminarRecibida(solicitud, InfoUsuario);
  }
  
  EliminarEnviadaUsuario(InfoUsuario) {
    let Recibidas: any[] = []
    let Enviadas: any[] = []
    let posReb = 0;
    let posEnvi = 0;
    for (const i in this.InfoAmigo.solicitudesAmistadRecibidas) {
      Recibidas.push(this.InfoAmigo.solicitudesAmistadRecibidas[i]);
      if (this.InfoAmigo.solicitudesAmistadRecibidas[i].correo === InfoUsuario.correo) {
        Recibidas.splice(posReb, 1);
      }
      posReb = posReb + 1;
    }
    for (const i in this.InfoAmigo.solicitudesAmistadEnviadas) {
      Enviadas.push(this.InfoAmigo.solicitudesAmistadEnviadas[i]);
      if (this.InfoAmigo.solicitudesAmistadEnviadas[i].correo === InfoUsuario.correo) {
        Enviadas.splice(posEnvi, 1);
      }
      posEnvi = posEnvi + 1;
    }
    const registro = new Usuarioperfil();
    registro.contraseña = this.InfoAmigo.contraseña;
    registro.correo = this.InfoAmigo.correo;
    registro.imagen = this.InfoAmigo.imagen;
    registro.plataforma = this.InfoAmigo.plataforma;
    registro.repcontraseña = this.InfoAmigo.repcontraseña;
    registro.usuario = this.InfoAmigo.usuario;
    registro.videojuego = this.InfoAmigo.videojuego;
    registro.solicitudesAmistadRecibidas = Recibidas;
    registro.solicitudesAmistadEnviadas = Enviadas;
    registro.amigos = this.GenerarAmigoUsuario(this.InfoUsuario);
    this.Cuenta.putCuenta(registro, this.InfoAmigo["$key"])
      .subscribe(result => {
        console.log("se agrego mi perfil en su lista de amigos");
      });
  }
  ObtenerInfoActualizada(solicitud: any, InfoUsuario) {
    this.entro = true;
    this.Cuenta.getTodasCuentas()
      .snapshotChanges()
      .subscribe(res => {
        if (this.entro === true) {
          this.InfoAmigo = null;
          res.forEach(elemento => {
            let x = elemento.payload.toJSON();
            if (elemento.key !== "ejemplo") {
              const datos = x as Usuarioperfil;
              if (datos.correo === solicitud.correo) {
                x['$key'] = elemento.key;
                this.InfoAmigo = x as Usuarioperfil;
                this.entro = false;
                this.EliminarEnviadaUsuario(InfoUsuario);
              }
            }
          })
        }
      })
  }

  GenerarAmigoUsuario(InfoUsuario: Usuarioperfil) {
    var x: any[] = [];
    const registroAmigo = new Usuarioperfil()
    registroAmigo.correo = InfoUsuario.correo;
    registroAmigo.usuario = InfoUsuario.usuario;
    if (this.InfoAmigo.amigos === null || this.InfoAmigo.amigos === undefined) {
      x.push(registroAmigo);
    } else {
      for (const i in this.InfoAmigo.amigos) {
        x.push(this.InfoAmigo.amigos[i]);
      }
      x.push(registroAmigo);
    }
    return x;
  }

  EliminarRecibida(solicitud: any, InfoUsuario) {
    let posReb = 0;
    let posEnvi = 0;
    for (const i in this.solicitudesRecibidas) {
      if (this.solicitudesRecibidas[i].correo === solicitud.correo) {
        this.solicitudesRecibidas.splice(posReb, 1);
      }
      posReb = posReb + 1;
    }
    for (const i in this.solicitudesEnviadas) {
      if (this.solicitudesEnviadas[i].correo === solicitud.correo) {
        this.solicitudesEnviadas.splice(posEnvi, 1);
      }
      posEnvi = posEnvi + 1;
    }

    const registro = new Usuarioperfil();
    registro.contraseña = this.InfoUsuario.contraseña;
    registro.correo = this.InfoUsuario.correo;
    registro.imagen = this.InfoUsuario.imagen;
    registro.plataforma = this.InfoUsuario.plataforma;
    registro.repcontraseña = this.InfoUsuario.repcontraseña;
    registro.usuario = this.InfoUsuario.usuario;
    registro.videojuego = this.InfoUsuario.videojuego;
    registro.solicitudesAmistadRecibidas = this.solicitudesRecibidas;
    registro.solicitudesAmistadEnviadas = this.solicitudesEnviadas;
    registro.amigos = this.GenerarAmigo(solicitud);
    this.Cuenta.putCuenta(registro, InfoUsuario.$key)
      .subscribe(result => { });
    console.log("se agrego su perfil en mi lista de amigos");
  }

  GenerarAmigo(solicitud: any) {
    var x: any[] = [];
    const registroAmigo = new Usuarioperfil()
    registroAmigo.correo = solicitud.correo;
    registroAmigo.usuario = solicitud.usuario;
    if (this.InfoUsuario.amigos === null || this.InfoUsuario.amigos === undefined) {
      x.push(registroAmigo);
    } else {
      for (const i in this.InfoUsuario.amigos) {
        x.push(this.InfoUsuario.amigos[i]);
      }
      x.push(registroAmigo);
    }
    return x;
  }
  
  perfilusuario(correo) {
    this.idUser = "";
    this.Cuenta.getAmigos()
    .subscribe(res => {
      for (const i in res) {
        if (res[i].correo === correo) {
          this.idUser = i;
          this.router.navigate(['perfil',this.idUser]);
        } 
      }
    });
  }
}
