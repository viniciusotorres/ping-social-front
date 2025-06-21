import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './activate.component.html',
  providers: [MessageService]
})
export class ActivateComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  email = '';
  activateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.activateForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]]
    });
  }

  ngOnInit() {
    // Obter e-mail da rota ou do estado de navegação
    this.email = this.route.snapshot.queryParams['email'] || 'seu@email.com';
  }

  moveFocus(event: any, currentIndex: number) {
    const input = event.target;
    const nextIndex = currentIndex + 1;
    const prevIndex = currentIndex - 1;

    // Mover para o próximo campo se um dígito foi inserido
    if (input.value.length === 1 && nextIndex < 4) {
      const nextControl = this.activateForm.get('digit' + (nextIndex + 1));
      if (nextControl) {
        document.getElementById('digit' + (nextIndex + 1))?.focus();
      }
    }

    // Mover para o campo anterior se backspace foi pressionado e o campo está vazio
    if (event.key === 'Backspace' && input.value.length === 0 && prevIndex >= 0) {
      const prevControl = this.activateForm.get('digit' + (prevIndex + 1));
      if (prevControl) {
        document.getElementById('digit' + (prevIndex + 1))?.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text/plain').trim();

    if (clipboardData && clipboardData.length === 4 && /^\d+$/.test(clipboardData)) {
      const digits = clipboardData.split('');
      this.activateForm.patchValue({
        digit1: digits[0],
        digit2: digits[1],
        digit3: digits[2],
        digit4: digits[3]
      });
    }
  }

  getActivationCode(): string {
    return Object.values(this.activateForm.value).join('');
  }

  onSubmit() {
    if (this.activateForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os dígitos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const activationCode = this.getActivationCode();

    // Simulação de chamada API para verificar o código
    setTimeout(() => {
      this.isLoading = false;

      if (activationCode === '1234') { // Código mockado para teste
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Conta ativada com sucesso!'
        });
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Código inválido. Por favor, tente novamente.';
        this.activateForm.reset();
        document.getElementById('digit1')?.focus();
      }
    }, 1500);
  }

  resendCode() {
    this.isLoading = true;

    // Simulação de reenvio de código
    setTimeout(() => {
      this.isLoading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Novo código enviado para seu e-mail!'
      });
    }, 1000);
  }
}
