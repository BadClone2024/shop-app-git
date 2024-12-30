import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$: Observable<string> = this.searchTermSubject.asObservable();

  updateSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  filterProducts(term: string, array: any[]): any[] {
    if (!term) {
      return array;
    }

    term = term.toLowerCase();

    array = array.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.price.toString().includes(term)
    );
    return array;
  }
  filterUsers(term: string, array: any[]): any[] {
    if (!term) {
      return array;
    }

    term = term.toLowerCase();

    array = array.filter(user =>
      user.username.toLowerCase().includes(term) ||
      user.id.toString().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
    return array;
  }

  findById(id: number, array: any[]): any[] {
    console.log("Find by ID starts");
    if (!id) return array;
    console.log("ID is not empty");
    return array.filter(userid => userid === id.toString());
  }
}
