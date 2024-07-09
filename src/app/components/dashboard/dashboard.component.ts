// dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Book } from '../../models/book';
import { BookReviewsService } from 'src/app/services/book-reviews.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public books: Book[] = [];
  public users: Book[] = [];
  public filteredBooks: Book[] = [];
  public searchTerm: string = '';
  public fullName: string = '';
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: BookReviewsService
  ) {}

  ngOnInit(): void {
    this.fetchBooks(); // Llama a una función para obtener los libros inicialmente
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });

    this.userStore.getFullNameFromStore().subscribe((val) => {
      let fullNameFromToken = this.auth.getfullNameFromtoken();
      this.fullName = val || fullNameFromToken;
    });
  }

  fetchBooks(): void {
    this.api.getBooks().subscribe((res: Book[]) => {
      this.books = res;
      this.filteredBooks = [...this.books]; // Inicialmente, mostrar todos los libros
    });
  }

  filterBooks(): void {
    const searchTerm = this.searchTerm.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredBooks = [...this.books]; // Mostrar todos los libros si no hay término de búsqueda
    } else {
      this.filteredBooks = this.books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.category.toLowerCase().includes(searchTerm)
      );
    }
  }
  logout() {
    this.auth.signOut();
  }
}
