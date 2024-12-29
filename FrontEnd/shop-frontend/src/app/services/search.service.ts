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

  filterArray(term: string, array: any[]) :any[] {
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
}
