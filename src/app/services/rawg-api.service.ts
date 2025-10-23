import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// ===== INTERFACES =====
export interface RAWGResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface RAWGPlatform {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background?: string;
  platforms?: RAWGPlatformDetail[];
}

export interface RAWGPlatformDetail {
  id: number;
  name: string;
  slug: string;
  games_count: number;
}

export interface RAWGGame {
  id: number;
  name: string;
  slug: string;
  background_image?: string;
  rating: number;
  metacritic?: number;
  genres: RAWGGenre[];
  platforms: { platform: RAWGPlatformDetail }[];
}

export interface RAWGGenre {
  id: number;
  name: string;
  slug: string;
  games_count: number;
}

// ===== CONFIGURACIÓN =====
interface RAWGConfig {
  baseUrl: string;
  apiKey: string;
  cacheKeys: {
    platforms: string;
    games: string;
    genres: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RawgApiService {
  private readonly config: RAWGConfig = {
    baseUrl: 'https://api.rawg.io/api',
    apiKey: '14c6606d6b704404adbe470ad2f0874d', // TODO: Mover a environment
    cacheKeys: {
      platforms: 'RAWGPlataformas',
      games: 'RAWGVideojuegos', 
      genres: 'RAWGGenres'
    }
  };

  constructor(private http: HttpClient) {}

  // ===== MÉTODOS PÚBLICOS =====

  /**
   * Obtiene plataformas con cache automático
   */
  obtenerPlataformas(): Observable<RAWGPlatform[]> {
    return this.obtenerConCache<RAWGPlatform>(
      `${this.config.baseUrl}/platforms/lists/parents`,
      this.config.cacheKeys.platforms
    );
  }

  /**
   * Obtiene videojuegos con cache automático
   */
  obtenerVideojuegos(busqueda?: string, genero?: string, plataforma?: string): Observable<RAWGGame[]> {
    const params = this.construirParametrosJuegos(busqueda, genero, plataforma);
    const url = `${this.config.baseUrl}/games?key=${this.config.apiKey}${params}`;
    
    // Solo cachear búsquedas básicas (sin filtros)
    const usarCache = !busqueda && genero === 'all' && plataforma === 'all';
    const cacheKey = usarCache ? this.config.cacheKeys.games : null;
    
    return this.obtenerConCache<RAWGGame>(url, cacheKey);
  }

  /**
   * Obtiene géneros con cache automático
   */
  obtenerGeneros(): Observable<RAWGGenre[]> {
    return this.obtenerConCache<RAWGGenre>(
      `${this.config.baseUrl}/genres`,
      this.config.cacheKeys.genres
    );
  }

  /**
   * Obtiene videojuegos con información de paginación completa
   */
  obtenerVideojuegosConPaginacion(busqueda?: string, genero?: string, plataforma?: string): Observable<RAWGResponse<RAWGGame>> {
    const params = this.construirParametrosJuegos(busqueda, genero, plataforma);
    const url = `${this.config.baseUrl}/games?key=${this.config.apiKey}${params}`;
    
    console.log(`Obteniendo videojuegos con paginación: ${url}`);
    
    return this.http.get<RAWGResponse<RAWGGame>>(url).pipe(
      catchError(this.manejarError<RAWGResponse<RAWGGame>>('obtenerVideojuegosConPaginacion', {
        count: 0,
        next: null,
        previous: null,
        results: []
      }))
    );
  }

  /**
   * Actualiza página de videojuegos (siguiente/anterior)
   */
  actualizarPaginaJuegos(url: string): Observable<RAWGResponse<RAWGGame>> {
    console.log(`Navegando a página: ${url}`);
    return this.http.get<RAWGResponse<RAWGGame>>(url).pipe(
      catchError(this.manejarError<RAWGResponse<RAWGGame>>('actualizarPaginaJuegos', {
        count: 0,
        next: null,
        previous: null,
        results: []
      }))
    );
  }

  // ===== MÉTODOS PRIVADOS =====

  /**
   * Obtiene datos con cache automático
   */
  private obtenerConCache<T>(url: string, cacheKey?: string): Observable<T[]> {
    // Verificar cache si existe cacheKey
    if (cacheKey) {
      const cached = this.obtenerDeCache<T>(cacheKey);
      if (cached) {
        console.log(`Datos obtenidos desde cache: ${cacheKey}`);
        return of(cached);
      }
    }

    // Realizar petición HTTP
    // Solo agregar API key si no está ya en la URL
    const urlConKey = url.includes('key=') 
      ? url
      : url.includes('?') 
        ? `${url}&key=${this.config.apiKey}`
        : `${url}?key=${this.config.apiKey}`;
    console.log(`Realizando petición a: ${urlConKey}`);
    
    return this.http.get<RAWGResponse<T>>(urlConKey).pipe(
      map(response => {
        console.log(`Respuesta exitosa para ${url}:`, response);
        const results = response.results;
        
        // Guardar en cache si existe cacheKey
        if (cacheKey) {
          this.guardarEnCache(cacheKey, response);
          console.log(`Datos guardados en cache: ${cacheKey}`);
        }
        
        return results;
      }),
      catchError(this.manejarError<T[]>('obtenerConCache', []))
    );
  }

  /**
   * Construye parámetros para búsqueda de juegos
   */
  private construirParametrosJuegos(busqueda?: string, genero?: string, plataforma?: string): string {
    const params = new URLSearchParams();
    
    if (busqueda) {
      params.append('search', busqueda);
    }
    
    if (genero && genero !== 'all') {
      params.append('genres', genero);
    }
    
    if (plataforma && plataforma !== 'all') {
      params.append('platforms', plataforma);
    }
    
    // Si no hay parámetros, devolver string vacío
    const paramString = params.toString();
    return paramString ? `&${paramString}` : '';
  }

  /**
   * Obtiene datos del cache
   */
  private obtenerDeCache<T>(key: string): T[] | null {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsedData = JSON.parse(cached);
        return parsedData.data?.results || parsedData.results || null;
      }
      return null;
    } catch (error) {
      console.warn(`Error obteniendo cache ${key}:`, error);
      return null;
    }
  }

  /**
   * Guarda datos en cache
   */
  private guardarEnCache<T>(key: string, data: RAWGResponse<T>): void {
    try {
      localStorage.setItem(key, JSON.stringify({ data }));
    } catch (error) {
      console.warn(`Error guardando cache ${key}:`, error);
    }
  }

  /**
   * Maneja errores de HTTP
   */
  private manejarError<T>(operacion = 'operacion', resultado?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operacion} falló:`, error);
      
      // Información específica del error
      if (error.status) {
        console.error(`Status HTTP: ${error.status}`);
        console.error(`Mensaje: ${error.message}`);
        
        if (error.status === 401) {
          console.error('Error de autenticación: Verifica tu API key de RAWG');
        } else if (error.status === 403) {
          console.error('Error de autorización: API key inválida o límite de requests excedido');
        } else if (error.status === 404) {
          console.error('Endpoint no encontrado');
        } else if (error.status >= 500) {
          console.error('Error del servidor RAWG');
        }
      }
      
      if (error.url) {
        console.error(`URL que falló: ${error.url}`);
      }
      
      return of(resultado as T);
    };
  }
}