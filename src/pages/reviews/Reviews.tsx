import { useState, useEffect } from 'react';
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
  Stack,
  Modal,
  Divider,
  Rating,
  Textarea,
  Switch,
  Grid,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { IconEye, IconTrash, IconEdit, IconSearch, IconCheck, IconX } from '@tabler/icons-react';
import { reviewService } from '../../services/review.service';
import { formatDate } from '../../utils/formatters';
import { useDebouncedState, useMediaQuery } from '../../hooks';

// Định nghĩa kiểu dữ liệu cho review
interface Review {
  id: number;
  name: string;
  email: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [opened, setOpened] = useState(false);
  const [searchInput, debouncedSearchTerm, setSearchInput] = useDebouncedState('', 300);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState('');
  const [editedRating, setEditedRating] = useState(0);
  const [editedIsApproved, setEditedIsApproved] = useState(false);
  const { isMobile } = useMediaQuery();

  // Lọc reviews theo điều kiện tìm kiếm
  const filteredReviews = reviews.filter(
    (review) =>
      review.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      review.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Tải danh sách đánh giá
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getAllReviews();
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải danh sách đánh giá',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Xóa đánh giá
  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: 'Xác nhận xóa',
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await reviewService.deleteReview(id);
          notifications.show({
            title: 'Thành công',
            message: 'Đã xóa đánh giá',
            color: 'teal',
          });
          fetchReviews();
          if (selectedReview?.id === id) {
            setOpened(false);
            setSelectedReview(null);
          }
        } catch (error) {
          console.error('Error deleting review:', error);
          notifications.show({
            title: 'Lỗi',
            message: 'Không thể xóa đánh giá',
            color: 'red',
          });
        }
      },
    });
  };

  // Cập nhật trạng thái phê duyệt đánh giá
  const toggleApproval = async (id: number, currentStatus: boolean) => {
    try {
      await reviewService.updateReview(id, { isApproved: !currentStatus });
      notifications.show({
        title: 'Thành công',
        message: `Đã ${!currentStatus ? 'phê duyệt' : 'hủy phê duyệt'} đánh giá`,
        color: 'teal',
      });
      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể cập nhật trạng thái đánh giá',
        color: 'red',
      });
    }
  };

  // Hiển thị chi tiết đánh giá
  const viewReviewDetails = (review: Review) => {
    setSelectedReview(review);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
    setEditedIsApproved(review.isApproved);
    setIsEditing(false);
    setOpened(true);
  };

  // Cập nhật đánh giá
  const handleUpdate = async () => {
    if (!selectedReview) return;
    
    try {
      setLoading(true);
      await reviewService.updateReview(selectedReview.id, {
        comment: editedComment,
        rating: editedRating,
        isApproved: editedIsApproved,
      });
      
      notifications.show({
        title: 'Thành công',
        message: 'Đã cập nhật đánh giá',
        color: 'teal',
      });
      
      setIsEditing(false);
      setOpened(false);
      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể cập nhật đánh giá',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <LoadingOverlay visible={loading} />
      
      <Group justify="space-between" mb="md">
        <Title order={2}>Quản lý đánh giá</Title>
        <Badge size="lg" variant="filled" color="blue">
          {reviews.length} đánh giá
        </Badge>
      </Group>
      
      <Card shadow="sm" p="lg" radius="md" mb="xl">
        <Grid mb="md">
          <Grid.Col span={isMobile ? 12 : 8}>
            <TextInput
              placeholder="Tìm kiếm đánh giá..."
              leftSection={<IconSearch size={16} />}
              value={searchInput}
              onChange={(event) => setSearchInput(event.currentTarget.value)}
              style={{ width: '100%' }}
            />
          </Grid.Col>
          {isMobile ? null : <Grid.Col span={4} />}
        </Grid>
        
        {filteredReviews.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Không tìm thấy đánh giá nào
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Người đánh giá</Table.Th>
                <Table.Th>Đánh giá</Table.Th>
                <Table.Th>Nội dung</Table.Th>
                <Table.Th>{isMobile ? null : 'Trạng thái'}</Table.Th>
                <Table.Th>{isMobile ? null : 'Ngày tạo'}</Table.Th>
                <Table.Th>Hành động</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredReviews.map((review) => (
                <Table.Tr key={review.id}>
                  <Table.Td>
                    <Text fw={500}>{review.name}</Text>
                    <Text size="xs" c="dimmed">
                      {review.email}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Rating value={review.rating} readOnly />
                  </Table.Td>
                  <Table.Td>
                    <Text lineClamp={2}>{review.comment}</Text>
                  </Table.Td>
                  <Table.Td style={{ display: isMobile ? 'none' : 'table-cell' }}>
                    <Badge color={review.isApproved ? 'teal' : 'gray'} variant="filled">
                      {review.isApproved ? 'Đã duyệt' : 'Chưa duyệt'}
                    </Badge>
                  </Table.Td>
                  <Table.Td style={{ display: isMobile ? 'none' : 'table-cell' }}>{formatDate(review.createdAt)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon 
                        color="blue"
                        onClick={() => viewReviewDetails(review)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color={review.isApproved ? 'red' : 'green'}
                        onClick={() => toggleApproval(review.id, review.isApproved)}
                      >
                        {review.isApproved ? <IconX size={16} /> : <IconCheck size={16} />}
                      </ActionIcon>
                      <ActionIcon 
                        color="red"
                        onClick={() => handleDelete(review.id)}
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
      </Card>
      
      {/* Modal xem chi tiết và chỉnh sửa đánh giá */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Text fw={700} size="lg">Chi tiết đánh giá</Text>}
        size="lg"
      >
        {selectedReview && (
          <Stack>
            <Group justify="space-between">
              <div>
                <Text fw={700}>Người đánh giá:</Text>
                <Text>{selectedReview.name}</Text>
              </div>
              <div>
                <Text fw={700}>Email:</Text>
                <Text>{selectedReview.email}</Text>
              </div>
            </Group>
            
            <Group>
              <Text fw={700}>Đánh giá:</Text>
              {isEditing ? (
                <Rating value={editedRating} onChange={setEditedRating} />
              ) : (
                <Rating value={selectedReview.rating} readOnly />
              )}
            </Group>
            
            <Divider my="xs" />
            
            <Text fw={700} mb="xs">Nội dung đánh giá:</Text>
            {isEditing ? (
              <Textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.currentTarget.value)}
                minRows={4}
              />
            ) : (
              <Card withBorder p="md" radius="md">
                <Text>{selectedReview.comment}</Text>
              </Card>
            )}
            
            {isEditing && (
              <Switch
                label="Phê duyệt đánh giá này"
                checked={editedIsApproved}
                onChange={(e) => setEditedIsApproved(e.currentTarget.checked)}
              />
            )}
            
            <Group justify="space-between" mt="md">
              <Group>
                <Button 
                  variant="outline" 
                  color="red" 
                  onClick={() => handleDelete(selectedReview.id)}
                >
                  Xóa
                </Button>
                {!isEditing && (
                  <Button 
                    variant="outline"
                    leftSection={<IconEdit size={16} />}
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </Group>
              
              {isEditing ? (
                <Group>
                  <Button variant="default" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button color="teal" onClick={handleUpdate}>
                    Lưu thay đổi
                  </Button>
                </Group>
              ) : (
                <Button onClick={() => setOpened(false)}>Đóng</Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

export default Reviews;
