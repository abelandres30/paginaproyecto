// Tipos para el sistema de amistad
export type EstadoAmistad = 'pendiente' | 'aceptado' | 'rechazado' | 'bloqueado';

export interface SolicitudAmistad {
  id: string;
  remitenteId: string;
  remitenteNombre: string;
  remitenteCorreo: string;
  remitenteImagen?: string;
  
  destinatarioId: string;
  destinatarioNombre: string;
  destinatarioCorreo: string;
  
  estado: EstadoAmistad;
  fechaEnvio: Date;
  fechaRespuesta?: Date;
  mensaje?: string;
}

export interface Amistad {
  id: string;
  usuario1Id: string;
  usuario1Nombre: string;
  
  usuario2Id: string;
  usuario2Nombre: string;
  
  fechaAmistad: Date;
  esActiva: boolean;
  
  // Estadísticas de interacción
  mensajesIntercambiados: number;
  ultimaInteraccion?: Date;
}

export interface PerfilAmigo {
  usuarioId: string;
  nombreUsuario: string;
  correoUsuario: string;
  imagen?: string;
  descripcion?: string;
  
  // Gaming info
  plataformasFavoritas: string[];
  juegosFavoritos: string[];
  
  // Social stats
  totalAmigos: number;
  fechaRegistro: Date;
  ultimaActividad?: Date;
  esEnLinea: boolean;
}

// Interface para gestionar amigos de un usuario
export interface ListaAmigos {
  usuarioId: string;
  amigos: PerfilAmigo[];
  solicitudesPendientes: SolicitudAmistad[];
  solicitudesEnviadas: SolicitudAmistad[];
  totalAmigos: number;
}