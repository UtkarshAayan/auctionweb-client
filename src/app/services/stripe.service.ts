import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private stripePromise: Promise<Stripe | null>;
  constructor(private http: HttpClient) { 
    this.stripePromise = loadStripe('pk_test_51Px4vBDcRywLwCxuiEpYqhKJkbs5BR3FRED9yek3zviZ6smZMuOpFcM9hEMYDgglhyQUlIuVmpzyGXwcPylTucDm00Gfxkcs88'); 
  }
  loadStripe() {
    return this.stripePromise;
  }

  createPaymentIntent(amount: number): Observable<any> {
    return this.http.post('https://www.menaauctions.com/api/payments/create-payment-intent', { amount });
  }
  getAllTransactions(): Observable<any> {
    return this.http.get('https://www.menaauctions.com/api/payments/transactions'); // Adjust URL if needed
  }

  
  
}
