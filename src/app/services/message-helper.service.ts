import { Injectable } from '@angular/core';

// Interfaces específicas para el servicio helper
interface MessageItem {
  hora: number;
  fecha?: string | Date;
  mensaje: string;
  usuario: string;
  imagen?: string;
  leido?: boolean;
  id?: string;
}

interface ConversationData {
  id: string;
  correo1: string;
  correo2: string;
  mensajes: MessageItem[];
  // Propiedades del usuario amigo (agregadas dinámicamente)
  correo?: string;
  usuario?: string;
  imagen?: string;
  amigoBorrado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessageHelperService {

  constructor() { }

  /**
   * Extrae los emails de amigos de las conversaciones
   */
  extractFriendEmails(conversations: ConversationData[], currentUserEmail: string | null): string[] {
    if (!currentUserEmail) return [];
    
    return conversations.reduce((emails: string[], conv) => {
      if (conv.correo1 === currentUserEmail) {
        emails.push(conv.correo2);
      }
      if (conv.correo2 === currentUserEmail) {
        emails.push(conv.correo1);
      }
      return emails;
    }, []);
  }

  /**
   * Encuentra una conversación específica por email del amigo
   */
  findConversationByFriendEmail(conversations: ConversationData[], friendEmail: string): ConversationData | undefined {
    return conversations.find(conv => 
      conv.correo1 === friendEmail || conv.correo2 === friendEmail
    );
  }

  /**
   * Crea un nuevo mensaje
   */
  createMessage(messageText: string, username: string): MessageItem {
    return {
      hora: Date.now(),
      fecha: new Date().toISOString(),
      mensaje: messageText,
      usuario: username,
      leido: false
    };
  }

  /**
   * Valida si un texto de mensaje es válido
   */
  isValidMessageText(messageText: string): boolean {
    return messageText.trim().length > 0;
  }

  /**
   * Obtiene la fecha del primer mensaje de una conversación
   */
  getFirstMessageDate(messages: MessageItem[]): Date {
    if (!messages || messages.length === 0) return new Date();
    const firstDate = messages[0].fecha || messages[0].hora;
    return new Date(firstDate);
  }

  /**
   * Genera un ID único para tracking de mensajes
   */
  generateMessageTrackingId(message: MessageItem, index: number): string | number {
    return message.id || 
           (typeof message.fecha === 'string' ? message.fecha : message.fecha?.toString()) || 
           message.hora || 
           index;
  }

  /**
   * Determina si un mensaje pertenece al usuario actual
   */
  isCurrentUserMessage(message: MessageItem, currentUsername: string | null): boolean {
    return currentUsername === message.usuario;
  }

  /**
   * Actualiza una conversación con nuevos mensajes de forma inmutable
   */
  updateConversationMessages(conversation: any, newMessages: MessageItem[]): any {
    return {
      ...conversation,
      mensajes: newMessages
    };
  }

  /**
   * Filtra conversaciones válidas (que tienen mensajes)
   */
  filterValidConversations(conversations: ConversationData[]): ConversationData[] {
    return conversations.filter(conv => conv.mensajes && conv.mensajes.length > 0);
  }

  /**
   * Ordena conversaciones por fecha del último mensaje
   */
  sortConversationsByLastMessage(conversations: ConversationData[]): ConversationData[] {
    return conversations.sort((a, b) => {
      const lastMessageA = a.mensajes[a.mensajes.length - 1];
      const lastMessageB = b.mensajes[b.mensajes.length - 1];
      
      const dateA = new Date(lastMessageA.fecha || lastMessageA.hora);
      const dateB = new Date(lastMessageB.fecha || lastMessageB.hora);
      
      return dateB.getTime() - dateA.getTime(); // Más reciente primero
    });
  }
}