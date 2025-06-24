import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarCommonComponent} from '../../../../shared/components/nav-bar-common/nav-bar-common.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NavBarCommonComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  notifications = [
    {
      title: 'Boas-vindas ao The Tribe!',
      message: 'Estamos felizes em ter você aqui! Por ser o início do desenvolvimento, algumas requisições podem levar mais tempo. Agradecemos sua compreensão e feedback!',
      time: 'Agora mesmo',
      read: false,
    },
    {
      title: 'Esqueci minha senha',
      message: 'A funcionalidade de recuperação e redefinição de senha está em desenvolvimento. Em breve estará disponível!',
      time: 'Há 2 minutos',
      read: false,
    },
    {
      title: 'Chat em construção',
      message: 'O chat da tribo está em desenvolvimento. Em breve você poderá interagir com outros membros!',
      time: 'Há 1 hora',
      read: false,
    },
    {
      title: 'Perfil do usuário',
      message: 'A seção de perfil está sendo aprimorada para oferecer uma experiência mais completa.',
      time: 'Hoje às 10:00',
      read: true,
    },
    {
      title: 'Área interna em evolução',
      message: 'Estamos trabalhando em diversas melhorias na parte interna da plataforma. Agradecemos sua paciência!',
      time: 'Ontem',
      read: true,
    },
  ];


  constructor(private router: Router) { }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }

  goToChat() {
    this.router.navigate(['/internal/chat']);
  }

  goToProfile() {
    this.router.navigate(['/internal/profile']);
  }

  goToNotifications() {
    this.router.navigate(['/internal/notifications']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

}
