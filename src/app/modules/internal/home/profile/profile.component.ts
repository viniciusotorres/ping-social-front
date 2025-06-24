import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user = {
    name: 'Vinícius Tôrres',
    username: 'viniciustorres',
    avatarUrl: 'https://i.pravatar.cc/100',
    bio: 'Desenvolvedor full stack apaixonado por tecnologia, inovação e soluções que transformam. Explorando novas ideias e evoluindo com a tribo.',
    followers: 128,
    following: 89
  };

  suggestedUsers = [
    {
      name: 'Karla Silva',
      username: 'karla.dev',
      avatar: 'https://i.pravatar.cc/150?img=12',
      following: false
    },
    {
      name: 'João Pereira',
      username: 'joaop',
      avatar: 'https://i.pravatar.cc/150?img=5',
      following: false
    },
    {
      name: 'Mariana Code',
      username: 'maricode',
      avatar: 'https://i.pravatar.cc/150?img=7',
      following: true
    }
  ];


  activities = [
    {
      type: 'comment',
      content: 'Você comentou em um post: "Gostei bastante dessa proposta!"',
      timestamp: '2 horas atrás'
    },
    {
      type: 'follow',
      content: 'Você seguiu @karla.dev',
      timestamp: '1 dia atrás'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Aqui no futuro: buscar dados da API autenticada, exemplo:
    // this.profileService.getUserProfile().subscribe(data => this.user = data);
  }

  editProfile(): void {
    // Navegar ou abrir modal de edição de perfil
    console.log('Editar perfil clicado');
  }

  toggleFollow(user: any) {
    user.following = !user.following;

    if (user.following) {

    } else {
    }
  }


  openSettings(): void {
    // Navegar ou abrir modal de configurações
    console.log('Configurações clicado');
  }
}
