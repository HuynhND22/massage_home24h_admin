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

  // Helper function to get slide title from translations
  const getSlideTitle = (slide: any) => {
    const vi = slide.translations?.find((t: any) => t.language === 'vi');
    if (vi?.title) return vi.title;
    if (slide.translations?.[0]?.title) return slide.translations[0].title;
    return '';
  };
  const getSlideDescription = (slide: any) => {
    const vi = slide.translations?.find((t: any) => t.language === 'vi');
    if (vi?.description) return vi.description;
    if (slide.translations?.[0]?.description) return slide.translations[0].description;
    return '';
  };

  // Filter + search
  const filtered = useMemo(() => {
    let result = Array.isArray(data) ? data : [];
    if (search)
      result = result.filter(
        s => {
          const title = getSlideTitle(s);
          const description = getSlideDescription(s);
          return (
            title?.toLowerCase().includes(search.toLowerCase()) ||
            description?.toLowerCase().includes(search.toLowerCase())
          );
        }
      );
    console.log('SlideListPage filtered:', result);
    return result;
  }, [data, search]);

  // Pagination
  const paginated = useMemo(() => {
    if (!Array.isArray(filtered)) {
      console.error('filtered is not an array:', filtered);
      return [];
    }
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <>
      {/* Có thể thêm filter bar nếu muốn */}
      <Paper p="md" pos="relative" mt="md">
        <input
          type="text"
          placeholder="Tìm kiếm tiêu đề hoặc mô tả..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 16, width: '100%', padding: 8, boxSizing: 'border-box' }}
        />
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