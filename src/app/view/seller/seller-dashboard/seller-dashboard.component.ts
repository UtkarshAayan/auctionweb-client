import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { AuthService } from '../../../services/auth.service';
import { SellerProductService } from '../../../services/seller-product.service';
import { AdminSettingsService } from "../../../services/admin-settings.service";
import { DropDownService } from '../../../services/drop-down.service'
import { OrderService } from '../../../services/order.service'
import { LoaderComponent } from "../../../view/loader/loader.component";
import { ToastService } from "../../../services/toast.service";

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule,LoaderComponent],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent {
  @Input() proId: string | null = null;
  authService = inject(AuthService);
  dropDownService = inject(DropDownService)
  adminSettingsService = inject(AdminSettingsService);
  orderService = inject(OrderService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);
  router = inject(Router)
  usersService = inject(UsersService);
  sellerProductService = inject(SellerProductService);
  profileForm!: FormGroup;
  isLoading = false;  // loader flag
  editData: any;
  userData: any;
  userArray: any;
  userData1: any;
  userData2: any;
  editData1: any;
  editData2: any;
  dropArray: any;
  proForm!: FormGroup;
  copiedStartingPrice: string = '';
  dropData: any;
  dataColor: any;
  dataCondition: any
  dataLot: any;
  userId: any
  selectedImages: File[] = [];
  dataArray: any;
  selectedDoc: File[] = [];
  countries: any;
  noProductsFound: boolean = false;
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  sellerpro: any
  passwordFieldType: string = 'password';
  totalOrders: number = 0;
  currentPage2: number = 1;
  totalPages2: number = 0;
  limit: number = 5;  // Set limit per page

  orders: any;
  orderData: any;

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
      shipping: ['false', Validators.required],
      collect: ['', Validators.required],
      startTime: ['', Validators.required],
      stopTime: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      comment: ['', Validators.required],
      country: ['', Validators.required],
      uploadDocuments: ['', Validators.required],
      essentialDocs: ['', Validators.required],
      buyNowPrice: ['', Validators.required],
      shippingDetails: this.fb.array([]),
      dynamicFields: this.fb.array([])
    })
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    })
    this.userId = localStorage.getItem('user_id');
    console.log(this.userId)
    if (this.userId) {
      this.usersService.getUserByIdService(this.userId)
        .subscribe(data => {
          this.userData1 = data
          this.userData2 = this.userData1.data
          console.log(this.userData2);
        })
    }

    this.getAllCountries();
    this.getUserById(this.userId)
    this.getproductByUser();
    if (this.proId) {
      this.getproductById(this.proId);
    }
    this.getAllDropdown();
    this.loadOrders();
  }
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onFileChanged(event: any): void {
    this.selectedImages = Array.from(event.target.files);
    this.proForm.patchValue({ uploadDocuments: this.selectedImages.length > 0 ? this.selectedImages : '' });
  }
  onDocChanged(event: any): void {
    this.selectedDoc = Array.from(event.target.files);
    this.proForm.patchValue({ essentialDocs: this.selectedDoc.length > 0 ? this.selectedDoc : '' });
  }


  clickAddMember() {
    this.resetForm();
  }
  resetForm(): void {
    this.proForm.reset();
    this.selectedImages = [];
    this.proId = null;
  }
  //DropdownData
  getAllDropdown() {
    this.dropDownService.getAllDropDownService()
      .subscribe((res) => {
        this.dropData = res
        console.log(this.dropData)
        this.dropArray = this.dropData.data[0].category
        this.dataColor = this.dropData.data[0].color
        this.dataCondition = this.dropData.data[0].productCondition
        this.dataLot = this.dropData.data[0].lotNumber
        console.log(this.dropArray)
        console.log("hi" + this.dataColor)

      })
  }

  getAllCountries(): void {
    this.adminSettingsService.getCountries().subscribe(res => {
      this.countries = res;
      this.countries = this.countries.data
    });
  }
  removeShippingDetail(index: number): void {
    const control = this.proForm.get('shippingDetails') as FormArray;
    const removedCountry = control.at(index).get('country')?.value;
    if (removedCountry) {
      this.enableCountryOption(removedCountry);
    }
    control.removeAt(index);
  }

  get shippingDetails(): FormArray {
    return this.proForm.get('shippingDetails') as FormArray;
  }

  addShippingDetail(): void {
    const shippingDetailForm = this.fb.group({
      country: ['', Validators.required],
      shippingPrice: ['', Validators.required]
    });
    this.shippingDetails.push(shippingDetailForm);
  }

  onShippingChange(isEnabled: boolean): void {
    const shippingControl = this.proForm.get('shipping');
    if (shippingControl) {
      shippingControl.setValue(isEnabled ? 'true' : 'false');

      if (isEnabled) {
        // When shipping is enabled, ensure we have an empty array for shipping details
        this.shippingDetails.clear();
      } else {
        // When shipping is disabled, clear shipping details
        this.shippingDetails.clear();
      }
    }
  }

  get isShippingEnabled(): boolean {
    return this.proForm.get('shipping')?.value === 'true';
  }

  // Helper method to get selected countries
  getSelectedCountries(): Set<string> {
    const selectedCountries = new Set<string>();
    this.shippingDetails.controls.forEach(control => {
      const country = control.get('country')?.value;
      if (country) {
        selectedCountries.add(country);
      }
    });
    return selectedCountries;
  }

  // Disable country options that are already selected
  isCountryDisabled(country: string): boolean {
    return this.getSelectedCountries().has(country);
  }

  // Enable a previously selected country option
  enableCountryOption(country: string): void {
    const selectedCountries = this.getSelectedCountries();
    selectedCountries.delete(country);
  }

  get dynamicFields(): FormArray {
    return this.proForm.get('dynamicFields') as FormArray;
  }

  addDynamicField() {
    console.log('Adding dynamic field');
    const dynamicFieldForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
    this.dynamicFields.push(dynamicFieldForm);
  }

  removeDynamicField(index: number) {
    console.log(`Removing dynamic field at index ${index}`);
    this.dynamicFields.removeAt(index);
  }


  submit() {


    const formData = new FormData();
    formData
      .append('productName', this.proForm.get('productName')?.value,

      );
    formData
      .append('category', this.proForm.get('category')?.value,

      );
    formData
      .append('color', this.proForm.get('color')?.value,
      );
    formData
      .append('productDescription', this.proForm.get('productDescription')?.value,
      );
    formData
      .append('productCondition', this.proForm.get('productCondition')?.value,
      );
    formData
      .append('lotNumber', this.proForm.get('lotNumber')?.value,
      );
    formData
      .append('brand', this.proForm.get('brand')?.value,
      );
    formData
      .append('startingPrice', this.proForm.get('startingPrice')?.value,
      );
    formData
      .append('reservePrice', this.proForm.get('reservePrice')?.value,
      );
    formData
      .append('startDate', this.proForm.get('startDate')?.value,
      );
    formData
      .append('endDate', this.proForm.get('endDate')?.value,
      );
    formData
      .append('saleTax', this.proForm.get('saleTax')?.value,
      );
    formData
      .append('buyerPremium', this.proForm.get('buyerPremium')?.value,
      );
    formData
      .append('shipping', this.proForm.get('shipping')?.value,
      );
    formData
      .append('collect', this.proForm.get('collect')?.value,
      );
    formData
      .append('startTime', this.proForm.get('startTime')?.value,
      );
    formData
      .append('stopTime', this.proForm.get('stopTime')?.value,
      );
    formData
      .append('town', this.proForm.get('town')?.value,
      );
    formData
      .append('comment', this.proForm.get('comment')?.value,
      );
    formData
      .append('address', this.proForm.get('address')?.value,
      );
    formData
      .append('country', this.proForm.get('country')?.value,
      );
    formData
      .append('buyNowPrice', this.proForm.get('buyNowPrice')?.value,
      );
    const shippingDetails = this.proForm.get('shippingDetails')?.value.map((detail: any) => ({
      country: detail.country,
      shippingPrice: Number(detail.shippingPrice)  // Convert to number
    }));

    if (shippingDetails && shippingDetails.length > 0) {
      formData.append('shippingDetails', JSON.stringify(shippingDetails));  // Serialize to JSON string
    } else {
      console.warn('Shipping details are invalid or missing');
    }



    formData.append('dynamicFields', JSON.stringify(this.proForm.get('dynamicFields')?.value));  // Add this line

    this.selectedImages.forEach(file => {
      formData.append('uploadDocuments', file, file.name);
    });
    this.selectedDoc.forEach(file => {
      formData.append('essentialDocs', file, file.name);
    });


    if (this.proId) {
      // Update user
      this.sellerProductService.updateProductService(this.proId, formData).subscribe({
        next: (res) => {
          this.toastService.show('Success', 'Product updated successfully!');
          this.selectedImages = [];
          this.selectedDoc = [];
          console.log(this.proForm.value)
          this.resetForm();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
    console.log("ss")
    // localStorage.clear();
    // this.router.navigate(['login'])
  }

  getproductById(id: any) {
    this.sellerProductService.getProductByIdService(id)
      .subscribe(data => {
        this.editData = data
        this.proId = this.editData.data._id;
        localStorage.setItem("product_id", this.editData.data._id);
        this.dataArray = this.editData.data
        console.log(this.dataArray);
        this.proForm.patchValue({
          productName: this.editData.data.productName,
          category: this.editData.data.category,
          color: this.editData.data.color,
          productDescription: this.editData.data.productDescription,
          productCondition: this.editData.data.productCondition,
          contactNumber: this.editData.data.contactNumber,
          brand: this.editData.data.brand,
          startingPrice: this.editData.data.startingPrice,
          reservePrice: this.editData.data.reservePrice,
          startDate: new Date(this.editData.data.startDate).toISOString().substring(0, 10),
          endDate: new Date(this.editData.data.endDate).toISOString().substring(0, 10),
          stopTime: this.editData.data.stopTime,
          startTime: this.editData.data.startTime,
          town: this.editData.data.town,
          comment: this.editData.data.comment,
          address: this.editData.data.address,
          lotNumber: this.editData.data.lotNumber,
          country: this.editData.data.country,
          uploadDocuments: this.editData.data.uploadDocuments,
          essentialDocs: this.editData.data.essentialDocs,
          buyNowPrice: this.editData.data.buyNowPrice
        })
        const dynamicFieldsArray = this.proForm.get('dynamicFields') as FormArray;
        dynamicFieldsArray.clear();

        // Add dynamic fields from the data
        this.editData.data.dynamicFields.forEach((field: any) => {
          const dynamicFieldForm = this.fb.group({
            key: [field.key, Validators.required],
            value: [field.value, Validators.required]
          });
          dynamicFieldsArray.push(dynamicFieldForm);
        });

        const shippingDetailsArray = this.proForm.get('shippingDetails') as FormArray;
        shippingDetailsArray.clear();
        this.editData.data.shippingDetails.forEach((shippingDetail: any) => {
          const shippingDetailForm = this.fb.group({
            country: [shippingDetail.country, Validators.required],
            shippingPrice: [Number(shippingDetail.shippingPrice), Validators.required]
          });
          shippingDetailsArray.push(shippingDetailForm);
        });

        this.proForm.get('saleTax')?.setValue(this.editData.data.saleTax.toString());
        this.proForm.get('buyerPremium')?.setValue(this.editData.data.buyerPremium.toString());
        this.proForm.get('shipping')?.setValue(this.editData.data.shipping.toString());
        this.proForm.get('collect')?.setValue(this.editData.data.collect.toString());
      })
  }


  getproductByUser(): void {
    this.isLoading = true;
    this.sellerProductService.getProductByUserService(this.userId, this.searchQuery, this.currentPage)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log('API Response:', res); // Check the API response
          this.editData2 = res;
          this.sellerpro = this.editData2.data.products;
          this.totalPages = this.editData2.data.totalPages;
          this.noProductsFound = this.sellerpro.length === 0;
          console.log('Total Pages:', this.totalPages); // Debugging
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.isLoading = false;
        }
      });
  }

  searchProducts(): void {
    this.currentPage = 1;
    this.getproductByUser();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchProducts();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getproductByUser();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getproductByUser();
    }
  }

  getUserById(id: any): void {
    this.isLoading = true;
    this.usersService.getUserByIdService(id).subscribe({
      next: (data) => {
        this.isLoading = false; 
        this.editData = data;
        console.log(this.editData);
        this.profileForm.patchValue({
          name: this.editData.data.name,
          email: this.editData.data.email,
          username: this.editData.data.username,
          password: this.editData.data.password,
        });
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.isLoading = false;
      }
    });
  }
  
  updateUser(userId: any): void {
    this.isLoading = true;
    const updatedUserData = {
      name: this.profileForm.value.name,
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      password: this.profileForm.value.password,
    };
  
    userId = this.userData1.data._id; 
    console.log(userId);
    console.log(updatedUserData);
  
    this.usersService.updateUserService(updatedUserData, userId).subscribe({
      next: (updatedUser) => {
        this.isLoading = false; 
        this.toastService.show('Success', 'User updated successfully!');
        this.getUserById(userId);  // Re-fetch updated user data
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.toastService.show('Success', 'Failed to update user!');
        this.isLoading = false; 
      }
    });
  }
  


  deleteAuction(id: any) {
    this.sellerProductService.deleteAuctionService(id)
      .subscribe(res => {
        this.toastService.show('Success', 'Product deleted successfully!');
        this.getproductByUser();
      })
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrderBySellerID(this.userId, this.currentPage2, this.limit)
      .subscribe(response => {
        this.isLoading = false;  
        this.orders = response.data.orders;
        this.totalOrders = response.data.totalOrders;
        console.log(this.orders)
        this.totalPages2 = response.data.totalPages;
      }, error => {
        console.error('Error fetching orders:', error);
        this.isLoading = false; 
      });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages2) {
      this.currentPage2 = page;
      this.loadOrders();  // Fetch orders again for the new page
    }
  }

  getOrderByProductId(id: any) {
    this.orderService.getorderByProductID(id)
      .subscribe(response => {
        this.orderData = response
        this.orderData = this.orderData.message
        this.router.navigate(['/order', this.orderData._id]);
      })
  }

}
