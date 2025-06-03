import { Group, Pagination, Select } from '@mantine/core';

interface PaginationBarProps {
  total: number;
  page: number;
  setPage: (v: number) => void;
  pageSize: number;
  setPageSize: (v: number) => void;
}

export default function PaginationBar({ total, page, setPage, pageSize, setPageSize }: PaginationBarProps) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  return (
    <Group justify="space-between" mt="md">
      <Pagination total={totalPages} value={page} onChange={setPage} />
      <Select
        data={['10', '25', '50', '100']}
        value={String(pageSize)}
        onChange={v => setPageSize(Number(v))}
        style={{ width: 80 }}
      />
    </Group>
  );
} 