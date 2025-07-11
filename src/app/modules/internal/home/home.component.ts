import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HomeService} from './services/home-service/home.service';
import {NavBarCommonComponent} from '../../../shared/components/nav-bar-common/nav-bar-common.component';
import {FeedComponent} from './feed/feed.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavBarCommonComponent, FeedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  loadingTribe: { [tribeId: number]: boolean } = {};
  showDropdown = false;
  showTribeModal = false;
  showSelectTribe = true;
  step: number = 1;
  tribes: any;

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  constructor(
    private router: Router,
    private homeService: HomeService) {
  }

  ngOnInit() {
    this.verifyHasTribe();
    this.loadTribes();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.dropdownRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showDropdown = false;
    }
  }

  loadTribes() {
    this.homeService.getTribes().subscribe({
      next: (data) => {
        this.tribes = data.items;
        console.log('Tribes loaded:', this.tribes);
      },
      error: (error) => {
        console.error('Error loading tribes:', error);
      }
    });
  }

  verifyHasTribe() {
    this.homeService.hasTribe().subscribe({
      next: (data) => {
        if (data.data) {
          this.showSelectTribe = false;
        } else {
          this.openTribeModal();
        }
      },
      error: (error) => {
        console.error('Error checking tribe:', error);
      }
    });
  }

  choiceTribe(tribeId: number) {
    if (this.showSelectTribe) {
      this.loadingTribe[tribeId] = true;

      this.homeService.joinTribe(tribeId).subscribe({
        next: (data) => {
          console.log('Tribe joined successfully:', data);
          this.showSelectTribe = false;
          this.showTribeModal = false;
        },
        error: (error) => {
          console.error('Error joining tribe:', error);
        },
        complete: () => {
          this.loadingTribe[tribeId] = false;
        }
      });
    }
  }


  openTribeModal() {
    this.showTribeModal = true;
  }

  closeTribeModal(): void {
    this.step = 1;
    this.showSelectTribe = false;
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
