import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5153/api/Product';

  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  update(product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${product.id}`, product);
  }
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  create(product: object): Observable<any> {
    return this.http.post(`${this.apiUrl}`, product);
  }
}