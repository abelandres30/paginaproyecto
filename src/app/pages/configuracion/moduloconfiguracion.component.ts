import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RespuestasService } from '../../services/cuentas.service';
import * as  $ from 'jquery';
import { Usuarioperfil } from 'src/app/models/cuenta';
import Swal from 'sweetalert2';
import axios from 'axios';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ObtenerPublicacionService } from 'src/app/services/publicaciones.service';

@Component({
  selector: 'app-moduloconfiguracion',
  templateUrl: './moduloconfiguracion.component.html',
  styleUrls: ['./moduloconfiguracion.component.css'],
  animations: [
    trigger('cambiarColor', [
      state('green', style({
        backgroundColor: '#17B169', color: 'white',
      })),
      state('rojo', style({
        backgroundColor: '#A52A2A', color: 'white',
      })),
      transition('green <=> rojo', [
        animate('1s ease')
      ]),
    ]),
  ]
})

export class ModuloconfiguracionComponent implements OnInit {
  @ViewChild("nombreVideojuego") nombreVideojuego: ElementRef;

  // nuevas variables para obtener de mejor forma la informacion
  Corrreousuario: string;
  InfoUser: Usuarioperfil;
  listaRAWG: any[] = [];
  nombreusuario: any;
  descripcion: string = '';
  EditarDescripcion: boolean = false;

  // Variables loading
  isLoading: boolean = true;
  isLoadingVideojuegos: boolean = false;
  isLoadingGenre: boolean = false;

  // variables select
  selectGenero: string = 'all';
  selectPlataforma: string = 'all';

  // Variable para almacenar el interval
  private scrollInterval: any;
  private scrollSpeed = 1; // Velocidad del desplazamiento (ajusta este valor)
  private scrollDirection = 1;
  private isMouseInside = false; // Detecta si el mouse está dentro del div

  // Variable para almacenar el interval
  private scrollInterval2: any;
  private scrollDirection2 = 1;
  private isMouseInside2 = false; // Detecta si el mouse está dentro del div

  RAWGAPIPlataformas: any;
  RAWGAPIResultPlataformas: string[] = [];
  RAWGAPIVideojuegos: any;
  RAWGAPIResultVideojuegos: string[] = [];
  RAWGAPIGenres: any;
  RAWGAPIResultGenres: string[] = [];
  listVideojuegosCargada:boolean = false;
  listaPlataformasCargada:boolean = false;
  listaGenresCargada:boolean = false;
  listPage: number = 1;

  AVTR = 'https://api.dicebear.com/9.x/'
  AVTRCAT = 'bottts-neutral/svg';
  AVTRCATAD = 'adventurer/svg';

  listaAvatares: string[] = [
    '../../assets/img11.png', '../../assets/img12.png', '../../assets/img13.png', '../../assets/img14.png', '../../assets/img15.png',
    '../../assets/img16.png', '../../assets/img17.png', '../../assets/img18.png',  this.AVTR + this.AVTRCAT, this.AVTR + this.AVTRCAT + '?seed=Felix',
    this.AVTR + this.AVTRCAT + '?seed=Aidan', this.AVTR + this.AVTRCAT + '?seed=Caleb', this.AVTR + this.AVTRCAT + '?seed=Sophia',
    this.AVTR + this.AVTRCATAD, this.AVTR + this.AVTRCATAD + '?seed=Emery', this.AVTR + this.AVTRCATAD + '?seed=Jack'
  ]

  constructor(private Cuenta: RespuestasService,private publicaciones: ObtenerPublicacionService) {
    this.Corrreousuario = localStorage.getItem('PerfilUsuario');
    this.nombreusuario = localStorage.getItem('NombreUser');
  }

  ngOnInit(): void {
    this.obtenerInformacionUsuario();
  }

  activarScroll() {
    clearInterval(this.scrollInterval)
    clearInterval(this.scrollInterval2)
    this.startAutoScroll(1);
    this.startAutoScroll(2);
  }

  cargarApiRAWGPlataformas() {
    if (!this.listaPlataformasCargada) {
      this.RAWGAPIPlataformas = JSON.parse(localStorage.getItem('RAWGPlataformas'));

      if (this.RAWGAPIPlataformas === null) {
        axios.get('https://api.rawg.io/api/platforms/lists/parents?key=14c6606d6b704404adbe470ad2f0874d').then(resp => {
          localStorage.setItem('RAWGPlataformas' , JSON.stringify(resp));
          this.RAWGAPIPlataformas = resp;

        }).catch(function (error) {
          this.mostrarMensaje('error', error);
        })
        .finally(function () {
          this.RAWGAPIResultPlataformas = this.RAWGAPIPlataformas.data.results;
        });
      }
      else
        this.RAWGAPIResultPlataformas = this.RAWGAPIPlataformas.data.results;

      this.limpiarListaPlataformas();
      this.listaPlataformasCargada = true;
    }
  }

