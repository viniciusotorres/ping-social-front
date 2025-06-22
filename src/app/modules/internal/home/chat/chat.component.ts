import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule, NgClass} from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  message = '';
  messages: { text: string; sender: string; time: string }[] = [];
  adminPostTime = '';
  onlineUsers = ['Ana', 'Carlos', 'Bia', 'Lucas', 'Marina'];
  showUserList = false;

  ngOnInit() {
    this.adminPostTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  }

  sendMessage() {
    if (!this.message.trim()) return;

    const now = new Date();
    this.messages.push({
      text: this.message,
      sender: 'Você',
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.message = '';
  }

  toggleUserList() {
    this.showUserList = !this.showUserList;
  }
}
