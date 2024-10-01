
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private router: Router) { }
  
  getAllUsersService() {
    return this.http.get(`${apiUrls.userService}`)
  }

  updateUserService(data: any, id: any) {
    return this.http.put(`http://localhost:3000/api/user/${id}`, data)
  }
  deleteUserService(id: any) {
    return this.http.delete(`http://localhost:3000/api/user/${id}`)
  }
   
  getUserByIdService(id:any){
    return this.http.get(`http://localhost:3000/api/user/${id}`)
  }

  //addresses

  addAddress(userId: string, address: any): Observable<any> {
    return this.http.post(`http://localhost:3000/api/user/${userId}/address`, address);
  }

  updateAddress(userId: string, addressId: string, address: any): Observable<any> {
    return this.http.put(`http://localhost:3000/api/user/${userId}/address/${addressId}`, address);
  }

  deleteAddress(userId: string, addressId: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/user/${userId}/address/${addressId}`);
  }

  getUserAddresses(userId: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/user/${userId}/addresses`);
  }


  getUserOneAddress(userId: string, addressId: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/user/${userId}/address/${addressId}`);
  }
}
