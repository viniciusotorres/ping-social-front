import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-post-card.component.html',
  styleUrl: './app-post-card.component.scss'
})
export class AppPostCardComponent {
  @Input() post: any;

  getInitials(nickname: string): string {
    if (!nickname || nickname.length === 0) return '';


    const parts = nickname.split(/[\s.]+/);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (nickname.length >= 2) {

      return nickname.substring(0, 2).toUpperCase();
    }

    return nickname[0].toUpperCase();
  }
}
