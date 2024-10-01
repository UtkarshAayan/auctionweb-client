import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http: HttpClient, private router: Router) { }

  getWishlistByIdService(id:any): Observable<any>{
    return this.http.get(`http://localhost:3000/api/wishlist/${id}`)
  }

  removeProductFromWishlist(userId: any, productId: any): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/wishlist/${userId}/remove/${productId}`);
  }


  addProductToWishlist(userId: any, productId: any): Observable<any> {
    return this.http.post(`http://localhost:3000/api/wishlist/${userId}/add`, { productId });
  }
}
