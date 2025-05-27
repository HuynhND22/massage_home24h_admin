import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Title,
  Table,
  Group,
  Text,
  ActionIcon,
  Badge,
  Button,
  Card,
  LoadingOverlay,
  TextInput,
  Box,
  Grid,
  Stack,
  Pagination,
  Center,
  Modal,
  Menu,
  Tabs,
  Divider,
  Flex,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import {
  IconTrash,
  IconSearch,
  IconEye,
  IconDots,
  IconCheckbox,
  IconMail,
  IconMailOpened,
} from '@tabler/icons-react';
import { contactService } from '../../services/contact.service';
import { formatDate } from '../../utils/formatters';
import { useDebouncedState, useMediaQuery } from '../../hooks';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Messages() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, debouncedSearchTerm, setSearchInput] = useDebouncedState('', 300);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>(undefined);
  const { isMobile } = useMediaQuery();
  const limit = 10;

  // Tải danh sách tin nhắn
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contactService.getAllContacts(page, limit, isReadFilter);
      setContacts(response.data.data.contacts);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải danh sách tin nhắn',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, isReadFilter, setLoading, setContacts, setTotalPages]);

  // Tải dữ liệu khi component được mount hoặc các tham số thay đổi
  useEffect(() => {
    fetchContacts();
  }, [page, isReadFilter, fetchContacts]);

  // Xóa tin nhắn
  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: 'Xác nhận xóa',
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa tin nhắn này? Hành động này không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await contactService.deleteContact(id);
          notifications.show({
            title: 'Thành công',
            message: 'Đã xóa tin nhắn',
            color: 'teal',
          });
          fetchContacts();
          if (selectedContact?.id === id) {
            close();
          }
        } catch (error) {
          console.error('Error deleting contact:', error);
          notifications.show({
            title: 'Lỗi',
            message: 'Không thể xóa tin nhắn',
            color: 'red',
          });
        }
      },
    });
  };

  // Đánh dấu tin nhắn đã đọc
  const markAsRead = async (id: number) => {
    try {
      await contactService.markAsRead(id);
      
      notifications.show({
        title: 'Thành công',
        message: 'Đã đánh dấu tin nhắn là đã đọc',
        color: 'teal',
      });
      
      // Cập nhật trạng thái đã đọc trong danh sách
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === id ? { ...contact, isRead: true } : contact
        )
      );
      
      // Cập nhật trạng thái đã đọc cho tin nhắn đang xem
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, isRead: true });
      }
    } catch (error) {
      console.error('Error marking contact as read:', error);
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể đánh dấu tin nhắn là đã đọc',
        color: 'red',
      });
    }
  };

  // Xem chi tiết tin nhắn
  const viewContactDetails = async (contact: Contact) => {
    setSelectedContact(contact);
    open();
    
    // Nếu tin nhắn chưa đọc, đánh dấu là đã đọc
    if (!contact.isRead) {
      markAsRead(contact.id);
    }
  };

  // Lọc tin nhắn theo từ khóa tìm kiếm
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Reset về trang 1 khi thay đổi tìm kiếm
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  return (
    <Container size="lg" py="xl">
      <LoadingOverlay visible={loading} />
      
      <Group justify="space-between" mb="md">
        <Title order={2}>Quản lý tin nhắn liên hệ</Title>
        <Badge size="lg" variant="filled" color="teal">
          {contacts.filter(c => !c.isRead).length} tin nhắn chưa đọc
        </Badge>
      </Group>
      
      <Card shadow="sm" p="lg" radius="md" mb="xl">
        <Grid align="center">
          <Grid.Col span={isMobile ? 12 : 8}>
            <TextInput
              placeholder="Tìm kiếm tin nhắn..."
              leftSection={<IconSearch size={16} />}
              value={searchInput}
              onChange={(event) => setSearchInput(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={isMobile ? 12 : 4}>
            <Tabs
              value={isReadFilter === undefined ? 'all' : isReadFilter ? 'read' : 'unread'}
              onChange={(value) => {
                if (value === 'all') setIsReadFilter(undefined);
                else if (value === 'read') setIsReadFilter(true);
                else setIsReadFilter(false);
              }}
            >
              <Tabs.List grow>
                <Tabs.Tab value="all" leftSection={<IconMail size={16} />}>
                  Tất cả
                </Tabs.Tab>
                <Tabs.Tab value="unread" leftSection={<IconMail size={16} />}>
                  Chưa đọc
                </Tabs.Tab>
                <Tabs.Tab value="read" leftSection={<IconMailOpened size={16} />}>
                  Đã đọc
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Grid.Col>
        </Grid>
      </Card>
      
      {filteredContacts.length === 0 ? (
        <Center style={{ height: '200px' }}>
          <Stack align="center" gap="xs">
            <Text c="dimmed">Không tìm thấy tin nhắn nào</Text>
            <Button variant="subtle" onClick={() => setSearchInput('')}>
              Xóa bộ lọc
            </Button>
          </Stack>
        </Center>
      ) : (
        <>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: '30%' }}>Người gửi</Table.Th>
                <Table.Th style={{ width: '40%' }}>Nội dung</Table.Th>
                <Table.Th style={{ width: '20%' }}>Ngày gửi</Table.Th>
                <Table.Th style={{ width: '10%' }}>Trạng thái</Table.Th>
                <Table.Th>Hành động</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredContacts.map((contact) => (
                <Table.Tr 
                  key={contact.id} 
                  style={{ 
                    cursor: 'pointer',
                    fontWeight: contact.isRead ? 'normal' : 'bold',
                  }}
                  onClick={() => viewContactDetails(contact)}
                >
                  <Table.Td>
                    <Text fw={contact.isRead ? 400 : 700}>{contact.name}</Text>
                    <Text size="xs" c="dimmed">
                      {contact.email}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {contact.phone}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text lineClamp={2} fw={contact.isRead ? 400 : 700}>
                      {contact.message}
                    </Text>
                  </Table.Td>
                  <Table.Td>{formatDate(contact.createdAt)}</Table.Td>
                  <Table.Td>
                    <Badge 
                      color={contact.isRead ? 'gray' : 'teal'} 
                      variant="filled"
                    >
                      {contact.isRead ? 'Đã đọc' : 'Chưa đọc'}
                    </Badge>
                  </Table.Td>
                  <Table.Td onClick={(e) => e.stopPropagation()}>
                    <Menu position="bottom-end" shadow="md">
                      <Menu.Target>
                        <ActionIcon>
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      
                      <Menu.Dropdown>
                        <Menu.Item 
                          leftSection={<IconEye size={16} />}
                          onClick={() => viewContactDetails(contact)}
                        >
                          Xem chi tiết
                        </Menu.Item>
                        
                        {!contact.isRead && (
                          <Menu.Item 
                            leftSection={<IconCheckbox size={16} />}
                            onClick={() => markAsRead(contact.id)}
                            color="teal"
                          >
                            Đánh dấu đã đọc
                          </Menu.Item>
                        )}
                        
                        <Menu.Divider />
                        
                        <Menu.Item 
                          leftSection={<IconTrash size={16} />}
                          onClick={() => handleDelete(contact.id)}
                          color="red"
                        >
                          Xóa
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          
          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination 
                total={totalPages} 
                value={page} 
                onChange={setPage} 
                withEdges 
              />
            </Group>
          )}
        </>
      )}
      
      {/* Modal xem chi tiết tin nhắn */}
      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw={700} size="lg">Chi tiết tin nhắn</Text>}
        size="lg"
      >
        {selectedContact && (
          <Box>
            <Grid>
              <Grid.Col span={6}>
                <Text fw={700}>Người gửi:</Text>
                <Text mb="xs">{selectedContact.name}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={700}>Ngày gửi:</Text>
                <Text mb="xs">{formatDate(selectedContact.createdAt)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={700}>Email:</Text>
                <Text mb="xs">{selectedContact.email}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={700}>Số điện thoại:</Text>
                <Text mb="xs">{selectedContact.phone}</Text>
              </Grid.Col>
            </Grid>
            
            <Divider my="md" />
            
            <Text fw={700} mb="xs">Nội dung tin nhắn:</Text>
            <Card withBorder p="md" radius="md">
              <Text>{selectedContact.message}</Text>
            </Card>
            
            <Divider my="md" />
            
            <Flex justify="space-between">
              <Button 
                variant="outline" 
                color="red" 
                onClick={() => handleDelete(selectedContact.id)}
              >
                Xóa tin nhắn
              </Button>
              
              <Button onClick={close}>Đóng</Button>
            </Flex>
          </Box>
        )}
      </Modal>
    </Container>
  );
}
