import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class UserService {
 private userTermSubject = new BehaviorSubject<any>(
   JSON.parse(localStorage.getItem('user') || '{}')
 );
 userTerm$: Observable<any> = this.userTermSubject.asObservable();

 updateUserTerm(term: any) {
   localStorage.setItem('user', JSON.stringify(term));
   this.userTermSubject.next(term);
 }

 getUserInfo(): any {
   return this.userTermSubject.getValue();
 }
}