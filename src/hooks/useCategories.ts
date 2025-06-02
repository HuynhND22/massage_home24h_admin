import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryResponse {
  items: Category[];
  meta: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export const useCategories = () => {
  return useQuery<CategoryResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryService.getAll();
      return response.data;
    }
  });
};
