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

export interface BlogTableProps {
  data: IBlog[];
  onEdit: (blog: IBlog) => void;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export interface BlogListPageProps {
  data: IBlog[];
  categoryOptions: { value: string; label: string }[];
  onEdit: (blog: IBlog) => void;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export interface BlogActionsProps {
  blog: IBlog;
  onEdit: (blog: IBlog) => void;
  onRefresh: () => void;
}

export interface BlogFormProps {
  initialValues?: Partial<IBlog & { translations?: Partial<IBlogTranslation>[] }>;
  onSubmit: (values: IBlog & { translations?: Partial<IBlogTranslation>[] }) => void;
  categories: { value: string; label: string }[];
}

export interface BlogFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  categoryId: string | undefined;
  setCategoryId: (v: string | undefined) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  sortOrder: 'ASC' | 'DESC';
  setSortOrder: (v: 'ASC' | 'DESC') => void;
  onReset: () => void;
  categoryOptions: { value: string; label: string }[];
}
