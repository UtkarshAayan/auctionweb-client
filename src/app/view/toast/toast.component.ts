import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  toastService = inject(ToastService);

  showToast: boolean = false;
  toastTitle: string = '';
  toastMessage: string = '';
  toastTime: string = '';

  
  ngOnInit(): void {
    // Subscribe to the toast service observables
    this.toastService.showToast$.subscribe(show => this.showToast = show);
    this.toastService.toastTitle$.subscribe(title => this.toastTitle = title);
    this.toastService.toastMessage$.subscribe(message => this.toastMessage = message);
    this.toastService.toastTime$.subscribe(time => this.toastTime = time);
  }

  // Method to close the toast manually
  closeToast(): void {
    this.toastService.hide();
  }

}
