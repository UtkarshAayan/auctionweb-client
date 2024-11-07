import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminSettingsService } from "../../../services/admin-settings.service";
import { ToastService } from "../../../services/toast.service";

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.css'
})
export class HelpPageComponent {
  adminSettingsService = inject(AdminSettingsService);
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  helpContents: any;
  requestForm!: FormGroup;
  ngOnInit(): void {
    this.requestForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
    this.getHelpContents();
 }
   
 getHelpContents(): void {
  this.adminSettingsService.getAllHelpContents().subscribe({
    next: (data) => {
      this.helpContents = data;
      this.helpContents =this.helpContents.data
   
    },
    error: (err) => {
      console.log(err);
    }
  });
}

onSubmit() {
  if (this.requestForm.valid) {
    this.adminSettingsService.createRequest(this.requestForm.value)
    .subscribe({
      next: () => {
       
        this.toastService.show('Success', 'Send successfully!');
        this.requestForm.reset();
      
      },
      error: (error) => {
        this.toastService.show('Failed', 'Failed to send');
        console.error('Error uploading product:', error);
      }
    });
  }
}
formatContent(content: string): string {
  // Replace 'MEA Auction' with a hyperlink
  let updatedContent = content.replace('Password Reset ', '<a href="http://localhost/forget-password" target="_blank">Password Reset </a>');
  
  // Replace newline characters with <br> tags for line breaks
  updatedContent = updatedContent.replace(/\n/g, '<br>');

  return updatedContent;
}


}
