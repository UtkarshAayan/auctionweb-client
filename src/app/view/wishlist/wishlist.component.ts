import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { WishlistService } from '../../services/wishlist.service';
import { SellerProductService } from "../../services/seller-product.service";
import { LoaderComponent } from "../../view/loader/loader.component";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule,LoaderComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  editData: any;
  userId: any;
  sellerProductService = inject(SellerProductService);
  router = inject(Router)
  editData1: any;
  isLoading = false;  // loader flag
  ngOnInit(): void {
     this.userId = localStorage.getItem('user_id');
    if (this.userId) {
      this.getWishlistById(this.userId);
    }
  }

  getWishlistById(id: any): void {
    this.isLoading = true;
    this.wishlistService.getWishlistByIdService(id)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.editData = data?.data?.products || [];
          console.log(this.editData);
        },
        error: (err) => {
          console.error('Error fetching wishlist:', err);
          this.isLoading = false;
        }
      });
  }
  

  removeProduct(productId: string) {
    this.wishlistService.removeProductFromWishlist(this.userId, productId
    ) .subscribe({
      next: (res) => {
        alert("Removed Successfully");
        console.log("Removed Successfully",res); 
        this.getWishlistById(this.userId);    
      },
      error: (err) => {
        console.log(err);
      }
    });
    


  }

  getproductById(id: any) {
    this.sellerProductService.getProductByIdService(id)
      .subscribe(data => {
        this.editData1 = data
        this.router.navigate(['/bid', this.editData1.data._id]);
      })
  }
}
