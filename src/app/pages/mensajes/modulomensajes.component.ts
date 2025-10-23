import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, map, filter, switchMap, catchError, tap } from 'rxjs/operators';
import { RespuestasService } from '../../services/cuentas.service'
import { UsuarioPerfil } from 'src/app/models/cuenta';
import { MensajesService } from '../../services/mensajes.service'
import { MensajeDetalle, Conversacion } from '../../models/mensaje';
import { MessageHelperService } from '../../services/message-helper.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

// Interfaces específicas para el componente de mensajes
interface MessageItem {
  hora: number;
  fecha?: string | Date;
  mensaje: string;
  usuario: string;
  imagen?: string;
  leido?: boolean;
  id?: string;
}

interface UserConversation {
  id?: string;
  correo: string;
  correo1?: string;
  correo2?: string;
  usuario: string;
  imagen: string;
  mensajes: MessageItem[];
  amigoBorrado?: boolean;
}

interface DatabaseUpdateParameter {
  campo: string;
  valor: any;
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

@Component({
  selector: 'app-modulomensajes',
  templateUrl: './modulomensajes.component.html',
  styleUrls: ['./modulomensajes.component.css']
})

export class ModulomensajesComponent implements OnInit, OnDestroy {
  // Subject para manejar la destrucción de suscripciones
  private destroy$ = new Subject<void>();
  @ViewChild("mensajeEnviar") mensajeEnviar!: ElementRef<HTMLInputElement>;

  // Propiedades principales tipadas
  currentUserName: string | null;
  friendExists: boolean = false;
  currentUserEmail: string | null;
  userProfile: UsuarioPerfil | null = null;
  selectedFriend: UserConversation | null = null;
  conversations: ConversationData[] = [];
  currentUserMessages: MessageItem[] = [];
  friendMessages: MessageItem[] = [];

  constructor(
    private cuenta: RespuestasService, 
    private mensaje: MensajesService,
    private messageHelper: MessageHelperService,
    private errorHandler: ErrorHandlerService
  ) {
    this.currentUserEmail = localStorage.getItem('PerfilUsuario');
    this.currentUserName = localStorage.getItem('NombreUser');
  }

  ngOnInit(): void {
    this.getUserMessages();
  }

  ngOnDestroy(): void {
    // Completar el Subject para cancelar todas las suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserMessages(): void {
    if (!this.currentUserName) {
      this.errorHandler.handleValidationError('Usuario no identificado');
      return;
    }
    
    this.mensaje.getTodosmensajes(this.currentUserName)
      .pipe(
        takeUntil(this.destroy$),
        map((conversations: ConversationData[]) => {
          // Usar el servicio helper para extraer emails
          const friendEmails = this.messageHelper.extractFriendEmails(conversations, this.currentUserEmail);
          return { conversations, friendEmails };
        })
      )
      .subscribe({
        next: ({ conversations, friendEmails }) => {
          
          // Mapear conversaciones con datos temporales mientras se cargan los amigos
          this.conversations = conversations.map(conv => {
            const friendEmail = conv.correo1 === this.currentUserEmail 
              ? conv.correo2 
              : conv.correo1;
            
            // Usar usuario1 o usuario2 según cuál no sea el usuario actual
            const currentUserName = this.currentUserName;
            let friendUserName = '';
            
            if ((conv as any).usuario1 && (conv as any).usuario1 !== currentUserName) {
              friendUserName = (conv as any).usuario1;
            } else if ((conv as any).usuario2 && (conv as any).usuario2 !== currentUserName) {
              friendUserName = (conv as any).usuario2;
            } else {
              friendUserName = friendEmail.split('@')[0]; // Fallback al email
            }

            // Generar avatar personalizado por usuario
            const avatarColor = this.getAvatarColorForUser(friendUserName);
            const avatarInitials = this.getAvatarInitials(friendUserName);
            
            return {
              ...conv,
              correo: friendEmail,
              usuario: friendUserName,
              imagen: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="${avatarColor}"/><text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${avatarInitials}</text></svg>`)}`,
              amigoBorrado: false
            } as ConversationData;
          });

          if (friendEmails.length > 0) {
            this.getFriends(friendEmails);
          }

          // Seleccionar automáticamente la primera conversación si no hay ninguna seleccionada
          if (!this.selectedFriend && this.conversations.length > 0) {
            const firstConv = this.conversations[0];
            if (firstConv.correo && firstConv.usuario && firstConv.imagen) {
              this.selectedFriend = {
                id: firstConv.id,
                correo: firstConv.correo,
                usuario: firstConv.usuario,
                imagen: firstConv.imagen,
                mensajes: firstConv.mensajes,
                amigoBorrado: firstConv.amigoBorrado || false
              } as UserConversation;
            }
          }

          // Actualizar selectedFriend si existe usando método funcional
          this.updateSelectedFriendIfExists();
        },
        error: (error) => {
          this.errorHandler.handleDataError(error, 'mensajes');
        }
      });
  }

