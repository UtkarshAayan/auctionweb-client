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
    return this.http.get(`http://localhost:3000/api/products/${productId}`);
  }
  placeBid(productId: string, userId: string, bidAmount: number): Observable<any> {
    return this.http.post(`http://localhost:3000/api/bids/place`, { productId, userId, bidAmount });
  }

  createBidService1(bidObj: any):Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/bids/place`, bidObj);
  }
}
