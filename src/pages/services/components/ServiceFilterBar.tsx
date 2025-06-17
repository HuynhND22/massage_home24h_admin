import { Group, TextInput, Button, Select, Paper, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ServiceFilterBarProps } from '../../../interfaces/service.interface';

export default function ServiceFilterBar({ search, setSearch, category, setCategory, categories, onReset }: ServiceFilterBarProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const categoryOptions = [
    { value: '', label: 'Tất cả danh mục' },
    ...categories.map(c => ({
      value: c.id,
      label: c.name || c.translations?.find(t => t.language === 'vi')?.name || c.translations?.[0]?.name || ''
    }))
  ];
  if (isMobile) {
    return (
      <Paper p="md" pos="relative">
        <Stack gap="xs">
          <TextInput
            placeholder="Tìm kiếm tên hoặc mô tả..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%' }}
          />
          <Select
            data={categoryOptions}
            value={category}
            onChange={v => setCategory(v || '')}
            placeholder="Lọc theo danh mục"
            style={{ width: '100%' }}
            clearable
          />
          <Button variant="outline" color="gray" onClick={onReset} fullWidth>
            Xóa bộ lọc
          </Button>
        </Stack>
      </Paper>
    );
  }
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