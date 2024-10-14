import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

 // private islogin = false;
  private loggedIn = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {

  }
  get isLoggedIn1() {
    return this.loggedIn.asObservable();
  }

  isLoggedIn() {
    //return false;
   this.loggedIn.next(true);

    return this.getToken() !== null;
  }


  loginService(loginObj: any): Observable<any> {
    this.loggedIn.next(true);
    return this.http.post<any>(`${apiUrls.authServiceApi}login`, loginObj);
  }
  logout() {
    localStorage.clear();
    //this.islogin = false;
    this.loggedIn.next(false);
    this.router.navigate(['login']);
  }

  createUserService(userObj: any) {
    return this.http.post<any>(`${apiUrls.authServiceApi}signup`, userObj);
  }
  sendEmailService(email: string) {
    return this.http.post<any>(`${apiUrls.authServiceApi}send-email`, { email: email });
  }

  resetPasswordService(resetObj: any) {
    return this.http.post<any>(`${apiUrls.authServiceApi}resetPassword`, resetObj);
  }
  //buyer
  createBuyerService(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.authServiceApi}register-buyer`, data);
  }
  //seller
  createSellerService(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.authServiceApi}register-seller`, data);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  //authguards
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getrole() {
    return localStorage.getItem('role') != null ? localStorage.getItem('role')?.toString() : '';
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  //admin

  // isAdminUser() {
  //   return localStorage.getItem('role') == 'Buyer'
  // }

  //seller
  isSellerUser() {
    return localStorage.getItem('isSeller') == 'true'
  }

  //buyer
  isBuyerUser() {
    return localStorage.getItem('isBuyer') == 'true'
  }

}
