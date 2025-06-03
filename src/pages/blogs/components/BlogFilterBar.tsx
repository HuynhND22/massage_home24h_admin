import { Group, TextInput, Button, Select, Paper, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { BlogFilterBarProps } from '../../../interfaces/blog.interface';

export default function BlogFilterBar({ search, setSearch, categoryId, setCategoryId, sortBy, setSortBy, sortOrder, setSortOrder, onReset, categoryOptions }: BlogFilterBarProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  if (isMobile) {
    return (
      <Paper p="md" pos="relative">
        <Stack gap="xs">
          <TextInput
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%' }}
          />
          <Select
            placeholder="Chọn danh mục"
            data={categoryOptions}
            value={categoryId}
            onChange={(v) => setCategoryId(v ?? undefined)}
            clearable
            style={{ width: '100%' }}
          />
          <Select
            placeholder="Sắp xếp theo"
            data={[
              { value: 'createdAt', label: 'Ngày tạo' },
              { value: 'title', label: 'Tiêu đề' },
            ]}
            value={sortBy}
            onChange={(v) => v && setSortBy(v)}
            style={{ width: '100%' }}
          />
          <Select
            placeholder="Thứ tự"
            data={[
              { value: 'DESC', label: 'Giảm dần' },
              { value: 'ASC', label: 'Tăng dần' },
            ]}
            value={sortOrder}
            onChange={v => v && setSortOrder(v as 'ASC' | 'DESC')}
            style={{ width: '100%' }}
          />
          <Button variant="outline" onClick={onReset} fullWidth>
            Đặt lại
          </Button>
        </Stack>
      </Paper>
    );
  }
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
            onChange={(v) => setCategoryId(v ?? undefined)}
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
            onChange={(v) => v && setSortBy(v)}
            style={{ width: 140 }}
          />
          <Select
            placeholder="Thứ tự"
            data={[
              { value: 'DESC', label: 'Giảm dần' },
              { value: 'ASC', label: 'Tăng dần' },
            ]}
            value={sortOrder}
            onChange={v => v && setSortOrder(v as 'ASC' | 'DESC')}
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