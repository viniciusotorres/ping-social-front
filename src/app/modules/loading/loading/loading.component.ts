import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  loadingPhrases: string[] = [
    'Carregando histórias compartilhadas...',
    'Buscando novas conexões...',
    'Transmitindo boas vibrações...',
    'Chamando a galera para a roda...',
    'Espalhando boas energias...',
  ];
  currentPhrase: string = this.loadingPhrases[0];
  private phraseIndex = 0;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.setIntervalPhrases();
    this.setIntervalToGoToLogin();
  }

  setIntervalPhrases(): void {
    setInterval(() => {
      this.phraseIndex = (this.phraseIndex + 1) % this.loadingPhrases.length;
      this.currentPhrase = this.loadingPhrases[this.phraseIndex];
    }, 1500);
  }

  setIntervalToGoToLogin(): void {
    setTimeout(() => {
      this.router.navigate(['/auth']);
    }, 5000);
  }
}
