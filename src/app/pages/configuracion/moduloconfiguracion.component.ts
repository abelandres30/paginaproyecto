import { Component, OnInit } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service';
import * as  $ from 'jquery';
import { Router } from '@angular/router';
import { ForoproblemasService } from '../../services/foroproblemas.service';
import * as firebase from 'firebase';
import { Usuarioperfil } from 'src/app/models/cuenta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-moduloconfiguracion',
  templateUrl: './moduloconfiguracion.component.html',
  styleUrls: ['./moduloconfiguracion.component.css']
})

export class ModuloconfiguracionComponent implements OnInit {
  // msgs: Message[] = [];

  // nuevas variables para obtener de mejor forma la informacion
  Corrreousuario: string;
  InfoUser: Usuarioperfil;
  amigos: any[] = [];
  plataforma: any[] = [];
  videojuego: any[] = [];
  plataformas: any[] = [];
  listaplataforma11: any[] = [];
  listaplataforma12: any[] = [];
  listaplataforma21: any[] = [];
  listaplataforma22: any[] = [];
  videojuegos: any[] = [];
  listavideojuegos11: any[] = [];
  listavideojuegos12: any[] = [];
  listavideojuegos21: any[] = [];
  listavideojuegos22: any[] = [];
  imagenperfil;
  avatarimagen;
  nombreusuario;

