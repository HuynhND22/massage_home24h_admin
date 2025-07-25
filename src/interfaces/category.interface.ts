export interface CategoryTranslation {
  language: string;
  name: string;
  description?: string;
}

export interface ICategory {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  type: 'blog' | 'service';
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  translations: CategoryTranslation[];
}

export interface CategoryTableProps {
  data: ICategory[];
  onEdit: (category: ICategory) => void;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export interface CategoryListPageProps {
  data: ICategory[];
  onEdit: (category: ICategory) => void;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export interface CategoryActionsProps {
  category: ICategory;
  onEdit: (category: ICategory) => void;
  onRefresh: () => void;
}

export interface CategoryFormProps {
  opened: boolean;
  onClose: (refresh?: boolean) => void;
  category: ICategory | null;
}

export interface CategoryFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  onReset: () => void;
}
