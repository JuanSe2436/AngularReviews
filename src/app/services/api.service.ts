import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://localhost:7241/api/User/';
  private bookUrl: string = 'https://localhost:7241/api/Book/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.bookUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}${id}`);
  }
  searchBooks(searchTerm: string): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.baseUrl}/SearchBooks?searchTerm=${searchTerm}`
    );
  }
  // Actualizar un usuario
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}${id}`, user);
  }
}
