export interface IBlogTranslation {
  id?: string;
  blogId: string;
  language: 'vi' | 'ko' | 'ru' | 'zh' | 'en';
  title: string;
  description?: string;
  content?: string;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
