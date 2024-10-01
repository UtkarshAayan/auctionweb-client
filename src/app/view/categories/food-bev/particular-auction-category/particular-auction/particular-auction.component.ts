import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { BuyerBidService } from '../../../../../services/buyer-bid.service'
import { SellerProductService } from '../../../../../services/seller-product.service';
import { DataSharingService } from '../../../../../services/data-sharing.service';
import { WishlistService } from "../../../../../services/wishlist.service";
import { AdminSettingsService } from "../../../../../services/admin-settings.service";
import { LoaderComponent } from "../../../../../view/loader/loader.component";
import { ToastService } from "../../../../../services/toast.service";

@Component({
  selector: 'app-particular-auction',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule,FormsModule,LoaderComponent],
  templateUrl: './particular-auction.component.html',
  styleUrl: './particular-auction.component.css'
})
export class ParticularAuctionComponent {
  products: any;
  categoryName: any;
  productsArr: any;
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  bannerImages: string[] = [];
  isLoading = false;  // loader flag
  constructor(
    private dataSharingService: DataSharingService, private route: ActivatedRoute
  ) { }

  buyerBidService = inject(BuyerBidService);
  wishlistService = inject(WishlistService);
  adminSettingsService = inject(AdminSettingsService);
  sellerProductService = inject(SellerProductService);
  router = inject(Router)
  userData: any;
  dataArray: any;
  editData: any;
  userId: any;
  categories: any;
  subcategories: any;


  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');
    this.categoryName = this.route.snapshot.paramMap.get('categoryName');
    this.getProductsByCategory();
    this.loadCategorySubcategories();
    this.loadBannerImages();

  }


  getProductsByCategory(): void {
    this.isLoading = true;
    this.adminSettingsService.getProductsByCategory(this.categoryName!, this.currentPage, this.limit, this.searchQuery)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.products = response?.data?.products || [];
          this.totalPages = response?.data?.pagination?.totalPages || 0;
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.isLoading = false;
        }
      });
  }
  

  loadCategorySubcategories(): void {
    this.isLoading = true;
    this.adminSettingsService.getCategoryByName(this.categoryName)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.subcategories = response?.data?.subcategories || [];
          console.log(response);
        },
        error: (err) => {
          console.error('Error loading subcategories:', err);
          this.isLoading = false;
        }
      });
  }
  


  getproductById(id: any) {
    this.sellerProductService.getProductByIdService(id)
      .subscribe(data => {
        this.editData = data
        console.log(this.editData);
        this.router.navigate(['/bid', this.editData.data._id]);
      })
  }

  addProductToWishlist(productId: any) {
    this.wishlistService.addProductToWishlist(this.userId, productId).subscribe({
      next: (res) => {
        alert("Added to Wishlist Successfully");
        console.log("Added to Wishlist  Successfully", res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  searchProducts(): void {
    this.currentPage = 1; // Reset to first page on new search
    this.getProductsByCategory();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.getProductsByCategory();
  }

  loadBannerImages() {
    this.isLoading = true;
    this.adminSettingsService.getBannerImages().subscribe(
      (response) => {
        this.isLoading = false;
        this.bannerImages = response.bannerImages;
        console.log(this.bannerImages)
      },
      (error) => {
        console.log("err");
        this.isLoading = false;
       }
    );
  }


}
