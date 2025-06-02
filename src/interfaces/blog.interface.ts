import { IBlogTranslation } from './blog-translation.interface';

export interface IBlog {
  id?: string;
  title: string;
  description?: string;
  content?: string;
  slug?: string;
  categoryId?: string;
  coverImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
  translations?: IBlogTranslation[];
}
