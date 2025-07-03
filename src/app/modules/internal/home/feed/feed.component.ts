import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPostCardComponent } from '../../../../shared/components/app-post-card/app-post-card.component';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { PostFilterType } from '../../../core/enums/PostFilterType';
import { FeedService, PostRequest, ResponsePost } from '../services/feed-service/feed.service';
import {HomeService} from '../services/home-service/home.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, AppPostCardComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  isLoading = false;
  currentUserId: number | null = null;
  tribes: any[] = [];
  tribesMap: { [key: number]: string } = {};

  // FormControl para o conteúdo do post
  postContent = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(500)
  ]);

  // Controles de filtro/tab unificados
  activeFilter: PostFilterType = PostFilterType.ALL;
  filters = [
    { value: PostFilterType.ALL, label: 'Todos' },
    { value: PostFilterType.MY_POSTS, label: 'Meus Posts' },
    { value: PostFilterType.TRIBE_POSTS, label: 'Minha Tribo' },
    { value: PostFilterType.FRIENDS_POSTS, label: 'Amigos' }
  ];

  // Feed de posts
  posts: ResponsePost[] = [];

  constructor(private feedService: FeedService, private homeService: HomeService ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadPosts();
  }

  private loadCurrentUser(): void {
    const userId = localStorage.getItem('userId');
    this.currentUserId = userId ? Number(userId) : null;
  }

  changeFilter(filter: PostFilterType): void {
    this.activeFilter = filter;
    this.loadPosts();
  }

  loadPosts(): void {
    if (!this.currentUserId) return;

    this.isLoading = true;
    this.feedService.getPosts(this.currentUserId, this.activeFilter)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.posts = response.items || [];
        },
        error: (err) => {
          console.error('Erro ao carregar posts:', err);
          this.posts = [];
        }
      });
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

  createPost(): void {
    if (this.postContent.invalid || !this.currentUserId) return;

    const postData: PostRequest = {
      userId: this.currentUserId,
      content: this.postContent.value!,
      tribeIds: []
    };

    this.isLoading = true;
    this.feedService.createPost(postData)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (newPost) => {
          this.posts.unshift(newPost);
          this.postContent.reset();
        },
        error: (err) => {
          console.error('Erro ao criar post:', err);
        }
      });
  }
}
