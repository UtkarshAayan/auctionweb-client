import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule,HttpClientModule],
  providers: [AuthService],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  forgetForm!: FormGroup;
  authService = inject(AuthService);
  ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email: ['',Validators.compose([Validators.required, Validators.email])],
    })
  }
  submit(){
    console.log(this.forgetForm.value);
    this.authService.sendEmailService(this.forgetForm.value.email)
    .subscribe({
      next: (res)=>{
        alert(res.message);
        this.forgetForm.reset();
      },
      error: (err)=>{
        alert(err.error.message);
      }
    });
  }
}
