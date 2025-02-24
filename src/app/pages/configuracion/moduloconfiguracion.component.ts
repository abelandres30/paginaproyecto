import { Component, OnInit } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service';
import * as  $ from 'jquery';
import { Router } from '@angular/router';
import { ForoproblemasService } from '../../services/foroproblemas.service';
import * as firebase from 'firebase';
import { Usuarioperfil } from 'src/app/models/cuenta';
import Swal from 'sweetalert2';
import axios from 'axios';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-moduloconfiguracion',
  templateUrl: './moduloconfiguracion.component.html',
  styleUrls: ['./moduloconfiguracion.component.css'],
  animations: [
    trigger('cambiarColor', [
      state('azul', style({
        backgroundColor: '#6495ED',
        color: 'white',
      })),
      state('rojo', style({
        backgroundColor: '#A52A2A',
        color: 'white',
      })),
      transition('azul <=> rojo', [
        animate('1s ease')
      ]),
    ]),
  ]

})

export class ModuloconfiguracionComponent implements OnInit {
  // msgs: Message[] = [];

  // nuevas variables para obtener de mejor forma la informacion
  Corrreousuario: string;
  InfoUser: Usuarioperfil;
  amigos: any[] = [];
  listaRAWG: any[] = [];
  nombreusuario: any;
  descripcion: string = '';
  EditarDescripcion: boolean = false;

  RAWGAPIPlataformas: any;
  RAWGAPIResultPlataformas: string[] = [];
  RAWGAPIVideojuegos: any;
  RAWGAPIResultVideojuegos: string[] = [];

  listaVideoJuegos: string[] = [
    "Black ops 4","Red dead redemtion","Fifa 19","The last of us",
    "God of war ","Ratchet and clank","Gears of war","Left for dead",
    "Forza","Lol","Fornite","Counter strike","Super smash bros",
    "Zelda","Mario bros","Pokemon battle",
    "Mario party","Mario galaxy", 'Halo', 'Mario kart'
  ]

  listaPlataformas: string[]  = ['Play station', 'Xbox', 'Swtich', 'Pc'];
  AVTR = 'https://api.dicebear.com/9.x/'
  AVTRCAT = 'bottts-neutral/svg';
  AVTRCATAD = 'adventurer/svg';

  listaAvatares: string[] = [
    '../../assets/img11.png', '../../assets/img12.png', '../../assets/img13.png', '../../assets/img14.png', '../../assets/img15.png',
    '../../assets/img16.png', '../../assets/img17.png', '../../assets/img18.png',  this.AVTR + this.AVTRCAT, this.AVTR + this.AVTRCAT + '?seed=Felix',
    this.AVTR + this.AVTRCAT + '?seed=Aidan', this.AVTR + this.AVTRCAT + '?seed=Caleb', this.AVTR + this.AVTRCAT + '?seed=Sophia',
    this.AVTR + this.AVTRCATAD, this.AVTR + this.AVTRCATAD + '?seed=Emery', this.AVTR + this.AVTRCATAD + '?seed=Jack'
  ]

  listaCompleta = {
    listaPlataformasCoindicentes: [],
    listaPlataformasNoCoindicentes: [],
    listaVideojuegosCoindicentes: [],
    listaVideojuegosNoCoindicentes: []
  }

  constructor(private router: Router, private Cuenta: RespuestasService,private proble: ForoproblemasService)
  {
    // aqui obtengo el usuario del storage
    this.Corrreousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
  }

  ngOnInit(): void {
    this.cargarApiRAWGPlataformas();
    this.cargarApiRAWGVideojuegos();
    this.obtenerInformacionUsuario();
  }

