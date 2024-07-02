// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Book } from '../../models/book'; // Importa el modelo Book desde el archivo correcto

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
