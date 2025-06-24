import {Component} from '@angular/core';
import {ProfileService} from '../services/profile-service/profile.service';
import {CommonModule} from '@angular/common';
import {NavBarCommonComponent} from '../../../../shared/components/nav-bar-common/nav-bar-common.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-followers',
  standalone: true,
  imports: [CommonModule, NavBarCommonComponent],
  templateUrl: './followers.component.html',
  styleUrl: './followers.component.scss'
})
export class FollowersComponent {
  followers: any[] = [];

  constructor(private profileService: ProfileService, private router: Router) {
  }

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.loadFollowers(userId);
  }

  loadFollowers(userId: number): void {
    this.profileService.getFollowedUsersByUserId(userId).subscribe({
      next: (res) => {
        this.followers = res.items || [];
      },
      error: (err) => {
        console.error('Erro ao carregar seguidores', err);
      }
    });
  }

  toggleFollow(user: any): void {
    // Lógica para seguir/deixar de seguir
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
