import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink,ActivatedRoute } from '@angular/router';
import { SellerProductService } from '../../../../services/seller-product.service';
import { UsersService } from '../../../../services/users.service';
import { OrderService } from '../../../../services/order.service';
import { AdminSettingsService } from '../../../../services/admin-settings.service';
import { forkJoin } from 'rxjs';
import { LoaderComponent } from "../../../../view/loader/loader.component";
import { ToastService } from "../../../../services/toast.service";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule,LoaderComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  orderService = inject(OrderService);
  adminSettingsService = inject(AdminSettingsService);
  route = inject(ActivatedRoute);
  editData: any;
  dataArray: any;
  adminArray: any;
  adminData: any;
  salesTaxPrice: any;
  buyerPremiumPrice: any;
  finalPrice: any;
  buyNowPrice: any
  order_id!: any
  isLoading = false;  // loader flag

  ngOnInit(): void {
    // const order_id = localStorage.getItem('order_id');
    // if (order_id) {
    //   this.getOrderAndAdminData(order_id);
    // }
    this.route.paramMap.subscribe(params => {
      this.order_id = params.get('id');
      this.getOrderAndAdminData(this.order_id);
    });
  }

  getOrderAndAdminData(order_id: string) {
    this.isLoading = true;
    forkJoin([
      this.orderService.getorderByIdService(order_id),
      this.adminSettingsService.getSettings()
    ]).subscribe({
      next: ([orderData, adminData]) => {
        this.isLoading = false;
        this.editData = orderData;
        this.dataArray = this.editData.data;
        console.log(this.dataArray)
        this.adminData = adminData;
        this.adminArray = this.adminData.data;
        this.calculateFinalPrice();
      },
      error: (error) => {
        console.error('Error fetching data', error);
        this.isLoading = false;
      }
    });
  }

  calculateFinalPrice() {
    let finalPrice = this.dataArray.currentBid;
    this.buyNowPrice = localStorage.getItem('buyNowPrice');

    // Check if buyNowPrice is not null, undefined, or an empty string
    if (this.buyNowPrice == 'true') {
      finalPrice = this.dataArray.product.buyNowPrice
      ; // Convert buyNowPrice to a number if necessary
    }

    if (this.dataArray.product.saleTax) {
      this.salesTaxPrice = (this.dataArray.product.startingPrice * this.adminArray.saleTax) / 100;
      finalPrice += this.salesTaxPrice;
    }

    if (this.dataArray.product.buyerPremium) {
      this.buyerPremiumPrice = (this.dataArray.product.startingPrice * this.adminArray.buyerPremium) / 100;
      finalPrice += this.buyerPremiumPrice;
    }

    // Add the shipping price if it exists
    // this.finalPrice = finalPrice + (this.dataArray.product.shippingPrice || 0);
  }

}