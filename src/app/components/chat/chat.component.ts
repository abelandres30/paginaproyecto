import { Component, OnInit } from '@angular/core';
import { ChatService} from '../../servicios/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  mensaje: string = '';
  elemento: any;
  usuariox;
  constructor( public _cs: ChatService) {
    this._cs.cargarMensajes().subscribe( () =>{
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;

      }, 20);
    } );
  }

  ngOnInit() {
  
    this.elemento = document.getElementById('app-mensajes');

  }
  Enviar_mensaje() {
    console.log(this.mensaje);
    if (this.mensaje.length === 0) {
      return;
    }
    this._cs.Agregarmensaje(this.mensaje, this.usuariox).then(() => this.mensaje = '').catch((err) => console.error('Error al enviar',err));

  }

}
