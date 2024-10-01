import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private productsData = new BehaviorSubject<any>(null);

  constructor() { }

  setProductsData(products: any) {
    this.productsData.next(products);
  }

  getProductsData() {
    return this.productsData.asObservable();
  }
}
