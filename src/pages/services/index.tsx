import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Card,
  Badge,
  Table,
  Image,
  LoadingOverlay,
  ActionIcon,
  Stack,
  Center,
  Grid,
  Select,
} from '@mantine/core';
import { showSuccessNotification } from '../../utils/notificationUtils';
import { handleApiError } from '../../utils/errorHandling';
import { modals } from '@mantine/modals';
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconPlus,
} from '@tabler/icons-react';
import { serviceService } from '../../services/service.service';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { useDebouncedState, useMediaQuery } from '../../hooks';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive: boolean;
  slug: string;
  translations: {
    id: number;
    language: string;
    name: string;
    description: string;
    serviceId: number;
  }[];
}

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useDebouncedState('', 300);
  const [language, setLanguage] = useState('');
  const { isMobile } = useMediaQuery();

  // Tải danh sách dịch vụ
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await serviceService.getAllServices(language || undefined);
      setServices(response.data.data);
    } catch (error) {
      handleApiError(error, 'Không thể tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  }, [language, setLoading, setServices]);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Xóa dịch vụ
  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: 'Xác nhận xóa',
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setLoading(true);
          await serviceService.deleteService(id);
          showSuccessNotification('Xóa dịch vụ', 'Đã xóa dịch vụ thành công');
          fetchServices();
        } catch (error) {
          handleApiError(error, 'Không thể xóa dịch vụ');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Lọc dịch vụ theo từ khóa tìm kiếm
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    service.description.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <Container size="xl">
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <Group mb="md" justify="space-between">
        <Title order={2}>Quản lý dịch vụ</Title>
        
        <Button 
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate('/services/create')}
          variant="gradient" 
          gradient={{ from: 'teal', to: 'blue', deg: 60 }}
        >
          Thêm dịch vụ mới
        </Button>
      </Group>
      
      <Card shadow="sm" p="lg" radius="md" mb="xl">
        <Grid align="center">
          <Grid.Col span={isMobile ? 12 : 8}>
            <TextInput
              placeholder="Tìm kiếm dịch vụ..."
              leftSection={<IconSearch size={16} />}
              value={searchInput}
              onChange={(event) => setSearchInput(event.currentTarget.value as string)}
            />
          </Grid.Col>
          <Grid.Col span={isMobile ? 12 : 4}>
            <Group justify={isMobile ? "space-between" as const : "flex-end" as const} wrap="nowrap">
              <Select
                placeholder="Chọn ngôn ngữ"
                clearable
                value={language}
                onChange={(value) => setLanguage(value || '')}
                data={[
                  { value: '', label: 'Tất cả' },
                  { value: 'vi', label: 'Tiếng Việt' },
                  { value: 'zh', label: 'Tiếng Trung' },
                  { value: 'ko', label: 'Tiếng Hàn' },
                  { value: 'ru', label: 'Tiếng Nga' },
                ]}
                style={{ width: isMobile ? '45%' : '150px' }}
              />
            </Group>
          </Grid.Col>
        </Grid>
      </Card>
      
      {filteredServices.length === 0 ? (
        <Center style={{ height: '200px' }}>
          <Stack align="center">
            <Text size="xl" fw={500} c="dimmed">Không có dịch vụ nào</Text>
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => navigate('/services/create')}
            >
              Thêm dịch vụ mới
            </Button>
          </Stack>
        </Center>
      ) : (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '60px' }}>ID</Table.Th>
              <Table.Th style={{ width: '80px' }}>Hình ảnh</Table.Th>
              <Table.Th>Tên dịch vụ</Table.Th>
              <Table.Th>Giá</Table.Th>
              <Table.Th>Thời gian</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th style={{ width: '120px' }}>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredServices.map((service) => (
              <Table.Tr key={service.id}>
                <Table.Td>{service.id}</Table.Td>
                <Table.Td>
                  <Image
                    radius="md"
                    src={service.image}
                    h={60}
                    w={60}
                    fit="cover"
                    fallbackSrc="https://placehold.co/60x60?text=Image"
                  />
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>{service.name}</Text>
                  <Text size="xs" c="dimmed" lineClamp={2}>
                    {service.description}
                  </Text>
                </Table.Td>
                <Table.Td>{formatCurrency(service.price, 'USD')}</Table.Td>
                <Table.Td>{formatDuration(service.duration)}</Table.Td>
                <Table.Td>
                  <Badge color={service.isActive ? 'teal' : 'gray'} variant="filled">
                    {service.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon 
                      color="blue" 
                      onClick={() => navigate(`/services/edit/${service.id}`)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon 
                      color="red" 
                      onClick={() => handleDelete(service.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Container>
  );
}
