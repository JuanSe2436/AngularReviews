import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookReviewsService {
  private bookName$ = new BehaviorSubject<string>('');
  private category$ = new BehaviorSubject<string>('');
  private fullName$ = new BehaviorSubject<string>('');
  private role$ = new BehaviorSubject<string>('');

  constructor() {}

  public getRoleFromStore() {
    return this.role$.asObservable();
  }

  public setRoleFromStore(role: string) {
    this.category$.next(role);
  }

  public getFullNameFromStore() {
    return this.fullName$.asObservable();
  }

  public setFullNameForStore(fullName: string) {
    this.category$.next(fullName);
  }

  public getCategoryFromBook() {
    return this.category$.asObservable();
  }

  public setCategoryForBook(category: string) {
    this.category$.next(category);
  }

  public getBookFromCategory() {
    this.bookName$.asObservable();
  }

  public setBookFromCategory(book: string) {
    this.bookName$.next(book);
  }
}
