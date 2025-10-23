// Sistema de likes mejorado
export type TipoLike = 'publicacion' | 'comentario' | 'respuesta';

export interface Like {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  correoUsuario: string;
  imagenUsuario?: string;
  
  // Objetivo del like
  objetivoId: string; // ID de la publicacion/comentario
  tipo: TipoLike;
  
  fechaLike: Date;
  esActivo: boolean;
}

export interface EstadisticasLikes {
  objetivoId: string;
  tipo: TipoLike;
  totalLikes: number;
  usuariosQueLikean: Like[];
  fechaUltimoLike?: Date;
}

// Interface para gestión de likes de un usuario
export interface LikesUsuario {
  usuarioId: string;
  likesOtorgados: Like[];
  likesRecibidos: Like[];
  totalLikesOtorgados: number;
  totalLikesRecibidos: number;
}

// Interface para toggle de like
export interface AccionLike {
  usuarioId: string;
  objetivoId: string;
  tipo: TipoLike;
  accion: 'dar' | 'quitar';
}