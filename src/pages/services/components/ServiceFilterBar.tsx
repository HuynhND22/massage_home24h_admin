import { Group, TextInput, Button, Select, Paper } from '@mantine/core';
import { ICategory } from '../../../services/category.service';

interface ServiceFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categories: ICategory[];
  onReset: () => void;
}

export default function ServiceFilterBar({ search, setSearch, category, setCategory, categories, onReset }: ServiceFilterBarProps) {
  const categoryOptions = [
    { value: '', label: 'Tất cả danh mục' },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ];
  return (
    <Paper p="md" pos="relative">
      <Group gap="md" wrap="wrap" >
        <TextInput
          placeholder="Tìm kiếm tên hoặc mô tả..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ minWidth: 220 }}
        />
        <Select
          data={categoryOptions}
          value={category}
          onChange={v => setCategory(v || '')}
          placeholder="Lọc theo danh mục"
          style={{ minWidth: 180 }}
          clearable
        />
        <Button variant="outline" color="gray" onClick={onReset}>
          Xóa bộ lọc
        </Button>
      </Group>
    </Paper>
  );
} 