import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminSettingsService } from "../../../services/admin-settings.service";

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {
  adminSettingsService = inject(AdminSettingsService);
  aboutContents: any;
  ngOnInit(): void {
    this.getAboutUsContents();
 }
 getAboutUsContents(): void {
  this.adminSettingsService.getAbout().subscribe({
    next: (data) => {
      this.aboutContents = data?.data?.[0]; // Access the first object in the array
      console.log(this.aboutContents);
    },
    error: (err) => {
      console.log(err);
    }
  });
}
}
