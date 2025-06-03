import { Group, TextInput, Button } from '@mantine/core';

interface CategoryFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  onReset: () => void;
}

export default function CategoryFilterBar({ search, setSearch, onReset }: CategoryFilterBarProps) {
  return (
    <Group>
      <TextInput
        placeholder="Tìm kiếm danh mục..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 300 }}
      />
      <Button variant="outline" onClick={onReset}>
        Đặt lại
      </Button>
    </Group>
  );
} 