import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminSettingsService } from "../../../services/admin-settings.service";
@Component({
  selector: 'app-how-to-buy',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './how-to-buy.component.html',
  styleUrl: './how-to-buy.component.css'
})
export class HowToBuyComponent {
  adminSettingsService = inject(AdminSettingsService);
  buyContents: any;
  ngOnInit(): void {
    this.getBuyContents();
 }
 getBuyContents(): void {
  this.adminSettingsService.getContentsBuy().subscribe({
    next: (data) => {
      this.buyContents = data;
      this.buyContents =this.buyContents.data
    
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
