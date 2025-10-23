import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  /**
   * Maneja errores de forma centralizada
   */
  handleError(error: any, context: string = 'Operación'): void {
    console.error(`Error en ${context}:`, error);
    
    let userMessage: string;
    let errorType: 'error' | 'warning' | 'info' = 'error';

    // Clasificar el tipo de error
    if (typeof error === 'string') {
      userMessage = error;
    } else if (error?.message) {
      userMessage = this.getContextualErrorMessage(error.message, context);
    } else if (error?.status) {
      userMessage = this.getHttpErrorMessage(error.status, context);
    } else {
      userMessage = `Error inesperado durante ${context.toLowerCase()}. Por favor, intente nuevamente.`;
    }

    this.showErrorDialog(userMessage, errorType);
  }

  /**
   * Maneja errores de validación
   */
  handleValidationError(message: string): void {
    this.showErrorDialog(message, 'warning');
  }

  /**
   * Maneja errores de red
   */
  handleNetworkError(error: any): void {
    this.handleError(error, 'Conexión de red');
  }

  /**
   * Maneja errores de datos
   */
  handleDataError(error: any, dataType: string): void {
    this.handleError(error, `Carga de ${dataType}`);
  }

  /**
   * Obtiene mensaje de error contextual
   */
  private getContextualErrorMessage(errorMessage: string, context: string): string {
    const errorMap: Record<string, string> = {
      'Usuario no identificado': 'Sesión expirada. Por favor, inicie sesión nuevamente.',
      'No se encontró la conversación': 'La conversación no existe o fue eliminada.',
      'No puedes enviar un mensaje vacío': 'Debe escribir un mensaje antes de enviarlo.',
      'Network Error': 'Error de conexión. Verifique su conexión a internet.',
      '404': `No se encontraron datos para ${context.toLowerCase()}.`,
      '500': 'Error del servidor. Intente nuevamente en unos momentos.',
      '403': 'No tiene permisos para realizar esta acción.'
    };

    return errorMap[errorMessage] || errorMessage;
  }

  /**
   * Obtiene mensaje de error HTTP
   */
  private getHttpErrorMessage(status: number, context: string): string {
    const statusMap: Record<number, string> = {
      400: 'Datos inválidos enviados al servidor.',
      401: 'Sesión expirada. Por favor, inicie sesión nuevamente.',
      403: 'No tiene permisos para realizar esta acción.',
      404: `No se encontraron datos para ${context.toLowerCase()}.`,
      408: 'Tiempo de espera agotado. Intente nuevamente.',
      429: 'Demasiadas solicitudes. Espere un momento antes de intentar nuevamente.',
      500: 'Error interno del servidor. Intente más tarde.',
      502: 'Servidor no disponible temporalmente.',
      503: 'Servicio no disponible. Intente más tarde.'
    };

    return statusMap[status] || `Error ${status} durante ${context.toLowerCase()}.`;
  }

  /**
   * Muestra diálogo de error
   */
  private showErrorDialog(message: string, type: 'error' | 'warning' | 'info' = 'error'): Promise<any> {
    return Swal.fire({
      icon: type,
      title: type === 'error' ? 'Error' : type === 'warning' ? 'Advertencia' : 'Información',
      text: message,
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
      heightAuto: false,
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    });
  }

  /**
   * Muestra mensaje de éxito
   */
  showSuccessMessage(message: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      showConfirmButton: false,
      timer: 2000,
      heightAuto: false
    });
  }

  /**
   * Muestra mensaje de información
   */
  showInfoMessage(message: string): Promise<any> {
    return this.showErrorDialog(message, 'info');
  }
}