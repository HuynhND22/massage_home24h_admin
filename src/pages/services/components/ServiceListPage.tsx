import { useMemo, useState } from 'react';
import { ICategory } from '../../../services/category.service';
import { IService } from '../../../services/service.service';
import ServiceTable from './ServiceList';
import ServiceFilterBar from './ServiceFilterBar';
import PaginationBar from '../../../components/PaginationBar';
import ResultCount from '../../../components/ResultCount';
import { Paper } from '@mantine/core';

interface ServiceListPageProps {
  data: IService[];
  categories: ICategory[];
  onEdit: (service: IService) => void;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export default function ServiceListPage({ data, categories, onEdit, onRefresh, selectedIds, setSelectedIds }: ServiceListPageProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Map categoryId to name
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => { map[c.id] = c.name; });
    return map;
  }, [categories]);

  // Filter + search
  const filtered = useMemo(() => {
    let result = data;
    if (category) result = result.filter(s => s.categoryId === category);
    if (search)
      result = result.filter(
        s =>
          s.name?.toLowerCase().includes(search.toLowerCase()) ||
          s.description?.toLowerCase().includes(search.toLowerCase())
      );
    return result;
  }, [data, search, category]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Reset filter
  const handleReset = () => {
    setSearch('');
    setCategory('');
    setPage(1);
  };

  return (
    <>
      <ServiceFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        onReset={handleReset}
      />
      
      <Paper p="md" pos="relative" mt="md">
        <ResultCount total={filtered.length} page={page} pageSize={pageSize} />
        <ServiceTable
          data={paginated}
          categoryMap={categoryMap}
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
    </>
  );
} 