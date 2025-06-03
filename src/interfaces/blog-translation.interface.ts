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

export interface BlogTranslationFormProps {
  initialValues?: Partial<IBlogTranslation>;
  onChange: (values: Partial<IBlogTranslation>) => void;
}

export interface BlogTranslationsProps {
  translations: Partial<IBlogTranslation>[];
  onChange: (translations: Partial<IBlogTranslation>[]) => void;
}
