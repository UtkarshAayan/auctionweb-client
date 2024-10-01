import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private router: Router) { }

  createOrder( orderData: any): Observable<any> {
    return this.http.post(`http://localhost:3000/api/orders`, orderData);
  }

  createOrderForBuynow( orderData: any): Observable<any> {
    return this.http.post(`http://localhost:3000/api/orders/BuynowOrder`, orderData);
  }

  getorderByIdService(id:any){
    return this.http.get(`http://localhost:3000/api/orders/${id}`)
  }

  getorderByProductID(id:any){
    return this.http.get(`http://localhost:3000/api/orders/product/${id}`)
  }

  //orderlistfor seller

  getAllOrderBySellerID(userId: string, page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`http://localhost:3000/api/orders/all/seller/${userId}`, { params });
  }


}
