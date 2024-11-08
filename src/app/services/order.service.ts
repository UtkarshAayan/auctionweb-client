import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    return this.http.post(`http://88.222.212.120:3000/api/orders`, orderData);
  }

  createOrderForBuynow( orderData: any): Observable<any> {
    return this.http.post(`http://88.222.212.120:3000/api/orders/BuynowOrder`, orderData);
  }

  getorderByIdService(id:any){
    return this.http.get(`http://88.222.212.120:3000/api/orders/${id}`)
  }

  getorderByProductID(id:any){
    return this.http.get(`http://88.222.212.120:3000/api/orders/product/${id}`)
  }

  //orderlistfor seller

  getAllOrderBySellerID(userId: string, page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`http://88.222.212.120:3000/api/orders/all/seller/${userId}`, { params });
  }


  getOrderHistoryList(buyerId: string): Observable<any> {
    return this.http.get(`http://88.222.212.120:3000/api/orders/orderhistory/${buyerId}`);
  }

  createTransaction(transactionData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`http://88.222.212.120:3000/api/transactions`, transactionData, { headers });
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`http://88.222.212.120:3000/api/transactions`);
  }

}
