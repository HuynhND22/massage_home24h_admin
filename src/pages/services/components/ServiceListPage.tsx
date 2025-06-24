import { useMemo, useState } from 'react';
import ServiceTable from './ServiceList';
import ServiceFilterBar from './ServiceFilterBar';
import PaginationBar from '../../../components/PaginationBar';
import ResultCount from '../../../components/ResultCount';
import { Paper } from '@mantine/core';
import { ServiceListPageProps } from '../../../interfaces/service.interface';

export default function ServiceListPage({ data, categories, onEdit, onRefresh, selectedIds, setSelectedIds }: ServiceListPageProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Map categoryId to name
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => { 
      map[c.id] = c.name || c.translations?.find(t => t.language === 'vi')?.name || c.translations?.[0]?.name || '';
    });
    return map;
  }, [categories]);

  // Helper function to get service name from translations
  const getServiceName = (service: any) => {
    if (service.name) return service.name;
    const viTranslation = service.translations?.find((t: any) => t.language === 'vi');
    if (viTranslation?.name) return viTranslation.name;
    const firstTranslation = service.translations?.[0];
    if (firstTranslation?.name) return firstTranslation.name;
    return '';
  };

  // Helper function to get service description from translations
  const getServiceDescription = (service: any) => {
    if (service.description) return service.description;
    const viTranslation = service.translations?.find((t: any) => t.language === 'vi');
    if (viTranslation?.description) return viTranslation.description;
    const firstTranslation = service.translations?.[0];
    if (firstTranslation?.description) return firstTranslation.description;
    return '';
  };

  // Filter + search
  const filtered = useMemo(() => {
    let result = data;
    if (category) result = result.filter(s => s.categoryId === category);
    if (search)
      result = result.filter(
        s => {
          const name = getServiceName(s);
          const description = getServiceDescription(s);
          return (
            name?.toLowerCase().includes(search.toLowerCase()) ||
            description?.toLowerCase().includes(search.toLowerCase())
          );
        }
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