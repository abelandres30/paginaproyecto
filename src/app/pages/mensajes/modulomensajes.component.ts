import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { RespuestasService } from '../../services/cuentas.service'
import * as $ from 'jquery';
import { Usuarioperfil } from 'src/app/models/cuenta';
import { MensajesService } from '../../services/mensajes.service'
import { detallemensaje, mensaje } from '../../models/mensaje';

@Component({
  selector: 'app-modulomensajes',
  templateUrl: './modulomensajes.component.html',
  styleUrls: ['./modulomensajes.component.css']
})

export class ModulomensajesComponent implements OnInit {
  nombreusuario: any;
  existeamigo: boolean = false;
  Corrreousuario: string;
  InfoUser: Usuarioperfil;
  amigos: any[] = [];
  imagen: any;
  name: any;
  perfilamigo: boolean = false;
  mensajes : any;
  mensajeUsuario: any[] = [];
  mensajeUsuario2: any[] = [];
  correo: any;

  constructor(private storage: AngularFireStorage, private Usuarios: RespuestasService, private mensaje: MensajesService) {
    // aqui obtengo el parametro del localstorage
    this.Corrreousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
    this.proceso();
  }

  proceso()
  {
    this.Usuarios.getTodasCuentas()
      .snapshotChanges()
      .subscribe(res => {
        this.InfoUser = null;
        res.forEach(elemento => {
          let x = elemento.payload.toJSON();

          if (elemento.key !== "ejemplo")
          {
            const datos = x as Usuarioperfil;

            if (datos.correo === this.Corrreousuario)
            {
              x['$key'] = elemento.key;
              this.InfoUser = x as Usuarioperfil;
              this.mostraramigos();
            }
          }
        });
      });
  }

  mostraramigos()
  {
    this.amigos = [];
    this.Usuarios.getAmigos()
    .subscribe(res => {
      for(const i in res)
      {
        for (const o in this.InfoUser.amigos)
        {
          if (res[i].correo === this.InfoUser.amigos[o].correo)
          {
            this.amigos.push(res[i]);
          }
        }
      }
    })
  }

  Perfil(imagen: any, name: any,correo: any)
  {
    this.perfilamigo = true;
    this.imagen = imagen;
    this.name = name;
    this.correo = correo;
    let entro = false;
    this.mensaje.getTodosmensajes()
      .snapshotChanges()
      .subscribe(res => {
        this.mensajes = [];
        this.mensajeUsuario = [];
        res.forEach(elemento => {
          let x = elemento.payload.toJSON();
          if (elemento.key !== "ejemplo")
          {
            const datos = x as mensaje;

            if ((datos.correo === this.Corrreousuario && datos.correo2 === correo) || (datos.correo === correo && datos.correo2 === this.Corrreousuario))
            {
              x['$key'] = elemento.key;
              this.mensajes = x as mensaje;
              entro = true;
            }
          }
        });

        if (!entro)
        {
          this.generarEspaciomensaje(imagen,name,correo);
          var input = document.getElementById("InputMensaje");
          input.focus();
        }
        else
        {
          this.generarMensajes();
          var input = document.getElementById("InputMensaje");
          input.focus();
        }
      });
  }

  generarMensajes()
  {
    for (const i in this.mensajes.listaMensajes)
    {
      this.mensajeUsuario.push(this.mensajes.listaMensajes[i]);
    }
  }

  generarEspaciomensaje(imagen: any, name: any, correo: any)
  {
    const registro = new mensaje();
    registro.usuario = this.nombreusuario;
    registro.usuario2 = this.name;
    registro.correo = this.Corrreousuario;
    registro.correo2 = correo;
    registro.listaMensajes = [];

    this.mensaje.postRegistroNormal(registro)
    .subscribe(res =>{});
  }

  Enviar(mensajeInfo,listamensajes)
  {
    let x: any[] = [];
    let entro = false;
    const mensajeText = $(".mensaje").val();

    if (mensajeText !== "")
    {
      const registro = new detallemensaje();
      registro.correo = this.Corrreousuario;
      registro.usuario = this.nombreusuario;
      registro.mensaje = mensajeText.toString();

       if (listamensajes === undefined || listamensajes === null)
       {
        x.push(registro);
       }
       else
      {
        for (const i in listamensajes)
        {
          x.push(listamensajes[i]);
        }
        x.push(registro);
       }

       const registroMensaje = new mensaje();
       registroMensaje.correo = mensajeInfo.correo;
       registroMensaje.correo2 = mensajeInfo.correo2;
       registroMensaje.usuario = mensajeInfo.usuario;
       registroMensaje.usuario2 = mensajeInfo.usuario2;
       registroMensaje.listaMensajes = x;

       this.mensaje.putmensaje(registroMensaje,mensajeInfo.$key)
       .subscribe(res => {
        $(".mensaje").val("");
       });
    }
  }

  cierro()
  {
    localStorage.removeItem('nombreUsuario');
    /*CERRANDO SESION */
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function (error) {
      // An error happened.
    });
  }

  ngOnInit()
  {
    $('#app-mensajes').hide();
  }
}
