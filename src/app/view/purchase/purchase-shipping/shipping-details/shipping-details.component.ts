import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipping-details',
  standalone: true,
  imports: [],
  templateUrl: './shipping-details.component.html',
  styleUrl: './shipping-details.component.css'
})
export class ShippingDetailsComponent {
  router = inject(Router)
  navigateToHome() {
    this.router.navigate(['/']);  // Adjust the route as per your app structure
  }
}
