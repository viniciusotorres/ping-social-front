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
}
