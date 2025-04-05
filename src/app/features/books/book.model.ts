import { Author } from './author.model';

export interface Book {
    id: number;
    title: string;
    authors: Author[];
    download_count: number;
}
