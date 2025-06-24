import React, { useEffect, useState } from 'react';
import { Modal, Text, Stack, Group, Divider, Badge, Loader, Card, Avatar, ScrollArea, Box, Title, Center, Button, SimpleGrid, Tooltip } from '@mantine/core';
import { IService, IServiceDetail } from '../../../interfaces/service.interface';
import { serviceService } from '../../../services/service.service';
import { IconInfoCircle, IconFileText, IconPlus, IconLanguage } from '@tabler/icons-react';
import { useCategories } from '../../../hooks/useCategories';
import ServiceDetailForm from './ServiceDetailForm';

interface ServiceViewModalProps {
  service: IService;
  opened: boolean;
  onClose: () => void;
}

const LANGS: Record<string, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  ko: '한국어',
  zh: '中文',
};

const ServiceViewModal: React.FC<ServiceViewModalProps> = ({ service, opened, onClose }) => {
  const [details, setDetails] = useState<IServiceDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCreateDetail, setOpenCreateDetail] = useState(false);
  const { data: categoryData } = useCategories();

  useEffect(() => {
    if (opened && service.slug) {
      setLoading(true);
      serviceService.getDetailsBySlug(service.slug)
        .then((res) => {
          // Nếu API trả về details dạng mảng, setDetails; nếu trả về object có details, lấy details
          if (Array.isArray(res.details)) setDetails(res.details);
          else if (Array.isArray(res)) setDetails(res);
          else setDetails([]);
        })
        .finally(() => setLoading(false));
    }
    // Debug: log dữ liệu categories và categoryId
    if (categoryData) {
      // eslint-disable-next-line no-console
      console.log('Categories:', categoryData.items);
      // eslint-disable-next-line no-console
      console.log('Service categoryId:', service.categoryId);
    }
  }, [opened, service.slug, categoryData, service.categoryId]);

  // Lấy tên danh mục: ưu tiên từ service.category, fallback sang categories global
  const categoryName = React.useMemo(() => {
    // Ưu tiên lấy từ service.category nếu có
    if (service.category) {
      const vi = service.category.translations?.find((t: any) => t.language === 'vi');
      if (vi?.name) return vi.name;
      if (service.category.name) return service.category.name;
      if (service.category.translations?.[0]?.name) return service.category.translations[0].name;
      // Nếu không có name, trả về type
      if (service.category.type) return service.category.type === 'service' ? 'Dịch vụ' : 'Blog';
    }
    // Fallback sang categories global nếu có
    if (categoryData?.items) {
      const found = categoryData.items.find((c) => c.id === service.categoryId);
      if (found) {
        const vi = found.translations?.find((t: any) => t.language === 'vi');
        if (vi?.name) return vi.name;
        if (found.name) return found.name;
        if (found.translations?.[0]?.name) return found.translations[0].name;
        // Nếu không có name, trả về type
        if (found.type) return found.type === 'service' ? 'Dịch vụ' : 'Blog';
      }
    }
    return 'Không rõ';
  }, [service.category, service.categoryId, categoryData]);

  return (
    <Modal opened={opened} onClose={onClose} title={<Group><IconInfoCircle size={22} /><span>Chi tiết dịch vụ</span></Group>} size="lg" centered radius="md">
      <ScrollArea h={500}>
        <Stack gap="md">
          <Group align="flex-start" gap="md" wrap="nowrap">
            {service.coverImage && (
              <Avatar src={service.coverImage} size={64} radius={8} alt={service.name} />
            )}
            <Box>
              <Title order={4} mb={2}>{service.name}</Title>
              <Group gap={8} mb={2}>
                <Text fz="sm" c="dimmed">Danh mục:</Text>
                <Badge color="grape" variant="light" size="sm">{categoryName}</Badge>
              </Group>
              <Group gap={8} mb={2}>
                <Text fz="sm" c="dimmed">Thời lượng:</Text>
                <Text fz="sm" fw={500}>{service.duration} phút</Text>
              </Group>
            </Box>
          </Group>
          <Text fz="sm" mt={-8} mb={4}><b>Mô tả:</b> {service.description || <i>Không có</i>}</Text>
          <Divider my="xs" label="Ngôn ngữ & bản dịch" labelPosition="center" />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={8} verticalSpacing={8}>
            {service.translations?.map(t => (
              <Box key={t.language} p={8} style={{ border: '1px solid #eee', borderRadius: 8, background: '#fafbfc' }}>
                <Group gap={6} mb={2}>
                  <Tooltip label={LANGS[t.language] || t.language}>
                    <Badge color="blue" size="xs" leftSection={<IconLanguage size={12} />}>{t.language.toUpperCase()}</Badge>
                  </Tooltip>
                  <Text fz="sm" fw={600}>{t.name}</Text>
                </Group>
                {t.description && <Text fz="xs" c="dimmed">{t.description}</Text>}
              </Box>
            ))}
          </SimpleGrid>
          <Divider my="xs" label="Chi tiết dịch vụ" labelPosition="center" />
          {loading ? (
            <Center><Loader size="md" /></Center>
          ) : details.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={12}>
              {details.map((d, idx) => (
                <Card key={d.id || idx} shadow="xs" radius="md" p="md" withBorder>
                  <Group gap={8} mb={4}>
                    <Badge color="teal" variant="filled" size="sm">{LANGS[d.language] || d.language}</Badge>
                    <Text fw={600}>{d.title}</Text>
                  </Group>
                  {/* Mô tả ngắn rich text */}
                  <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: d.description }} />
                  <Group gap={6} align="flex-start">
                    <IconFileText size={16} color="#888" />
                    {/* Nội dung chi tiết rich text */}
                    <div style={{ fontSize: 14 }} dangerouslySetInnerHTML={{ __html: d.content }} />
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Center>
              <Stack align="center" gap={2}>
                <IconFileText size={28} color="#bbb" />
                <Text c="dimmed" fz="sm">Chưa có chi tiết dịch vụ nào</Text>
                <Button leftSection={<IconPlus size={16} />} color="teal" size="sm" mt="sm" onClick={() => setOpenCreateDetail(true)}>
                  Tạo chi tiết dịch vụ
                </Button>
              </Stack>
            </Center>
          )}
        </Stack>
      </ScrollArea>
      <Group justify="flex-end" mt="md">
        <Button onClick={onClose} color="gray" variant="light">Đóng</Button>
      </Group>
      <ServiceDetailForm
        opened={openCreateDetail}
        onClose={(refresh) => {
          setOpenCreateDetail(false);
          if (refresh) {
            setLoading(true);
            if (service.slug) {
              serviceService.getDetailsBySlug(service.slug).then((res) => {
                if (Array.isArray(res.details)) setDetails(res.details);
                else if (Array.isArray(res)) setDetails(res);
                else setDetails([]);
              }).finally(() => setLoading(false));
            }
          }
        }}
        serviceId={service.id!}
      />
    </Modal>
  );
};

export default ServiceViewModal; 