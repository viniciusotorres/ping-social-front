import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile-service/profile.service';
import { NavBarCommonComponent } from '../../../../shared/components/nav-bar-common/nav-bar-common.component';
import { Router } from '@angular/router';
import { LoginService } from '../../../auth/services/login-service/login.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavBarCommonComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'], // Corrigido para styleUrls
})
export class ProfileComponent {
  /** Controle de loading para ações de seguir/deixar de seguir usuários */
  loadingFollow: { [userId: number]: boolean } = {};

  /** Lista de usuários sugeridos para seguir */
  suggestedUsers: any[] = [];

  /** Nickname do usuário atual */
  nickname: string = '';

  /** Iniciais do avatar do usuário atual */
  avatarInitials: string = '';

  /** Dias ativo na plataforma */
  daysActive: number = 0;

  /** Quantidade de usuários que o usuário atual está seguindo */
  countFollowingUsers: number = 0;

  /** Quantidade de seguidores do usuário atual */
  countFollowedUsers: number = 0;

  /** Lista de tribos do usuário atual */
  tribes: string[] = [];

  /** Mapeamento para pluralização da contagem de seguidores */
  followersMapping: { [k: string]: string } = {
    '=0': 'Nenhum seguidor',
    '=1': '1 seguidor',
    other: '# seguidores',
  };

  constructor(
    private profileService: ProfileService,
    private loginService: LoginService,
    private router: Router
  ) {}

  /**
   * Inicializa o componente carregando dados do usuário e sugestões.
   */
  ngOnInit(): void {
    this.loadSuggestedUsers();
    this.loadUserInfo();
  }

  /**
   * Carrega as informações do usuário atual a partir do serviço de login.
   */
  loadUserInfo(): void {
    this.loginService.getMyInfo().subscribe({
      next: (res) => {
        this.nickname = res.nickname;
        this.avatarInitials = res.avatarInitials;
        this.daysActive = res.daysActive;
        this.countFollowingUsers = res.countFollowing;
        this.countFollowedUsers = res.countFollowers;
        this.tribes = res.namesTribes || [];
      },
      error: (err) => {
        console.error('Erro ao carregar informações do usuário:', err);
      },
    });
  }

  /**
   * Alterna entre seguir e deixar de seguir um usuário.
   * @param user Usuário alvo da ação.
   */
  toggleFollow(user: any): void {
    const userId = user.id;
    this.loadingFollow[userId] = true;

    const action$ = user.isFollowing
      ? this.profileService.unfollowUser(userId)
      : this.profileService.followUser(userId);

    action$.subscribe({
      next: () => {
        user.isFollowing = !user.isFollowing;
        this.loadSuggestedUsers();
        this.loadUserInfo();
      },
      error: (err) => {
        this.loadingFollow[userId] = false;
        console.error('Erro ao alternar follow:', err);
      },
      complete: () => {
        this.loadingFollow[userId] = false;
      },
    });
  }

  /**
   * Carrega a lista de usuários sugeridos para seguir.
   */
  private loadSuggestedUsers(): void {
    this.profileService.getSuggestedUsers().subscribe({
      next: (res) => {
        this.suggestedUsers = res.items;
      },
      error: (err) => {
        console.error('Erro ao carregar sugestões:', err);
      },
    });
  }

  /**
   * Retorna as classes CSS para a tribo informada, para estilização.
   * @param tribe Nome da tribo.
   * @returns Classes CSS correspondentes à tribo.
   */
  getTribeClass(tribe: string): string {
    const colorMap: Record<string, string> = {
      'Tribe Red': 'bg-red-500 bg-opacity-20 text-red-300',
      'Tribe Blue': 'bg-blue-500 bg-opacity-20 text-blue-300',
      'Tribe Green': 'bg-green-500 bg-opacity-20 text-green-300',
      'Tribe Yellow': 'bg-yellow-500 bg-opacity-20 text-yellow-300',
    };

    return colorMap[tribe] || 'bg-gray-500 bg-opacity-20 text-gray-300'; // fallback
  }

  /** Navega para a tela de chat */
  goToChat(): void {
    this.router.navigate(['/internal/chat']);
  }

  /** Navega para o perfil do usuário */
  goToProfile(): void {
    this.router.navigate(['/internal/profile']);
  }

  /** Navega para as notificações */
  goToNotifications(): void {
    this.router.navigate(['/internal/notifications']);
  }

  /** Navega para a página inicial */
  goToHome(): void {
    this.router.navigate(['/internal/']);
  }

  /** Navega para a lista de seguidores */
  goToFollowedUsers(): void {
    this.router.navigate(['/internal/followers']);
  }

  /** Navega para a lista de usuários seguidos */
  goToFollowingUsers(): void {
    this.router.navigate(['/internal/following']);
  }

  /**
   * Realiza o logout do usuário, limpando localStorage e redirecionando para login.
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
