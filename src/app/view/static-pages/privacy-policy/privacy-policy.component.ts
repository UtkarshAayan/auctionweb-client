import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminSettingsService } from "../../../services/admin-settings.service";

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {
  adminSettingsService = inject(AdminSettingsService);
  privacyContents: any;
  ngOnInit(): void {
    this.getPrivacyContents();
 }
 getPrivacyContents(): void {
  this.adminSettingsService.getPrivacy().subscribe({
    next: (data) => {
      this.privacyContents = data;
      this.privacyContents =  this.privacyContents.data;
      
    
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
