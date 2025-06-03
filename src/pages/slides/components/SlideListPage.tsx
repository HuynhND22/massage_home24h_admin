import { useMemo, useState } from 'react';
import { SlideListPageProps } from '../../../interfaces/slide.interface';
import SlideTable from './SlideList';
import PaginationBar from '../../../components/PaginationBar';
import ResultCount from '../../../components/ResultCount';
import { Paper } from '@mantine/core';

export default function SlideListPage({ data, onEdit, onRefresh, selectedIds, setSelectedIds }: SlideListPageProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter + search
  const filtered = useMemo(() => {
    let result = data;
    if (search)
      result = result.filter(
        s =>
          s.title?.toLowerCase().includes(search.toLowerCase()) ||
          s.description?.toLowerCase().includes(search.toLowerCase())
      );
    return result;
  }, [data, search]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <>
      {/* Có thể thêm filter bar nếu muốn */}
      <Paper p="md" pos="relative" mt="md">
        <ResultCount total={filtered.length} page={page} pageSize={pageSize} />
        <SlideTable
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
    </>
  );
} 