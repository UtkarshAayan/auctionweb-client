import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink,Router } from '@angular/router';
import {SellerProductService} from '../../../../services/seller-product.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DropDownService} from '../../../../services/drop-down.service'

@Component({
  selector: 'app-auction-details',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule,HttpClientModule],
  providers: [SellerProductService],
  templateUrl: './auction-details.component.html',
  styleUrl: './auction-details.component.css'
})

export class AuctionDetailsComponent implements OnInit {
  catFb =  inject(FormBuilder);
  fb = inject(FormBuilder);
  sellerProductService = inject(SellerProductService);
  router = inject(Router)
  dropDownService = inject(DropDownService)
  productForm!: FormGroup;
  catForm!: FormGroup;
   // for start price
   startingPrice: string = '';
   copiedStartingPrice: string = '';
  userData: any;
  userArray: any;
  dataArray: any;
  dropData:any;
  dropArray:any;
  dataColor:any;
  dataCondition: any
  dataLot: any;
   copyStartingPrice(value: string) {
     this.copiedStartingPrice = value;
   }
 
   // for reserved price
   reservedPrice: string = '';
   copiedReservedPrice: string = '';
   copyReservedPrice(value: string) {
     this.copiedReservedPrice = value;
   } 
   // timer 
   copyStartTime() {
     const startTimeInput = document.getElementById('exampleInputStartTime') as HTMLInputElement;
     const stopTimeInput = document.getElementById('exampleInputStopTime') as HTMLInputElement;
     stopTimeInput.value = startTimeInput.value;
   }

   copyStopTime() {
     // Implement stop time logic here if needed
   }

   ngOnInit(): void {
    this.productForm = this.fb.group({

      productName: ['',Validators.required],
      category: ['',Validators.required],
      color: ['',Validators.required],
      productDescription: ['',Validators.required],
      productCondition: ['',Validators.required],
      //subcategory:['',Validators.required],
      // lotNumber: ['',Validators.required],
      brand: ['',Validators.required],
      startingPrice: ['',Validators.required],
      reservePrice: ['',Validators.required],
      // saleTax: ['',Validators.required],
      startDate: ['',Validators.required],
      endDate: ['',Validators.required],
      // buyerPremium: ['',Validators.required],
      // shipping: ['',Validators.required],
      // collect: ['',Validators.required],
      startTime: ['',Validators.required],
      stopTime: ['',Validators.required],
      address: ['',Validators.required],
      town: ['',Validators.required],
      country: ['',Validators.required],
      uploadDocuments: ['',Validators.required],
    })
    // this.catForm = this.catFb.group({    
    //    category: ['',Validators.required],
    //   // color: ['',Validators.required],    
      //subcategory:['',Validators.required],
      //lotNumber: ['',Validators.required]
    // })

    this.getAllUsers();
    this.getAllDropdown();
  }

  getAllUsers(){
    this.sellerProductService.getAllproductService()
    .subscribe((res)=>{
     this.userData = res
     this.dataArray= this.userData.data
   
 
    })
  }

  submit(){

    this.sellerProductService.createSellerProductService(this.productForm.value)
    .subscribe({
      next:(res)=>{
        alert("Auction Created")
        this.productForm.reset();
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  //DropdownData
  getAllDropdown(){
    this.dropDownService.getAllDropDownService()
    .subscribe((res)=>{
     this.dropData = res

     this.dropArray= this.dropData.data[0].category
     this.dataColor = this.dropData.data[0].color
     this.dataCondition = this.dropData.data[0].productCondition
     this.dataLot = this.dropData.data[0].lotNumber
  
    //this.userArray = this.userData.data
   
    })
  }

}