  constructor(private router: Router, private Usuarios: RespuestasService,private proble: ForoproblemasService)
  {
    // aqui obtengo el usuario del storage
    this.Corrreousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');

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
              this.ObtenerInfo();
            }
          }
        });
      });
  }

  ngOnInit() { }

  GenerarRegistro(amigos, contraseña, correo, imagen, plataforma, repcontraseña, solicitudesAmistadEnviadas, solicitudesAmistadRecibidas, usuario, videojuego, descripcion)
  {
    const registro = new Usuarioperfil();
    registro.amigos = amigos;
    registro.contraseña = contraseña;
    registro.correo = correo;
    registro.imagen = imagen;
    registro.plataforma = plataforma;
    registro.repcontraseña = repcontraseña;
    registro.solicitudesAmistadEnviadas = solicitudesAmistadEnviadas;
    registro.solicitudesAmistadRecibidas = solicitudesAmistadRecibidas;
    registro.usuario = usuario;
    registro.videojuego = videojuego;
    registro.descripcion = descripcion;

    return registro;
  }

  modificarCorreo()
  {
    if ($(".contra").val() === '' || $(".repecontra").val() === '')
    {
      alert("faltan datos por agregar ");
    }
    else
    {
      if ($(".contra").val() === $(".repecontra").val())
      {
        const registro = this.GenerarRegistro(this.InfoUser.amigos, $(".contra").val().toString(), this.InfoUser.correo, this.InfoUser.imagen,
          this.InfoUser.plataforma, $(".contra").val().toString(), this.InfoUser.solicitudesAmistadEnviadas, this.InfoUser.solicitudesAmistadRecibidas,
          this.InfoUser.usuario, this.InfoUser.videojuego, this.InfoUser.descripcion);
        this.Usuarios.putCuenta(registro, this.InfoUser['$key'])
          .subscribe(res => {
            alert("se cambio con exito la contraseña");
            $(".contra").val("");
            $(".repecontra").val("");
          })
      }
      else
      {
        alert("Las contraseñas no coindicen");
      }
    }
  }

  cambiaravatar(avatar)
  {
    const registro = this.GenerarRegistro(this.InfoUser.amigos, this.InfoUser.contraseña, this.InfoUser.correo, avatar,
      this.InfoUser.plataforma, this.InfoUser.repcontraseña, this.InfoUser.solicitudesAmistadEnviadas, this.InfoUser.solicitudesAmistadRecibidas,
      this.InfoUser.usuario, this.InfoUser.videojuego, this.InfoUser.descripcion);
    this.Usuarios.putCuenta(registro, this.InfoUser['$key'])
      .subscribe(res => {
        // alert("se cambio con exito la cuenta");
        $(".contra").val("");
        $(".repecontra").val("");
      })
  }

  ObtenerInfo()
  {
    // este es el espacio para las plataformas
    this.plataformas = [];
    this.plataforma = [];
    this.listaplataforma11 = [];
    this.listaplataforma12 = [];
    this.listaplataforma21 = [];
    this.listaplataforma22 = [];
    this.plataformas = ["Play station", "Pc", "Xbox", "Wii"];
    if (this.InfoUser.plataforma !== undefined || this.InfoUser.plataforma !== null)
    {
      for (const i in this.InfoUser.plataforma)
      {
        let pos = 0;
        this.plataforma.push(this.InfoUser.plataforma[i]);
        for (const o in this.plataformas)
        {
          if (this.plataforma[i] === this.plataformas[o])
          {
            this.plataformas.splice(pos, 1);
          }
          pos = pos + 1
        }
      }
    }
    if (this.plataforma.length > 1)
    {
      this.listaplataforma11 = this.plataforma.splice(0, (this.plataforma.length / 2));
      this.listaplataforma12 = this.plataforma.splice(0, this.plataforma.length);
    }
    else
    {
      this.listaplataforma11 = this.plataforma;
    }
    if (this.plataformas.length > 1)
    {
      this.listaplataforma21 = this.plataformas.splice(0, (this.plataformas.length / 2));
      this.listaplataforma22 = this.plataformas.splice(0, this.plataformas.length);
    }
    else
    {
      this.listaplataforma21 = this.plataformas;
    }

    // este es el espacio para los videojuegos
    this.videojuegos = [];
    this.videojuego = [];
    this.videojuegos = ["God of war", "The last of us", "Ratchet and clank", "Gears of war"
      , "Halo", "left for dead", "Super Smash Bros", "Zelda", "Mario kart", "League of legends", "Fornite", "Forza"];
    this.listavideojuegos11 = [];
    this.listavideojuegos12 = [];
    this.listavideojuegos21 = [];
    this.listavideojuegos22 = [];
    if (this.InfoUser.videojuego !== undefined || this.InfoUser.videojuego !== null)
    {
      for (const i in this.InfoUser.videojuego)
      {
        let pos2 = 0;
        this.videojuego.push(this.InfoUser.videojuego[i]);
        for (const o in this.videojuegos)
        {
          if (this.videojuego[i] === this.videojuegos[o])
          {
            this.videojuegos.splice(pos2, 1);
          }
          pos2 = pos2 + 1
        }
      }
    }

    if (this.videojuego.length > 1)
    {
      this.listavideojuegos11 = this.videojuego.splice(0, (this.videojuego.length / 2));
      this.listavideojuegos12 = this.videojuego.splice(0, this.videojuego.length);
    }
    else
    {
      this.listavideojuegos11 = this.videojuego;
    }
    if (this.videojuegos.length > 1)
    {
      this.listavideojuegos21 = this.videojuegos.splice(0, (this.videojuegos.length / 2));
      this.listavideojuegos22 = this.videojuegos.splice(0, this.videojuegos.length);
    }
    else
    {
      this.listavideojuegos21 = this.videojuegos;
    }

  }

  EliminarPlata()
  {
    let plataformas: any[] = [];
    let entro = false;
    for (const i in this.InfoUser.plataforma)
    {
      plataformas.push(this.InfoUser.plataforma[i]);
    }
    jQuery.noConflict();
    $('.checkbox:checked').each(
      function()
      {
        let pos = 0;
        for (const i in plataformas)
        {
          if ($(this).val() === plataformas[i])
          {
            plataformas.splice(pos, 1);
          }
          pos = pos + 1;
        }
        if ($(this).val() !== null || $(this).val())
        {
          entro = true;
        }
      }
    );
    if (entro)
    {
      const registro = this.GenerarRegistro(this.InfoUser.amigos, this.InfoUser.contraseña, this.InfoUser.correo, this.InfoUser.imagen,
        plataformas, this.InfoUser.repcontraseña, this.InfoUser.solicitudesAmistadEnviadas, this.InfoUser.solicitudesAmistadRecibidas,
        this.InfoUser.usuario, this.InfoUser.videojuego, this.InfoUser.descripcion);
      this.Usuarios.putCuenta(registro, this.InfoUser['$key'])
        .subscribe(res => {
          // alert("Se eliminaron las plataformas seleccionadas con exito");
        })
    }
    else
    {
      alert("No ha seleccionado ningun valor");
    }
  }

  Agregarplata()
  {
    let plataformas: any[] = [];
    let plataformasAll: any = [];
    let entro = false;
    jQuery.noConflict();
    $('.checkbox2:checked').each(
      function()
      {
        plataformas.push($(this).val());
        if ($(this).val() !== undefined || $(this).val() !== null) {
          entro = true;
        }
      }
    );
    for (const i in plataformas)
    {
      plataformasAll.push(plataformas[i]);
    }
    if (this.InfoUser.plataforma !== undefined || this.InfoUser.plataforma !== null)
    {
      for (const i in this.InfoUser.plataforma)
      {
        plataformasAll.push(this.InfoUser.plataforma[i]);
      }
    }
    if (entro)
    {
      const registro = this.GenerarRegistro(this.InfoUser.amigos, this.InfoUser.contraseña, this.InfoUser.correo, this.InfoUser.imagen,
        plataformasAll, this.InfoUser.repcontraseña, this.InfoUser.solicitudesAmistadEnviadas, this.InfoUser.solicitudesAmistadRecibidas,
        this.InfoUser.usuario, this.InfoUser.videojuego, this.InfoUser.descripcion);
      this.Usuarios.putCuenta(registro, this.InfoUser['$key'])
        .subscribe(res => {
          // alert("Se agregaron las plataformas seleccionadas con exito");
        })
    }
    else
    {
      alert("No ha seleccionado ningun valor");
    }
  }

  EliminarVideo()
  {
    let videojuegos: any[] = [];
    let entro = false;
    for (const i in this.InfoUser.videojuego)
    {
      videojuegos.push(this.InfoUser.videojuego[i]);
    }
    jQuery.noConflict();
    $('.checkbox3:checked').each(
      function ()
      {
        let pos = 0;
        for (const i in videojuegos)
        {
          if ($(this).val() === videojuegos[i])
          {
            videojuegos.splice(pos, 1);
          }
          pos = pos + 1;
        }
        if ($(this).val() !== null || $(this).val())
        {
          entro = true;
        }
      }
    );
    if (entro)
    {
      const registro = this.GenerarRegistro(this.InfoUser.amigos, this.InfoUser.contraseña, this.InfoUser.correo, this.InfoUser.imagen,
        this.InfoUser.plataforma, this.InfoUser.repcontraseña, this.InfoUser.solicitudesAmistadEnviadas, this.InfoUser.solicitudesAmistadRecibidas,
        this.InfoUser.usuario, videojuegos, this.InfoUser.descripcion);
      this.Usuarios.putCuenta(registro, this.InfoUser['$key'])
        .subscribe(res => {
          // alert("Se eliminaron los videojuegos seleccionados con exito");
        })
    }
    else
    {
      alert("No ha seleccionado ningun valor");
    }
  }

  Agregarvideo()
  {
    let videojuegos: any[] = [];
    let videojuegosAll: any = [];
    let entro = false;
    jQuery.noConflict();
    $('.checkbox4:checked').each(
      function ()
      {
        videojuegos.push($(this).val());
        if ($(this).val() !== undefined || $(this).val() !== null)
        {
          entro = true;
        }
      }
    );
    for (const i in videojuegos)
    {
      videojuegosAll.push(videojuegos[i]);
    }
    if (this.InfoUser.videojuego !== undefined || this.InfoUser.videojuego !== null)
    {
      for (const i in this.InfoUser.videojuego)
      {
        videojuegosAll.push(this.InfoUser.videojuego[i]);
      }
    }
    if (entro)
    {
      const registro = this.GenerarRegistro(this.InfoUser.amigos, this.InfoUser.contraseña, this.InfoUser.correo, this.InfoUser.imagen,
        this.InfoUser.plataforma, this.InfoUser.repcontraseña, this.InfoUser.solicitudesAmistadEnviadas, this.InfoUser.solicitudesAmistadRecibidas,
        this.InfoUser.usuario, videojuegosAll, this.InfoUser.descripcion);
      this.Usuarios.putCuenta(registro, this.InfoUser['$key'])
        .subscribe(res => {
          // alert("Se agregaron los videojuegos seleccionados con exito");
        })
    }
    else
    {
      alert("No ha seleccionado ningun valor");
    }
  }

  validar()
  {
    const contra = $(".passvalidar").val();
    if (contra !== "") {
      if (contra === this.InfoUser.contraseña) {
        $(".eliminar").removeAttr("disabled");
      } else {
        alert("la contraseña es incorrecta");
      }
    } else {
      alert("No ha ingresado la contraseña");
    }

  }

  Eliminarcuenta()
  {

  }

  guardarDescripcion()
  {
    const registro = this.GenerarRegistro(this.InfoUser.amigos, this.InfoUser.contraseña, this.InfoUser.correo, this.InfoUser.imagen,
      this.InfoUser.plataforma, this.InfoUser.repcontraseña, this.InfoUser.solicitudesAmistadEnviadas, this.InfoUser.solicitudesAmistadRecibidas,
      this.InfoUser.usuario, this.InfoUser.videojuego, $("#TextoDescripcion").val());

    this.Usuarios.putCuenta(registro, this.InfoUser['$key'])
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Se guardo con exito',
          showConfirmButton: false,
          timer: 1500
        })
      })
  }

  cierro()
  {
    localStorage.removeItem('nombreUsuario');
    /*CERRANDO SESION */
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
    }, function (error) {
      // An error happened.
    });
  }

}
