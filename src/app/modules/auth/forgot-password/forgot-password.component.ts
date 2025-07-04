import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {ForgotService} from '../services/forgot-service/forgot.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private forgotService: ForgotService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email } = this.forgotPasswordForm.value;
    const emailUser = this.forgotPasswordForm.get('email')?.value;

    sessionStorage.setItem('email', emailUser);

    this.forgotService.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Sucesso');
        this.router.navigate(['/auth/reset-password']);
      },
      error: (error) => {
        this.toastr.error(error.error.message || 'An error occurred. Please try again.');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
