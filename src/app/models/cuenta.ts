// Tipos base para gaming
export interface Plataforma {
  id: string;
  nombre: string;
  icono?: string;
}

export interface Videojuego {
  id: string;
  nombre: string;
  genero: string;
  plataforma: string;
  imagen?: string;
}

// Interface principal del usuario
export interface UsuarioPerfil {
  id?: string;
  usuario: string;
  correo: string;
  descripcion?: string;
  imagen?: string;
  fechaCreacion?: Date;
  fechaUltimaActividad?: Date;
  
  // Gaming data
  plataformas: Plataforma[];
  videojuegos: Videojuego[];
  
  // Social features
  amigos: string[]; // Array de IDs de usuarios
  solicitudesAmistadEnviadas: string[];
  solicitudesAmistadRecibidas: string[];
  
  // Settings
  esPublico: boolean;
  notificacionesActivas: boolean;
}

// Interface para registro (sin datos sensibles)
export interface UsuarioRegistro {
  usuario: string;
  correo: string;
  contraseña: string;
  confirmacionContraseña: string;
  descripcion?: string;
}

// Interface para actualización de perfil
export interface ActualizacionPerfil {
  usuario?: string;
  descripcion?: string;
  imagen?: string;
  plataformas?: Plataforma[];
  videojuegos?: Videojuego[];
  esPublico?: boolean;
  notificacionesActivas?: boolean;
}