  cargarApiRAWGVideojuegos() {
    if (!this.listVideojuegosCargada) {
      this.RAWGAPIVideojuegos = JSON.parse(localStorage.getItem('RAWGVideojuegos'));

      if (this.RAWGAPIVideojuegos === null) {
        axios.get('https://api.rawg.io/api/games?key=14c6606d6b704404adbe470ad2f0874d').then(resp => {
          localStorage.setItem('RAWGVideojuegos' , JSON.stringify(resp));
          this.RAWGAPIVideojuegos = resp;
        }).catch(function (error) {
          this.mostrarMensaje('error', error);
        })
        .finally(function () {
          this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results;
          this.isLoadingGenre = false;
        });
      }
      else {
        this.isLoadingGenre = false;
        this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results;
      }
      this.limpiarListaVideojuegos();
      this.listVideojuegosCargada = true;
    }
  }

  cargarApiRAWGGenres() {
    if (!this.listaGenresCargada) {
      this.RAWGAPIGenres = JSON.parse(localStorage.getItem('RAWGGenres'));

      if (this.RAWGAPIGenres === null) {
        axios.get('https://api.rawg.io/api/genres?key=14c6606d6b704404adbe470ad2f0874d').then(resp => {
          localStorage.setItem('RAWGGenres' , JSON.stringify(resp));
          this.RAWGAPIGenres = resp;
        }).catch(function (error) {
          this.mostrarMensaje('error', error);
        })
        .finally(function () {
          this.RAWGAPIResultGenres = this.RAWGAPIGenres.data.results;
        });
      }
      else
        this.RAWGAPIResultGenres = this.RAWGAPIGenres.data.results;

      this.listaGenresCargada = true;
    }
  }

  buscarVideojuego() {
    this.isLoadingVideojuegos = true;
    let nombre = this.nombreVideojuego.nativeElement.value;

    if(nombre === '') {
      this.listVideojuegosCargada = false;
      this.cargarApiRAWGVideojuegos();
      return false;
    }

    axios.get('https://api.rawg.io/api/games?key=14c6606d6b704404adbe470ad2f0874d&search=' + nombre).then(resp => {
      this.RAWGAPIVideojuegos = null;
      this.RAWGAPIResultVideojuegos = [];
      this.RAWGAPIResultVideojuegos = resp.data.results;
      this.RAWGAPIVideojuegos = resp;
      this.filtrarVideojuegos();
      this.limpiarListaVideojuegos();
      this.isLoadingVideojuegos = false;
    }).catch(function (error) {
      this.mostrarMensaje('error', error);
    })
    .finally(function () {
      // Se ejecuto sin problemas
      this.isLoadingVideojuegos = false;
    });
  }

  cambioGenero(item: any) {
    this.isLoadingGenre = true;
    this.listVideojuegosCargada = false;
    this.selectGenero = item;
    this.filtrarVideojuegos();
  }

  cambioPlataforma(item: any) {
    this.isLoadingGenre = true;
    this.listVideojuegosCargada = false;
    this.selectPlataforma = item;
    this.filtrarVideojuegos();
  }

  filtrarVideojuegos() {
    if(this.selectGenero === 'all' && this.selectPlataforma === 'all') {
      this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results;
      this.listVideojuegosCargada = true;
    }
    else if(this.selectGenero !== 'all' && this.selectPlataforma === 'all') {
      this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results.filter((itemArray: any) => itemArray.genres.some((genre: any) =>  genre.id.toString() === this.selectGenero.toString()));
    }
    else if(this.selectGenero === 'all' && this.selectPlataforma !== 'all') {
      this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results.filter((itemArray: any) => itemArray.platforms.some((platform: any) =>  platform.platform.id.toString() === this.selectPlataforma.toString()));
    }
    else {
      this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results.filter((itemArray: any) => itemArray.genres.some((genre: any) =>  genre.id.toString() === this.selectGenero.toString()) && itemArray.platforms.some((platform: any) =>  platform.platform.id.toString() === this.selectPlataforma.toString()));
    }

    this.isLoadingGenre = false;
  }

  limpiarListaVideojuegos() {
    if('videojuego' in this.InfoUser) {
      this.RAWGAPIVideojuegos.data.results.map((result,index) => {
        for (const video of this.InfoUser.videojuego) {
          if(video.slug === result.slug) {
            this.RAWGAPIVideojuegos.data.results[index]['Agregado'] = true;
            break;
          }
        }
      })
      this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results;
    }
    else
      this.RAWGAPIResultVideojuegos = this.RAWGAPIVideojuegos.data.results;
  }

