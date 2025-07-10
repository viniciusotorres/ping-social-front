import {Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { NavBarCommonComponent } from '../../../../shared/components/nav-bar-common/nav-bar-common.component';
import { Router } from '@angular/router';
import { ChatMessage, WebSocketService } from '../services/chat-service/web-socket.service';
import { ProfileService } from '../services/profile-service/profile.service';
import { Subscription } from 'rxjs';
import {HistoryChatService} from '../services/history-chat-service/history-chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule, NavBarCommonComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('lastMessage', { static: false }) lastMessage: ElementRef | undefined;

  message = '';
  messages: ChatMessage[] = [];

  selectedUser!: string;
  nicknameSelected = '';
  suggestedUsers: Array<{ id: string; nickname: string; avatarInitials?: string; email?: string }> = [];

  userSearch = '';
  showUserDropdown = false;

  currentUserEmail = localStorage.getItem('email') || '';
  currentUserNickname = localStorage.getItem('nickname') || 'Você';

  private page = 0;
  private size = 20;
  private isLoading = false;
  newNotificationsCount = 5;

  private messagesSubscription?: Subscription;
  private audio = new Audio('assets/audio/notificacao.mp3');

  constructor(
    private router: Router,
    private webSocketService: WebSocketService,
    private profileService: ProfileService,
    private historyChatService: HistoryChatService
  ) {}

  ngOnInit(): void {
    this.loadSuggestedUsers();
    this.connectWebSocket();
  }

  private connectWebSocket(): void {
    const nickname = this.currentUserEmail || 'Você';
    this.webSocketService.connect(nickname);

    this.messagesSubscription = this.webSocketService.messages$.subscribe({
      next: (msg) => this.handleIncomingMessage(msg),
      error: (err) => console.error('Erro no WebSocket:', err),
    });
  }

  private handleIncomingMessage(msg: ChatMessage): void {
    const normalizedMessage: ChatMessage = {
      ...msg,
      time: msg.time || msg.timestamp || '',
    };

    const exists = this.messages.some(
      (m) =>
        m.time === normalizedMessage.time &&
        m.text === normalizedMessage.text &&
        m.sender === normalizedMessage.sender
    );

    if (!exists) {
      this.messages.push(normalizedMessage);
      this.playNotificationSound();
    }
  }

  private playNotificationSound(): void {
    this.audio
      .play()
      .catch((err) => console.error('Erro ao tocar áudio:', err));
  }

  loadSuggestedUsers(): void {
    this.profileService.getSuggestedUsers().subscribe({
      next: (res) => (this.suggestedUsers = res.items),
      error: (err) => console.error('Erro ao carregar sugestões:', err),
    });
  }

  sendMessage(): void {
    const trimmedMessage = this.message.trim();
    if (!trimmedMessage || !this.selectedUser) return;

    const now = new Date();
    const newMessage: ChatMessage = {
      text: trimmedMessage,
      sender: this.currentUserEmail,
      recipient: this.selectedUser,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.messages.push(newMessage);
    this.webSocketService.sendMessage(this.selectedUser, trimmedMessage);
    this.message = '';
  }

  filteredMessages(): ChatMessage[] {
    if (!this.selectedUser) return [];

    return this.messages.filter(
      (msg) =>
        (msg.sender === this.currentUserEmail && msg.recipient === this.selectedUser) ||
        (msg.sender === this.selectedUser && msg.recipient === this.currentUserEmail)
    );
  }

  getAvatarInitials(email: string): string {
    const user = this.suggestedUsers.find((u) => u.email === email);
    return user?.avatarInitials || email.charAt(0).toUpperCase();
  }

  selectUser(user: { email?: string; nickname: string }): void {
    if (user.email) {
      this.selectedUser = user.email;
      this.nicknameSelected = user.nickname;
      this.showUserDropdown = false;

      this.loadChatHistory()
    }
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  deselectUser(): void {
    this.selectedUser = '';
  }

  filteredUserList() {
    const search = this.userSearch.trim().toLowerCase();
    if (!search) return this.suggestedUsers;

    return this.suggestedUsers.filter((user) =>
      user.email?.toLowerCase().includes(search)
    );
  }

  goToChat(): void {
    this.router.navigate(['/internal/chat']);
  }

  goToProfile(): void {
    this.router.navigate(['/internal/profile']);
  }

  goToNotifications(): void {
    this.router.navigate(['/internal/notifications']);
  }

  logout(): void {
    localStorage.clear();
    this.messagesSubscription?.unsubscribe();
    this.webSocketService.disconnect();
    this.router.navigate(['/auth/login']);
  }


  loadChatHistory(): void {
    if (this.isLoading) return; // Impede múltiplos carregamentos simultâneos
    this.isLoading = true;

    this.historyChatService.getHistoryChat(this.currentUserEmail, this.selectedUser, this.page, this.size)
      .subscribe({
        next: (newMessages) => {
          if (newMessages && newMessages.length > 0) {
            const newMessagesSet = new Set(newMessages.map(msg => msg.id));
            const uniqueMessages = this.messages.filter(msg => !newMessagesSet.has(msg.id));


            this.messages = [...newMessages, ...uniqueMessages];
            this.page++;
          }
          this.isLoading = false;
          this.scrollToBottom();
        },
        error: (err) => {
          console.error('Erro ao carregar histórico de mensagens:', err);
          this.isLoading = false;
        }
      });
  }

  scrollToBottom(): void {
    if (this.lastMessage) {
      this.lastMessage.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }


  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {

  }

  clearChatHistory() {
    this.historyChatService.clearChatHistory(this.currentUserEmail, this.selectedUser).subscribe({
      next: (response) => {
        console.log('Histórico de mensagens limpo com sucesso.');
        this.messages = [];
      },
      error: (err) => {
        console.error('Erro ao limpar histórico de mensagens:', err);
      }
    });
  }

  // Navegar para configurações
  goToSettings() {

  }

  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
    this.webSocketService.disconnect();
  }

}
