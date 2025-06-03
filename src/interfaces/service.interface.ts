import { ICategory } from "./category.interface";

export interface IService {
  id?: string;
  name: string;
  description?: string | null;
  duration: number;
  coverImage?: string | null;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
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
  categories: { id: string; name: string }[];
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