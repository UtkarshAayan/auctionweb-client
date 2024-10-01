import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators,FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { CategoryService } from "../../../services/category.service";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule, RecaptchaModule,
    RecaptchaFormsModule,FormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router)
  authService = inject(AuthService);
  categoryService = inject(CategoryService);
  loginForm!: FormGroup;
  passwordFieldType: string = 'password';

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
      recaptcha: [null, Validators.required],
      rememberMe: [false]
    })
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  resolved(captchaResponse:any) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
  submit() {
    console.log(this.loginForm.value);
    this.authService.loginService(this.loginForm.value)
      .subscribe({
        next: (res) => {
          alert("Login Successfully");
          console.log(res.data.roles);
  
          // Always clear sessionStorage to ensure no data remains
          sessionStorage.clear();
  
          if (this.loginForm.value.rememberMe) {
            localStorage.setItem("user_id", res.data._id);
            localStorage.setItem("token", res.token);
            localStorage.setItem("isAdmin", res.data.isAdmin);
            localStorage.setItem("isBuyer", res.data.isBuyer);
            localStorage.setItem("isSeller", res.data.isSeller);
          } else {
            // Clear localStorage if rememberMe is not checked
            localStorage.clear();
          }
  
          if (res.data.isBuyer) {
            this.router.navigate(['/home']);
            this.categoryService.setHideCategory(false);
          } else {
            this.router.navigate(['/auction']);
            this.categoryService.setHideCategory(true);
          }
          localStorage.setItem('isLoggedIn', 'true');
          this.loginForm.reset();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
  
}
