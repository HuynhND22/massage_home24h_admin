import { Group, TextInput, Button, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { CategoryFilterBarProps } from '../../../interfaces/category.interface';

export default function CategoryFilterBar({ search, setSearch, onReset }: CategoryFilterBarProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  if (isMobile) {
    return (
      <Stack gap="xs">
        <TextInput
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%' }}
        />
        <Button variant="outline" onClick={onReset} fullWidth>
          Đặt lại
        </Button>
      </Stack>
    );
  }
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