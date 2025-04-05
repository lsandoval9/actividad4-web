import {Routes} from '@angular/router';
import {MainComponent} from './features/main/main.component';
import {AboutComponent} from './features/about/about.component';
import {BooksComponent} from './features/books/books.component';

/**
 * Define las rutas que salen en el componente router-outlet
 */
export const routes: Routes = [
    {
        path: '',
        title: "Home",
        component: MainComponent
    },
    {
        path: 'about',
        title: "About",
        component: AboutComponent,
    },
    {
        path: 'books',
        title: "Books",
        component: BooksComponent
    }
];
