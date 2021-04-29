import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { GlobalesService } from '../../services/globales.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { RespuestasService } from '../../services/cuentas.service';
import { Message } from 'primeng/api';
import { Usuarioperfil } from 'src/app/models/cuenta';

class Notificaciones {
  usuario1;
  usuario2;
  motivo;
  estado;
  mensaje;
}

@Component({
  selector: 'app-usuariorecomendados',
  templateUrl: './usuariorecomendados.component.html',
  styleUrls: ['./usuariorecomendados.component.css']
})
export class UsuariorecomendadosComponent implements OnInit {
  msgs: Message[] = [];
  msgs2: Message[] = [];
  existencia = false;
  nombreusuario;
  nombreplataforma;
  nombreusuario2;
  amigousuario: string[] = [];
  // variables booleanas
  sicoincidencia: boolean[] = [];
  videojuegos: string[] = [];
  coincidencia: any[] = [];
  register;

  esamigo: boolean = false;
  CorreoUsuario: string;
  InfoUsuarios: Usuarioperfil[];
  InfoUser: Usuarioperfil;
  constructor(private storage: AngularFireStorage, private cookie: CookieService, private usuarios: RespuestasService) {

    this.nombreusuario = localStorage.getItem('NombreUser');
    this.CorreoUsuario = localStorage.getItem('nombreUsuario')

    this.usuarios.getTodasCuentas()
      .snapshotChanges()
      .subscribe(res => {
        this.InfoUsuarios = [];
        res.forEach(elemento => {
          let x = elemento.payload.toJSON();
          if (elemento.key !== "ejemplo") {
            const datos = x as Usuarioperfil;
            if (datos.correo === this.CorreoUsuario) {
              x['$key'] = elemento.key;
              this.InfoUser = x as Usuarioperfil;

            }
          }
        });
        this.obtenerUsuariosRecomendados(this.InfoUser);
      });

  }
  obtenerUsuariosRecomendados(InfoUser) {
    this.usuarios.getTodasCuentas()
      .snapshotChanges()
      .subscribe(res => {
        this.InfoUsuarios = [];
        this.coincidencia = [];
        this.sicoincidencia = [];
        res.forEach(elemento => {
          let ValorPlataforma = false;
          let ValorVideojuego = false;
          let entro = false;
          let x = elemento.payload.toJSON();
          if (elemento.key !== "ejemplo") {
            const datos = x as Usuarioperfil;
            if (datos.correo !== this.CorreoUsuario) {
                  for (const i in this.InfoUser.plataforma) {
                    for (const o in datos.plataforma) {
                      if (this.InfoUser.plataforma[i] === datos.plataforma[o]) {
                        ValorPlataforma = true;
                        this.coincidencia.push(datos.plataforma[o]);
                      }
                    }
                  }
                  if (!ValorPlataforma) {
                    for (const i in this.InfoUser.videojuego) {
                      for (const o in datos.videojuego) {
                        if (this.InfoUser.videojuego[i] === datos.videojuego[o]) {
                          ValorVideojuego = true;
                          this.coincidencia.push(datos.videojuego[o]);
                        }
                      }
                    }
                  }
                  if (ValorVideojuego === true || ValorPlataforma) {
                      x['$key'] = elemento.key;
                      this.InfoUsuarios.push(x as Usuarioperfil);
                      this.existencia = true;
                  }
                  if (ValorPlataforma === true && ValorVideojuego === false) {
                    this.sicoincidencia.push(true);
                  }
                  if (ValorVideojuego === true && ValorPlataforma === false) {
                    this.sicoincidencia.push(false);
                  }
                  if (ValorVideojuego === true && ValorPlataforma) {
                    this.sicoincidencia.push(true);
                  }                
            }
          }
        });
        this.ValidarUsuarios();              

      });

  }

  ValidarUsuarios() {
    for (const i in this.InfoUser.solicitudesAmistadEnviadas) {
      let pos = 0;
      for (const o  in this.InfoUsuarios) {
        if (this.InfoUser.solicitudesAmistadEnviadas[i].correo === this.InfoUsuarios[o].correo) {
            this.coincidencia.splice(pos,1);
            this.sicoincidencia.splice(pos,1);
            this.InfoUsuarios.splice(pos,1);
        }
        pos = pos + 1;
      }
    }

    for (const i in this.InfoUser.amigos) {
      let pos = 0;
      for (const o in this.InfoUsuarios) {
        if (this.InfoUser.amigos[i].correo === this.InfoUsuarios[o].correo) {
          this.coincidencia.splice(pos,1);
          this.sicoincidencia.splice(pos,1);
          this.InfoUsuarios.splice(pos,1);
        }
        pos = pos + 1;
      }
    }

  }

  nombretuusuario(usuario) {
    localStorage.removeItem('suusuario');
    localStorage.setItem('suusuario', usuario);
  }
  ngOnInit() {
    this.register = {
      mensaje: '',
    };
  }

