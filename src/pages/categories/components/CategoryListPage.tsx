import { useMemo, useState } from 'react';
import CategoryTable from './CategoryList';
import CategoryFilterBar from './CategoryFilterBar';
import PaginationBar from '../../../components/PaginationBar';
import ResultCount from '../../../components/ResultCount';
import { Paper } from '@mantine/core';
import { CategoryListPageProps } from '../../../interfaces/category.interface';

export default function CategoryListPage({ data, onEdit, onRefresh, selectedIds, setSelectedIds }: CategoryListPageProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter + search
  const filtered = useMemo(() => {
    let result = data;
    if (search)
      result = result.filter(
        c =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.description?.toLowerCase().includes(search.toLowerCase())
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