  limpiarListaPlataformas() {
    if('plataforma' in this.InfoUser) {
      this.RAWGAPIPlataformas.data.results.map((result,index) => {
        result.platforms.map((result2,index2) => {
          for (const plata of this.InfoUser.plataforma) {
            if(plata.slug === result2.slug) {
              this.RAWGAPIPlataformas.data.results[index].platforms[index2]['Agregado'] = true;
              break;
            }
          }
        })
      })
      this.RAWGAPIResultPlataformas = this.RAWGAPIPlataformas.data.results;
    }
    else
      this.RAWGAPIResultPlataformas = this.RAWGAPIPlataformas.data.results;
  }

  actualizarListaJuegos(estado: boolean) {
    var ruta: string;
    this.isLoadingVideojuegos = true;
    estado ? ruta = this.RAWGAPIVideojuegos.data.next : ruta = this.RAWGAPIVideojuegos.data.previous;

    if(ruta) {
      axios.get(ruta).then(resp => {
        this.RAWGAPIVideojuegos = null;
        this.RAWGAPIResultVideojuegos = [];
        this.RAWGAPIResultVideojuegos = resp.data.results;
        this.RAWGAPIVideojuegos = resp;
        estado ? this.listPage++ : this.listPage > 1 ? this.listPage-- : null;
        this.limpiarListaVideojuegos();
        this.filtrarVideojuegos();
        this.isLoadingVideojuegos = false;
      }).catch(function (error) {
        this.mostrarMensaje('error', error);
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
      this.isLoading = false;
      this.cargarApiRAWGPlataformas();
      this.cargarApiRAWGGenres();
      this.cargarApiRAWGVideojuegos();
      this.limpiarListaVideojuegos();
      this.limpiarListaPlataformas();
    }, error => this.mostrarMensaje('error', error));
  }

  cambiaravatar(avatar) {
    var Parametros  = [{ campo: 'imagen', valor: avatar }];

    try {
      this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
      this.publicaciones.actualizarCampoEnPublicaciones(this.Corrreousuario, 'usuarioIcono', avatar);
    } catch (error) {
      this.mostrarMensaje('error', error);
    }
  }

  Agregarplataforma(slugPadre: any, item: any) {
    var listaNuevaArray = [];

    const { slug, name, id, games_count, image_background } = item;

    var listaNuevaArray = [];
    listaNuevaArray.push({
      slugPadre,
      slug,
      name,
      id,
      games_count,
      image_background
    });

    let arregloCombinado: any;
    'plataforma' in this.InfoUser ? arregloCombinado = [...listaNuevaArray, ...this.InfoUser.plataforma] : arregloCombinado = [...listaNuevaArray];
    let arrayLimpio = Array.from(new Set(arregloCombinado));

    var Parametros  = [{ campo: 'plataforma', valor: arrayLimpio }];

    try {
      this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
    } catch (error) {
      this.mostrarMensaje('error', error);
    }
  }

  EliminarPlataforma(itemParametro: any, slugPadre: any) {
    let item = this.RAWGAPIResultPlataformas
      .find(itemArray => itemArray['slug'] === slugPadre)?.['platforms']
      .find(itemArray => itemArray['slug'] === itemParametro.slug);

    let arrayLimpio = this.InfoUser.plataforma.filter(itemInfo => itemInfo.slug !== ( item !== undefined ? item['slug'] : itemParametro.slug));

    var Parametros  = [{ campo: 'plataforma', valor: arrayLimpio }];

    try {
      this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
    } catch (error) {
      this.mostrarMensaje('error', error);
    }

    if(item !== undefined) item['Agregado'] = false
  }

  AgregarVideojuego(item: any) {
    const { slug, name, metacritic, genres, platforms, background_image } = item;

    let platformsNew = platforms.map((item: any) => {
      delete item.requirements_en;
      delete item.requirements_ru;
      delete item.year_end;
      delete item.year_start;
      return item;
    });

    let genresNew = genres.map((item: any) => {
      delete item.games_count;
      delete item.image_background;
      delete item.id;
      return item;
    });

    platformsNew = platformsNew.slice(0, 3);

    var listaNuevaArray = [];
    listaNuevaArray.push({
      slug,
      name,
      metacritic,
      genres: genresNew,
      platforms: platformsNew,
      background_image
    });

    let arregloCombinado: any;
    'videojuego' in this.InfoUser ? arregloCombinado = [...listaNuevaArray, ...this.InfoUser.videojuego] : arregloCombinado = [...listaNuevaArray];
    let arrayLimpio = Array.from(new Set(arregloCombinado));

    var Parametros  = [{ campo: 'videojuego', valor: arrayLimpio }]

    try {
      this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
    } catch (error) {
      this.mostrarMensaje('error', error);
    }
  }

  EliminarVideojuego(itemParametro: any) {
    let item = this.RAWGAPIResultVideojuegos.find(itemArray => itemArray['slug'] === itemParametro.slug);

    let arrayLimpio = this.InfoUser.videojuego.filter(itemInfo => itemInfo.slug !== ( item !== undefined ? item['slug'] : itemParametro.slug));

    var Parametros  = [{ campo: 'videojuego', valor: arrayLimpio }];

    try {
      this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
    } catch (error) {
      this.mostrarMensaje('error', error);
    }

    if(item !== undefined) item['Agregado'] = false
  }

  guardarDescripcion() {
    var Parametros  = [{ campo: 'descripcion', valor: this.descripcion }];
    this.EditarDescripcion = false;

    try {
      this.Cuenta.editarCamposNoArray(Parametros, this.InfoUser['id']);
    } catch (error) {
      this.mostrarMensaje('error', error);
    }
  }

  desactivarCuenta() {
    Swal.fire({
      title: "Ingrese su contraseña", input: "password",
      inputAttributes: { autocapitalize: "off" },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      showLoaderOnConfirm: true,
      heightAuto: false,
      preConfirm: async (login) => {
        try {
          if (login !== this.InfoUser.contraseña) return false;

          console.log('Se desactivo la cuenta');

        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Cuenta desactivada con exito',
          showConfirmButton: false,
          timer: 1500,
          heightAuto: false,
        }).then();
      }
    });
  }

