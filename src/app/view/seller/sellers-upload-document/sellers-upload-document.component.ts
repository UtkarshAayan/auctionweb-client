import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { SellerProductService } from '../../../services/seller-product.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropDownService } from '../../../services/drop-down.service'
import { AdminSettingsService } from "../../../services/admin-settings.service";
import { LoaderComponent } from "../../../view/loader/loader.component";
import { ToastService } from "../../../services/toast.service";
@Component({
  selector: 'app-sellers-upload-document',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule,LoaderComponent],
  providers: [SellerProductService],
  templateUrl: './sellers-upload-document.component.html',
  styleUrl: './sellers-upload-document.component.css'
})
export class SellersUploadDocumentComponent implements OnInit {
  catFb = inject(FormBuilder);
  fb = inject(FormBuilder);
  sellerProductService = inject(SellerProductService);
  adminSettingsService = inject(AdminSettingsService);
  toastService = inject(ToastService);
  router = inject(Router)
  dropDownService = inject(DropDownService)
  productForm!: FormGroup;
  catForm!: FormGroup;
  userId!: any
  // for start price
  startingPrice: string = '';
  copiedStartingPrice: string = '';
  userData: any;
  userArray: any;
  dataArray: any;
  dropData: any;
  dropArray: any;
  dataColor: any;
  dataCondition: any
  dataLot: any;
  selectedImages: File[] = [];
  selectedDocs: File[] = [];
  categories: any;
  subcategories: any[] = [];
  countries: any;
  isLoading = false;
  submitted = false;
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

