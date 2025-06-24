import { useMemo, useState } from 'react';
import BlogTable from './BlogList';
import BlogFilterBar from './BlogFilterBar';
import PaginationBar from '../../../components/PaginationBar';
import ResultCount from '../../../components/ResultCount';
import { Paper } from '@mantine/core';
import { BlogListPageProps } from '../../../interfaces/blog.interface';

export default function BlogListPage({ data, categoryOptions, onEdit, onRefresh, selectedIds, setSelectedIds }: BlogListPageProps) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter + search
  const filtered = useMemo(() => {
    let result = data;
    if (categoryId) result = result.filter(b => b.categoryId === categoryId);
    if (search)
      result = result.filter(
        b =>
          b.title?.toLowerCase().includes(search.toLowerCase()) ||
          b.description?.toLowerCase().includes(search.toLowerCase())
      );
    return result;
  }, [data, search, categoryId]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'createdAt') {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === 'DESC' ? bDate - aDate : aDate - bDate;
      }
      if (sortBy === 'title') {
        return sortOrder === 'DESC'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [filtered, sortBy, sortOrder]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  // Reset filter
  const handleReset = () => {
    setSearch('');
    setCategoryId(undefined);
    setSortBy('createdAt');
    setSortOrder('DESC');
    setPage(1);
  };

  return (
    <>
      <BlogFilterBar
        search={search}
        setSearch={setSearch}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onReset={handleReset}
        categoryOptions={categoryOptions}
      />
      <Paper p="md" pos="relative">
      <ResultCount total={sorted.length} page={page} pageSize={pageSize} />
      <BlogTable
        data={paginated}
        onEdit={onEdit}
        onRefresh={onRefresh}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
      <PaginationBar
        total={sorted.length}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
      </Paper>
    </>
  );
} 