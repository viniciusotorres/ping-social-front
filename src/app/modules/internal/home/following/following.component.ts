import {Component} from '@angular/core';
import {ProfileService} from '../services/profile-service/profile.service';
import {Router} from '@angular/router';
import {NavBarCommonComponent} from '../../../../shared/components/nav-bar-common/nav-bar-common.component';
import {CommonModule} from '@angular/common';
import {HomeService} from '../services/home-service/home.service';

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
  userId!: number ;
  loadingUnfollow: { [userId: number]: boolean } = {};


  constructor(private profileService: ProfileService, private router: Router,  private homeService: HomeService) {
  }

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    } else {
      this.userId = userId;
    }
    this.loadFollowing(userId);
  }

  loadFollowing(userId: number): void {
    this.profileService.getFollowingUsersByUserId(userId).subscribe({
      next: (res) => {
        this.following = res.items || [];


        this.following.forEach(user => {
          this.loadTribesForUser(user);
        });
      },
      error: (err) => {
        console.error('Erro ao carregar seguindo:', err);
      }
    });
  }

  loadTribesForUser(user: any): void {
    this.homeService.loadTribeByUserId(user.followedUserId).subscribe({
      next: (res) => {
        if (res?.items?.length > 0) {
          user.tribeName = res.items[0].name; // Pega o nome da primeira tribo
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

  unfollow(user: any): void {
    const userId = user.followedUserId;
    this.loadingUnfollow[userId] = true;

    this.profileService.unfollowUser(userId).subscribe({
      next: () => {
        this.following = this.following.filter(u => u.id !== userId);
        this.loadFollowing(this.userId);
      },
      error: (err) => {
        console.error('Erro ao deixar de seguir usuário:', err);
      },
      complete: () => {
        this.loadingUnfollow[userId] = false;
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
