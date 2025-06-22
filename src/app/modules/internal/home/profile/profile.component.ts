import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
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

  openSettings(): void {
    // Navegar ou abrir modal de configurações
    console.log('Configurações clicado');
  }
}
