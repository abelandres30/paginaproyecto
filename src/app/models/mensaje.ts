// Tipos para el sistema de mensajería
export type EstadoMensaje = 'enviado' | 'entregado' | 'leido';

export interface MensajeDetalle {
  id: string;
  remitenteId: string;
  remitenteNombre: string;
  remitenteCorreo: string;
  contenido: string;
  fecha: Date;
  estado: EstadoMensaje;
  editado?: boolean;
  fechaEdicion?: Date;
}

export interface Conversacion {
  id: string;
  
  // Participantes
  usuario1Id: string;
  usuario1Nombre: string;
  usuario1Correo: string;
  
  usuario2Id: string;
  usuario2Nombre: string;
  usuario2Correo: string;
  
  // Mensajes
  mensajes: MensajeDetalle[];
  
  // Metadata
  fechaCreacion: Date;
  fechaUltimaActividad: Date;
  ultimoMensaje?: string;
  mensajesNoLeidos: number;
  esActiva: boolean;
}

// Interface para enviar nuevo mensaje
export interface NuevoMensaje {
  destinatarioId: string;
  contenido: string;
}

// Interface para chat en tiempo real
export interface MensajeChat {
  usuarioId: string;
  nombreUsuario: string;
  correoUsuario: string;
  mensaje: string;
  fecha: Date;
  sala?: string; // Para chat grupal
}