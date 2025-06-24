import {Component} from '@angular/core';
import {ProfileService} from '../services/profile-service/profile.service';
import {Router} from '@angular/router';
import {NavBarCommonComponent} from '../../../../shared/components/nav-bar-common/nav-bar-common.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [
    CommonModule,
    NavBarCommonComponent
  ],
  templateUrl: './following.component.html',
  styleUrl: './following.component.scss'
})
export class FollowingComponent {
  following: any[] = [];

  constructor(private profileService: ProfileService, private router: Router) {
  }

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.loadFollowing(userId);
  }

  loadFollowing(userId: number): void {
    this.profileService.getFollowingUsersByUserId(userId).subscribe({
      next: (res) => {
        this.following = res.items || [];
      },
      error: (err) => {
        console.error('Erro ao carregar seguindo:', err);
      }
    });
  }

  unfollow(user: any): void {
    this.profileService.unfollowUser(user.id).subscribe({
      next: () => {
        this.following = this.following.filter(u => u.id !== user.id);
      },
      error: (err) => {
        console.error('Erro ao deixar de seguir usuário:', err);
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

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
