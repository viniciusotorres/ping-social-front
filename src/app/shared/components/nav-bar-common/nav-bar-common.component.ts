import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-bar-common',
  templateUrl: './nav-bar-common.component.html',
  styleUrls: ['./nav-bar-common.component.scss'],
  standalone: true
})
export class NavBarCommonComponent {
  @Input() showSelectTribe = false;
  @Output() chat = new EventEmitter<void>();
  @Output() profile = new EventEmitter<void>();
  @Output() notifications = new EventEmitter<void>();
  @Output() tribeModal = new EventEmitter<void>();
  @Output() logoutEvent = new EventEmitter<void>();
  @Output() home = new EventEmitter<void>();

  goToHome() {
    this.home.emit();
  }

  goToChat() {
    this.chat.emit();
  }
  goToProfile() {
    this.profile.emit();
  }
  goToNotifications() {
    this.notifications.emit();
  }
  openTribeModal() {
    this.tribeModal.emit();
  }
  logout() {
    this.logoutEvent.emit();
  }
}

