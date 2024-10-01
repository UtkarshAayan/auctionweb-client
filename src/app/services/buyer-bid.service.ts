
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BuyerBidService {

  constructor(private http: HttpClient, private router: Router) { }

  getAllVerifiedproductService(){
    return this.http.get(`http://localhost:3000/api/buyer/getAllBuyer/`)
  }
  createBidService(bidObj: any):Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/bids/create`, bidObj);
  }
  getBuyerBidsAtleaseService(id:any):Observable<any> {
    return this.http.get(`http://localhost:3000/api/product/bidProducts/${id}`)
  }

    //winnerHistory
    getWinnerHistoryProductById(id:any){
      return this.http.get(`http://localhost:3000/api/product/history/${id}`)
    }
  
}
