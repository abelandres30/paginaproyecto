// Sistema de notificaciones completo
export type TipoNotificacion = 
  | 'solicitud_amistad' 
  | 'amistad_aceptada'
  | 'nuevo_mensaje'
  | 'like_publicacion'
  | 'comentario_publicacion'
  | 'mencion_comentario'
  | 'nueva_publicacion_amigo'
  | 'sistema';

export type EstadoNotificacion = 'no_leida' | 'leida' | 'archivada';

export type PrioridadNotificacion = 'baja' | 'media' | 'alta' | 'critica';

export interface Notificacion {
  id: string;
  
  // Usuario destinatario
  usuarioDestinatarioId: string;
  
  // Usuario que generó la notificación (si aplica)
  usuarioOrigenId?: string;
  usuarioOrigenNombre?: string;
  usuarioOrigenImagen?: string;
  
  // Contenido
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  descripcion?: string;
  
  // Referencias
  objetivoId?: string; // ID de publicación, comentario, etc.
  enlace?: string; // URL para redirigir
  
  // Estado
  estado: EstadoNotificacion;
  prioridad: PrioridadNotificacion;
  
  // Fechas
  fechaCreacion: Date;
  fechaLeida?: Date;
  fechaExpiracion?: Date;
  
  // Configuración
  requireAccion: boolean; // Si requiere aceptar/rechazar
  esEliminable: boolean;
}

// Interface para gestión de notificaciones
export interface GestorNotificaciones {
  usuarioId: string;
  notificaciones: Notificacion[];
  noLeidas: number;
  configuraciones: ConfiguracionNotificaciones;
}

export interface ConfiguracionNotificaciones {
  usuarioId: string;
  notificacionesActivas: boolean;
  
  // Tipos habilitados
  solicitudesAmistad: boolean;
  mensajes: boolean;
  likesPublicaciones: boolean;
  comentarios: boolean;
  menciones: boolean;
  publicacionesAmigos: boolean;
  notificacionesSistema: boolean;
  
  // Configuración de envío
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  horaInicioSilencio?: string; // "22:00"
  horaFinSilencio?: string; // "08:00"
}
  