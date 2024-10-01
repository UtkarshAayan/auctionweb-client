import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SellerProductService } from '../../../services/seller-product.service';
import {BuyerBidService} from '../../../services/buyer-bid.service'
import { LoaderComponent } from "../../../view/loader/loader.component";

@Component({
  selector: 'app-sellers-bidders-of-items',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule,HttpClientModule,LoaderComponent],
  templateUrl: './sellers-bidders-of-items.component.html',
  styleUrl: './sellers-bidders-of-items.component.css'
})
export class SellersBiddersOfItemsComponent {
  @Input() auctionId!: string;
  sellerProductService = inject(SellerProductService);
  editData: any;
  dataArray: any;
  productId!: any
  isLoading = false;  // loader flag
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  proForm!: FormGroup;
  ngOnInit(): void {
    this.proForm = this.fb.group({

      productName: ['', Validators.required],
      category: ['', Validators.required],
      color: ['', Validators.required],
      productDescription: ['', Validators.required],
      productCondition: ['', Validators.required],
      //subcategory:['',Validators.required],
      lotNumber: ['',Validators.required],
      brand: ['', Validators.required],
      startingPrice: ['', Validators.required],
      reservePrice: ['', Validators.required],
      saleTax: ['',Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
       buyerPremium: ['',Validators.required],
      shipping: ['',Validators.required],
      collect: ['',Validators.required],
      startTime: ['', Validators.required],
      stopTime: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      country: ['', Validators.required],
      uploadDocuments: ['', Validators.required],
    })

    // const productId = localStorage.getItem('product_id');
    // console.log(productId)

    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      this.getproductById(this.productId)
    });
  }



  getproductById(id: string): void {
    this.isLoading = true;
  
    this.sellerProductService.getProductByIdService(id).subscribe({
      next: (data) => {
        this.isLoading = false;  // Stop loading indicator
        this.editData = data
        this.dataArray = this.editData.data
        const { productName, category, color, productDescription, productCondition, contactNumber, brand, startingPrice, reservePrice, startDate, endDate, stopTime, town, saleTax, buyerPremium, shipping, collect, lotNumber, country, uploadDocuments } = this.editData?.data || {};
  
        // Use patchValue to update the form with the retrieved data
        this.proForm.patchValue({
          productName: productName || '',
          category: category || '',
          color: color || '',
          productDescription: productDescription || '',
          productCondition: productCondition || '',
          contactNumber: contactNumber || '',
          brand: brand || '',
          startingPrice: startingPrice || 0,
          reservePrice: reservePrice || 0,
          startDate: startDate || '',
          endDate: endDate || '',
          stopTime: stopTime || '',
          town: town || '',
          saleTax: saleTax || 0,
          buyerPremium: buyerPremium || 0,
          shipping: shipping || false,
          collect: collect || false,
          lotNumber: lotNumber || '',
          country: country || '',
          uploadDocuments: uploadDocuments || [],
        });
  
        console.log(this.proForm.value);  // Log the form data for debugging
      },
      error: (err) => {
        this.isLoading = false;  // Stop loading on error
        console.error('Error fetching product data:', err);
        // Optionally, show an error message to the user
      },
      complete: () => {
        console.log('Product data fetching complete');  // Optional complete handler
      }
    });
  }
  
}
