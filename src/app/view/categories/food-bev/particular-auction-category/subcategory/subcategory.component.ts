import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink,Router, ActivatedRoute } from '@angular/router';
import {BuyerBidService} from '../../../../../services/buyer-bid.service'
import { SellerProductService } from '../../../../../services/seller-product.service';
import { DataSharingService } from '../../../../../services/data-sharing.service';
import { WishlistService } from "../../../../../services/wishlist.service";
import { AdminSettingsService } from "../../../../../services/admin-settings.service";
import { LoaderComponent } from "../../../../../view/loader/loader.component";
import { ToastService } from "../../../../../services/toast.service";

@Component({
  selector: 'app-subcategory',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule,HttpClientModule,FormsModule,LoaderComponent],
  templateUrl: './subcategory.component.html',
  styleUrl: './subcategory.component.css'
})
export class SubcategoryComponent {
  router = inject(Router)
  products: any;
  categoryName: any;
  subcategoryName: any;
  editData: any;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  searchQuery: string = '';
  bannerImages: string[] = [];
  isLoading = false;  // loader flag

  constructor(private route: ActivatedRoute, private adminSettingsService: AdminSettingsService, private sellerProductService: SellerProductService) { }

 ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('categoryName');
      this.subcategoryName = params.get('subcategoryName');
      this.getProductsBySubcategory();
      this.loadBannerImages();
    });
  }


  getProductsBySubcategory(): void {
    this.isLoading = true;
    if (this.categoryName && this.subcategoryName) {
      this.adminSettingsService.getProductsBySubcategory(this.categoryName, this.subcategoryName, this.currentPage, this.limit, this.searchQuery)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            this.products = res?.data?.products || [];
            this.totalPages = res?.data?.pagination?.totalPages || 0;
          },
          error: (err) => {
            console.error('Error loading products by subcategory:', err);
            this.isLoading = false;
          }
        });
    }
  }
  

  searchProducts(): void {
    this.currentPage = 1; 
    this.getProductsBySubcategory();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.getProductsBySubcategory();
  }

  getproductById(id:any){
    this.sellerProductService.getProductByIdService(id)
    .subscribe(data=>{
      this.editData = data
      this.router.navigate(['/bid', this.editData.data._id]);
    })
  }

  loadBannerImages() {
    this.isLoading = true;
    this.adminSettingsService.getBannerImages().subscribe(
      (response) => {
        this.isLoading = false;
        this.bannerImages = response.bannerImages;
      
      },
      (error) => {
        console.log("err");
        this.isLoading = false;
       }
    );
  }

}
