import { Table, Text, Image, Box, Checkbox } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { SlideTableProps } from '../../../interfaces/slide.interface';
import { SlideActions } from './SlideActions';


export default function SlideTable({ data, onEdit, onRefresh, selectedIds, setSelectedIds }: SlideTableProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const handleCheckRow = (id: string, checked: boolean) => {
    if (checked) setSelectedIds([...selectedIds, id]);
    else setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  const handleCheckAll = (checked: boolean) => {
    if (checked) setSelectedIds(data.map((d) => d.id!));
    else setSelectedIds([]);
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table striped highlightOnHover withTableBorder miw={isMobile ? 600 : undefined}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                checked={selectedIds.length === data.length && data.length > 0}
                indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                onChange={(e) => handleCheckAll(e.currentTarget.checked)}
              />
            </Table.Th>
            <Table.Th>Tiêu đề</Table.Th>
            <Table.Th>Ảnh</Table.Th>
            <Table.Th>Mô tả</Table.Th>
            <Table.Th>Vị trí</Table.Th>
            <Table.Th>Thứ tự</Table.Th>
            <Table.Th>Hành động</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((slide) => (
            <Table.Tr key={slide.id}>
              <Table.Td>
                <Checkbox
                  checked={selectedIds.includes(slide.id!)}
                  onChange={(e) => handleCheckRow(slide.id!, e.currentTarget.checked)}
                />
              </Table.Td>
              <Table.Td>{slide.title}</Table.Td>
              <Table.Td>
                {slide.image ? (
                  <Image src={slide.image} alt={slide.title} width={60} height={40} fit="cover" radius="sm" />
                ) : (
                  <Box w={60} h={40} bg="gray.2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text c="dimmed" size="xs">Không có ảnh</Text>
                  </Box>
                )}
              </Table.Td>
              <Table.Td>{slide.description}</Table.Td>
              <Table.Td>{slide.role}</Table.Td>
              <Table.Td>{slide.order}</Table.Td>
              <Table.Td>
                <SlideActions slide={slide} onEdit={onEdit} onRefresh={onRefresh} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
} 