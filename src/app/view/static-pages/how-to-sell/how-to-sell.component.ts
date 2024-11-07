import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminSettingsService } from "../../../services/admin-settings.service";
@Component({
  selector: 'app-how-to-sell',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './how-to-sell.component.html',
  styleUrl: './how-to-sell.component.css'
})
export class HowToSellComponent {
  adminSettingsService = inject(AdminSettingsService);
  sellContents: any;
  ngOnInit(): void {
    this.getSellContents();
 }
 getSellContents(): void {
  this.adminSettingsService.getContentsSell().subscribe({
    next: (data) => {
      this.sellContents = data;
      this.sellContents =  this.sellContents.data;
      
     
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
