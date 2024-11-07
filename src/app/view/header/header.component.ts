import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { SellerProductService } from "../../services/seller-product.service";
import { DataSharingService } from "../../services/data-sharing.service";
import { CategoryService } from "../../services/category.service";
import { AdminSettingsService } from "../../services/admin-settings.service";
import { InAppNotificationService } from "../../services/in-app-notification.service";
@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent implements OnInit {
  inAppNotificationService = inject(InAppNotificationService);
  num = 10;
  showLoginButton: boolean = true;
  title = "client";
  isAdmin = false;
  product: any;
  products: any;
  hideCategory: boolean = false;
  categories: any
  notifications: any
  unreadCount: any = 0;
  userId!: any; // Variable to hold the logged-in user's ID

  constructor(
    private router: Router,
    private authService: AuthService,
    private sellerProduct: SellerProductService,
    private dataSharingService: DataSharingService,
    private categoryService: CategoryService,
    private adminSettingsService: AdminSettingsService,
    
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const hideCategory = event.urlAfterRedirects.includes('sellers-bidders-of-items')|| event.urlAfterRedirects.includes('sellers-upload-document') || event.urlAfterRedirects.includes('auction')  || event.urlAfterRedirects.includes('seller-dashboard');
        this.categoryService.setHideCategory(hideCategory);
      }
    });

    this.categoryService.hideCategory$.subscribe(hide => {
      this.hideCategory = hide;
    });
  }
  isLoggedIn: boolean = false;
  isSeller: boolean = false;
  ngOnInit(): void {
    const loginState = localStorage.getItem('isLoggedIn');
    this.isLoggedIn = loginState === 'true';
    const sellerState = localStorage.getItem('isSeller');
     this.isSeller = sellerState === 'true';
    this.loadCategories();
    this.userId = localStorage.getItem('user_id');
  
  if (this.userId) {
    this.loadUnreadNotifications();
    setInterval(() => this.loadUnreadNotifications(), 60000);
  } else {
    console.warn('No user ID found. Notifications will not be fetched.');
  }
  }

  loadUnreadNotifications(): void {
    this.inAppNotificationService.getUnreadNotifications(this.userId).subscribe({
      next: (res) => {
        this.notifications = res.data || []; // Default to empty array if no data
        this.unreadCount = this.notifications.length; // Count notifications
      },
      error: (error) => {
        // Log or handle unexpected errors
        console.error('Error fetching unread notifications', error);
      },
      complete: () => {
        console.log('Notification fetching complete');
      }
    });
  }
  
  
  
  
  
  
  loadCategories(): void {
    this.adminSettingsService.getCategories().subscribe(cat => {
      this.categories = cat;
      this.categories = this.categories.data
    
    });
  }
}
