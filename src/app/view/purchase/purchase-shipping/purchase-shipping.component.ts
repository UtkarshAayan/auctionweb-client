
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SellerProductService } from '../../../services/seller-product.service';
import { UsersService } from '../../../services/users.service';
import { OrderService } from '../../../services/order.service';
import { AdminSettingsService } from "../../../services/admin-settings.service";
import { LoaderComponent } from "../../../view/loader/loader.component";
import { ToastService } from "../../../services/toast.service";

@Component({
  selector: 'app-purchase-shipping',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule,LoaderComponent],
  templateUrl: './purchase-shipping.component.html',
  styleUrl: './purchase-shipping.component.css'
})
export class PurchaseShippingComponent {
  usersService = inject(UsersService);
  sellerProductService = inject(SellerProductService);
  adminSettingsService = inject(AdminSettingsService);
  orderService = inject(OrderService);
  editData1: any;
  router = inject(Router)
  route = inject(ActivatedRoute);
  toastService = inject(ToastService);
  dataArray: any;
  fb = inject(FormBuilder);
  addressForm!: FormGroup;
  editAddressForm!: FormGroup;
  showAddAddressForm = false;
  showEditAddressForm = false;
  selectedAddressId: string | null = null;
  userId!: any
  addresses: any;
  selectedAddress: any;
  addressArray: any;
  resData: any;
  resArray: any;
  buyNowPrice: any
  countries: any;
  productId!: any;
  isLoading = false; 

  // sellerAddress: any;
  ngOnInit(): void {

    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required]
    });
    this.editAddressForm = this.fb.group({
      fullName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required]
    });

   // const productId = localStorage.getItem('product_id');
    this.userId = localStorage.getItem('user_id');
    this.buyNowPrice = localStorage.getItem('buyNowPrice');
  
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      this.getproductById1(this.productId);
    });
  //  this.getproductById1(productId)
    this.loadAddresses();
    this.getAllDropdown()
  }

  getproductById1(id: any): void {
    this.isLoading = true;
    this.sellerProductService.getProductByIdService(id)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.editData1 = data;
          this.dataArray = this.editData1?.data || [];
        },
        error: (err) => {
          console.error('Error fetching product by ID:', err);
          this.isLoading = false;
        }
      });
  }
  
  toggleAddAddressForm(): void {
    this.showAddAddressForm = !this.showAddAddressForm;
    this.showEditAddressForm = false;
  }

  toggleEditAddressForm(address: any): void {
    this.showEditAddressForm = true;
    this.showAddAddressForm = false;
    this.selectedAddressId = address._id;
    this.editAddressForm.patchValue(address);
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.usersService.getUserAddresses(this.userId)
      .subscribe({
        next: (addresses) => {
          this.isLoading = false;
          this.addresses = addresses;
          this.addressArray = this.addresses?.data || [];
        },
        error: (err) => {
          console.error('Error loading addresses:', err);
          this.isLoading = false;
        }
      });
  }
  

  addAddress(): void {
    if (this.addressForm.valid) {
      this.usersService.addAddress(this.userId, this.addressForm.value).subscribe(response => {
        this.toastService.show('Success', 'Address created successfully!');
        this.loadAddresses();
        this.showAddAddressForm = false;
      });
    }
  }

  updateAddress(): void {
    if (this.selectedAddressId && this.editAddressForm.valid) {
      this.usersService.updateAddress(this.userId, this.selectedAddressId, this.editAddressForm.value).subscribe(response => {
        this.toastService.show('Success', 'Address updated successfully!');
        this.loadAddresses();
        this.showEditAddressForm = false;
        this.selectedAddressId = null;
      });
    }
  }

  deleteAddress(addressId: string): void {
    this.usersService.deleteAddress(this.userId, addressId).subscribe(response => {
      this.toastService.show('Success', 'Address deleted successfully!');
      this.loadAddresses();
    });
  }

  onAddressSelect(addressId: string): void {
    localStorage.setItem('selectedAddressId', addressId);
    this.usersService.getUserOneAddress(this.userId, addressId).subscribe((data: any) => {
      this.selectedAddress = data;
    });
  }
  //for startingPriceOrder
  createOrder(): void {
   // const productId = localStorage.getItem('product_id');
    const buyerId = localStorage.getItem('user_id');
    const addressId = localStorage.getItem('selectedAddressId');
 
    if (!this.productId || !buyerId) {
      console.error('Missing required information');
      return;
    }
  
    // Use the already fetched product details stored in this.dataArray
    const product = this.dataArray;
  
    // Prepare the order data based on whether shipping is required
    let orderData: any = {
      productId: this.productId,
      buyerId: buyerId,
    };
  
    if (product.shipping) {
      if (!addressId) {
        console.error('Address is required for this product');
        return;
      }
      orderData.addressId = addressId;
    }
  
    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        this.toastService.show('Success', 'Order Summary Created successfully!');
       
        this.resData = res;
        this.resArray = this.resData.data;
        
        // Storing the order ID in local storage for further use
      //  localStorage.setItem("order_id", this.resArray._id);
  
        // Navigate to the order page
       // this.router.navigate(['/order']);
        this.router.navigate(['/order',this.resArray._id]);

      },
      error: (err) => {
        console.error('Error creating order:', err);
      }
    });
  }
  
  
  getAllDropdown() {
    this.adminSettingsService.getCountries()
      .subscribe((res) => {
        this.countries = res
        this.countries = this.countries.data
      })
  }
  //for buynowPriceOrder


  createOrderforBuyNow(): void {
   // const productId = localStorage.getItem('product_id');
    const buyerId = localStorage.getItem('user_id');
    const addressId = localStorage.getItem('selectedAddressId');
    
    if (!this.productId || !buyerId) {
      console.error('Missing required information');
      return;
    }
  
    // Use the already fetched product details stored in this.dataArray
    const product = this.dataArray;
  
    // Prepare the order data based on whether shipping is required
    let orderData: any = {
      productId: this.productId,
      buyerId: buyerId,
    };
  
    if (product.shipping) {
      if (!addressId) {
        console.error('Address is required for this product');
        return;
      }
      orderData.addressId = addressId;
    }
  
    this.orderService.createOrderForBuynow(orderData).subscribe({
      next: (res) => {
        this.toastService.show('Success', 'Order Summary Created successfully!');
       
        this.resData = res;
        this.resArray = this.resData.data;
        
        // Storing the order ID in local storage for further use
       // localStorage.setItem("order_id", this.resArray._id);
  
        // Navigate to the order page
       // this.router.navigate(['/order']);
        this.router.navigate(['/order',this.resArray._id]);
      },
      error: (err) => {
        this.toastService.show('Failed', 'Shipping is not available in this country');
        console.error('Error creating order:', err);
      }
    });
  }
  

}
