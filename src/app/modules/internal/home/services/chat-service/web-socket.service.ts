import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage, StompConfig, StompSubscription } from '@stomp/stompjs';
import { Subject, Observable, timer, Subscription } from 'rxjs';
import { retryWhen, delayWhen, tap } from 'rxjs/operators';
import SockJS from 'sockjs-client';

export interface ChatMessage {
  id?: number
  sender: string;
  recipient: string;
  text: string;
  time?: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private stompClient?: Client;
  private username: string = '';

  private readonly messageSubject = new Subject<ChatMessage>();
  public readonly messages$: Observable<ChatMessage> = this.messageSubject.asObservable();

  private reconnectDelayMs = 5000; // tempo para tentar reconectar
  private isConnected = false;
  private connectionSubscription?: Subscription;

  private subscription?: StompSubscription;

  private readonly enableLogs = true; // toggle para logs
  private readonly apiSocketUrl = 'https://ping-social-1.onrender.com/ws';

  connect(username: string): void {
    if (this.isConnected) {
      this.log('[WebSocket] Já conectado, ignorando nova conexão.');
      return;
    }

    this.username = username;
    const token = localStorage.getItem('authToken') || '';
    const socket = new SockJS(this.apiSocketUrl + `?token=${token}`)

    if (!token) {
      console.warn('[WebSocket] Conexão bloqueada: token ausente.');
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (msg: string) => this.log(`[WebSocket][DEBUG] ${msg}`),
      reconnectDelay: 0,
      onConnect: this.onConnect.bind(this),
      onStompError: this.onStompError.bind(this),
      onWebSocketClose: this.onWebSocketClose.bind(this),
      onWebSocketError: this.onWebSocketError.bind(this),
    });

    this.stompClient.activate();
  }

  private onConnect(frame: any): void {
    this.isConnected = true;
    this.log(`[WebSocket] Conectado como: ${this.username}`);

    this.subscription = this.stompClient?.subscribe(`/user/queue/messages`, (message: IMessage) => {
      if (message.body) {
        try {
          const parsed: ChatMessage = JSON.parse(message.body);
          this.log('[WebSocket] Mensagem recebida:', parsed);
          this.messageSubject.next(parsed);
        } catch (e) {
          console.error('[WebSocket] Falha ao parsear mensagem:', e);
        }
      }
    });
  }

  private onStompError(frame: any): void {
    console.error('[WebSocket] Erro STOMP:', frame.headers['message']);
  }

  private onWebSocketClose(event: CloseEvent): void {
    this.isConnected = false;
    this.log(`[WebSocket] Conexão fechada. Código: ${event.code}, Razão: ${event.reason}`);

    this.tryReconnect();
  }

  private onWebSocketError(event: Event): void {
    console.error('[WebSocket] Erro WebSocket:', event);
  }

  private tryReconnect() {
    this.log(`[WebSocket] Tentando reconectar em ${this.reconnectDelayMs / 1000}s...`);

    if (this.connectionSubscription && !this.connectionSubscription.closed) {
      this.log('[WebSocket] Reconexão já está em andamento.');
      return;
    }

    this.connectionSubscription = timer(this.reconnectDelayMs).subscribe(() => {
      this.log('[WebSocket] Reconectando...');
      this.connect(this.username);
    });
  }

  sendMessage(recipient: string, text: string): void {
    if (!this.stompClient?.connected) {
      console.error('[WebSocket] Cliente STOMP não conectado.');
      return;
    }

    const msg: ChatMessage = {
      sender: this.username,
      recipient,
      text,
      time: new Date().toISOString()
    };

    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(msg)
    });

    this.log('[WebSocket] Mensagem enviada:', msg);
  }

  disconnect(): void {
    if (!this.stompClient || !this.isConnected) {
      this.log('[WebSocket] Não está conectado.');
      return;
    }

    this.subscription?.unsubscribe();
    this.stompClient.deactivate();
    this.isConnected = false;

    this.connectionSubscription?.unsubscribe();

    this.log('[WebSocket] Desconectado');
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.messageSubject.complete();
  }

  private log(...args: any[]): void {
    if (this.enableLogs) {
      console.log(...args);
    }
  }
}
