import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls'

@Injectable({
  providedIn: 'root'
})
export class InAppNotificationService {

  constructor(private http: HttpClient) { }

  getNotifications(userId: string, filter: string = 'all'): Observable<any> {
    let params = new HttpParams().set('filter', filter);
    return this.http.get(`${apiUrls.inAppNotificationAPI}/notifications/${userId}`, { params });
  }

  // Mark a notification as read
  markAsRead(notificationId: string): Observable<any> {
    return this.http.post(`${apiUrls.inAppNotificationAPI}/notifications/read/${notificationId}`, {});
  }

  // Delete a notification
  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${apiUrls.inAppNotificationAPI}/notifications/${notificationId}`);
  }

  // Clear all notifications for a user
  clearAllNotifications(userId: string): Observable<any> {
    return this.http.delete(`${apiUrls.inAppNotificationAPI}/notifications/clear/${userId}`);
  }

  // Turn on notifications for a user
  turnOnNotifications(userId: string): Observable<any> {
    return this.http.post(`${apiUrls.inAppNotificationAPI}/notifications/turnon`, { userId });
  }

  // Turn off notifications for a user
  turnOffNotifications(userId: string): Observable<any> {
    return this.http.post(`${apiUrls.inAppNotificationAPI}/notifications/turnoff`, { userId });
  }

  getUnreadNotifications(userId: string): Observable<any> {
    const url = `${apiUrls.inAppNotificationAPI}/notifications/${userId}?filter=unread`;
    console.log('Fetching notifications from URL:', url); // Debug log
    return this.http.get<any>(url);
  }
}
