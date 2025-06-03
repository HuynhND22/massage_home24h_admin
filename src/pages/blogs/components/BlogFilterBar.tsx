import { Group, TextInput, Button, Select, Paper } from '@mantine/core';

interface BlogFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  categoryId: string | undefined;
  setCategoryId: (v: string | undefined) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  sortOrder: 'ASC' | 'DESC';
  setSortOrder: (v: 'ASC' | 'DESC') => void;
  onReset: () => void;
  categoryOptions: { value: string; label: string }[];
}

export default function BlogFilterBar({ search, setSearch, categoryId, setCategoryId, sortBy, setSortBy, sortOrder, setSortOrder, onReset, categoryOptions }: BlogFilterBarProps) {
  return (
    <Paper p="md" pos="relative">
      <Group gap="sm" justify="space-between">
        <Group gap="sm">
          <TextInput
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <Select
            placeholder="Chọn danh mục"
            data={categoryOptions}
            value={categoryId}
            onChange={setCategoryId}
            clearable
            style={{ width: 180 }}
          />
        </Group>

        <Group gap="sm">
          <Select
            placeholder="Sắp xếp theo"
            data={[
              { value: 'createdAt', label: 'Ngày tạo' },
              { value: 'title', label: 'Tiêu đề' },
            ]}
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 140 }}
          />
          <Select
            placeholder="Thứ tự"
            data={[
              { value: 'DESC', label: 'Giảm dần' },
              { value: 'ASC', label: 'Tăng dần' },
            ]}
            value={sortOrder}
            onChange={v => setSortOrder(v as 'ASC' | 'DESC')}
            style={{ width: 120 }}
          />
          <Button variant="outline" onClick={onReset}>
            Đặt lại
          </Button>
        </Group>
      </Group>
    </Paper>
  );
} 