  private updateSelectedFriendIfExists(): void {
    if (!this.selectedFriend) return;

    const currentConversation = this.conversations.find(conv => 
      this.selectedFriend!.correo === conv.correo1 || 
      this.selectedFriend!.correo === conv.correo2
    );
    
    if (currentConversation) {
      this.selectedFriend = {
        ...this.selectedFriend,
        mensajes: currentConversation.mensajes,
        id: currentConversation.id
      };
    }
  }

  getFriends(friendEmails: string[]): void {
    if (friendEmails.length === 0) return;

    // Procesar cada amigo individualmente para evitar problemas con forkJoin
    friendEmails.forEach(email => {
      this.cuenta.obtenerPorCorreo(email)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: UsuarioPerfil[]) => {
            if (result && result.length > 0) {
              this.updateConversationWithFriendData(email, result[0]);
            }
          },
          error: (error) => {
            console.error(`❌ Error obteniendo ${email}:`, error);
          }
        });
    });
  }

  private updateConversationWithFriendData(email: string, friend: UsuarioPerfil): void {
    // Actualizar la conversación específica
    this.conversations = this.conversations.map(conversation => {
      const friendEmail = conversation.correo1 === this.currentUserEmail 
        ? conversation.correo2 
        : conversation.correo1;
        
      if (friendEmail === email) {
        // Corregir ruta de imagen si es relativa
        const imagenCorregida = friend.imagen?.startsWith('../../assets/') 
          ? friend.imagen.replace('../../assets/', 'assets/')
          : friend.imagen;
          
        const updated = {
          ...conversation,
          correo: friend.correo,
          usuario: friend.usuario,
          imagen: imagenCorregida,
          amigoBorrado: false
        } as ConversationData;
        
        // Si es el amigo seleccionado, actualizar también selectedFriend
        if (this.selectedFriend && this.selectedFriend.correo === email) {
          this.selectedFriend = {
            id: updated.id,
            correo: updated.correo,
            usuario: updated.usuario,
            imagen: imagenCorregida,
            mensajes: updated.mensajes,
            amigoBorrado: updated.amigoBorrado
          } as UserConversation;
        }
        
        return updated;
      }
      return conversation;
    });
  }

  private updateConversationsWithFriendsData(friendsData: UsuarioPerfil[][]): void {
    console.log('🔄 Procesando datos de amigos:', friendsData);
    
    // Aplanar y filtrar datos válidos
    const validFriends = friendsData
      .filter(res => res && res.length > 0)
      .map(res => res[0]);
      
    console.log('👥 Amigos válidos encontrados:', validFriends);



    // Actualizar conversations de manera inmutable
    this.conversations = this.conversations.map(conversation => {
      // Determinar cuál es el email del amigo (no el del usuario actual)
      const friendEmail = conversation.correo1 === this.currentUserEmail 
        ? conversation.correo2 
        : conversation.correo1;
        
      const friend = validFriends.find(user => user.correo === friendEmail);

      if (friend) {
        console.log(`🔄 Actualizando conversación con ${friend.usuario} imagen: ${friend.imagen}`);
        return {
          ...conversation,
          correo: friend.correo,
          usuario: friend.usuario,
          imagen: friend.imagen,
          amigoBorrado: false
        } as ConversationData;
      }

      // Si no encuentra el amigo, usar datos por defecto
      return {
        ...conversation,
        correo: friendEmail,
        usuario: friendEmail.split('@')[0], // Usar parte del email como nombre
        imagen: 'https://via.placeholder.com/40x40/666666/ffffff?text=?', // Avatar por defecto
        amigoBorrado: true
      } as ConversationData;
    });
    
    // Actualizar selectedFriend si existe después de obtener los datos de amigos
    this.updateSelectedFriendIfExists();
  }

  private getAvatarColorForUser(userName: string): string {
    // Crear colores consistentes basados en el nombre
    const colors = [
      '#007bff', // Azul
      '#28a745', // Verde
      '#dc3545', // Rojo
      '#ffc107', // Amarillo
      '#6f42c1', // Púrpura
      '#fd7e14', // Naranja
      '#20c997', // Turquesa
      '#e83e8c'  // Rosa
    ];
    
    // Usar código hash simple para generar índice consistente
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  private getAvatarInitials(userName: string): string {
    // Tomar las primeras 2 letras del nombre o username
    if (userName.includes(' ')) {
      // Si tiene espacios, tomar primera letra de cada palabra
      const words = userName.split(' ');
      return (words[0].charAt(0) + (words[1]?.charAt(0) || '')).toUpperCase();
    } else {
      // Si no tiene espacios, tomar las primeras 2 letras
      return userName.substring(0, 2).toUpperCase();
    }
  }

  sendMessage(): void {
    if (!this.validateMessageRequirements()) return;

    const messageText = this.mensajeEnviar.nativeElement.value.trim();
    const conversation = this.findCurrentConversation();
    
    if (!conversation?.id) {
      this.errorHandler.handleError('No se encontró la conversación', 'Envío de mensaje');
      return;
    }

    const newMessage = this.createNewMessage(messageText);
    const updatedMessages = [...(this.selectedFriend!.mensajes || []), newMessage];
    
    this.updateLocalConversation(updatedMessages);
    this.sendMessageToServer(updatedMessages, conversation.id);
    this.clearMessageInput();
  }

  private validateMessageRequirements(): boolean {
    const messageText = this.mensajeEnviar.nativeElement.value.trim();
    
    if (!this.messageHelper.isValidMessageText(messageText)) {
      this.errorHandler.handleValidationError('No puedes enviar un mensaje vacío');
      return false;
    }

    if (!this.selectedFriend || !this.currentUserName) {
      this.errorHandler.handleValidationError('Error: No se puede enviar el mensaje');
      return false;
    }

    return true;
  }

  private findCurrentConversation(): ConversationData | undefined {
    return this.conversations.find(conv => 
      this.selectedFriend!.correo === conv.correo1 || 
      this.selectedFriend!.correo === conv.correo2
    );
  }

  private createNewMessage(messageText: string): MessageItem {
    return this.messageHelper.createMessage(messageText, this.currentUserName!);
  }

  private updateLocalConversation(updatedMessages: MessageItem[]): void {
    this.selectedFriend!.mensajes = updatedMessages;
  }

  private sendMessageToServer(messages: MessageItem[], conversationId: string): void {
    const parameters: DatabaseUpdateParameter[] = [
      { campo: 'mensajes', valor: messages }
    ];
    
    this.mensaje.editarCamposNoArray(parameters, conversationId);
  }

  private clearMessageInput(): void {
    this.mensajeEnviar.nativeElement.value = '';
  }

  // Método de compatibilidad para uso existente
  showTryCatchError(error: string | Error): Promise<any> {
    this.errorHandler.handleError(error, 'Operación');
    return Promise.resolve();
  }

  // Método para seleccionar un amigo/conversación
  selectFriend(conversation: ConversationData): void {
    if (conversation.correo && conversation.usuario && conversation.imagen) {
      this.selectedFriend = {
        id: conversation.id,
        correo: conversation.correo,
        usuario: conversation.usuario,
        imagen: conversation.imagen,
        mensajes: conversation.mensajes,
        amigoBorrado: conversation.amigoBorrado || false
      } as UserConversation;
    }
  }

  // Método trackBy para mejor rendimiento y accesibilidad con screen readers
  trackByMessageId(index: number, mensaje: MessageItem): string | number {
    return this.messageHelper.generateMessageTrackingId(mensaje, index);
  }

  // Método helper para obtener la fecha del primer mensaje
  getFirstMessageDate(mensajes: MessageItem[]): Date {
    return this.messageHelper.getFirstMessageDate(mensajes);
  }

  // Propiedad para indicador de escritura (se puede conectar con WebSocket)
  isTyping: boolean = false;
  
  // Propiedades para el formulario mejorado
  isSubmitting: boolean = false;
  inputFocused: boolean = false;

  // Métodos para manejar el input mejorado
  onMessageInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    // Lógica para indicador de escritura en tiempo real
    if (value.trim()) {
      this.isTyping = true;
      // Simular que se deja de escribir después de 2 segundos
      setTimeout(() => {
        this.isTyping = false;
      }, 2000);
    } else {
      this.isTyping = false;
    }
  }

  onInputFocus(): void {
    this.inputFocused = true;
  }

  onInputBlur(): void {
    this.inputFocused = false;
  }

  // Override del método sendMessage existente para agregar estados de carga
  async sendMessageWithStates(): Promise<void> {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    try {
      // Llamar al método original sendMessage()
      this.sendMessage();
      
      // Feedback visual de éxito (opcional)
      this.showSuccessMessage();
      
    } catch (error) {
      this.errorHandler.handleError(error, 'Envío de mensaje');
    } finally {
      this.isSubmitting = false;
    }
  }

  private showSuccessMessage(): void {
    this.errorHandler.showSuccessMessage('Mensaje enviado exitosamente');
  }
}
