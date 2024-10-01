import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private hideCategorySubject = new BehaviorSubject<boolean>(false);
  hideCategory$ = this.hideCategorySubject.asObservable();

  setHideCategory(value: boolean) {
    this.hideCategorySubject.next(value);
  }
}
