import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StripeService } from '../../../services/stripe.service';
import { Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { LoaderComponent } from "../../../view/loader/loader.component";
import { ToastService } from "../../../services/toast.service";
import { OrderService } from '../../../services/order.service';
@Component({
  selector: 'app-add-cards',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule, LoaderComponent],
  templateUrl: './add-cards.component.html',
  styleUrl: './add-cards.component.css'
})
export class AddCardsComponent {
  orderService = inject(OrderService);
  router = inject(Router)
  transactions: any[] = [];
  // amount: number = 50;  // Default test amount
  route = inject(ActivatedRoute);
  toastService = inject(ToastService);
  stripe!: Stripe | null;
  elements!: StripeElements;
  cardElement!: StripeCardElement;
  stripeService = inject(StripeService);
  order_id!: any
  isLoading = false;  // loader flag
  editData: any;
  dataArray: any;


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.order_id = params.get('id');
      this.getorderById(this.order_id);
    });
    // Fetch all transactions on component load
    this.stripeService.getAllTransactions().subscribe(
      (data) => {
        this.transactions = data;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }
  async ngAfterViewInit() {
    this.stripe = await this.stripeService.loadStripe(); // Load Stripe
    if (!this.stripe) {
      return;
    }

    this.elements = this.stripe.elements();

    // Wait a bit to ensure the DOM has rendered
    setTimeout(() => {
      this.cardElement = this.elements.create('card', {
        hidePostalCode: true, // You can hide postal code input
        style: {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        },
      });

      this.cardElement.mount('#card-element'); // Mount the card element into the HTML div
    }, 100); // Adjust this value if necessary
  }


  async pay() {
    const cardErrorsDiv = document.getElementById('card-errors');
  
    if (cardErrorsDiv) {
      cardErrorsDiv.textContent = '';
    }
  
    try {
   
     
      // Step 1: Create payment intent
      const { clientSecret } = await this.stripeService
        .createPaymentIntent(this.dataArray.finalPrice)
        .toPromise();
  
      // Get the email from input
      const emailInput = (document.getElementById('email') as HTMLInputElement)?.value;
  
      // Step 2: Confirm card payment
      const { error, paymentIntent } = await this.stripe!.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: 'Test User', // Replace with actual user details if needed
            email: emailInput, // Collect email from input
          },
        },
      });
  
      if (error) {
        console.error('Payment Error:', error.message);
        if (cardErrorsDiv) {
          cardErrorsDiv.textContent = error.message || 'An error occurred during payment.';
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Step 3: Payment successful, prepare transaction data
        const transactionData = {
          transactionId: paymentIntent.id,        // Stripe's paymentIntent ID
          email: emailInput,                      // User's email
          status: paymentIntent.status,           // Payment status (succeeded)
          transactionDate: new Date(),            // Current date/time
          amount: this.dataArray.finalPrice,      // Payment amount
          orderId: this.dataArray._id,    // Product/order ID
        };
        // Show loader
        // Step 4: Send transaction data to backend API
        this.orderService.createTransaction(transactionData).subscribe(
          (response) => {
            this.toastService.show('Success', 'Payment successful and transaction saved!');
            this.router.navigate(['/shipping-details']);
          },
          (error) => {
            console.error('Error saving transaction:', error);
            this.toastService.show('Error', 'Payment successful, but transaction saving failed.');
            
          }
        );
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
  


  getorderById(order_id: string): void {

    this.isLoading = true;
    this.orderService.getorderByIdService(order_id)
      .subscribe({
        next: (orderData) => {
          this.isLoading = false;
          this.editData = orderData;
          this.dataArray = this.editData.data;
        
        },
        error: (err) => {
          console.error('Error fetching wishlist:', err);
          this.isLoading = false;
        }
      });
  }




}
