import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminSettingsService } from "../../../services/admin-settings.service";

@Component({
  selector: 'app-terms-condition',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './terms-condition.component.html',
  styleUrl: './terms-condition.component.css'
})
export class TermsConditionComponent {
  adminSettingsService = inject(AdminSettingsService);
  termsContents: any;
  ngOnInit(): void {
    this.getTermsContents();
 }
 getTermsContents(): void {
  this.adminSettingsService.getTerms().subscribe({
    next: (data) => {
      this.termsContents = data;
      this.termsContents =  this.termsContents.data;
      console.log(this.termsContents)
      
    
    },
    error: (err) => {
      console.log(err);
    }
  });
}

formatContent(content: string): string {
  return content.replace(/\n/g, '<br>');
}
}
