import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { apiUrls } from '../api.urls'

@Injectable({
  providedIn: 'root'
})
export class AdminSettingsService {

  constructor(private http: HttpClient) { }

  getSettings(): Observable<any> {
    return this.http.get<any>(`${apiUrls.adminSettingsApi}/settings`);
  }

  updateBuyersPremium(buyerPremium: any): Observable<any> {
    return this.http.put(`https://www.menaauctions.com/api/adminSettings/buyerPremium`, buyerPremium);
  }

  updateSalesTax(saleTax: any): Observable<any> {
    return this.http.put(`https://www.menaauctions.com/api/adminSettings/saleTax`, saleTax);
  }

  // getCategories(): Observable<any> {
  //   return this.http.get(`https://www.menaauctions.com/api/categories/all`);
  // }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`https://www.menaauctions.com/api/categories/all`).pipe(
      catchError(this.handleError)
    );
  }
    // Error handling method
    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'An unknown error occurred!';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(() => new Error(errorMessage));
    }

    getProductsByCategory(categoryName: string, page: number = 1, limit: number = 10, search: string = ''): Observable<any> {
      const queryParams = `?page=${page}&limit=${limit}&search=${search}`;
      return this.http.get<any>(`https://www.menaauctions.com/api/categories/all/${categoryName}${queryParams}`);
    }
    

getProductsBySubcategory(categoryName: string, subcategoryName: string, page: number = 1, limit: number = 10, search: string = ''): Observable<any> {
  const queryParams = `?page=${page}&limit=${limit}&search=${search}`;
  return this.http.get<any>(`https://www.menaauctions.com/api/categories/${categoryName}/sub/${subcategoryName}${queryParams}`);
}

  getCategoryByName(categoryName: string): Observable<any> {
    return this.http.get<any>(`https://www.menaauctions.com/api/categories/${categoryName}`);
  }

  //help
  getAllHelpContents(): Observable<any> {
    return this.http.get<any>(`${apiUrls.helpContentApi}contents`);
  }

  //sell
  getContentsSell(): Observable<any> {
    return this.http.get<any>(`${apiUrls.howSellAPI}`);
  }
  //buy
  getContentsBuy(): Observable<any> {
    return this.http.get<any>(`${apiUrls.howBuyAPI}`);
  }

  //request
  createRequest(data: any): Observable<any> {
    return this.http.post(`${apiUrls.requestFormAPI}`, data);
  }

//aboutus
getAbout(): Observable<any> {
  return this.http.get<any>(`https://www.menaauctions.com/api/about`);
}

  //termsandconditions

  getTerms(): Observable<any> {
    return this.http.get<any>(`https://www.menaauctions.com/api/terms`);
  }
  //privacypolicy

  getPrivacy(): Observable<any> {
    return this.http.get<any>(`https://www.menaauctions.com/api/privacy`);
  }

  //getcountrys
  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`https://www.menaauctions.com/api/country/all`);
  }

  getCountryById(id: any) {
    return this.http.get(`https://www.menaauctions.com/api/country/${id}`)
  }

    // Fetch Banner Images
    getBannerImages() {
      return this.http.get<{ bannerImages: string[] }>(`https://www.menaauctions.com/api/banner/view`);
    }

}
