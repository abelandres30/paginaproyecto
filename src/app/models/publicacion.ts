// Tipos para publicaciones
export type TipoPublicacion = 'problema' | 'proyecto' | 'logro' | 'pregunta' | 'tutorial';

export interface Like {
  usuarioId: string;
  nombreUsuario: string;
  correoUsuario: string;
  fecha: Date;
}

export interface Comentario {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  correoUsuario: string;
  contenido: string;
  fecha: Date;
}

export interface PublicacionGuardada {
  usuarioId: string;
  correoUsuario: string;
  fechaGuardado: Date;
}

// Interface principal de publicación
export interface Publicacion {
  id: string;
  autorId: string;
  autorNombre: string;
  autorCorreo: string;
  autorIcono?: string;
  
  // Contenido
  titulo: string;
  descripcion: string;
  tipo: TipoPublicacion;
  
  // Gaming info
  plataforma: string;
  videojuego: string;
  
  // Media
  imagen?: string;
  archivos?: string[];
  
  // Interacciones
  likes: Like[];
  cantidadLikes: number;
  comentarios: Comentario[];
  guardadas: PublicacionGuardada[];
  
  // Metadata
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  esActiva: boolean;
}

// Interface para crear nueva publicación
export interface NuevaPublicacion {
  titulo: string;
  descripcion: string;
  tipo: TipoPublicacion;
  plataforma: string;
  videojuego: string;
  imagen?: string;
}

// Interface para estadísticas de publicación
export interface EstadisticasPublicacion {
  totalLikes: number;
  totalComentarios: number;
  totalGuardadas: number;
  fechaUltimoLike?: Date;
  fechaUltimoComentario?: Date;
}