      productName: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      color: ['', Validators.required],
      productDescription: ['', Validators.required],
      productCondition: ['', Validators.required],
      // lotNumber: ['',Validators.required],
      brand: ['', Validators.required],
      startingPrice: ['', Validators.required],
      buyNowPrice: ['', Validators.required],
      reservePrice: ['', Validators.required],
      saleTax: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      buyerPremium: ['', Validators.required],
      shipping: ['', Validators.required],
      collect: ['', Validators.required],
      startTime: ['', Validators.required],
      stopTime: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      comment:  ['', Validators.required],
      country: ['', Validators.required],
      uploadDocuments: ['', Validators.required],
      essentialDocs: ['', Validators.required],
      shippingDetails: this.fb.array([]),
      dynamicFields: this.fb.array([])
    })
    // this.catForm = this.catFb.group({    
    //    category: ['',Validators.required],
    //   // color: ['',Validators.required],    
    //subcategory:['',Validators.required],
    //lotNumber: ['',Validators.required]
    // })

    this.getAllUsers();
    this.getAllDropdown();
    this.getAllCategories();
    this.getAllCountries()
  }

  getAllCategories(): void {
    this.adminSettingsService.getCategories().subscribe(res => {
      this.categories = res;
      this.categories = this.categories.data;
    });
  }
  getAllCountries(): void {
    this.adminSettingsService.getCountries().subscribe(res => {
      this.countries = res;
      this.countries = this.countries.data
    });
  }

  // Method to check if a country is already selected
  isCountrySelected(countryName: string): boolean {
    return this.shippingDetails.controls.some(
      (control) => control.get('country')!.value === countryName
    );
  }

  get shippingDetails(): FormArray {
    return this.productForm.get('shippingDetails') as FormArray;
  }

  addShippingDetail(): void {
    const shippingDetailGroup = this.fb.group({
      country: [''],
      shippingPrice: ['']
    });
    this.shippingDetails.push(shippingDetailGroup);
  }

  removeShippingDetail(index: number): void {
    this.shippingDetails.removeAt(index);
  }

  onShippingChange(isAvailable: boolean): void {
    if (isAvailable) {
      this.addShippingDetail(); // Add at least one shipping detail by default
    } else {
      while (this.shippingDetails.length !== 0) {
        this.shippingDetails.removeAt(0);
      }
    }
  }

  get dynamicFields(): FormArray {
    return this.productForm.get('dynamicFields') as FormArray;
  }

  addDynamicField(): void {
    this.dynamicFields.push(this.fb.group({
      key: [''],
      value: ['']
    }));
  }

  removeDynamicField(index: number): void {
    this.dynamicFields.removeAt(index);
  }


  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const categoryName = target.value;
    if (categoryName) {
      const selectedCategory = this.categories.find((category: { name: string; }) => category.name === categoryName);
      this.subcategories = selectedCategory ? selectedCategory.subcategories : [];
      this.productForm.get('subcategory')?.setValue('');
    } else {
      this.subcategories = [];
      this.productForm.get('subcategory')?.setValue('');
    }
  }


  getAllUsers() {
    this.sellerProductService.getAllproductService()
      .subscribe((res) => {
        this.userData = res
        this.dataArray = this.userData.data
        console.log(this.userData)
        //this.userArray = this.userData.data
        console.log(this.dataArray)
      })
  }

  //for image change on click
  onFileChanged(event: any) {
    this.selectedImages = Array.from(event.target.files);
    if (this.selectedImages.length > 0) {
      this.productForm.patchValue({ images: this.selectedImages });
    } else {
      this.productForm.patchValue({ images: '' });
    }
  }
  onDocsChanged(event: any) {
    this.selectedDocs = Array.from(event.target.files);
    if (this.selectedDocs.length > 0) {
      this.productForm.patchValue({ images: this.selectedDocs });
    } else {
      this.productForm.patchValue({ images: '' });
    }
  }
  

  submit(): void {
    this.submitted = true;
    
    this.userId = localStorage.getItem('user_id')!;
    const formData = new FormData();
    formData.append('productName', this.productForm.get('productName')!.value);
    formData.append('category', this.productForm.get('category')!.value);
    formData.append('subcategory', this.productForm.get('subcategory')!.value);
    formData.append('color', this.productForm.get('color')!.value);
    formData.append('productDescription', this.productForm.get('productDescription')!.value);
    formData.append('productCondition', this.productForm.get('productCondition')!.value);
    formData.append('brand', this.productForm.get('brand')!.value);
    formData.append('startingPrice', this.productForm.get('startingPrice')!.value);
    formData.append('reservePrice', this.productForm.get('reservePrice')!.value);
    formData.append('buyNowPrice', this.productForm.get('buyNowPrice')!.value);
    formData.append('startDate', this.productForm.get('startDate')!.value);
    formData.append('endDate', this.productForm.get('endDate')!.value);
    formData.append('startTime', this.productForm.get('startTime')!.value);
    formData.append('stopTime', this.productForm.get('stopTime')!.value);
    formData.append('address', this.productForm.get('address')!.value);
    formData.append('town', this.productForm.get('town')!.value);
    formData.append('comment', this.productForm.get('comment')!.value);
    formData.append('country', this.productForm.get('country')!.value);
    formData.append('saleTax', this.productForm.get('saleTax')!.value);
    formData.append('buyerPremium', this.productForm.get('buyerPremium')!.value);
    formData.append('shipping', this.productForm.get('shipping')!.value);
    formData.append('collect', this.productForm.get('collect')!.value);
    formData.append('userId', this.userId);
    // Add shipping details if shipping is available
    const shippingDetailsArray = this.shippingDetails.value;
    formData.append('shippingDetails', JSON.stringify(shippingDetailsArray));
    const dynamicFieldsArray = this.productForm.get('dynamicFields')?.value || [];
    formData.append('dynamicFields', JSON.stringify(dynamicFieldsArray));
    this.selectedImages.forEach(file => {
      formData.append('uploadDocuments', file, file.name);
    });
    this.selectedDocs.forEach(file => {
      formData.append('essentialDocs', file, file.name);
    });


    this.isLoading = true;  // Show loader
    this.sellerProductService.createSellerProductService(formData).subscribe({
      next: () => {
        this.toastService.show('Success', 'Product created successfully!');
        this.router.navigate(['auction']);
        this.productForm.reset();
        this.selectedImages = [];
        this.selectedDocs = []
        this.dynamicFields.clear(); 
        this.isLoading = false; 
      },
      error: (error) => {
        console.error('Error uploading product:', error);
        this.isLoading = false; 
      }
    });
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
        //this.userArray = this.userData.data

      })
  }

}
