import { Text } from '@mantine/core';

interface ResultCountProps {
  total: number;
  page: number;
  pageSize: number;
}

export default function ResultCount({ total, page, pageSize }: ResultCountProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <Text size="sm" c="dimmed" mb="xs">
      Hiển thị {from}–{to} trong {total} mục
    </Text>
  );
} 