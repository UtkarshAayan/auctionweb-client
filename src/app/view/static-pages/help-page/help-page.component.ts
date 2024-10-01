import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminSettingsService } from "../../../services/admin-settings.service";
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
      console.log(this.helpContents)
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
        alert("Sent Successfully");
        this.requestForm.reset();
      
      },
      error: (error) => {
        console.error('Error uploading product:', error);
      }
    });
  }
}
}
