import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { StripeService } from '../../../services/stripe.service';
import { Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
@Component({
  selector: 'app-add-cards',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule,FormsModule],
  templateUrl: './add-cards.component.html',
  styleUrl: './add-cards.component.css'
})
export class AddCardsComponent {
  router = inject(Router)
  transactions: any[] = [];
  amount: number = 50;  // Default test amount
  stripe!: Stripe | null;
  elements!: StripeElements;
  cardElement!: StripeCardElement;
  stripeService = inject(StripeService);

  ngOnInit(): void {
    // Fetch all transactions on component load
    this.stripeService.getAllTransactions().subscribe(
      (data) => {
        this.transactions = data;
        console.log('Transactions:', this.transactions);
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }
  async ngAfterViewInit() {
    this.stripe = await this.stripeService.loadStripe(); // Load Stripe
    if (!this.stripe) {
      console.error('Stripe.js has not loaded yet.');
      return;
    }

    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card'); // Create card element
    this.cardElement.mount('#card-element'); // Mount the card element into the HTML div
  }

  async pay() {
    const cardErrorsDiv = document.getElementById('card-errors');
  
    if (cardErrorsDiv) {
      cardErrorsDiv.textContent = '';
    }
  
    try {
      // Create payment intent
      const { clientSecret } = await this.stripeService.createPaymentIntent(this.amount).toPromise();
      console.log('Client Secret:', clientSecret); // Log clientSecret for debugging
  
      // Confirm card payment
      const { error, paymentIntent } = await this.stripe!.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: 'Test User' // Replace with actual user details if needed
          }
        }
      });
  
      if (error) {
        console.error('Payment Error:', error.message);
        if (cardErrorsDiv) {
          cardErrorsDiv.textContent = error.message || 'An error occurred during payment.';
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful!', paymentIntent);
        alert('Payment successful!');
        this.router.navigate(['/shipping-details']);
      } else {
        console.error('Payment failed:', paymentIntent);
        if (cardErrorsDiv) {
          cardErrorsDiv.textContent = 'Payment failed. Please try again.';
        }
      }
    } catch (error) {
      console.error('Payment Error:', error);
      if (cardErrorsDiv) {
        cardErrorsDiv.textContent = 'Payment failed. Please try again.';
      }
    }
  }
  
  
  
}
