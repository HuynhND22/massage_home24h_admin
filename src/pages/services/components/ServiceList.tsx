import { Table, Text, Image, Group, Box, Paper, Checkbox } from '@mantine/core';
import { IService } from '../../../services/service.service';
import { ServiceActions } from './ServiceActions';

interface ServiceTableProps {
  data: IService[];
  categoryMap: Record<string, string>;
  onEdit: (service: IService) => void;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export default function ServiceTable({ data, categoryMap, onEdit, onRefresh, selectedIds, setSelectedIds }: ServiceTableProps) {
  const allIds = data.map((s) => s.id!);
  const allChecked = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const someChecked = allIds.some((id) => selectedIds.includes(id)) && !allChecked;

  const handleCheckAll = (checked: boolean) => {
    if (checked) setSelectedIds(Array.from(new Set([...selectedIds, ...allIds])));
    else setSelectedIds(selectedIds.filter((id) => !allIds.includes(id)));
  };

  const handleCheckRow = (id: string, checked: boolean) => {
    if (checked) setSelectedIds([...selectedIds, id]);
    else setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ width: 40, textAlign: 'center' }}>
            <Checkbox
              checked={allChecked}
              indeterminate={someChecked}
              onChange={(e) => handleCheckAll(e.currentTarget.checked)}
              aria-label="Chọn tất cả"
            />
          </Table.Th>
          <Table.Th>Tên dịch vụ</Table.Th>
          <Table.Th>Danh mục</Table.Th>
          <Table.Th>Mô tả</Table.Th>
          <Table.Th>Ngày tạo</Table.Th>
          <Table.Th style={{ width: 120, textAlign: 'center' }}>Thao tác</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={6} align="center">
              <Text c="dimmed">Không có dữ liệu</Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          data.map((service) => (
            <Table.Tr key={service.id}>
              <Table.Td style={{ textAlign: 'center' }}>
                <Checkbox
                  checked={selectedIds.includes(service.id!)}
                  onChange={(e) => handleCheckRow(service.id!, e.currentTarget.checked)}
                  aria-label="Chọn dòng"
                />
              </Table.Td>
              <Table.Td>
                <Group gap="sm">
                  {service.coverImage && (
                    <Box w={50} h={50} style={{ overflow: 'hidden', borderRadius: '4px' }}>
                      <Image
                        src={service.coverImage}
                        alt={service.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  )}
                  <div>
                    <Text fz="sm" fw={500}>{service.name}</Text>
                  </div>
                </Group>
              </Table.Td>
              <Table.Td>{categoryMap[service.categoryId] || '-'}</Table.Td>
              <Table.Td>{service.description || '-'}</Table.Td>
              <Table.Td>
                <Text fz="xs" c="dimmed">
                  {service.createdAt ? new Date(service.createdAt).toLocaleDateString('vi-VN') : '-'}
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'center' }}>
                <Group gap="xs" justify="center">
                  <ServiceActions service={service} onEdit={onEdit} onRefresh={onRefresh} />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
} 