  cargarApiRAWGPlataformas() {
    this.RAWGAPIPlataformas = JSON.parse(localStorage.getItem('RAWGPlataformas'));

    if (this.RAWGAPIPlataformas === null)
    {
      axios.get('https://api.rawg.io/api/platforms/lists/parents?key=14c6606d6b704404adbe470ad2f0874d').then(resp => {
        localStorage.setItem('RAWGPlataformas' , JSON.stringify(resp));
        this.RAWGAPIPlataformas = resp;

        console.log("Consumo API");
      }).catch(function (error) {
          console.log(error);
      })
      .finally(function () {
        // Se ejecuto sin problemas
        this.RAWGAPIResultPlataformas = this.RAWGAPIPlataformas.data.results;
      });
    }
    else
    {
      this.RAWGAPIResultPlataformas = this.RAWGAPIPlataformas.data.results;
    }
  }

  cargarApiRAWGVideojuegos() {

    this.RAWGAPIVideojuegos = JSON.parse(localStorage.getItem('RAWGVideojuegos'));

    if (this.RAWGAPIVideojuegos === null)
    {
      axios.get('https://api.rawg.io/api/games?key=14c6606d6b704404adbe470ad2f0874d').then(resp => {
        localStorage.setItem('RAWGVideojuegos' , JSON.stringify(resp));
        this.RAWGAPIVideojuegos = resp;

        console.log("Consumo API");
      }).catch(function (error) {
          console.log(error);
      })
      .finally(function () {
        // Se ejecuto sin problemas
        this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results;

      });
    }
    else
    {
      this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results;
    }
  }

  limpiarListaVideojuegos()
  {
    if('videojuego' in this.InfoUser)
    {
      this.RAWGAPIVideojuegos.data.results.map((result,index) => {
        for (const video of this.InfoUser.videojuego) {
          if(video.slug === result.slug)
          {
            this.RAWGAPIVideojuegos.data.results[index]['Agregado'] = true;
            break;
          }
        }
      })
      this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results;
    }
    else
    {
      this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results;
    }
  }

  limpiarListaPlataformas()
  {
    if('plataforma' in this.InfoUser)
    {
      this.RAWGAPIPlataformas.data.results.map((result,index) => {
        result.platforms.map((result2,index2) => {
          for (const plata of this.InfoUser.plataforma) {
            if(plata.slug === result2.slug)
            {
              this.RAWGAPIPlataformas.data.results[index].platforms[index2]['Agregado'] = true;
              break;
            }
          }
        })
      })
      this.RAWGAPIResultPlataformas = this.RAWGAPIPlataformas.data.results;
    }
    else
    {
      this.RAWGAPIResultPlataformas = this.RAWGAPIPlataformas.data.results;
    }
  }

  actualizarListaJuegos(estado: boolean)
  {
    var ruta: string;

    estado ? ruta = this.RAWGAPIVideojuegos.data.next : ruta = this.RAWGAPIVideojuegos.data.previous;

    if(ruta)
    {
      axios.get(ruta).then(resp => {
        this.RAWGAPIVideojuegos = null;
        this.RAWGAPIResultVideojuegos = [];
        this.RAWGAPIResultVideojuegos = resp.data.results;
        this.RAWGAPIVideojuegos = resp;
        this.limpiarListaVideojuegos();
      }).catch(function (error) {
          console.log(error);
      })
      .finally(function () {
        // Se ejecuto sin problemas
      });
    }
  }

  async obtenerInformacionUsuario() {
    this.Cuenta.obtenerPorCorreo(this.Corrreousuario).subscribe(res => {
      this.InfoUser = res[0] as Usuarioperfil;
      this.descripcion = this.InfoUser.descripcion;
      this.limpiarListaVideojuegos();
      this.limpiarListaPlataformas();
    });
  }

