import { Injectable } from '@angular/core';

// Interfaces para validación de archivos
export interface FileValidationConfig {
  maxSizeBytes: number;
  allowedTypes: string[];
  allowedExtensions?: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  errorType?: 'size' | 'type' | 'extension' | 'corrupted';
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  extension: string;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class FileValidationService {

  // Configuración por defecto
  private readonly defaultConfig: FileValidationConfig = {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/', 'video/'],
    allowedExtensions: [
      // Imágenes
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.tif', '.ico',
      // Videos
      '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp', '.ogv'
    ]
  };

  constructor() { }

  /**
   * Valida un archivo según la configuración proporcionada
   */
  validateFile(file: File, config?: Partial<FileValidationConfig>): FileValidationResult {
    const validationConfig = { ...this.defaultConfig, ...config };
    const fileInfo = this.getFileInfo(file);

    // Validar tamaño
    const sizeValidation = this.validateSize(fileInfo, validationConfig);
    if (!sizeValidation.isValid) {
      return sizeValidation;
    }

    // Validar tipo MIME
    const typeValidation = this.validateType(fileInfo, validationConfig);
    if (!typeValidation.isValid) {
      return typeValidation;
    }

    // Validar extensión (si está configurada)
    if (validationConfig.allowedExtensions) {
      const extensionValidation = this.validateExtension(fileInfo, validationConfig);
      if (!extensionValidation.isValid) {
        return extensionValidation;
      }
    }

    return { isValid: true };
  }

  /**
   * Obtiene información detallada del archivo
   */
  getFileInfo(file: File): FileInfo {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      extension: this.getFileExtension(file.name),
      file
    };
  }

  /**
   * Valida el tamaño del archivo
   */
  private validateSize(fileInfo: FileInfo, config: FileValidationConfig): FileValidationResult {
    if (fileInfo.size > config.maxSizeBytes) {
      const maxSizeMB = Math.round(config.maxSizeBytes / (1024 * 1024));
      return {
        isValid: false,
        error: `El archivo es demasiado grande. Tamaño máximo permitido: ${maxSizeMB}MB`,
        errorType: 'size'
      };
    }
    return { isValid: true };
  }

  /**
   * Valida el tipo MIME del archivo
   */
  private validateType(fileInfo: FileInfo, config: FileValidationConfig): FileValidationResult {
    const isTypeAllowed = config.allowedTypes.some(allowedType => 
      fileInfo.type.startsWith(allowedType)
    );

    if (!isTypeAllowed) {
      return {
        isValid: false,
        error: 'Tipo de archivo no permitido. Solo se permiten imágenes y videos.',
        errorType: 'type'
      };
    }
    return { isValid: true };
  }

  /**
   * Valida la extensión del archivo
   */
  private validateExtension(fileInfo: FileInfo, config: FileValidationConfig): FileValidationResult {
    if (!config.allowedExtensions) {
      return { isValid: true };
    }

    const isExtensionAllowed = config.allowedExtensions.includes(fileInfo.extension.toLowerCase());

    if (!isExtensionAllowed) {
      const allowedExtensionsStr = config.allowedExtensions.join(', ');
      return {
        isValid: false,
        error: `Extensión de archivo no permitida. Extensiones permitidas: ${allowedExtensionsStr}`,
        errorType: 'extension'
      };
    }
    return { isValid: true };
  }

  /**
   * Extrae la extensión del nombre del archivo
   */
  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot !== -1 ? fileName.substring(lastDot) : '';
  }

  /**
   * Convierte bytes a una representación legible
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Determina si el archivo es una imagen
   */
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Determina si el archivo es un video
   */
  isVideo(file: File): boolean {
    return file.type.startsWith('video/');
  }

  /**
   * Obtiene el tipo de archivo para la aplicación
   */
  getFileFormat(file: File): 'image' | 'video' | 'unknown' {
    if (this.isImage(file)) return 'image';
    if (this.isVideo(file)) return 'video';
    return 'unknown';
  }
}