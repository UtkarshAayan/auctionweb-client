import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { AuthService } from '../../../services/auth.service';
import { SellerProductService } from '../../../services/seller-product.service';
import { BuyerBidService } from '../../../services/buyer-bid.service'
import { OrderService } from '../../../services/order.service';
import { LoaderComponent } from "../../../view/loader/loader.component";
import { ToastService } from "../../../services/toast.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule, LoaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  authService = inject(AuthService);
  orderService = inject(OrderService);
  buyerBidService = inject(BuyerBidService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);
  router = inject(Router)
  usersService = inject(UsersService);
  sellerProductService = inject(SellerProductService);
  profileForm!: FormGroup;
  editData: any;
  userData: any;
  userArray: any;
  userData1: any;
  userData2: any;
  history: any;
  win: any;
  passwordFieldType: string = 'password';
  orderData: any;
  isLoading = false;  // loader flag

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
    const userId = localStorage.getItem('user_id');
    console.log(userId)
    if (userId) {
      this.usersService.getUserByIdService(userId)
        .subscribe(data => {
          this.userData1 = data
          this.userData2 = this.userData1.data
          console.log(this.userData2);
        })
    }
    this.getUserById(userId)
    this.getWinnerHistory(userId);
    this.getBuyerBidHistory(userId);
  }
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
  getBuyerBidHistory(id: any): void {
    this.isLoading = true;
    this.buyerBidService.getBuyerBidsAtleaseService(id)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.history = data?.data || [];
          console.log(this.history);
        },
        error: (err) => {
          console.error('Error fetching buyer bid history:', err);
          this.isLoading = false;
        }
      });
  }
  

  getWinnerHistory(id: any): void {
    this.isLoading = true;
    this.buyerBidService.getWinnerHistoryProductById(id)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.win = data
          this.win = this.win.data
        },
        error: (err) => {
          console.error('Error fetching winner history:', err);
          this.isLoading = false;
        }
      });
  }
  

  getproductById(id: any) {
    this.sellerProductService.getProductByIdService(id)
      .subscribe(data => {
        this.editData = data
        this.router.navigate(['/bid', this.editData.data._id]);
      })
  }
  getUserById(id: any): void {
    this.isLoading = true;
    this.usersService.getUserByIdService(id)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.editData = data;
          console.log(this.editData);
          this.profileForm.patchValue({
            name: this.editData?.data?.name || '',
            email: this.editData?.data?.email || '',
            username: this.editData?.data?.username || '',
            password: this.editData?.data?.password || '',
          });
        },
        error: (err) => {
          console.error('Error fetching user by ID:', err);
          this.isLoading = false;
        }
      });
  }
  
  getOrderByProductId(id: any): void {
    this.isLoading = true;
    this.orderService.getorderByProductID(id)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.orderData = data
          this.orderData = this.orderData.message
          this.router.navigate(['/order', this.orderData._id]);
        },
        error: (err) => {
          console.error('Error fetching order by product ID:', err);
          this.isLoading = false;
        }
      });
  }
  
  updateUser(userId: any): void {
    const updatedUserData = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      username: this.profileForm.value.username,
      password: this.profileForm.value.password,
    };
    this.isLoading = true;
    userId = this.userData1?.data?._id; // Ensure safe access
    this.usersService.updateUserService(updatedUserData, userId)
      .subscribe({
        next: (updatedUser) => {
          this.isLoading = false;
          this.toastService.show('Success', 'User updated successfully!');
          console.log('User updated:', updatedUser);
          this.getUserById(userId);
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.isLoading = false;
        }
      });
  }
  

}
