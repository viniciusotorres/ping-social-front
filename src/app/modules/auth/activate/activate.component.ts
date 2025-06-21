import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import {ActivateService} from '../services/activate-service/activate.service';
import {ToastrService} from 'ngx-toastr';

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
    private messageService: MessageService,
    private activateService: ActivateService,
    private toastr: ToastrService
  ) {
    this.activateForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]]
    });
  }

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
  }

  moveFocus(event: any, currentIndex: number) {
    const input = event.target;
    const nextIndex = currentIndex + 1;
    const prevIndex = currentIndex - 1;

    if (input.value.length === 1 && nextIndex < 4) {
      const nextControl = this.activateForm.get('digit' + (nextIndex + 1));
      if (nextControl) {
        document.getElementById('digit' + (nextIndex + 1))?.focus();
      }
    }

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

    const code = this.getActivationCode();

    this.activateService.activate(this.email, code).subscribe({
      next: (res: string) => {
        if (res.includes('Usuário ativado com sucesso')) {
          this.toastr.success(res, 'Sucesso');
          localStorage.removeItem('email');
          this.router.navigate(['/internal']);
        } else {
          this.toastr.error(res, 'Erro');
          this.activateForm.reset();
          document.getElementById('digit1')?.focus();
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Falha ao ativar a conta. Tente novamente.', 'Erro');
      },
      complete: () => this.isLoading = false
    });

  }

}
