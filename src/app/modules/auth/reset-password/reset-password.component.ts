import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {ForgotService} from '../services/forgot-service/forgot.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  email = '';
  token = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private forgotService: ForgotService
  ) {
    this.resetPasswordForm = this.fb.group({
      email: [''],
      code: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    const storedEmail = sessionStorage.getItem('email');
    this.resetPasswordForm.get('email')?.setValue(storedEmail);
  }

  passwordsMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, code, newPassword } = this.resetPasswordForm.value;

    this.forgotService.resetPassword(email, code, newPassword).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Sucesso');
        sessionStorage.removeItem('email');
        this.router.navigate(['/auth/login']);
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
