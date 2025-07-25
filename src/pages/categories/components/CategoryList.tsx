import { Table, Text, Image, Group, Box, Paper, Checkbox } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { rem } from '@mantine/core';
import { CategoryActions } from './CategoryActions';
import { useMediaQuery } from '@mantine/hooks';
import { CategoryTableProps, ICategory, CategoryTranslation } from '../../../interfaces/category.interface';

export default function CategoryTable({ data, onEdit, onRefresh, selectedIds, setSelectedIds }: CategoryTableProps) {
  const allIds = data.map((c) => c.id!);
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

  const getTranslation = (category: ICategory): CategoryTranslation => {
    return (
      category.translations?.find((t: CategoryTranslation) => t.language === 'vi') ||
      category.translations?.[0] || { name: '', description: '', language: 'vi', id: '', categoryId: '', createdAt: '', updatedAt: '' }
    );
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table striped highlightOnHover withTableBorder miw={isMobile ? 600 : undefined}>
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
            <Table.Th>Tên</Table.Th>
            {!isMobile && <Table.Th>Mô tả</Table.Th>}
            {!isMobile && <Table.Th>Ngày tạo</Table.Th>}
            <Table.Th style={{ width: 120, textAlign: 'center' }}>Thao tác</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={isMobile ? 3 : 5} align="center">
                <Text c="dimmed">Không có dữ liệu</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            data.map((category: ICategory) => {
              const translation = getTranslation(category);
              return (
                <Table.Tr key={category.id}>
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Checkbox
                      checked={selectedIds.includes(category.id!)}
                      onChange={(e) => handleCheckRow(category.id!, e.currentTarget.checked)}
                      aria-label="Chọn dòng"
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Box
                        w={50}
                        h={50}
                        style={{
                          overflow: 'hidden',
                          borderRadius: '4px',
                        }}
                      >
                        {category.coverImage ? (
                          <Image
                            src={category.coverImage}
                            alt={translation.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Paper
                            w="100%"
                            h="100%"
                            bg="gray.1"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconPhoto
                              style={{
                                width: rem(20),
                                height: rem(20),
                                color: 'gray',
                              }}
                              stroke={1.5}
                            />
                          </Paper>
                        )}
                      </Box>
                      <div>
                        <Text fz="sm" fw={500}>
                          {translation.name}
                        </Text>
                        <Text fz="xs" c="dimmed">
                          {category.type === 'service' ? 'Dịch vụ' : 'Blog'}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  {!isMobile && <Table.Td>{translation.description || '-'}</Table.Td>}
                  {!isMobile && (
                    <Table.Td>
                      <Text fz="xs" c="dimmed">
                        {category.createdAt ? new Date(category.createdAt).toLocaleDateString('vi-VN') : '-'}
                      </Text>
                    </Table.Td>
                  )}
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Group gap={isMobile ? 2 : 'xs'} justify="center">
                      <CategoryActions category={category} onEdit={onEdit} onRefresh={onRefresh} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
} 