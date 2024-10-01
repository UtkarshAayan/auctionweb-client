
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SellerProductService } from '../../../../services/seller-product.service';
@Component({
  selector: 'app-view-auction',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './view-auction.component.html',
  styleUrl: './view-auction.component.css'
})



export class ViewAuctionComponent {
  sellerProductService = inject(SellerProductService);
  editData: any;
  userData1: any;
  userData2: any;
  ngOnInit(): void {
    const productId = localStorage.getItem('product_id');
    console.log(productId)
    this.getproductById(productId)
  }
  getproductById(id:any){
    this.sellerProductService.getProductByIdService(id)
    .subscribe(data=>{
      this.editData = data
      console.log(this.editData);
    })
  }

}
