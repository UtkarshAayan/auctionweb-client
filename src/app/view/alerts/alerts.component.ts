import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SellerProductService } from '../../services/seller-product.service';
import { BuyerBidService } from '../../services/buyer-bid.service'
import { interval, Subscription } from 'rxjs';
import { InAppNotificationService } from "../../services/in-app-notification.service";
import { UsersService } from '../../services/users.service';
import { LoaderComponent } from "../../view/loader/loader.component";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, HttpClientModule,LoaderComponent],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent {
  inAppNotificationService = inject(InAppNotificationService);
  usersService = inject(UsersService);
  toastService = inject(ToastService);
  notifications: any[] = [];
  filteredNotifications: any[] = [];  // Store the filtered notifications here
  currentFilter: string = 'all';
  notificationsEnabled: boolean = true;
  isLoading = false;  // loader flag
  userId: any
  editData: any;


  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');

    if (this.userId) {
      this.loadNotifications();
      setInterval(() => this.loadNotifications(), 60000);
    }
    this.getUserById()
    //  this.getUserById(userId)

    // this.checkNotificationSettings();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.inAppNotificationService.getNotifications(this.userId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notifications = response.data;
       
        // this.notificationsEnabled = this.notifications
        this.applyFilter();  // Apply the filter after loading notifications
      },
      error: (error) => {
        console.error('Error loading notifications', error);
        this.isLoading = false;
      }
    });
  }
  getUserById() {
    this.usersService.getUserByIdService(this.userId)
      .subscribe(data => {
        this.editData = data
        this.editData = this.editData.data
        this.notificationsEnabled = this.editData.notificationsEnabled
      })
  }


  // Apply the filter based on the current filter selection
  applyFilter(): void {
    if (this.currentFilter === 'all') {
      this.filteredNotifications = this.notifications;
    } else if (this.currentFilter === 'read') {
      this.filteredNotifications = this.notifications.filter(notification => notification.read);
    } else if (this.currentFilter === 'unread') {
      this.filteredNotifications = this.notifications.filter(notification => !notification.read);
    }
  }

  // Filter notifications (All, Read, Unread)
  filterNotifications(filter: string): void {
    this.currentFilter = filter;
    this.applyFilter();  // Apply the filter when the user selects a filter option
  }


  // Mark a notification as read
  markAsRead(notificationId: string): void {
    this.inAppNotificationService.markAsRead(notificationId).subscribe({
      next: (response) => {
        this.toastService.show('Success', 'Marked as read!');
        this.loadNotifications(); // Reload notifications after marking as read
      },
      error: (error) => {
        console.error('Error marking notification as read', error);
      }
    });
  }


  // Delete a notification
  deleteNotification(notificationId: string): void {
    this.inAppNotificationService.deleteNotification(notificationId).subscribe({
      next: (response) => {
        this.toastService.show('Success', 'Notification deleted successfully!');
        this.loadNotifications(); // Reload notifications after deleting
      },
      error: (error) => {
        console.error('Error deleting notification', error);
      }
    });
  }


  // Clear all notifications
  clearAllNotifications(): void {
    this.inAppNotificationService.clearAllNotifications(this.userId).subscribe({
      next: (response) => {
        this.notifications = []; // Clear the notifications array
      },
      error: (error) => {
        console.error('Error clearing notifications', error);
      }
    });
  }


  // Turn on notifications
  toggleNotifications(event: any): void {
    const enableNotifications = event.target.checked;

    if (enableNotifications) {
      this.inAppNotificationService.turnOnNotifications(this.userId).subscribe({
        next: (response) => {
          this.notificationsEnabled = true;
        },
        error: (error) => {
          console.error('Error turning on notifications', error);
          event.target.checked = false; // Revert the checkbox if there's an error
        }
      });
    } else {
      this.inAppNotificationService.turnOffNotifications(this.userId).subscribe({
        next: (response) => {
          this.notificationsEnabled = false;
        },
        error: (error) => {
          console.error('Error turning off notifications', error);
          event.target.checked = true; // Revert the checkbox if there's an error
        }
      });
    }
  }

}
