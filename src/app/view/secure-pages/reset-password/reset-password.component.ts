import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { confirmPasswordValidator } from '../../../validators/confirm-password';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule,HttpClient  } from '@angular/common/http';
import { ToastService } from "../../../services/toast.service";
import { LoaderComponent } from "../../../view/loader/loader.component";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule,HttpClientModule,LoaderComponent],
  providers: [AuthService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  toastService = inject(ToastService);
  resetForm!: FormGroup;
  token!: string;
  isLoading = false;
  submitted = false;
  authService = inject(AuthService);
  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: confirmPasswordValidator('password', 'confirmPassword')
      });

    this.activatedRoute.params.subscribe(val => {
      this.token = val['token'];
      console.log(this.token);
    });
  }

  submit() {
    this.submitted = true;
    this.isLoading = true;  
    
    let resetObj = {
      token: this.token,
      password: this.resetForm.value.password
    }
    this.authService.resetPasswordService(resetObj)
      .subscribe(
        {
          next: (res) => {
            this.isLoading = false; 
            this.toastService.show('Success', 'Reset password successfully!');
            this.resetForm.reset();
            this.router.navigate(['login']);
          },
          error: (err) => {
            this.toastService.show('Failed', 'Failed!');
            this.isLoading = false; 
          }
        })
  }
}
