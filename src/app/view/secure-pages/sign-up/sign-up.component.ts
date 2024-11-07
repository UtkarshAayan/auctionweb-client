
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from "../../../services/toast.service";
import { LoaderComponent } from "../../../view/loader/loader.component";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule,LoaderComponent],
  providers: [AuthService],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router)
  userForm!: FormGroup;
  toastService = inject(ToastService);
  isLoading = false;
  submitted = false;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Name should have a minimum length
      username: ['', [Validators.required, Validators.minLength(3)]], // Username should have a minimum length
      email: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', [Validators.required, Validators.minLength(8)]], // Minimum length for password
      role: ['', Validators.required], // Role is required
      iAgree: [false, Validators.requiredTrue] // Checkbox for T&C
    });
  }

  openInNewTab(url: string) {
    window.open(url, '_blank');
  }
  

  // A utility function to check if the form field is valid and touched
  isFieldInvalid(field: string) {
    return this.userForm.controls[field].invalid && (this.userForm.controls[field].dirty || this.userForm.controls[field].touched);
  }

  submit() {
    this.submitted = true;
    
    if (this.userForm.invalid) {
      // If form is invalid, mark all controls as touched to display validation errors
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.userForm.value;

    if (formData.role === 'buyer') {
      this.isLoading = true;  
      this.authService.createBuyerService(formData).subscribe({
        next: (res) => {
          this.isLoading = false; 
          this.toastService.show('Success', 'Your buyer account is created!');
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false; 
        }
      });
    } else if (formData.role === 'seller') {
      this.isLoading = true; 
      this.authService.createSellerService(formData).subscribe({
        next: (res) => {
          this.isLoading = false; 
          this.toastService.show('Success', 'Your seller account is created!');
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false; 
        }
      });
    }
  }
}

