import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ActivateService } from '../services/activate-service/activate.service';
import { ToastrService } from 'ngx-toastr';

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
  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef>;

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

  ngAfterViewInit() {
    // Foca no primeiro campo quando a view é carregada
    this.focusInput(0);
  }

  focusInput(index: number) {
    setTimeout(() => {
      if (this.digitInputs && this.digitInputs.toArray()[index]) {
        this.digitInputs.toArray()[index].nativeElement.focus();
      }
    });
  }

  moveFocus(event: any, currentIndex: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Permite apenas números
    if (value && !/^\d+$/.test(value)) {
      input.value = '';
      return;
    }

    // Atualiza o form control
    this.activateForm.get(`digit${currentIndex + 1}`)?.setValue(value);

    // Se um dígito foi digitado, move para o próximo campo
    if (value && value.length === 1) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < 4) {
        this.focusInput(nextIndex);
      }
    }

    // Trata backspace
    if (event.key === 'Backspace' && !value) {
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        this.focusInput(prevIndex);
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
      // Foca no último campo após colar
      this.focusInput(3);
    }
  }

  handleKeyDown(event: KeyboardEvent, currentIndex: number) {
    const input = event.target as HTMLInputElement;

    // Permite apenas números, backspace e tab
    if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Delete|Tab/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Trata backspace quando o campo está vazio
    if (event.key === 'Backspace' && input.value === '') {
      event.preventDefault();
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        this.focusInput(prevIndex);
        // Limpa o valor do campo anterior
        this.activateForm.get(`digit${prevIndex + 1}`)?.setValue('');
      }
    }
  }

  getActivationCode(): string {
    return Object.values(this.activateForm.value).join('');
  }

  onSubmit() {
    if (this.activateForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os dígitos';
      this.focusInput(0);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const code = this.getActivationCode();

    this.activateService.activate(this.email, code).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Sucesso');
          localStorage.removeItem('email');
          this.router.navigate(['/internal']);
        } else {
          // Mostra toast de erro apenas se houver mensagem de erro
          if (res.message) {
            this.toastr.error(res.message, 'Erro');
          } else {
            this.toastr.error('Ocorreu um erro ao ativar sua conta', 'Erro');
          }
          this.activateForm.reset();
          this.focusInput(0);
        }
      },
      error: (err) => {
        // Trata diferentes formatos de erro
        const errorMsg = err.error?.message ||
          err.message ||
          'Falha ao ativar a conta. Tente novamente.';
        this.toastr.error(errorMsg, 'Erro');
        this.focusInput(0);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
