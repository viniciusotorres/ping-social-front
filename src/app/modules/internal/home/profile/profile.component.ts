import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileService} from '../services/profile-service/profile.service';
import {NavBarCommonComponent} from '../../../../shared/components/nav-bar-common/nav-bar-common.component';
import {Router} from '@angular/router';
import {HomeService} from '../services/home-service/home.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavBarCommonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  loadingFollow: { [userId: number]: boolean } = {};
  suggestedUsers: any[] = [];
  followingUsers: any[] = [];
  followedUsers: any[] = [];
  userEmail: string = '';
  nickname: string = '';
  countFollowingUsers: number = 0;
  countFollowedUsers: number = 0;
  tribes: any[] = [];

  constructor(
    private profileService: ProfileService,
    private homeService: HomeService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.loadSuggestedUsers();
    this.loadFollowedUser();
    this.loadUserInfo();
    this.loadFollowingUsers();
    this.loadTribeByUserId();
  }

  loadUserInfo(): void {
    const user = localStorage.getItem('email');
    if (user) {
      this.userEmail = user || 'Usuário';
      this.nickname = localStorage.getItem('nickname') || 'Usuário';
    }
  }

  loadTribeByUserId(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.homeService.loadTribeByUserId(userId).subscribe({
      next: (res) => {
        console.log('Tribos do usuário carregadas:', res);
        if (res?.items?.length > 0) {
          this.tribes = res.items.map((tribe: any) => tribe.name);
        } else {
          this.tribes = [];
        }
      },
      error: (err) => {
        console.error('Erro ao carregar tribos do usuário:', err);
        this.tribes = [];
      }
    });
  }

  private setUserFollowingStatus(user: any): void {
    this.profileService.verifyFollowedUser(user.id).subscribe({
      next: (res) => {
        user.following = res.message === 'Usuário está seguindo';
      },
      error: (err) => {
        console.error(`Erro ao verificar se segue ${user.email}:`, err);
        user.following = false;
      }
    });
  }

  private followUser(user: any): void {
    this.profileService.followUser(user.id).subscribe({
      next: () => {
        user.following = true;
        this.loadFollowingUsers();
        console.log(`Seguindo ${user.email}`);
      },
      error: (err) => {
        console.error('Erro ao seguir usuário:', err);
      }
    });
  }

  private unfollowUser(user: any): void {
    this.profileService.unfollowUser(user.id).subscribe({
      next: () => {
        user.following = false;
        this.loadFollowingUsers();
        console.log(`Deixou de seguir ${user.email}`);
      },
      error: (err) => {
        console.error('Erro ao deixar de seguir usuário:', err);
      }
    });
  }

  toggleFollow(user: any): void {
    const userId = user.id;
    this.loadingFollow[userId] = true;

    const action$ = user.following
      ? this.profileService.unfollowUser(userId)
      : this.profileService.followUser(userId);

    action$.subscribe({
      next: () => {
        user.following = !user.following;
        this.loadFollowingUsers()
        this.loadFollowedUser();
      },
      error: (err) => {
        console.error('Erro ao alternar follow:', err);
      },
      complete: () => {
        this.loadingFollow[userId] = false;
      }
    });
  }

  private loadSuggestedUsers(): void {
    this.profileService.getSuggestedUsers().subscribe({
      next: (res) => {
        this.suggestedUsers = res.items;
        this.suggestedUsers.forEach(user => this.setUserFollowingStatus(user));
        this.loadTribesForSuggestedUsers();
      },
      error: (err) => {
        console.error('Erro ao carregar sugestões:', err);
      }
    });
  }

  loadTribesForSuggestedUsers() {
    this.suggestedUsers.forEach((user) => {
      this.homeService.loadTribeByUserId(user.id).subscribe({
        next: (res) => {
          user.tribes = res?.items || [];
        },
        error: (err) => {
          console.error(`Erro ao carregar tribos do usuário ${user.id}:`, err);
          user.tribes = [];
        }
      });
    });
  }

  private loadFollowedUser(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.profileService.getFollowedUsersByUserId(userId).subscribe({
      next: (res) => {
        this.followedUsers = res.items;
        this.countFollowedUsers = res.count;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários seguidos:', err);
      }
    });
  }

  private loadFollowingUsers(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.profileService.getFollowingUsersByUserId(userId).subscribe({
      next: (res) => {
        this.followingUsers = res.items;
        this.countFollowingUsers = res.count;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários seguidos:', err);
      }
    });
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

  goToHome() {
    this.router.navigate(['/internal/']);
  }

  goToFollowedUsers() {
    this.router.navigate(['/internal/followers']);
  }

  goToFollowingUsers() {
    this.router.navigate(['/internal/following']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
