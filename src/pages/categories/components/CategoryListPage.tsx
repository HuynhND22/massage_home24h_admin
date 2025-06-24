import { useMemo, useState } from 'react';
import CategoryTable from './CategoryList';
import CategoryFilterBar from './CategoryFilterBar';
import PaginationBar from '../../../components/PaginationBar';
import ResultCount from '../../../components/ResultCount';
import { Paper } from '@mantine/core';
import { CategoryListPageProps, ICategory, CategoryTranslation } from '../../../interfaces/category.interface';

export default function CategoryListPage({ data, onEdit, onRefresh, selectedIds, setSelectedIds }: CategoryListPageProps) {
  console.log('CategoryListPage data:', data);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getTranslation = (category: ICategory): CategoryTranslation => {
    return (
      category.translations?.find((t: CategoryTranslation) => t.language === 'vi') ||
      category.translations?.[0] || { name: '', description: '', language: 'vi', id: '', categoryId: '', createdAt: '', updatedAt: '' }
    );
  };

  // Filter + search
  const filtered = useMemo(() => {
    let result = data;
    if (search)
      result = result.filter(
        (c: ICategory) => {
          const t = getTranslation(c);
          return (
            t.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase())
          );
        }
      );
    return result;
  }, [data, search]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Reset filter
  const handleReset = () => {
    setSearch('');
    setPage(1);
  };

  return (
    <div>
      <Paper p="md" >
        <CategoryFilterBar
          search={search}
          setSearch={setSearch}
          onReset={handleReset}
        />
      </Paper>
      <Paper p="md" pos="relative" mt="md">
        <ResultCount total={filtered.length} page={page} pageSize={pageSize} />
        <CategoryTable
          data={paginated}
          onEdit={onEdit}
          onRefresh={onRefresh}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
        <PaginationBar
          total={filtered.length}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          />
      </Paper>
    </div>
  );
} 