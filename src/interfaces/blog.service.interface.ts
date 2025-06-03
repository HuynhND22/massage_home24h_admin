export interface IBlogCreate {
  title: string;
  description?: string;
  content: string;
  slug: string;
  categoryId: string;
  imageFile?: File;
  coverImage?: string;
} 