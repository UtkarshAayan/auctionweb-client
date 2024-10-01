import { SellerProductService } from "../../services/seller-product.service";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, Inject, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink, Router } from '@angular/router';
import { BuyerBidService } from "../../services/buyer-bid.service";
import { WishlistService } from "../../services/wishlist.service";
import { log } from "node:console";
import { AdminSettingsService } from "../../services/admin-settings.service";
import { LoaderComponent } from "../../view/loader/loader.component";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink, LoaderComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  buyerBidService = inject(BuyerBidService);
  wishlistService = inject(WishlistService);
  sellerProductService = inject(SellerProductService);
  adminSettingsService = inject(AdminSettingsService);
  router = inject(Router)
  products: any;
  product: any;
  editData: any;
  liveProduct: any;
  liveProducts: any;
  futureProduct: any;
  futureProducts: any;
  userId: any;
  filteredProducts: any[] = [];
  searchTerm: string = '';
  searchProduct: any
  categories: any;
  bannerImages: string[] = [];
  isLoading = false;  // loader flag
  // searching: boolean = true;
  constructor(private sellerProduct: SellerProductService) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');
    // this.getAllVerifiedProduct();
    this.getLiveAuction();
    this.getfutureAuction();
    this.loadCategories();
    this.loadBannerImages();
  }

  getAllVerifiedProduct(): void {
    this.isLoading = true;
    this.buyerBidService.getAllVerifiedproductService() // Pass userId as needed
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.products = res;
          this.filteredProducts = this.products.data;
          console.log(this.products);
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      });
  }

  searchProducts(): void {
    this.filteredProducts = this.products.data.filter((product: { productName: string }) =>
      product.productName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getproductById(id: any) {
    this.sellerProductService.getProductByIdService(id)
      .subscribe(data => {
        this.editData = data
        this.router.navigate(['/bid', this.editData.data._id]);
      })
  }

  getLiveAuction(): void {
    this.isLoading = true;
    this.sellerProduct.liveAuction()
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.liveProduct = res;
          console.log(this.liveProduct)
          this.liveProducts = this.liveProduct.data;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      });
  }

  getfutureAuction(): void {
    this.isLoading = true;
    this.sellerProduct.futureAuction()
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.futureProduct = res;
          console.log(this.futureProduct)
          this.futureProducts = this.futureProduct.data;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      });
  }


  loadCategories(): void {
    this.isLoading = true;
    this.adminSettingsService.getCategories().subscribe({
      next: (cat) => {
        this.isLoading = false;
        this.categories = cat;
        this.categories = this.categories.data
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.isLoading = false;
      }
    });
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