  enviar(usuario, InfoUser) {
    var x: any[] = [];
    let entro = false;
    const registroNewAmigo = new Usuarioperfil();
    registroNewAmigo.imagen = usuario.imagen;
    registroNewAmigo.correo = usuario.correo;
    registroNewAmigo.usuario = usuario.usuario;
    registroNewAmigo.plataforma = usuario.plataforma;
    registroNewAmigo.videojuego = usuario.videojuego;
    registroNewAmigo.amigos = usuario.amigos;
    registroNewAmigo.contraseña = usuario.contraseña;
    registroNewAmigo.repcontraseña = usuario.repcontraseña;
    registroNewAmigo.solicitudesAmistadEnviadas = usuario.solicitudesAmistadEnviadas;
    registroNewAmigo.solicitudesAmistadRecibidas = usuario.solicitudesAmistadRecibidas;

    if (this.InfoUser.solicitudesAmistadEnviadas === null || this.InfoUser.solicitudesAmistadEnviadas === undefined) {
      x.push(registroNewAmigo);
    } else {
      for (const i in InfoUser.solicitudesAmistadEnviadas) {
        x.push(InfoUser.solicitudesAmistadEnviadas[i]);
      }
        x.push(registroNewAmigo);
      
    }
    const registroMiPerfil = new Usuarioperfil();
    registroMiPerfil.amigos = InfoUser.amigos;
    registroMiPerfil.contraseña = InfoUser.contraseña;
    registroMiPerfil.correo = InfoUser.correo;
    registroMiPerfil.imagen = InfoUser.imagen;
    registroMiPerfil.plataforma = InfoUser.plataforma;
    registroMiPerfil.repcontraseña = InfoUser.repcontraseña;
    registroMiPerfil.solicitudesAmistadEnviadas = x;
    registroMiPerfil.usuario = InfoUser.usuario;
    registroMiPerfil.videojuego = InfoUser.videojuego;
    registroMiPerfil.solicitudesAmistadRecibidas = InfoUser.solicitudesAmistadRecibidas;
    this.usuarios.putCuenta(registroMiPerfil, InfoUser.$key)
      .subscribe(res => {
        this.ModificarListaUsuario(usuario,InfoUser);
      });

  }
  ModificarListaUsuario(usuario,InfoUser) {
    var x: any[] = [];
    let entro = false;
    const registroSolicitud = new Usuarioperfil();
    registroSolicitud.imagen = InfoUser.imagen;
    registroSolicitud.correo = InfoUser.correo;
    registroSolicitud.usuario = InfoUser.usuario;
    registroSolicitud.plataforma = InfoUser.plataforma;
    registroSolicitud.videojuego = InfoUser.videojuego;
    registroSolicitud.amigos = InfoUser.amigos;
    registroSolicitud.contraseña = InfoUser.contraseña;
    registroSolicitud.repcontraseña = InfoUser.repcontraseña;
    registroSolicitud.solicitudesAmistadEnviadas = InfoUser.solicitudesAmistadEnviadas;
    registroSolicitud.solicitudesAmistadRecibidas = InfoUser.solicitudesAmistadRecibidas;
  
    if (usuario.solicitudesAmistadRecibidas === null || usuario.solicitudesAmistadRecibidas === undefined) {
      x.push(registroSolicitud);
    } else {
      for (const i in usuario.solicitudesAmistadRecibidas) {
 
        x.push(usuario.solicitudesAmistadRecibidas[i]);
      }
        x.push(registroSolicitud);
      
    }
    const registroMiPerfil = new Usuarioperfil();
    registroMiPerfil.amigos = usuario.amigos;
    registroMiPerfil.contraseña = usuario.contraseña;
    registroMiPerfil.correo = usuario.correo;
    registroMiPerfil.imagen = usuario.imagen;
    registroMiPerfil.plataforma = usuario.plataforma;
    registroMiPerfil.repcontraseña = usuario.repcontraseña;
    registroMiPerfil.solicitudesAmistadEnviadas = usuario.solicitudesAmistadEnviadas;
    registroMiPerfil.usuario = usuario.usuario;
    registroMiPerfil.videojuego = usuario.videojuego;
    registroMiPerfil.solicitudesAmistadRecibidas = x;
    this.usuarios.putCuenta(registroMiPerfil, usuario.$key)
      .subscribe(res => {
        alert("Se envio la solicitud de amistad")
      });
  }

  mensaje() {}

  enviarmensaje(usuario) {
    // this.nombreusuario2 = usuario;
  }
  Enviarmensaje2(usuario) {
    // if (this.register.mensaje === '') {
    //   this.msgs2 = [];
    //   this.msgs2.push({ severity: 'error', detail: ' Falta agregar el mensaje' });
    // } else {
    //   const registro = new Notificaciones();
    //   registro.usuario1 = this.nombreusuario;
    //   registro.usuario2 = usuario;
    //   registro.motivo = ' Te envio un mensaje';
    //   registro.estado = 'false';
    //   registro.mensaje = this.register.mensaje;
    //   this.notifiaciones.postRegistroNormal(registro)
    //     .subscribe(newpres => { });



    //   this.msgs2 = [];
    //   this.msgs2.push({ severity: 'success', detail: ' Se envio el mensaje con exito' });
    //   this.register.mensaje = '';
    // }


  }
}
