import {Component, OnInit} from '@angular/core';
import {Book} from './book.model';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-books',
    // se importan los modulos que se van a usar en el componente y la vista
    imports: [
        FormsModule,
        NgForOf,
        AsyncPipe,
        NgIf,
    ],
    // aca se declara la plantilla del componente y los estilos
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {


    // observables manejo de state
    books: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);


    // las variables son reactivas, osea si se actualizan en el ts se actualizan en el html
    selectedBook: Book | null = null;

    newBook: Partial<Book> = { title: '', download_count: 0, authors: [] };

    authorInput: string = '';

    constructor(private http: HttpClient) { }


    // funcion de ciclo de vida (lo que se le dice hook en react y vue). Se ejecuta cuando se inicializa el componente
    ngOnInit(): void {
        this.loadBooks();
    }

    loadBooks(): void {
        this.http.get<any>('/json/fantasy-books.json').subscribe(data => {
            //this.books = data.results;

            this.books.next(data.results)
        });
    }

    addBook(): void {

        const newId = this.books.value.length > 0 ? Math.max(...this.books.value.map(b => b.id)) + 1 : 1;

        const authors = this.authorInput.split(',')
            .map(name => ({ name: name.trim(), birth_year: null, death_year: null }));

        const book: Book = {
            id: newId,
            title: this.newBook.title || 'Sin título',
            authors: authors,
            download_count: this.newBook.download_count || 0
        };

        this.books.next([...this.books.value, book]);

        this.resetForm();
    }

    editBook(book: Book): void {
        this.selectedBook = { ...book };
        this.newBook = { ...book };
        this.authorInput = book.authors.map(a => a.name).join(', ');
    }

    updateBook(): void {
        if (this.selectedBook) {
            const authors = this.authorInput.split(',')
                .map(name => ({ name: name.trim(), birth_year: null, death_year: null }));

            // Actualiza los campos
            this.selectedBook.title = this.newBook.title || this.selectedBook.title;
            this.selectedBook.download_count = this.newBook.download_count || this.selectedBook.download_count;
            this.selectedBook.authors = authors;

            // Busca el índice del libro a actualizar y lo reemplaza
            const index = this.books.value.findIndex(b => b.id === this.selectedBook!.id);
            if (index !== -1) {
                // this.books[index] = { ...this.selectedBook };

                const updatedBooks = [...this.books.value];

                updatedBooks[index] = this.selectedBook;

                this.books.next(updatedBooks);
            }
            this.resetForm();
        }
    }

    deleteBook(id: number): void {
        const newBooks = this.books.value.filter(b => b.id !== id);

        this.books.next(newBooks);
    }

    resetForm(): void {
        this.newBook = { title: '', download_count: 0, authors: [] };
        this.authorInput = '';
        this.selectedBook = null;
    }
}