  // Método que se llama cuando el mouse entra en el contenedor
  onMouseEnter(valor: any) {
    const isFirst = valor === 1;
    const scrollIntervalNew = isFirst ? this.scrollInterval : this.scrollInterval2;
    isFirst ? this.isMouseInside = true : this.isMouseInside2 = true;

    if (scrollIntervalNew) clearInterval(scrollIntervalNew);
  }

  // Método que se llama cuando el mouse sale del contenedor
  onMouseLeave(valor:any) {
    const isFirst = valor === 1;
    isFirst ? this.isMouseInside = false : this.isMouseInside2 = false;
    this.startAutoScroll(valor);
  }

  // Método para iniciar el desplazamiento automático
  startAutoScroll(valor:any) {
    if(valor === 1) {
      if (this.isMouseInside) return;

      const scrollContainer = document.querySelector('.scroll-container') as HTMLElement;

      if (!scrollContainer) return;

      // Iniciar el desplazamiento automático con un intervalo
      this.scrollInterval = setInterval(() => {
        scrollContainer.scrollLeft += this.scrollSpeed * this.scrollDirection;

        // Detectar si hemos llegado al final o al inicio
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          // Si llegamos al final, cambiar la dirección hacia la izquierda
          this.scrollDirection = -1;
        } else if (scrollContainer.scrollLeft <= 0) {
          // Si llegamos al inicio, cambiar la dirección hacia la derecha
          this.scrollDirection = 1;
        }
      }, 10);
    }
    else {
      if (this.isMouseInside2) return;

      const scrollContainer = document.querySelector('.plataformasCointainer') as HTMLElement;

      if (!scrollContainer) return;

      // Iniciar el desplazamiento automático con un intervalo
      this.scrollInterval2 = setInterval(() => {
        scrollContainer.scrollLeft += this.scrollSpeed * this.scrollDirection2;

        // Detectar si hemos llegado al final o al inicio
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          // Si llegamos al final, cambiar la dirección hacia la izquierda
          this.scrollDirection2 = -1;
        } else if (scrollContainer.scrollLeft <= 0) {
          // Si llegamos al inicio, cambiar la dirección hacia la derecha
          this.scrollDirection2 = 1;
        }
      }, 10);
    }
  }

   // Método para detectar el evento de la rueda del mouse
   onScroll(event: WheelEvent, valor:any) {
    const isFirst = valor === 1;

    const scrollContainer = isFirst ? document.querySelector('.scroll-container') as HTMLElement : document.querySelector('.plataformasCointainer') as HTMLElement;

    if (!scrollContainer) return;
    if (event.deltaY !== 0) scrollContainer.scrollLeft += event.deltaY;

    event.preventDefault();
  }

  mostrarMensaje(icon: any, title: any) {
    Swal.fire({ icon: icon, title: title})
  }
}


