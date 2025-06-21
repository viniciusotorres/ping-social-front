import {Component} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';
import {CardModule} from 'primeng/card';
import {CheckboxModule} from 'primeng/checkbox';
import {CommonModule} from '@angular/common';
import {RegisterService} from '../services/register-service/register.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CardModule,
    CheckboxModule,
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  isLoading = false;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
      role: ['ROLE_USER']
    }, {validator: this.passwordsMatchValidator});
  }

  passwordsMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return {mismatch: true};
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastr.error('Por favor, preencha todos os campos corretamente.', 'Erro!');
      return;
    }

    const {email, password, role} = this.registerForm.value;

    this.isLoading = true;
    this.registerService.register({email, password, role}).subscribe({
      next: (res) => {
        this.toastr.success(res.message, 'Sucesso!');
        this.goToLogin();
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Erro ao registrar usuário', 'Erro!');
        this.isLoading = false;
      }
    });
  }


  goToLogin() {
    this.router.navigate(['auth/login']);
  }
}
