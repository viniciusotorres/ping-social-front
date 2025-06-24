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
      const firstToast = this.toastr.warning(
        'Bem-vindo! Esta é uma versão de teste, por favor envie seu feedback.',
        'Atenção'
      );


      firstToast.onHidden.subscribe(() => {
        this.toastr.warning(
          'As requisições podem demorar devido ao início do desenvolvimento.',
          'Aviso Importante'
        );
      });
    }, 1000);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        localStorage.setItem('latitude', latitude.toString());
        localStorage.setItem('longitude', longitude.toString());

        this.loginService.login(email, password)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (res) => {
              if (res.token) {
                localStorage.setItem('authToken', res.token);
                localStorage.setItem('email', res.email);
                localStorage.setItem('userId', res.id.toString());
                localStorage.setItem('nickname', res.nickname);
                this.toastr.success('Login efetuado com sucesso!', 'Sucesso');
                this.router.navigate(['/internal']);
              } else if (res.message && res.email) {
                this.toastr.info(res.message, 'Atenção');
                localStorage.setItem('email', res.email);
                this.router.navigate(['auth/activate']);
              } else {
                this.toastr.warning('Resposta inesperada do servidor.', 'Aviso');
                console.warn('Resposta inesperada:', res);
              }
            },
            error: (err) => this.handleLoginError(err)
          });
      },
      (error) => {
        this.isLoading = false;
        this.toastr.warning('Permissão de localização negada. Login continuará normalmente.', 'Aviso');
        this.proceedLoginWithoutLocation(email, password); // fallback
      }
    );
  }


  proceedLoginWithoutLocation(email: string, password: string) {
    this.loginService.login(email, password)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          if (res.token) {
            localStorage.setItem('authToken', res.token);
            this.toastr.success('Login efetuado com sucesso!', 'Sucesso');
            this.router.navigate(['/internal']);
          } else if (res.message && res.email) {
            this.toastr.info(res.message, 'Atenção');
            localStorage.setItem('email', res.email);
            this.router.navigate(['auth/activate']);
          } else {
            this.toastr.warning('Resposta inesperada do servidor.', 'Aviso');
            console.warn('Resposta inesperada:', res);
          }
        },
        error: (err) => this.handleLoginError(err)
      });
  }

  handleLoginError(err: any) {
    const msg = err.error?.message || 'Erro ao tentar logar. Tente novamente.';
    const title = err.status === 401 ? 'Autenticação falhou' : 'Erro';

    this.toastr.error(msg, title);
    console.error('Erro no login:', err);

    if (msg.includes('Senha incorreta')) {
      this.loginForm.get('password')?.setValue('');
      this.loginForm.get('password')?.setErrors({ incorrect: true });

      setTimeout(() => {
        const passwordInput = document.getElementById('password');
        if (passwordInput) passwordInput.focus();
      }, 100);
    }
  }


  goToForgotPassword() {
    this.router.navigate(['auth/forgot-password']);
  }

  goToRegister() {
    this.router.navigate(['auth/register']);
  }

}
