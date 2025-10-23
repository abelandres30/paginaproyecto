// Sistema de comentarios mejorado
export interface ComentarioBase {
  id: string;
  autorId: string;
  autorNombre: string;
  autorCorreo: string;
  autorImagen?: string;
  
  contenido: string;
  fechaCreacion: Date;
  fechaEdicion?: Date;
  editado: boolean;
  
  // Interacciones
  likes: number;
  usuariosQueLikean: string[];
  
  // Estado
  esActivo: boolean;
  reportado: boolean;
}

export interface ComentarioPublicacion extends ComentarioBase {
  publicacionId: string;
  respuestas?: ComentarioRespuesta[];
}

export interface ComentarioRespuesta extends ComentarioBase {
  comentarioPadreId: string;
  mencionaUsuario?: string; // @usuario en respuesta
}

// Interface para crear comentario
export interface NuevoComentario {
  contenido: string;
  publicacionId?: string;
  comentarioPadreId?: string; // Para respuestas
}

// Interface para gestión de comentarios
export interface GestionComentarios {
  publicacionId: string;
  comentarios: ComentarioPublicacion[];
  totalComentarios: number;
  comentariosRecientes: ComentarioPublicacion[];
  paginacion: {
    pagina: number;
    totalPaginas: number;
    comentariosPorPagina: number;
  };
}