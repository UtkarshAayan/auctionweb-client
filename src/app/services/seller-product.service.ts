
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SellerProductService {

  constructor(private http: HttpClient, private router: Router) { }
  createSellerProductService(formData: FormData):Observable<any> {
    return this.http.post<any>(`${apiUrls.sellerProductform}create`, formData);
  }

  getAllproductService(searchTerm?: string){
    return this.http.post(`http://localhost:3000/api/product/`,{search:searchTerm})
  }

  // getprofileService(){
  //   return this.http.get(`http://localhost:3000/api/profile`)
  // }

  getProductByIdService(id:any){
    return this.http.get(`http://localhost:3000/api/product/${id}`)
  }
  getProductByIdWithWishlistService(productId: string, userId: string): Observable<any> {
    const url = `http://localhost:3000/api/product/pro/${productId}?userId=${userId}`;
    return this.http.get<any>(url);
  }

//for Seller DashBoard
  getProductByUserService(id: any, search: string = '', page: number = 1, limit: number = 8): Observable<any[]> {
    const params = { search, page: page.toString(), limit: limit.toString() };
    return this.http.get<any[]>(`http://localhost:3000/api/product/proUser/${id}`, { params });
  }
  
//for Seller Verified Product list

getVerifiedProductByUserService(id: any, search: string = '', page: number = 1, limit: number = 8): Observable<any[]> {
  const params = { search, page: page.toString(), limit: limit.toString() };
  return this.http.get<any[]>(`http://localhost:3000/api/product/proUser/verified/${id}`, { params });
}

  
  updateProductService(proId: any, formData: FormData): Observable<any> {
    return this.http.put(`http://localhost:3000/api/product/${proId}`,formData)
  }

  getCatagory(selectedItem:any): Observable<any[]>{
    return this.http.post<any[]>(`http://localhost:3000/api/product/category`,{selectedItem})
  }

  liveAuction(): Observable<any[]>{
    return this.http.post<any[]>(`http://localhost:3000/api/product/liveAuction`,{})
  }
  futureAuction(): Observable<any[]>{
    return this.http.post<any[]>(`http://localhost:3000/api/product/futureAuction`,{})
  }

  deleteAuctionService(id: any) {
    return this.http.delete(`http://localhost:3000/api/product/${id}`)
  }



}
