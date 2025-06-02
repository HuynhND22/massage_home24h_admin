import { Table, Text } from '@mantine/core';
import { IService } from '../../../services/service.service';
import { ServiceActions } from './ServiceActions';

interface ServiceListProps {
  services: IService[];
  onEdit: (service: IService) => void;
  onRefresh: () => void;
  categoryMap: Record<string, string>;
}

export function ServiceList({ services, onEdit, onRefresh, categoryMap }: ServiceListProps) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Tên dịch vụ</Table.Th>
          <Table.Th>Giá</Table.Th>
          <Table.Th>Thời lượng</Table.Th>
          <Table.Th>Danh mục</Table.Th>
          <Table.Th>Thao tác</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {services.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={5} align="center">
              <Text c="dimmed">Không có dữ liệu</Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          services.map((service) => (
            <Table.Tr key={service.id}>
              <Table.Td>{service.name}</Table.Td>
              <Table.Td>{service.price}</Table.Td>
              <Table.Td>{service.duration} phút</Table.Td>
              <Table.Td>{categoryMap[service.categoryId] || service.categoryId}</Table.Td>
              <Table.Td>
                <ServiceActions service={service} onEdit={onEdit} onRefresh={onRefresh} />
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
} 