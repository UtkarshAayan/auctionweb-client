import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class ProbidService {

  constructor(private http: HttpClient, private router: Router){}
  getProductById(productId: string): Observable<any> {
    return this.http.get(`https://www.menaauctions.com/api/products/${productId}`);
  }
  placeBid(productId: string, userId: string, bidAmount: number): Observable<any> {
    return this.http.post(`https://www.menaauctions.com/api/bids/place`, { productId, userId, bidAmount });
  }

  createBidService1(bidObj: any):Observable<any> {
    return this.http.post<any>(`https://www.menaauctions.com/api/bids/place`, bidObj);
  }
}
