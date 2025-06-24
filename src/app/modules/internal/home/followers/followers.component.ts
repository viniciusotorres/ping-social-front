import {Component} from '@angular/core';
import {ProfileService} from '../services/profile-service/profile.service';
import {CommonModule} from '@angular/common';
import {NavBarCommonComponent} from '../../../../shared/components/nav-bar-common/nav-bar-common.component';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {HomeService} from '../services/home-service/home.service';

@Component({
  selector: 'app-followers',
  standalone: true,
  imports: [CommonModule, NavBarCommonComponent],
  templateUrl: './followers.component.html',
  styleUrl: './followers.component.scss'
})
export class FollowersComponent {
  loadingFollow: { [userId: number]: boolean } = {};
  followers: any[] = [];

  constructor(private profileService: ProfileService, private router: Router, private homeService: HomeService) {
    // Inicialização do componente
  }

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.loadFollowers(userId);
  }

  loadFollowers(userId: number): void {
    this.profileService.getFollowedUsersByUserId(userId).subscribe({
      next: (res) => {
        this.followers = res.items || [];
        this.followers.forEach(follower => {
          this.loadTribesForUser(follower);
        });

        this.checkFollowingStatus();
      },
      error: (err) => {
        console.error('Erro ao carregar seguidores', err);
      }
    });
  }

  checkFollowingStatus(): void {
    this.followers.forEach(user => {
      this.profileService.verifyFollowedUser(user.followedUserId).subscribe({
        next: (isFollowing) => {
          user.following = isFollowing;
        },
        error: () => {
          user.following = false; // fallback
        }
      });
    });
  }


  toggleFollow(user: any): void {
    this.loadingFollow[user.followedUserId] = true;

    const followAction = user.following
      ? this.profileService.unfollowUser(user.followedUserId)
      : this.profileService.followUser(user.followedUserId);

    followAction.subscribe({
      next: () => {
        user.following = !user.following;
      },
      error: (err) => {
        console.error('Erro ao seguir/deixar de seguir:', err);
      },
      complete: () => {
        this.loadingFollow[user.followedUserId] = false;
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

  loadTribesForUser(user: any): void {
    this.homeService.loadTribeByUserId(user.followedUserId).subscribe({
      next: (res) => {
        if (res?.items?.length > 0) {
          user.tribeName = res.items[0].name;
        } else {
          user.tribeName = null;
        }
      },
      error: (err) => {
        console.error(`Erro ao carregar tribos do usuário ${user.followedUserId}`, err);
        user.tribeName = null;
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
