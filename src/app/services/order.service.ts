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
    return this.http.post(`https://www.menaauctions.com/api/orders`, orderData);
  }

  createOrderForBuynow( orderData: any): Observable<any> {
    return this.http.post(`https://www.menaauctions.com/api/orders/BuynowOrder`, orderData);
  }

  getorderByIdService(id:any){
    return this.http.get(`https://www.menaauctions.com/api/orders/${id}`)
  }

  getorderByProductID(id:any){
    return this.http.get(`https://www.menaauctions.com/api/orders/product/${id}`)
  }

  //orderlistfor seller

  getAllOrderBySellerID(userId: string, page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`https://www.menaauctions.com/api/orders/all/seller/${userId}`, { params });
  }


  getOrderHistoryList(buyerId: string): Observable<any> {
    return this.http.get(`https://www.menaauctions.com/api/orders/orderhistory/${buyerId}`);
  }

  createTransaction(transactionData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://www.menaauctions.com/api/transactions`, transactionData, { headers });
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`https://www.menaauctions.com/api/transactions`);
  }

}
