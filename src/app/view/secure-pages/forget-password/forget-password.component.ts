import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from "../../../services/toast.service";
import { LoaderComponent } from "../../../view/loader/loader.component";


@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule,HttpClientModule,LoaderComponent],
  providers: [AuthService],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  router = inject(Router);
  forgetForm!: FormGroup;
  authService = inject(AuthService);
  isLoading = false;
  submitted = false;

  ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email: ['',Validators.compose([Validators.required, Validators.email])],
    })
  }
  submit(){
    this.submitted = true;
    this.isLoading = true;  
     
    this.authService.sendEmailService(this.forgetForm.value.email)
    .subscribe({
      next: (res)=>{
        this.isLoading = false; 
        this.toastService.show('Success', 'Reset password mail sent successfully!');
        this.forgetForm.reset();
      },
      error: (err)=>{
        this.toastService.show('Failed', 'Failed to send!');
        this.isLoading = false; 
      }
    });
  }
}
