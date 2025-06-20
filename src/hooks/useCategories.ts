import { useQuery } from '@tanstack/react-query';
import { ICategory } from '../interfaces/category.interface';
import { categoryService } from '../services/category.service';

interface CategoryResponse {
  items: ICategory[];
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
