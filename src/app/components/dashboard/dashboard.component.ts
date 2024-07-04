// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Book } from '../../models/book'; // Importa el modelo Book desde el archivo correcto
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public users: any[] = [];
  public books: Book[] = [];
  public filteredBooks: Book[] = [];
  public sortColumn: string = '';
  public sortDirection: string = 'asc';
  public searchTerm: string = '';
  public userName: string = '';
  private searchTerms = new Subject<string>();

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.api.getUsers().subscribe((res) => {
      this.users = res;
      console.log('Usuarios:', this.users);
    });

    this.api.getBooks().subscribe((res: Book[]) => {
      this.books = res;
      this.filteredBooks = [...this.books]; // Inicialmente, mostrar todos los libros
      console.log('Libros:', this.books);
    });
    this.userName = this.auth.getfullNameFromtoken();

    this.searchTerms
      .pipe(
        debounceTime(300), // Esperar 300ms después de cada pulsación de tecla antes de realizar la búsqueda
        distinctUntilChanged(), // Ignorar nuevos términos de búsqueda si son iguales al término anterior
        switchMap((term: string) => this.api.searchBooks(term)) // Realizar la búsqueda en el servicio API
      )
      .subscribe((filteredBooks: Book[]) => {
        this.filteredBooks = filteredBooks;
      });
  }

  sortBooks(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    // Implementación del ordenamiento (debe ajustarse según tu lógica)
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
