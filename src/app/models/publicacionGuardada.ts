// Sistema de publicaciones guardadas
export interface PublicacionGuardada {
  id: string;
  usuarioId: string;
  usuarioCorreo: string;
  
  publicacionId: string;
  tituloPublicacion: string;
  autorPublicacion: string;
  tipoPublicacion: string;
  
  fechaGuardado: Date;
  etiquetas?: string[]; // Para organizar guardados
  notas?: string; // Notas personales del usuario
}

export interface ColeccionGuardados {
  id: string;
  usuarioId: string;
  nombre: string;
  descripcion?: string;
  esPublica: boolean;
  
  publicaciones: PublicacionGuardada[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  
  // Estadísticas
  totalPublicaciones: number;
  etiquetasPopulares: string[];
}

// Interface para gestión de guardados de un usuario
export interface GestorGuardados {
  usuarioId: string;
  publicacionesGuardadas: PublicacionGuardada[];
  colecciones: ColeccionGuardados[];
  
  totalGuardados: number;
  etiquetasUsadas: string[];
  fechaUltimoGuardado?: Date;
}

// Interface para acciones de guardado
export interface AccionGuardado {
  usuarioId: string;
  publicacionId: string;
  coleccionId?: string;
  etiquetas?: string[];
  notas?: string;
}

// Interface para búsqueda en guardados
export interface BusquedaGuardados {
  usuarioId: string;
  termino?: string;
  etiquetas?: string[];
  tipoPublicacion?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  coleccionId?: string;
}