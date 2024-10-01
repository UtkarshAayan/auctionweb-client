import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

   // BehaviorSubjects to keep track of toast state
   private showToastSubject = new BehaviorSubject<boolean>(false);
   private toastTitleSubject = new BehaviorSubject<string>('');
   private toastMessageSubject = new BehaviorSubject<string>('');
   private toastTimeSubject = new BehaviorSubject<string>('');
 
   // Observable to subscribe to the state
   showToast$ = this.showToastSubject.asObservable();
   toastTitle$ = this.toastTitleSubject.asObservable();
   toastMessage$ = this.toastMessageSubject.asObservable();
   toastTime$ = this.toastTimeSubject.asObservable();
 
   // Method to show the toast
   show(title: string, message: string): void {
     this.toastTitleSubject.next(title);
     this.toastMessageSubject.next(message);
     this.toastTimeSubject.next(new Date().toLocaleTimeString());
     this.showToastSubject.next(true);
 
     // Automatically hide the toast after 3 seconds
     setTimeout(() => {
       this.hide();
     }, 3000);
   }
 
   // Method to hide the toast
   hide(): void {
     this.showToastSubject.next(false);
   }
}
