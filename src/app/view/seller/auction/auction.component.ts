import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SellerProductService } from '../../../services/seller-product.service';
import { Profile } from './auction.model';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BuyerBidService } from '../../../services/buyer-bid.service'
import { DropDownService } from '../../../services/drop-down.service'
import { AdminSettingsService } from "../../../services/admin-settings.service";
import { LoaderComponent } from "../../../view/loader/loader.component";
import { ToastService } from "../../../services/toast.service";

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule,FormsModule,LoaderComponent],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css'
})
export class AuctionComponent implements OnInit {
  @Input() proId: string | null = null;
  sellerProductService = inject(SellerProductService);
  adminSettingsService = inject(AdminSettingsService);
  dropDownService = inject(DropDownService)
  isLoading = false;  // loader flag
  profile3: any
  userData: any;
  profile!: Profile;
  dataArray: any;
  profile2: any
  editData: any;
  editData1: any;
  router = inject(Router)
  toastService = inject(ToastService);
  userData2: any;
  userData1: any;
  fb = inject(FormBuilder);
  editData2: any;
  sellerpro:any
  proForm!: FormGroup;
  startingPrice: string = '';
  copiedStartingPrice: string = '';
  selectedImages: File[] = [];
  selectedDoc: File[] = [];
  userArray: any;
  dropData: any;
  dropArray: any;
  dataColor: any;
  dataCondition: any
  dataLot: any;
  countries: any;
  bannerImages: string[] = [];
  searchQuery: string = ''; // For search input
  currentPage: number = 1;  // For pagination
  totalPages: number = 1;   // Total number of pages
  userId: any
  noProductsFound: boolean = false; // To show 'No products found' message

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
    // this.getAllUsers();
    this.getAllCountries();
    this.loadBannerImages();

    this.userId = localStorage.getItem('user_id');
    this.getproductByUser();
  
    if (this.proId) {
      this.getproductById(this.proId);
    }
    this.getAllDropdown();
  }
  onFileChanged(event: any): void {
    this.selectedImages = Array.from(event.target.files);
    this.proForm.patchValue({ uploadDocuments: this.selectedImages.length > 0 ? this.selectedImages : '' });
  }

  onDocChanged(event: any): void {
    this.selectedDoc = Array.from(event.target.files);
    this.proForm.patchValue({ essentialDocs: this.selectedDoc.length > 0 ? this.selectedDoc : '' });
  }
  getAllUsers() {
    this.sellerProductService.getAllproductService()
      .subscribe((res) => {
        this.userData = res
        this.dataArray = this.userData.data
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
    const dynamicFieldForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
    this.dynamicFields.push(dynamicFieldForm);
  }

  removeDynamicField(index: number) {
       this.dynamicFields.removeAt(index);
  }



  getproductById(id: any) {
    this.sellerProductService.getProductByIdService(id)
      .subscribe(data => {
        this.editData = data
        this.proId = this.editData.data._id;
       // localStorage.setItem("product_id", this.editData.data._id);
        this.dataArray = this.editData.data
        
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
    this.isLoading = true;  // Show loader
    this.sellerProductService.getVerifiedProductByUserService(this.userId, this.searchQuery, this.currentPage)
      .subscribe({
        next: (res) => {
        
          this.editData2 = res;
          this.sellerpro = this.editData2.data.products.filter((product: any) => product.proVerifyByAdmin === true);
          this.totalPages = this.sellerpro.length ? this.editData2.data.totalPages : 0;
  
        
          this.noProductsFound = this.sellerpro.length === 0;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.isLoading = false;  // Hide loader on error
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

  //to navigate

  getproductById1(id: any) {
    this.sellerProductService.getProductByIdService(id)
      .subscribe(data => {
        this.editData = data
      //  localStorage.setItem("product_id", this.editData.data._id);
        this.router.navigate(['/sellers-bidders-of-items', this.editData.data._id])
      })
  }

  //for update

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
          this.toastService.show('Success', 'Auction updated successfully!');
          this.selectedImages = [];
          this.selectedDoc = [];
         
          this.resetForm();
          
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
  clickAddMember() {
    this.resetForm();
  }
  resetForm(): void {
    this.proForm.reset();
    this.selectedImages = [];
    this.selectedDoc = [];
    this.shippingDetails.clear();
    this.proId = null;
  }

  //DropdownData
  getAllDropdown() {
    this.dropDownService.getAllDropDownService()
      .subscribe((res) => {
        this.dropData = res
       
        this.dropArray = this.dropData.data[0].category
        this.dataColor = this.dropData.data[0].color
        this.dataCondition = this.dropData.data[0].productCondition
        this.dataLot = this.dropData.data[0].lotNumber
      

      })
  }

  loadBannerImages() {
    this.adminSettingsService.getBannerImages().subscribe(
      (response) => {
        this.bannerImages = response.bannerImages;
       
      },
      (error) => {
        console.log("err");
      }
    );
  }

}
