import { ICategory } from "./category.interface";

export interface ServiceTranslation {
  language: string;
  name: string;
  description?: string;
}

export interface IService {
  id?: string;
  name: string;
  slug?: string;
  description?: string | null;
  duration: number;
  coverImage?: string | null;
  categoryId: string;
  category?: ICategory;
  price?: number | string;
  discount?: number | string;
  createdAt?: string;
  updatedAt?: string;
  translations?: ServiceTranslation[];
}

export interface ServiceTableProps {
  data: IService[];
  categoryMap: Record<string, string>;
  onEdit: (service: IService) => void;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export interface ServiceListPageProps {
  data: IService[];
  categories: ICategory[];
  onEdit: (service: IService) => void;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export interface ServiceActionsProps {
  service: IService;
  onEdit: (service: IService) => void;
  onRefresh: () => void;
}

export interface ServiceFormProps {
  opened: boolean;
  onClose: (refresh?: boolean) => void;
  service: IService | null;
}

export interface ServiceFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categories: ICategory[];
  onReset: () => void;
}

export interface IServiceDetail {
  id?: string;
  title: string;
  description: string;
  content: string;
  language: string;
  serviceId: string;
}

export interface ServiceDetailFormProps {
  opened: boolean;
  onClose: (refresh?: boolean) => void;
  serviceId: string;
  detail?: IServiceDetail | null;
}