  modificarCorreo()
  {
    if ($(".contra").val() === '' || $(".repecontra").val() === '')
    {
      this.mostrarMensaje('error','Error con los campos');
    }
    else
    {
      if ($(".contra").val() === $(".repecontra").val())
      {
        var Parametros  = [
          { campo: 'contraseña', valor: $(".contra").val().toString() },
          { campo: 'repcontraseña', valor: $(".repecontra").val().toString() },
        ]

        this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);

        $(".contra").val('');
        $(".repecontra").val('');

        this.mostrarMensaje('success','Se actualizo con exito');
      }
      else
      {
        this.mostrarMensaje('error','Las contraseñas nos coinciden');
      }
    }
  }

  cambiaravatar(avatar)
  {
    var Parametros  = [{ campo: 'imagen', valor: avatar }]
    this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
  }

  // obtenerPlataformas() {
  //   if('plataforma' in this.InfoUser)
  //   {
  //     const coincidencias = this.InfoUser.plataforma.filter(item => this.listaPlataformas.includes(item));

  //     const noCoincidencias1 = this.InfoUser.plataforma.filter(item => !this.listaPlataformas.includes(item));
  //     const noCoincidencias2 = this.listaPlataformas.filter(item => !this.InfoUser.plataforma.includes(item));

  //     this.listaCompleta.listaPlataformasCoindicentes = coincidencias;
  //     this.listaCompleta.listaPlataformasNoCoindicentes = [...noCoincidencias1, ...noCoincidencias2];
  //   }
  // }

  // obtenerVideojuegos() {
  //   if('videojuego' in this.InfoUser)
  //   {
  //     const coincidencias = this.InfoUser.videojuego.filter(item => this.listaVideoJuegos.includes(item));

  //     const noCoincidencias1 = this.InfoUser.videojuego.filter(item => !this.listaVideoJuegos.includes(item));
  //     const noCoincidencias2 = this.listaVideoJuegos.filter(item => !this.InfoUser.videojuego.includes(item));

  //     this.listaCompleta.listaVideojuegosCoindicentes = coincidencias;
  //     this.listaCompleta.listaVideojuegosNoCoindicentes = [...noCoincidencias1, ...noCoincidencias2];
  //   }
  // }

  Agregarplataforma(slugPadre: any, item: any) {
    var listaNuevaArray = [];

    const { slug, name, id, games_count, image_background } = item;

    var listaNuevaArray = [];
    listaNuevaArray.push(
      {
        slugPadre,
        slug,
        name,
        id,
        games_count,
        image_background
      }
    );

    let arregloCombinado: any;
    'plataforma' in this.InfoUser ? arregloCombinado = [...listaNuevaArray, ...this.InfoUser.plataforma] : arregloCombinado = [...listaNuevaArray];
    let arrayLimpio = Array.from(new Set(arregloCombinado));

    var Parametros  = [{ campo: 'plataforma', valor: arrayLimpio }]

    this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
  }

  EliminarPlataforma(slugPadre: any, item: any) {

    const { slug } = item;
    let arrayLimpio = this.InfoUser.plataforma.filter(item => item.slug !== slug);
    var Parametros  = [{ campo: 'plataforma', valor: arrayLimpio }]
    this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
    item.Agregado = false;
  }

  AgregarVideojuego(item: any) {
    const { slug, name, metacritic, genres, platforms, background_image } = item;

    var listaNuevaArray = [];
    listaNuevaArray.push(
      {
        slug,
        name,
        metacritic,
        genres,
        platforms,
        background_image
      }
    );

    let arregloCombinado: any;
    'videojuego' in this.InfoUser ? arregloCombinado = [...listaNuevaArray, ...this.InfoUser.videojuego] : arregloCombinado = [...listaNuevaArray];
    let arrayLimpio = Array.from(new Set(arregloCombinado));

    var Parametros  = [{ campo: 'videojuego', valor: arrayLimpio }]

    this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
  }

  EliminarVideojuego(item: any) {
    const { slug } = item;
    let arrayLimpio = this.InfoUser.videojuego.filter(item => item.slug !== slug);
    var Parametros  = [{ campo: 'videojuego', valor: arrayLimpio }]
    this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
    item.Agregado = false;
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

  guardarDescripcion()
  {
    var Parametros  = [{ campo: 'descripcion', valor: this.descripcion }];
    this.EditarDescripcion = false;
    this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
  }

  Eliminarcuenta()
  {

  }

  mostrarMensaje(icon: any, title: any)
  {
    Swal.fire({
      icon: icon,
      title: title,
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
