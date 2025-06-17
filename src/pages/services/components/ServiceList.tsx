import { Table, Text, Image, Group, Box, Checkbox } from '@mantine/core';
import { ServiceTableProps } from '../../../interfaces/service.interface';
import { ServiceActions } from './ServiceActions';
import { useMediaQuery } from '@mantine/hooks';

// Helper function to get service name from translations
const getServiceName = (service: any) => {
  if (service.name) return service.name; // Fallback to root name if exists
  const viTranslation = service.translations?.find((t: any) => t.language === 'vi');
  if (viTranslation?.name) return viTranslation.name;
  const firstTranslation = service.translations?.[0];
  if (firstTranslation?.name) return firstTranslation.name;
  return 'Không có tên';
};

// Helper function to get service description from translations
const getServiceDescription = (service: any) => {
  if (service.description) return service.description; // Fallback to root description if exists
  const viTranslation = service.translations?.find((t: any) => t.language === 'vi');
  if (viTranslation?.description) return viTranslation.description;
  const firstTranslation = service.translations?.[0];
  if (firstTranslation?.description) return firstTranslation.description;
  return '';
};

export default function ServiceTable({ data, categoryMap, onEdit, onRefresh, selectedIds, setSelectedIds }: ServiceTableProps) {
  const allIds = data.map((s) => s.id!);
  const allChecked = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const someChecked = allIds.some((id) => selectedIds.includes(id)) && !allChecked;
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleCheckAll = (checked: boolean) => {
    if (checked) setSelectedIds(Array.from(new Set([...selectedIds, ...allIds])));
    else setSelectedIds(selectedIds.filter((id) => !allIds.includes(id)));
  };

  const handleCheckRow = (id: string, checked: boolean) => {
    if (checked) setSelectedIds([...selectedIds, id]);
    else setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table striped highlightOnHover withTableBorder miw={isMobile ? 700 : undefined}>
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
            {!isMobile && <Table.Th>Danh mục</Table.Th>}
            {!isMobile && <Table.Th>Mô tả</Table.Th>}
            {!isMobile && <Table.Th>Ngày tạo</Table.Th>}
            <Table.Th style={{ width: 120, textAlign: 'center' }}>Thao tác</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={isMobile ? 3 : 6} align="center">
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
                      <Text fz="sm" fw={500}>{getServiceName(service)}</Text>
                    </div>
                  </Group>
                </Table.Td>
                {!isMobile && <Table.Td>{categoryMap[service.categoryId] || '-'}</Table.Td>}
                {!isMobile && <Table.Td>{getServiceDescription(service) || '-'}</Table.Td>}
                {!isMobile && (
                  <Table.Td>
                    <Text fz="xs" c="dimmed">
                      {service.createdAt ? new Date(service.createdAt).toLocaleDateString('vi-VN') : '-'}
                    </Text>
                  </Table.Td>
                )}
                <Table.Td style={{ textAlign: 'center' }}>
                  <Group gap={isMobile ? 2 : 'xs'} justify="center">
                    <ServiceActions service={service} onEdit={onEdit} onRefresh={onRefresh} />
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
} 