import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import {LoginService} from '../services/login-service/login.service';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CardModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  isLoading = false;
  loginForm: FormGroup;
  showPassword = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.toastr.warning(
        'Bem-vindo! Esta é uma versão de teste, por favor envie seu feedback.',
        'Atenção'
      );
    }, 1000);
  }



  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.loginService.login(email, password)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          if (res.token) {
            localStorage.setItem('authToken', res.token);
            this.toastr.success('Login efetuado com sucesso!', 'Success');
            this.router.navigate(['/internal']);
          } else if (res.message) {
            this.toastr.info(res.message, 'Atenção');
            localStorage.setItem('email', res.email);
            this.router.navigate(['auth/activate']);
          } else {
            this.toastr.warning('Resposta inesperada do servidor.', 'Aviso');
            console.warn('Resposta inesperada:', res);
          }
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Falha no login. Tente novamente.', 'Erro');
          console.error('Erro no login:', err);
        }
      });
  }


  goToForgotPassword() {
    this.router.navigate(['auth/forgot-password']);
  }

  goToRegister() {
    this.router.navigate(['auth/register']);
  }

}
