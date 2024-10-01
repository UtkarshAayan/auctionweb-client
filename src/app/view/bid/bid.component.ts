
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SellerProductService } from '../../services/seller-product.service';
import { BuyerBidService } from '../../services/buyer-bid.service'
import { interval, Subscription } from 'rxjs';
import { WishlistService } from "../../services/wishlist.service";
import { LoaderComponent } from "../../view/loader/loader.component";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'app-bid',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule,LoaderComponent],
  templateUrl: './bid.component.html',
  styleUrl: './bid.component.css'
})
export class BidComponent implements OnInit, OnDestroy {
  productId!: any;
  userId!: string;
  sellerProductService = inject(SellerProductService);
  wishlistService = inject(WishlistService);
  buyerBidService = inject(BuyerBidService);
  route = inject(ActivatedRoute);
  editData: any;
  userData1: any;
  userData2: any;
  dataArray: any;
  fb = inject(FormBuilder);
  router = inject(Router)
  bidForm!: FormGroup;
  fb2 = inject(FormBuilder);
  proForm!: FormGroup;
  x: any;
  editData1: any;
  timer: string = '00:00:00';
  timerSubscription: Subscription | null = null;
  editData2: any;
  isLoading = false;  // loader flag
  toastService = inject(ToastService);

  ngOnInit(): void {
    this.proForm = this.fb.group({

      productName: ['', Validators.required],
      category: ['', Validators.required],
      color: ['', Validators.required],
      productDescription: ['', Validators.required],
      productCondition: ['', Validators.required],
      //subcategory:['',Validators.required],
      lotNumber: ['', Validators.required],
      brand: ['', Validators.required],
      startingPrice: ['', Validators.required],
      reservePrice: ['', Validators.required],
      saleTax: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      buyerPremium: ['', Validators.required],
      shipping: ['', Validators.required],
      collect: ['', Validators.required],
      startTime: ['', Validators.required],
      stopTime: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      country: ['', Validators.required],
      uploadDocuments: ['', Validators.required],
    })
  
    this.userId = localStorage.getItem('user_id') || '';
  

    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      this.getProductById(this.productId, this.userId);
    });

    this.bidForm = this.fb.group({
      bidAmount: ['', Validators.required]
    })

  }

  getProductById(productId: string, userId: string): void {
    this.isLoading = true;
    this.sellerProductService.getProductByIdWithWishlistService(productId, userId)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.editData = data;
          this.dataArray = this.editData?.data || {};

          this.startTimer();
  
          // Patch the form with the retrieved product details
          this.proForm.patchValue({
            productName: this.dataArray.productName,
            category: this.dataArray.category,
            color: this.dataArray.color,
            productDescription: this.dataArray.productDescription,
            productCondition: this.dataArray.productCondition,
            contactNumber: this.dataArray.contactNumber,
            brand: this.dataArray.brand,
            startingPrice: this.dataArray.startingPrice,
            reservePrice: this.dataArray.reservePrice,
            startDate: this.dataArray.startDate,
            startTime: this.dataArray.startTime,
            endDate: this.dataArray.endDate,
            stopTime: this.dataArray.stopTime,
            town: this.dataArray.town,
            saleTax: this.dataArray.saleTax,
            buyerPremium: this.dataArray.buyerPremium,
            shipping: this.dataArray.shipping,
            collect: this.dataArray.collect,
            lotNumber: this.dataArray.lotNumber,
            country: this.dataArray.country,
            uploadDocuments: this.dataArray.uploadDocuments,
          });
        },
        error: (err) => {
          console.error('Error fetching product details:', err);
          this.isLoading = false;
        }
      });
  }
  


  //for Buynow Price
  getproductByIdForBuyNow(id: any) {
    this.sellerProductService.getProductByIdService(id)
      .subscribe(data => {
        this.editData1 = data
        localStorage.setItem("buyNowPrice", 'true');
        this.router.navigate(['/purchase-shipping', this.editData1.data._id]);
      })
  }
  //for CurrentBid Price
  getproductByIdForCheckout(id: any) {
    this.sellerProductService.getProductByIdService(id)
      .subscribe(data => {
        this.editData2 = data
        localStorage.setItem("buyNowPrice", 'false');
        this.router.navigate(['/purchase-shipping', this.editData2.data._id]);
      })
  }





  //for timer
  startTimer(): void {
    if (!this.dataArray) return;

    const now = new Date();
    const startTime = new Date(`${this.dataArray.startDate}T${this.dataArray.startTime}`);
    const endTime = new Date(`${this.dataArray.endDate}T${this.dataArray.stopTime}`);

    if (now < startTime || now > endTime) {
      this.timer = '00:00:00';
      return;
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      const currentTime = new Date();
      let remainingTime = endTime.getTime() - currentTime.getTime();
      if (remainingTime <= 0) {
        remainingTime = 0;
        this.timerSubscription?.unsubscribe();
        this.dataArray.status = 'expired';
      }
      this.timer = this.formatTime(remainingTime);
    });
  }

  formatTime(ms: number): string {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${this.pad(days)} Days ${this.pad(hours)} Hours ${this.pad(minutes)} Minutes ${this.pad(seconds)} Seconds`;
  }

  pad(number: number): string {
    return number.toString().padStart(2, '0');
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  submit() {


    const bid = {
      bidAmount: this.bidForm.get('bidAmount')?.value,
      productId: this.productId,
      userId: this.userId
    };

    this.buyerBidService.createBidService(bid)
      .subscribe({
        next: (res) => {
          this.toastService.show('Success', 'Bid placed successfully!');
          window.location.reload();
          this.bidForm.reset();
        },
        error: (err) => {
          this.toastService.show('Failed', 'Bidding Price is Low!');
          console.log(err);
        }
      });
  }

  //wishlisted

  addProductToWishlist(productId: any) {
    this.wishlistService.addProductToWishlist(this.userId, productId).subscribe({
      next: (response) => {
        this.toastService.show('Success', 'Product added to wishlist!');
        this.dataArray.isWishlisted = true;
      },
      error: (error) => {
        console.error('Error adding product to wishlist:', error);
      }
    });
  }

  removeProductFromWishlist(productId: string) {
    this.wishlistService.removeProductFromWishlist(this.userId, productId).subscribe({
      next: (response) => {
        this.toastService.show('Success', 'Product removed to wishlist!');
        this.dataArray.isWishlisted = false;
      },
      error: (error) => {
        console.error('Error removing product from wishlist:', error);
      }
    });
  }


}
