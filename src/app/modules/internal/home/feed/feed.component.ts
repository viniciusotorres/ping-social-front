import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppPostCardComponent} from '../../../../shared/components/app-post-card/app-post-card.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, AppPostCardComponent, FormsModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  activeTab: string = 'tribe';
  newPostContent: string = '';

  tabs = [
    { key: 'tribe', label: 'Minha Tribo' },
    { key: 'followers', label: 'Seguidores' },
    { key: 'explore', label: 'Explorar' }
  ];
  tribeFeed = [
    {
      user: {
        avatar: 'https://i.pravatar.cc/150?img=21',
        nickname: 'karla.dev',
      },
      content: 'Bem-vindos à tribo! Estamos construindo algo incrível juntos.',
      createdAt: '2025-06-24T10:30:00',
    },
    {
      user: {
        avatar: 'https://i.pravatar.cc/150?img=22',
        nickname: 'lucas.code',
      },
      content: 'Acabei de publicar um novo artigo sobre arquitetura de software!',
      createdAt: '2025-06-23T15:12:00',
    },
    {
      user: {
        avatar: 'https://i.pravatar.cc/150?img=23',
        nickname: 'clara.tech',
      },
      content: 'Qual a stack preferida da galera por aqui?',
      createdAt: '2025-06-22T18:00:00',
    }
  ];

  followersFeed = [
    {
      user: {
        avatar: 'https://i.pravatar.cc/150?img=24',
        nickname: 'joao.dev',
      },
      content: 'Iniciando um novo projeto open source, quem topa colaborar?',
      createdAt: '2025-06-24T08:15:00',
    },
    {
      user: {
        avatar: 'https://i.pravatar.cc/150?img=25',
        nickname: 'bia.codes',
      },
      content: 'Feliz por ter batido a meta de commits da semana 🎯',
      createdAt: '2025-06-23T20:50:00',
    },
    {
      user: {
        avatar: 'https://i.pravatar.cc/150?img=26',
        nickname: 'marco.build',
      },
      content: 'Dica rápida sobre performance com Angular: lazy load tudo!',
      createdAt: '2025-06-22T11:03:00',
    }
  ];

  exploreFeed = [
    {
      user: {
        avatar: 'https://i.pravatar.cc/150?img=27',
        nickname: 'ana.uiux',
      },
      content: 'Tô reformulando meu portfólio, feedbacks são bem-vindos!',
      createdAt: '2025-06-24T13:40:00',
    },
    {
      user: {
        avatar: 'https://i.pravatar.cc/150?img=28',
        nickname: 'ricardo.qa',
      },
      content: 'Testes automatizados salvaram minha vida hoje!',
      createdAt: '2025-06-23T09:30:00',
    },
    {
      user: {
        avatar: 'https://i.pravatar.cc/150?img=29',
        nickname: 'livia.front',
      },
      content: 'Vocês usam Tailwind? Estou amando a liberdade criativa 🔥',
      createdAt: '2025-06-22T17:20:00',
    }
  ];

}
